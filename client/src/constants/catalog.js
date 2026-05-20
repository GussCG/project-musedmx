import Icons from "../components/Other/IconProvider";

export const TEMATICAS = {
  1: {
    id: 1,
    nombre: "Antropología",
    icon: Icons.antropologiaIcon,
    museoCardColorsLight: {
      background: "#edffe9",
      header: "#009016",
      text: "#1b6c27",
      backgroundImage: "#004700",
    },
    museoCardColorsDark: {
      background: "#212820",
      header: "#009016",
      text: "#c8ffd1",
      backgroundImage: "#c7ffc7",
    },
    museoDetailBGColors: {
      background_1: "#dcffd4",
      background_2: "#b3e6b3",
    },
    museoDetailBGColorsDM: {
      background_1: "#1d211d",
      background_2: "#2b312b",
    },
  },
  2: {
    id: 2,
    nombre: "Arte",
    icon: Icons.arteIcon,
    museoCardColorsLight: {
      background: "#dbe1ff",
      header: "#3254ff",
      text: "#25389c",
      backgroundImage: "#000d47",
    },
    museoCardColorsDark: {
      background: "#202334",
      header: "#3254ff",
      text: "#b6c2ff",
      backgroundImage: "#000d47",
    },
    museoDetailBGColors: {
      background_1: "#b6c3ff",
      background_2: "#a0b0ff",
    },
    museoDetailBGColorsDM: {
      background_1: "#1d1f2d",
      background_2: "#2b2d3b",
    },
  },
  3: {
    id: 3,
    nombre: "Arte Alternativo",
    icon: Icons.arteAlternativoIcon,
    museoCardColorsLight: {
      background: "#f1e1ff",
      header: "#6b00a5",
      text: "#50007b",
      backgroundImage: "#44027d",
    },
    museoCardColorsDark: {
      background: "#362f3c",
      header: "#6b00a5",
      text: "#c6a3ff",
      backgroundImage: "#44027d",
    },
    museoDetailBGColors: {
      background_1: "#e3c6ff",
      background_2: "#d0b0ff",
    },
    museoDetailBGColorsDM: {
      background_1: "#2d1d2b",
      background_2: "#3b2b3b",
    },
  },
  4: {
    id: 4,
    nombre: "Arqueología",
    icon: Icons.arqueologiaIcon,
    museoCardColorsLight: {
      background: "#ffeddd",
      header: "#7d4f05",
      text: "#754e00",
      backgroundImage: "#7d5002",
    },
    museoCardColorsDark: {
      background: "#3b3229",
      header: "#7d4f05",
      text: "#ffd3b1",
      backgroundImage: "#7d5002",
    },
    museoDetailBGColors: {
      background_1: "#e5c1a0",
      background_2: "#d0b08c",
    },
    museoDetailBGColorsDM: {
      background_1: "#2e281e",
      background_2: "#382d1b",
    },
  },
  5: {
    id: 5,
    nombre: "Ciencia y Tecnología",
    icon: Icons.cienciayTecnologiaIcon,
    museoCardColorsLight: {
      background: "#ffd9d9",
      header: "#910000",
      text: "#570707",
      backgroundImage: "#580101",
    },
    museoCardColorsDark: {
      background: "#301e1e",
      header: "#910000",
      text: "#ffc2c2",
      backgroundImage: "#580101",
    },
    museoDetailBGColors: {
      background_1: "#ffb6b6",
      background_2: "#ff9f9f",
    },
    museoDetailBGColorsDM: {
      background_1: "#2d1d1d",
      background_2: "#3b2b2b",
    },
  },
  6: {
    id: 6,
    nombre: "Especializado",
    icon: Icons.especializadoIcon,
    museoCardColorsLight: {
      background: "#cfe0d8",
      header: "#2c634b",
      text: "#0a3d23",
      backgroundImage: "#223633",
    },
    museoCardColorsDark: {
      background: "#1c201e",
      header: "#2c634b",
      text: "#d8ffeb",
      backgroundImage: "#223633",
    },
    museoDetailBGColors: {
      background_1: "#97cab2",
      background_2: "#7fbfa6",
    },
    museoDetailBGColorsDM: {
      background_1: "#1d2b2b",
      background_2: "#2b3b3b",
    },
  },
  7: {
    id: 7,
    nombre: "Historia",
    icon: Icons.historiaIcon,
    museoCardColorsLight: {
      background: "#fff9dc",
      header: "#9f9500",
      text: "#a28a00",
      backgroundImage: "#928900",
    },
    museoCardColorsDark: {
      background: "#333125",
      header: "#9f9500",
      text: "#fff3ae",
      backgroundImage: "#928900",
    },
    museoDetailBGColors: {
      background_1: "#fff7d2",
      background_2: "#ffe6b3",
    },
    museoDetailBGColorsDM: {
      background_1: "#2b2d1d",
      background_2: "#3b3b2b",
    },
  },
  8: {
    id: 8,
    nombre: "Otro",
    icon: Icons.otroIcon,
    museoCardColorsLight: {
      background: "#ebebeb",
      header: "#545454",
      text: "#434343",
      backgroundImage: "#2f2f2f",
    },
    museoCardColorsDark: {
      background: "#ebebeb",
      header: "#545454",
      text: "#434343",
      backgroundImage: "#2f2f2f",
    },
    museoDetailBGColors: {
      background_1: "#ebebeb",
      background_2: "#d0d0d0",
    },
    museoDetailBGColorsDM: {
      background_1: "#2b2b2b",
      background_2: "#3b3b3b",
    },
  },
};

export const ALCALDIAS = ["Benito Juárez", "Cuauhtémoc", "Miguel Hidalgo"];

export const REDES_SOCIALES = {
  1: {
    id: 1,
    nombre: "Página Web",
    icon: Icons.AiOutlineGlobal,
    validador: (link) =>
      /^(https?:\/\/)?(www\.)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\/?$/.test(link),
  },
  2: {
    id: 2,
    nombre: "Email",
    icon: Icons.IoMail,
    validador: (link) =>
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(link),
  },
  3: {
    id: 3,
    nombre: "Facebook",
    icon: Icons.FaSquareFacebook,
    validador: (link) =>
      /^(https?:\/\/)?(www\.)?facebook\.com\/[A-Za-z0-9._%+-]+\/?$/.test(link),
  },
  4: {
    id: 4,
    nombre: "Twitter",
    icon: Icons.FaSquareXTwitter,
    validador: (link) =>
      /^(https?:\/\/)?(www\.)?twitter\.com\/[A-Za-z0-9._%+-]+\/?$/.test(link) ||
      /^https?:\/\/(www\.)?x\.com\/[A-Za-z0-9._]+\/?$/.test(link),
  },
  5: {
    id: 5,
    nombre: "Instagram",
    icon: Icons.FaSquareInstagram,
    validador: (link) =>
      /^(https?:\/\/)?(www\.)?instagram\.com\/[A-Za-z0-9._%+-]+\/?$/.test(link),
  },
};

// Modos de viaje con label, icono y valor
export const TRAVEL_MODES = {
  DRIVING: {
    label: "Auto",
    icon: Icons.FaCar,
    value: "DRIVING",
  },
  BICYCLING: {
    label: "Bicicleta",
    icon: Icons.FaBicycle,
    value: "BICYCLING",
  },
  WALKING: {
    label: "Caminando",
    icon: Icons.FaPersonWalking,
    value: "WALKING",
  },
  TRANSIT: {
    label: "Transporte Público",
    icon: Icons.FaBus,
    value: "TRANSIT",
  },
};

// Tipos de Mapa
export const MAP_TYPES = {
  ROADMAP: {
    label: "Mapa de Carretera",
    icon: Icons.FaMap,
    value: "ROADMAP",
    normalized: "roadmap",
  },
  SATELLITE: {
    label: "Mapa Satelital",
    icon: Icons.FaSatellite,
    value: "SATELLITE",
    normalized: "satellite",
  },
  TERRAIN: {
    label: "Mapa de Terreno",
    icon: Icons.MdTerrain,
    value: "TERRAIN",
    normalized: "terrain",
  },
  HYBRID: {
    label: "Mapa Híbrido",
    icon: Icons.IoMapSharp,
    value: "HYBRID",
    normalized: "hybrid",
  },
};

export const SERVICIOS = {
  1: {
    id: 1,
    nombre: "Tienda de Regalos",
    icon: Icons.tiendaIcon,
  },
  2: {
    id: 2,
    nombre: "WiFi",
    icon: Icons.wifiIcon,
  },
  3: {
    id: 3,
    nombre: "Guardarropa",
    icon: Icons.guardarropaIcon,
  },
  4: {
    id: 4,
    nombre: "Biblioteca",
    icon: Icons.bilbiotecaIcon,
  },
  5: {
    id: 5,
    nombre: "Estacionamiento",
    icon: Icons.estacionamientoIcon,
  },
  6: {
    id: 6,
    nombre: "Visitas Guiadas",
    icon: Icons.visitaGuiadaIcon,
  },
  7: {
    id: 7,
    nombre: "Servicio Médico",
    icon: Icons.medicoIcon,
  },
  8: {
    id: 8,
    nombre: "Baño",
    icon: Icons.banioIcon,
  },
  9: {
    id: 9,
    nombre: "Sillas de Ruedas",
    icon: Icons.sillaRuedasIcon,
  },
  10: {
    id: 10,
    nombre: "Cafetería",
    icon: Icons.cafeteriaIcon,
  },
  11: {
    id: 11,
    nombre: "Elevador",
    icon: Icons.elevadorIcon,
  },
  12: {
    id: 12,
    nombre: "Braille",
    icon: Icons.brailleIcon,
  },
  13: {
    id: 13,
    nombre: "Lenguaje de Señas",
    icon: Icons.lenguajeDeSenasIcon,
  },
};

export const CALIFICACIONES_RUBROS = {
  5: [
    { valor: 1, titulo: "Adultos", icono: Icons.adultoIcon },
    { valor: 1, titulo: "Familiar", icono: Icons.familiarIcon },
    { valor: 1, titulo: "Niños", icono: Icons.ninoIcon },
  ],
  1: [
    { valor: 5, titulo: "Muy Interesante", icono: Icons.interesanteIcon },
    { valor: 4, titulo: "Interesante", icono: Icons.interesanteIcon },
    { valor: 3, titulo: "Poco Interesante", icono: Icons.dormirIcon },
    { valor: 2, titulo: "Aburrido", icono: Icons.dormirIcon },
  ],
  2: [
    { valor: 1, titulo: "Limpio", icono: Icons.limpioIcon },
    { valor: 0.5, titulo: "Sucio", icono: Icons.sucioIcon },
  ],
  3: [
    { valor: 1, titulo: "Entendible", icono: Icons.entendibleIcon },
    { valor: 0.5, titulo: "Difícil", icono: Icons.dificilIcon },
  ],
  4: [
    { valor: 4, titulo: "Muy Caro", icono: Icons.muyCaroIcon },
    { valor: 3, titulo: "Caro", icono: Icons.caroIcon },
    { valor: 2, titulo: "Barato", icono: Icons.baratoIcon },
    { valor: 1, titulo: "Gratis", icono: Icons.gratisIcon },
  ],
};

export const DIAS_SEMANA = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo",
];

export const PREGUNTAS_RESPUESTAS = {
  1: {
    id: 1,
    pregunta: "¿Qué tan interesante fue la visita?",
    respuestas: [
      {
        valor: 5,
        respuesta: "Muy Interesante",
      },
      {
        valor: 4,
        respuesta: "Interesante",
      },
      {
        valor: 3,
        respuesta: "Medio Interesante",
      },
      {
        valor: 2,
        respuesta: "Aburrido",
      },
      {
        valor: 1,
        respuesta: "Muy Aburrido",
      },
    ],
  },
  2: {
    id: 2,
    pregunta: "¿El museo estaba limpio?",
    respuestas: [
      {
        valor: 1,
        respuesta: "Limpio",
      },
      {
        valor: 0,
        respuesta: "Sucio",
      },
    ],
  },
  3: {
    id: 3,
    pregunta: "¿Es fácil de entender el museo?",
    respuestas: [
      {
        valor: 1,
        respuesta: "Sí",
      },
      {
        valor: 0,
        respuesta: "No",
      },
    ],
  },
  4: {
    id: 4,
    pregunta: "¿Qué tan costosa fue la entrada al museo?",
    respuestas: [
      {
        valor: 1,
        respuesta: "Muy costosa",
      },
      {
        valor: 2,
        respuesta: "Costosa",
      },
      {
        valor: 3,
        respuesta: "Barata",
      },
      {
        valor: 4,
        respuesta: "Gratis",
      },
    ],
  },
  5: {
    id: 5,
    pregunta: "¿Para qué público esta dirigido?",
    respuestas: [
      {
        valor: 1,
        respuesta: "Niños",
      },
      {
        valor: 2,
        respuesta: "Toda la familia",
      },
      {
        valor: 3,
        respuesta: "Adultos",
      },
    ],
  },
};

export const TIPOS_USUARIO = {
  1: {
    id: 1,
    nombre: "Usuario",
    redirectPath: "/Usuario",
  },
  2: {
    id: 2,
    nombre: "Admin",
    redirectPath: "/Admin",
  },
  3: {
    id: 3,
    nombre: "Mod",
    redirectPath: "/Mod",
  },
  0: {
    id: 0,
    nombre: "",
    redirectPath: "/",
  },
};

export const MOTIVOS_RECHAZO = {
  1: {
    id: 1,
    nombre: "Comentario inapropiado",
  },
  2: {
    id: 2,
    nombre: "Imágenes inapropiadas",
  },
  3: {
    id: 3,
    nombre: "Otro",
  },
};
