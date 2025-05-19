import Icons from "../components/Other/IconProvider";

export const TEMATICAS = {
  1: {
    id: 1,
    nombre: "Antropología",
    icon: Icons.antropologiaIcon,
    museoCardColors: {
      background: "#dcffd4",
      header: "#0b891e",
      text: "#198e2b",
      backgroundImage: "#004700",
    },
  },
  2: {
    id: 2,
    nombre: "Arte",
    icon: Icons.arteIcon,
    museoCardColors: {
      background: "#b6c3ff",
      header: "#3548a7",
      text: "#3548a7",
      backgroundImage: "#000d47",
    },
  },
  3: {
    id: 3,
    nombre: "Arte Alternativo",
    icon: Icons.arteAlternativoIcon,
    museoCardColors: {
      background: "#e3c6ff",
      header: "#7001ab",
      text: "#74269e",
      backgroundImage: "#44027d",
    },
  },
  4: {
    id: 4,
    nombre: "Arqueología",
    icon: Icons.arqueologiaIcon,
    museoCardColors: {
      background: "#e5c1a0",
      header: "#7d4f05",
      text: "#754e00",
      backgroundImage: "#7d5002",
    },
  },
  5: {
    id: 5,
    nombre: "Ciencia y Tecnología",
    icon: Icons.cienciayTecnologiaIcon,
    museoCardColors: {
      background: "#ffb6b6",
      header: "#920b0b",
      text: "#731313",
      backgroundImage: "#580101",
    },
  },
  6: {
    id: 6,
    nombre: "Especializado",
    icon: Icons.especializadoIcon,
    museoCardColors: {
      background: "#97cab2",
      header: "#2a4d3e",
      text: "#1d4832",
      backgroundImage: "#223633",
    },
  },
  7: {
    id: 7,
    nombre: "Historia",
    icon: Icons.historiaIcon,
    museoCardColors: {
      background: "#fff7d2",
      header: "#8c842f",
      text: "#8d7e2b",
      backgroundImage: "#928900",
    },
  },
  8: {
    id: 8,
    nombre: "Otro",
    icon: Icons.otroIcon,
    museoCardColors: {
      background: "#ebebeb",
      header: "#545454",
      text: "#434343",
      backgroundImage: "#2f2f2f",
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
    { valor: 3, titulo: "Adultos", icono: Icons.adultoIcon },
    { valor: 2, titulo: "Familiar", icono: Icons.familiarIcon },
    { valor: 1, titulo: "Niños", icono: Icons.ninoIcon },
  ],
  1: [
    { valor: 5, titulo: "Muy Interesante", icono: Icons.dormirIcon },
    { valor: 4, titulo: "Interesante", icono: Icons.dormirIcon },
    { valor: 3, titulo: "Poco Interesante", icono: Icons.dormirIcon },
    { valor: 2, titulo: "Aburrido", icono: Icons.dormirIcon },
  ],
  2: [
    { valor: 1, titulo: "Limpio", icono: Icons.limpioIcon },
    { valor: 0.5, titulo: "Sucio", icono: Icons.limpioIcon },
  ],
  3: [
    { valor: 1, titulo: "Entendible", icono: Icons.entendibleIcon },
    { valor: 0.5, titulo: "Difícil", icono: Icons.entendibleIcon },
  ],
  4: [
    { valor: 4, titulo: "Muy Caro", icono: Icons.moneyIcon },
    { valor: 3, titulo: "Caro", icono: Icons.moneyIcon },
    { valor: 2, titulo: "Barato", icono: Icons.moneyIcon },
    { valor: 1, titulo: "Gratis", icono: Icons.moneyIcon },
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
