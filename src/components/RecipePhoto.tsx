import { useImagesReady } from "@/lib/store";

/**
 * Renders a recipe photo. Holds back the <img> until the IndexedDB image
 * cache is hydrated to avoid flashing the stock photo for ~1s before the
 * user-uploaded version swaps in.
 */
export function RecipePhoto({
  src,
  alt,
  className,
  loading,
  draggable,
}: {
  src: string;
  alt: string;
  className?: string;
  loading?: "lazy" | "eager";
  draggable?: boolean;
}) {
  const ready = useImagesReady();

  if (!ready) {
    return (
      <div
        className={`${className ?? ""} bg-highlight/60 animate-pulse`}
        aria-label={alt}
        role="img"
      />
    );
  }

  return <img src={src} alt={alt} className={className} loading={loading} draggable={draggable} />;
}
