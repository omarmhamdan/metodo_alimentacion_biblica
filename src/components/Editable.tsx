import { useEffect, useRef, useState, type ElementType } from "react";
import { createPortal } from "react-dom";
import { Pencil, ImageUp, X, Check, RotateCcw } from "lucide-react";
import { useLang, useImagesReady } from "@/lib/store";
import { T, type TKey } from "@/lib/i18n";
import {
  useEditMode,
  useText,
  getOverride,
  saveTextOverride,
  clearTextOverride,
  setEditMode,
} from "@/lib/edit-store";
import { compressImage, saveImage, deleteImage, getCachedImages } from "@/lib/image-store";
import { uploadRecipePhoto, deleteRecipePhoto } from "@/lib/sync";

/* ─────────────────────────── Editable TEXT ───────────────────────────
 * <Ed k="unique.key" pt="default PT" es="default ES" /> renders the resolved
 * string. In admin edit mode it becomes clickable → opens a PT+ES editor.
 * Renders a <span> by default; pass `as` for a block tag.
 */
export function Ed({
  k,
  pt,
  es,
  as: As = "span",
  className,
}: {
  k: string;
  pt: string;
  es: string;
  as?: ElementType;
  className?: string;
}) {
  const { lang } = useLang();
  const edit = useEditMode();
  const display = useText(k, lang, lang === "pt" ? pt : es);
  const [open, setOpen] = useState(false);

  if (!edit) {
    return <As className={className}>{display}</As>;
  }

  return (
    <>
      <As
        className={`${className ?? ""} relative cursor-pointer rounded-[4px] outline outline-1 outline-dashed outline-olive/50 transition-colors hover:bg-olive/10`}
        onClick={(e: React.MouseEvent) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen(true);
        }}
        title="Editar texto"
      >
        {display}
        <Pencil className="ml-1 inline-block h-3 w-3 align-baseline text-olive" />
      </As>
      {open && <TextEditorModal k={k} defPt={pt} defEs={es} onClose={() => setOpen(false)} />}
    </>
  );
}

/** Shortcut for editing an i18n (UI chrome) string by its key. */
export function EdI18n({ k, as, className }: { k: TKey; as?: ElementType; className?: string }) {
  return <Ed k={`i18n.${k}`} pt={T.pt[k]} es={T.es[k]} as={as} className={className} />;
}

function TextEditorModal({
  k,
  defPt,
  defEs,
  onClose,
}: {
  k: string;
  defPt: string;
  defEs: string;
  onClose: () => void;
}) {
  const ov = getOverride(k);
  const [valPt, setValPt] = useState(ov?.pt ?? defPt);
  const [valEs, setValEs] = useState(ov?.es ?? defEs);
  const multiline = defPt.length > 60 || defEs.length > 60;
  const Field = multiline ? "textarea" : "input";

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4">
      <div className="w-full max-w-lg rounded-t-3xl bg-stone-900 p-5 text-white shadow-2xl sm:rounded-3xl">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-medium">Editar texto</h3>
          <button onClick={onClose} className="rounded-lg p-1 text-stone-400 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>
        <p className="mb-3 truncate text-[10px] text-stone-500">{k}</p>

        <label className="mb-1 block text-[11px] font-medium text-stone-400">🇧🇷 Português</label>
        <Field
          value={valPt}
          onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
            setValPt(e.target.value)
          }
          rows={multiline ? 4 : undefined}
          className="mb-3 w-full rounded-xl border border-stone-600 bg-stone-800 px-3 py-2 text-sm outline-none focus:border-olive"
        />

        <label className="mb-1 block text-[11px] font-medium text-stone-400">🇨🇴 Español</label>
        <Field
          value={valEs}
          onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
            setValEs(e.target.value)
          }
          rows={multiline ? 4 : undefined}
          className="mb-4 w-full rounded-xl border border-stone-600 bg-stone-800 px-3 py-2 text-sm outline-none focus:border-olive"
        />

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              saveTextOverride(k, { pt: valPt, es: valEs });
              onClose();
            }}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-olive py-2.5 text-sm font-medium text-cream hover:opacity-90"
          >
            <Check className="h-4 w-4" /> Salvar
          </button>
          <button
            onClick={() => {
              clearTextOverride(k);
              onClose();
            }}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-stone-600 px-3 py-2.5 text-xs text-stone-300 hover:text-white"
            title="Restaurar texto original"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Restaurar
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

/* ─────────────────────────── Editable PHOTO ───────────────────────────
 * <EditImage id="slot-id" src={resolvedFallback} ... /> renders an <img>.
 * In edit mode an overlay lets the admin upload/replace (→ Supabase) or restore.
 * `src` should already be the resolved URL (cloud or fallback) from the caller.
 */
export function EditImage({
  id,
  src,
  alt,
  className,
  loading,
}: {
  id: string;
  src: string;
  alt: string;
  className?: string;
  loading?: "lazy" | "eager";
}) {
  const edit = useEditMode();
  const ready = useImagesReady();
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  // Resolve the cloud/IDB photo for this id (so every user sees uploads),
  // falling back to the bundled `src`. Reactive to admin uploads.
  const [resolved, setResolved] = useState<string>(() => getCachedImages()[id] ?? src);
  useEffect(() => {
    const fn = () => setResolved(getCachedImages()[id] ?? src);
    fn();
    window.addEventListener("mab:images", fn);
    window.addEventListener("mab:images-ready", fn);
    return () => {
      window.removeEventListener("mab:images", fn);
      window.removeEventListener("mab:images-ready", fn);
    };
  }, [id, src]);

  const onFile = async (file: File) => {
    setBusy(true);
    try {
      const dataUrl = await compressImage(file);
      await saveImage(id, dataUrl); // instant local + cache event
      const url = await uploadRecipePhoto(id, dataUrl); // → Supabase (global)
      if (url) await saveImage(id, url);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      window.alert(
        `A foto ficou salva só neste dispositivo — a publicação para todos falhou.\n\n${msg}`,
      );
    } finally {
      setBusy(false);
    }
  };

  const shown = resolved;

  if (!edit) {
    // Hold back the <img> until the image cache (IDB + cloud) is hydrated, so
    // the bundled stock fallback doesn't flash before the real photo swaps in.
    if (!ready) {
      return <span className={`${className ?? ""} block animate-pulse bg-highlight/60`} aria-label={alt} role="img" />;
    }
    return <img src={shown} alt={alt} className={className} loading={loading} />;
  }

  return (
    <span className="group relative block h-full w-full">
      <img src={shown} alt={alt} className={className} loading={loading} />
      <span className="absolute inset-0 z-10 flex items-center justify-center gap-2 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            fileRef.current?.click();
          }}
          className="flex items-center gap-1.5 rounded-full bg-olive px-3 py-1.5 text-xs font-medium text-cream shadow-lg"
        >
          <ImageUp className="h-3.5 w-3.5" /> {busy ? "Enviando..." : "Trocar foto"}
        </button>
        {getCachedImages()[id] && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              deleteImage(id);
              deleteRecipePhoto(id).catch(() => {});
            }}
            className="flex items-center gap-1 rounded-full bg-red-500/90 px-2.5 py-1.5 text-xs text-white shadow-lg"
            title="Restaurar foto original"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        )}
      </span>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onClick={(e) => {
          // The programmatic click on this input bubbles up to the parent
          // card/Link and was navigating to the detail page. Contain it here.
          e.stopPropagation();
          (e.target as HTMLInputElement).value = "";
        }}
        onChange={(e) => {
          e.stopPropagation();
          const f = e.target.files?.[0];
          if (f) onFile(f);
        }}
      />
    </span>
  );
}

/* ─────────────────────────── Edit mode bar ─────────────────────────── */
export function EditModeBar() {
  const edit = useEditMode();
  if (!edit) return null;
  return createPortal(
    <div className="fixed bottom-24 left-1/2 z-[90] flex -translate-x-1/2 items-center gap-3 rounded-full bg-stone-900/95 px-4 py-2 text-xs text-white shadow-2xl backdrop-blur lg:bottom-6">
      <span className="flex items-center gap-1.5 font-medium text-olive">
        <Pencil className="h-3.5 w-3.5" /> Modo edição
      </span>
      <span className="hidden text-stone-400 sm:inline">Toque em textos e fotos para editar</span>
      <button
        onClick={() => {
          setEditMode(false);
          window.location.href = "/admin";
        }}
        className="rounded-full bg-stone-700 px-3 py-1 text-stone-200 hover:text-white"
      >
        Sair
      </button>
    </div>,
    document.body,
  );
}
