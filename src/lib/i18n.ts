export type Lang = "es" | "pt";

const KEY = "mab:lang";

export function getLang(): Lang {
  if (typeof window === "undefined") return "es";
  const stored = localStorage.getItem(KEY) as Lang | null;
  if (stored === "es" || stored === "pt") return stored;
  // First visit: default to Spanish (primary audience). User can switch to PT.
  return "es";
}

export function setLang(l: Lang) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, l);
  window.dispatchEvent(new CustomEvent("mab:lang"));
}

// ─── Translations ────────────────────────────────────────────────────────────
export const T = {
  es: {
    // Nav
    nav_inicio: "Inicio",
    nav_recetas: "Recetas",
    nav_mesa: "Edén",
    nav_devocion: "Devoción",
    nav_perfil: "Perfil",
    nav_protocolo: "Anti\ninflamación",
    nav_mesa_unica: "Mesa Única",

    // Login
    login_badge: "Método Bíblico",
    login_pwa_banner_title: "¡Bienvenida! App instalada con éxito",
    login_pwa_banner_body:
      "Ingresa con el mismo correo que usaste en el navegador para traer todos tus datos.",
    login_loading: "Cargando...",
    login_title: "Método Alimentación Bíblica",
    login_subtitle: "La mesa que Dios creó, al alcance de tu cocina.",
    login_email_placeholder: "tuemail@ejemplo.com",
    login_remember: "Recordarme",
    login_enter: "Entrar",
    login_no_account: "¿Aún no tienes cuenta?",
    login_create: "Crear cuenta",
    login_have_account: "¿Ya eres parte de la familia?",
    login_signin: "Entrar",
    login_explore: "Explorar como visitante",
    login_name_placeholder: "Tu nombre",
    login_verse: '"Tu cuerpo es templo del Espíritu Santo."',

    // Dashboard
    dash_greeting: "Hola,",
    dash_subtitle: "Hoy es un nuevo día para cuidar el templo que Dios te dio.",
    dash_daily: "Devocional del día",
    dash_read_more: "Leer reflexión completa →",
    dash_journey: "Jornada",
    dash_day: "Día",
    dash_day_seq: "día seguido",
    dash_days_seq: "días seguidos",
    dash_hydration: "Hidratación",
    dash_morning_ritual: "Bebidas naturales",
    dash_sacred_juice: "Recetas de Jugos",
    dash_juice_sub: "Más de 50 jugos naturales + el Jugo Sagrado del día.",
    dash_juice_done: "Ver recetas →",
    dash_juice_access: "Ver recetas →",
    dash_recipes: "Recetas Bíblicas",
    dash_fundamentals: "Fundamentos",
    dash_eden_table: "Mesa del Edén",
    dash_devotional: "Devocional",
    dash_daily_reflection: "Reflexión diaria",
    dash_progress: "Progreso",
    dash_my_evolution: "Mi evolución",
    dash_continue: "Continuar desde donde lo dejaste",
    dash_see_all: "Ver todo",

    // Recipes list
    rec_subtitle: "La mesa del Edén",
    rec_title: "Recetas Bíblicas",
    rec_desc: "Comida viva, simple y llena de propósito. Inspirada en las Escrituras.",
    rec_search: "Buscar receta...",
    rec_all: "Todas",
    rec_none: "Ninguna receta encontrada.",
    rec_min: "min",
    cat_main: "Platos Principales",
    cat_salads: "Ensaladas y Acompañamientos",
    cat_soups: "Sopas",
    cat_herbs: "Hierbas y Condimentos",
    cat_desserts: "Postres",
    cat_anchor: "Recetas Ancla",

    // Recipe detail
    rd_ingredients: "Ingredientes",
    rd_steps: "Modo de preparación",
    rd_tip: "Consejo de Beatriz",
    rd_benefits: "Beneficios",
    rd_back: "Volver",
    rd_portions: "porciones",
    rd_easy: "Fácil",
    rd_medium: "Medio",
    rd_advanced: "Avanzado",

    // Devotional
    dev_subtitle: "Comunión diaria",
    dev_title: "Devocional del Día",
    dev_reflection: "Reflexión",
    dev_prayer_title: "Oración del día",

    // Profile
    prof_subtitle: "Templo del Espíritu",
    prof_age: "Edad",
    prof_weight: "Peso",
    prof_water: "Agua",
    prof_goal_label: "Mi objetivo",
    prof_goal_edit: "Editar objetivo",
    prof_goal_add: "Añadir objetivo",
    prof_goal_save: "Guardar",
    prof_goal_placeholder: "Escribe tu objetivo de salud...",
    prof_favorites: "Favoritas",
    prof_fav_hint: "desliza ← para quitar",
    prof_no_fav: "Aún no has marcado ninguna receta como favorita.",
    prof_notifications: "Notificaciones",
    prof_notifications_hint: "Recordatorios suaves durante el día",
    prof_preferences: "Preferencias",
    prof_preferences_hint: "Idioma y configuración",
    prof_help: "Ayuda y soporte",
    prof_help_hint: "Preguntas frecuentes y contacto",
    prof_signout: "Salir",

    // Help & support modal
    help_title: "Ayuda y soporte",
    help_faq_label: "Preguntas frecuentes",
    help_contact_label: "¿Necesitas hablar con nosotros?",
    help_contact_body: "Escríbenos y te respondemos en pocos minutos. Estamos aquí para ayudarte.",
    help_email_btn: "Escribir por correo",
    help_email_subject: "Soporte — Método Alimentación Bíblica",
    help_close: "Cerrar",
    faq_access_q: "Compré pero no puedo acceder, ¿qué hago?",
    faq_access_a:
      "Ingresa con el mismo correo que usaste en la compra. Si aún no entra, escríbenos a metodoalimentacionbiblica@gmail.com y liberamos tu acceso en pocos minutos.",
    faq_install_q: "¿Cómo instalo la app en mi celular?",
    faq_install_a:
      "Abre el menú de tu navegador y toca \"Agregar a la pantalla de inicio\". La app quedará como un ícono normal, sin ocupar espacio.",
    faq_data_q: "¿Pierdo mis datos si cambio de celular?",
    faq_data_a:
      "No. Entra con el mismo correo en el nuevo dispositivo y tu progreso, favoritos y objetivos vuelven automáticamente.",
    faq_refund_q: "¿Tengo garantía?",
    faq_refund_a:
      "Sí. Tienes garantía de devolución según las políticas de la plataforma de compra. Antes de pedirla, escríbenos a metodoalimentacionbiblica@gmail.com: casi siempre resolvemos el problema al instante.",
    prof_verse:
      '"Venid a mí todos los que estáis cansados y cargados, y yo os haré descansar." — Mateo 11:28',

    // Preferences modal
    pref_title: "Preferencias",
    pref_lang: "Idioma",
    pref_lang_es: "Español",
    pref_lang_pt: "Português",
    pref_close: "Cerrar",

    // Notifications modal
    notif_title: "Notificaciones",
    notif_morning: "Recordatorio matutino",
    notif_morning_hint: "Te recuerda el jugo sagrado cada mañana",
    notif_afternoon: "Recordatorio de hidratación",
    notif_afternoon_hint: "Cada 2 horas durante el día",
    notif_devotional: "Devocional diario",
    notif_devotional_hint: "Reflexión al despertar",
    notif_save: "Guardar",

    // Suco Sagrado
    suco_title: "Jugo Sagrado de la Mañana",
    suco_done: "✓ Ya lo tomé hoy",
    suco_mark: "Marcar como tomado",

    // Onboarding
    onb_welcome: "Bienvenida",
    onb_name_label: "¿Cómo te llamas?",
    onb_name_placeholder: "Tu nombre",
    onb_next: "Continuar",
    onb_skip: "Saltar por ahora",

    // Fundamentos
    fund_title: "Mesa del Edén",
    fund_subtitle: "Los fundamentos de la Alimentación Bíblica",

    // Progresso
    prog_title: "Progreso",
    prog_subtitle: "Tu evolución en la jornada",
  },

  pt: {
    nav_inicio: "Início",
    nav_recetas: "Receitas",
    nav_mesa: "Mesa",
    nav_devocion: "Devoção",
    nav_perfil: "Perfil",
    nav_protocolo: "Anti-\nInflamação",
    nav_mesa_unica: "Mesa Única",

    login_badge: "Método Bíblico",
    login_pwa_banner_title: "Bem-vindo! App instalado com sucesso",
    login_pwa_banner_body:
      "Entre com o mesmo email que usou no navegador para trazer todos os seus dados.",
    login_loading: "Carregando...",
    login_title: "Método Alimentação Bíblica",
    login_subtitle: "A mesa que Deus criou, ao alcance da sua cozinha.",
    login_email_placeholder: "seuemail@exemplo.com",
    login_remember: "Lembrar-me",
    login_enter: "Entrar",
    login_no_account: "Ainda não tem conta?",
    login_create: "Criar conta",
    login_have_account: "Já é da família?",
    login_signin: "Entrar",
    login_explore: "Explorar como visitante",
    login_name_placeholder: "Seu nome",
    login_verse: '"Seu corpo é templo do Espírito Santo."',

    dash_greeting: "Olá,",
    dash_subtitle: "Hoje é um novo dia para cuidar do templo que Deus lhe deu.",
    dash_daily: "Devocional do dia",
    dash_read_more: "Ler reflexão completa →",
    dash_journey: "Jornada",
    dash_day: "Dia",
    dash_day_seq: "dia seguido",
    dash_days_seq: "dias seguidos",
    dash_hydration: "Hidratação",
    dash_morning_ritual: "Bebidas naturais",
    dash_sacred_juice: "Receitas de Sucos",
    dash_juice_sub: "Mais de 50 sucos naturais + o Suco Sagrado do dia.",
    dash_juice_done: "Ver receitas →",
    dash_juice_access: "Ver receitas →",
    dash_recipes: "Receitas Bíblicas",
    dash_fundamentals: "Fundamentos",
    dash_eden_table: "Mesa do Éden",
    dash_devotional: "Devocional",
    dash_daily_reflection: "Reflexão diária",
    dash_progress: "Progresso",
    dash_my_evolution: "Sua evolução",
    dash_continue: "Continue de onde parou",
    dash_see_all: "Ver tudo",

    rec_subtitle: "A mesa do Éden",
    rec_title: "Receitas Bíblicas",
    rec_desc: "Comida viva, simples e cheia de propósito. Inspirada nas Escrituras.",
    rec_search: "Buscar receita...",
    rec_all: "Todas",
    rec_none: "Nenhuma receita encontrada.",
    rec_min: "min",
    cat_main: "Pratos Principais",
    cat_salads: "Saladas e Acompanhamentos",
    cat_soups: "Sopas",
    cat_herbs: "Ervas e Temperos",
    cat_desserts: "Sobremesas",
    cat_anchor: "Receitas Âncora",

    rd_ingredients: "Ingredientes",
    rd_steps: "Modo de preparo",
    rd_tip: "Dica da Beatriz",
    rd_benefits: "Benefícios",
    rd_back: "Voltar",
    rd_portions: "porções",
    rd_easy: "Fácil",
    rd_medium: "Médio",
    rd_advanced: "Avançado",

    dev_subtitle: "Comunhão diária",
    dev_title: "Devocional do Dia",
    dev_reflection: "Reflexão",
    dev_prayer_title: "Oração do dia",

    prof_subtitle: "Templo do Espírito",
    prof_age: "Idade",
    prof_weight: "Peso",
    prof_water: "Água",
    prof_goal_label: "Meu objetivo",
    prof_goal_edit: "Editar objetivo",
    prof_goal_add: "Adicionar objetivo",
    prof_goal_save: "Salvar",
    prof_goal_placeholder: "Escreva seu objetivo de saúde...",
    prof_favorites: "Favoritos",
    prof_fav_hint: "deslize ← para remover",
    prof_no_fav: "Você ainda não favoritou nenhuma receita.",
    prof_notifications: "Notificações",
    prof_notifications_hint: "Lembretes gentis durante o dia",
    prof_preferences: "Preferências",
    prof_preferences_hint: "Idioma e configurações",
    prof_help: "Ajuda e suporte",
    prof_help_hint: "Perguntas frequentes e contato",
    prof_signout: "Sair",

    // Help & support modal
    help_title: "Ajuda e suporte",
    help_faq_label: "Perguntas frequentes",
    help_contact_label: "Precisa falar com a gente?",
    help_contact_body: "Escreva pra gente que respondemos em poucos minutos. Estamos aqui pra te ajudar.",
    help_email_btn: "Escrever por e-mail",
    help_email_subject: "Suporte — Método Alimentação Bíblica",
    help_close: "Fechar",
    faq_access_q: "Comprei mas não consigo acessar, e agora?",
    faq_access_a:
      "Entre com o mesmo e-mail que usou na compra. Se ainda não liberar, escreva pra gente em metodoalimentacionbiblica@gmail.com que liberamos seu acesso em poucos minutos.",
    faq_install_q: "Como instalo o app no meu celular?",
    faq_install_a:
      "Abra o menu do seu navegador e toque em \"Adicionar à tela de início\". O app fica como um ícone normal, sem ocupar espaço.",
    faq_data_q: "Perco meus dados se trocar de celular?",
    faq_data_a:
      "Não. Entre com o mesmo e-mail no aparelho novo e seu progresso, favoritos e objetivos voltam automaticamente.",
    faq_refund_q: "Tenho garantia?",
    faq_refund_a:
      "Sim. Você tem garantia de reembolso conforme as políticas da plataforma de compra. Antes de pedir, fale com a gente em metodoalimentacionbiblica@gmail.com: quase sempre resolvemos o problema na hora.",
    prof_verse:
      '"Vinde a mim, todos os que estais cansados e sobrecarregados, e eu vos aliviarei." — Mateus 11:28',

    pref_title: "Preferências",
    pref_lang: "Idioma",
    pref_lang_es: "Español",
    pref_lang_pt: "Português",
    pref_close: "Fechar",

    notif_title: "Notificações",
    notif_morning: "Lembrete matinal",
    notif_morning_hint: "Te lembra do suco sagrado todas as manhãs",
    notif_afternoon: "Lembrete de hidratação",
    notif_afternoon_hint: "A cada 2 horas durante o dia",
    notif_devotional: "Devocional diário",
    notif_devotional_hint: "Reflexão ao acordar",
    notif_save: "Salvar",

    suco_title: "Suco Sagrado da Manhã",
    suco_done: "✓ Já tomei hoje",
    suco_mark: "Marcar como tomado",

    onb_welcome: "Boas-vindas",
    onb_name_label: "Como você se chama?",
    onb_name_placeholder: "Seu nome",
    onb_next: "Continuar",
    onb_skip: "Pular por agora",

    fund_title: "Mesa do Éden",
    fund_subtitle: "Os fundamentos da Alimentação Bíblica",

    prog_title: "Progresso",
    prog_subtitle: "Sua evolução na jornada",
  },
} as const;

export type TKey = keyof typeof T.es;
