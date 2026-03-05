export const dict = {
  ES: {
    // Nav
    login: "Iniciar sesión",
    signup: "Crear cuenta",
    logout: "Cerrar sesión",
    roleStartup: "Soy Startup Founder",
    roleInvestor: "Soy Inversor",
    roleAdmin: "Soy Admin",
    rolePitchRoom: "Pitch Room",
    demoMode: "Modo Demo",

    // Landing
    tagline: "Conectando Innovación con Capital",
    heroDesc:
      "La plataforma profesional para startups e inversores. Descubre, conecta y cierra rondas de inversión basadas en datos.",
    feat1: "Perfiles Estandarizados",
    feat1Desc: "Información estructurada para decisiones rápidas.",
    feat2: "Matching Transparente",
    feat2Desc: "Algoritmo de puntuación que explica por qué haces match.",
    feat3: "Insignia de Verificación",
    feat3Desc: "Startups verificadas para mayor confianza.",
    feat4: "Pitch Room Simulator",
    feat4Desc: "Practica tu pitch con inversores de IA y recibe feedback.",
    viewDemo: "Ver Demo",

    // Roles
    chooseRole: "Elige tu rol",

    // Startup Dashboard
    profileCompleteness: "Completitud del Perfil",
    verificationStatus: "Estado de Verificación",
    quickActions: "Acciones Rápidas",
    editProfile: "Editar Perfil",
    submitVerification: "Enviar a Verificación",
    viewRequests: "Ver Solicitudes",
    suggestedInvestors: "Inversores Sugeridos",
    inviteToView: "Invitar a ver",

    // Startup Profile
    startupProfile: "Perfil de Startup",
    saveDraft: "Guardar Borrador",
    publishProfile: "Publicar Perfil",
    unverified: "No verificado",
    pending: "Pendiente",
    verified: "Verificado",
    rejected: "Rechazado",

    // Investor Dashboard
    preferencesCompleteness: "Completitud de Preferencias",
    editPreferences: "Editar Preferencias",
    browseStartups: "Explorar Startups",
    viewMatches: "Ver Matches",
    savedStartups: "Startups Guardadas",
    yourPipeline: "Tu Pipeline",
    savedCount: "Guardadas",
    requestsPending: "Solicitudes Pendientes",
    requestsAccepted: "Solicitudes Aceptadas",

    // Investor Browse
    searchStartups: "Buscar startups...",
    filters: "Filtros",
    industry: "Industria",
    stage: "Etapa",
    country: "País",
    fundingRange: "Rango de Financiación",
    verifiedOnly: "Solo verificadas",
    sortBy: "Ordenar por",
    matchScore: "Puntuación de Match",
    fundingNeeded: "Financiación Necesaria",
    newest: "Más recientes",
    view: "Ver",
    save: "Guardar",
    unsave: "Quitar guardado",

    // Match
    topMatches: "Tus Mejores Matches",
    whyMatch: "¿Por qué este match?",
    weightsPanel: "Panel de Pesos",

    // Admin
    adminPanel: "Panel de Administración",
    pendingReview: "Pendientes de Revisión",
    verify: "Verificar",
    reject: "Rechazar",
    hide: "Ocultar",
    moderationLog: "Registro de Moderación",
  },
  EN: {
    // Nav
    login: "Login",
    signup: "Sign Up",
    logout: "Logout",
    roleStartup: "I am a Startup Founder",
    roleInvestor: "I am an Investor",
    roleAdmin: "I am an Admin",
    rolePitchRoom: "Pitch Room",
    demoMode: "Demo Mode",

    // Landing
    tagline: "Connecting Innovation with Capital",
    heroDesc:
      "The professional platform for startups and investors. Discover, connect, and close funding rounds based on data.",
    feat1: "Standardized Profiles",
    feat1Desc: "Structured information for quick decisions.",
    feat2: "Transparent Matching",
    feat2Desc: "Scoring algorithm that explains why you match.",
    feat3: "Verification Badge",
    feat3Desc: "Verified startups for increased trust.",
    feat4: "Pitch Room Simulator",
    feat4Desc: "Practice your pitch with AI investors and get feedback.",
    viewDemo: "View Demo",

    // Roles
    chooseRole: "Choose your role",

    // Startup Dashboard
    profileCompleteness: "Profile Completeness",
    verificationStatus: "Verification Status",
    quickActions: "Quick Actions",
    editProfile: "Edit Profile",
    submitVerification: "Submit for Verification",
    viewRequests: "View Requests",
    suggestedInvestors: "Suggested Investors",
    inviteToView: "Invite to view",

    // Startup Profile
    startupProfile: "Startup Profile",
    saveDraft: "Save Draft",
    publishProfile: "Publish Profile",
    unverified: "Unverified",
    pending: "Pending",
    verified: "Verified",
    rejected: "Rejected",

    // Investor Dashboard
    preferencesCompleteness: "Preferences Completeness",
    editPreferences: "Edit Preferences",
    browseStartups: "Browse Startups",
    viewMatches: "View Matches",
    savedStartups: "Saved Startups",
    yourPipeline: "Your Pipeline",
    savedCount: "Saved",
    requestsPending: "Pending Requests",
    requestsAccepted: "Accepted Requests",

    // Investor Browse
    searchStartups: "Search startups...",
    filters: "Filters",
    industry: "Industry",
    stage: "Stage",
    country: "Country",
    fundingRange: "Funding Range",
    verifiedOnly: "Verified only",
    sortBy: "Sort by",
    matchScore: "Match Score",
    fundingNeeded: "Funding Needed",
    newest: "Newest",
    view: "View",
    save: "Save",
    unsave: "Unsave",

    // Match
    topMatches: "Your Top Matches",
    whyMatch: "Why this match?",
    weightsPanel: "Weights Panel",

    // Admin
    adminPanel: "Admin Panel",
    pendingReview: "Pending Review",
    verify: "Verify",
    reject: "Reject",
    hide: "Hide",
    moderationLog: "Moderation Log",
  },
};

export const useTranslation = (lang: "ES" | "EN") => {
  return dict[lang];
};
