import type { Owner, Room, Complaint } from '../types';
export const INITIAL_BLACKLIST = ["40392817"];

export const INITIAL_OWNERS: Owner[] = [
  {
    id: 101,
    name: "Alejandro Villanueva",
    dni: "09837462",
    status: "Aprobado",
    dniFile: "dni_alejandro_v.png",
    receiptFile: "recibo_enel_santa_anita.pdf",
    phone: "987654321"
  },
  {
    id: 102,
    name: "Martha Espinoza",
    dni: "45281930",
    status: "Pendiente",
    dniFile: "dni_martha_e.png",
    receiptFile: "recibo_sedapal_los_olivos.pdf",
    phone: "912345678"
  }
];

export const INITIAL_ROOMS: Room[] = [
  {
    id: 1,
    title: "Minidepartamento con Baño Propio frente a la USMP",
    district: "Santa Anita",
    address: "Calle Los Ruiseñores 420",
    proximity: "A 2 min de la Facultad de Ingeniería USMP",
    price: 550,
    genderTarget: "Mixto",
    privateBathroom: true,
    servicesIncluded: true,
    daysLeft: 11,
    ownerId: 101,
    image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80",
    description: "Excelente minidepartamento ideal para estudiantes universitarios. Entrada independiente, agua caliente 24 horas y excelente ventilación natural.",
    rules: "No se permiten mascotas. Horario de visitas máximo hasta las 10 PM. No ruidos molestos.",
    features: ["Wifi de Alta Velocidad", "Entrada Independiente", "Amoblado Básico"]
  },
  {
    id: 2,
    title: "Cuarto amoblado economico - Solo Estudiantes",
    district: "Los Olivos",
    address: "Av. Las Palmeras 1250",
    proximity: "A 5 min de avenidas principales y universidades",
    price: 380,
    genderTarget: "Solo Varones",
    privateBathroom: false,
    servicesIncluded: true,
    daysLeft: 0,
    ownerId: 102,
    image: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=600&q=80",
    description: "Habitación económica y muy cómoda en segundo piso. Baño compartido con otro estudiante varón. Costo incluye internet y luz.",
    rules: "Prohibido fiestas o reuniones sociales. Mantener áreas comunes limpias después de usarlas.",
    features: ["Servicios Incluidos", "Wifi", "Área de Lavandería"]
  },
  {
    id: 3,
    title: "Habitación Premium cerca de Tecsup y USMP",
    district: "Santa Anita",
    address: "Jr. Los Álamos 254",
    proximity: "A 3 min de Tecsup",
    price: 650,
    genderTarget: "Solo Señoritas",
    privateBathroom: true,
    servicesIncluded: true,
    daysLeft: 14,
    ownerId: 101,
    image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=600&q=80",
    description: "Habitación de estreno muy segura exclusiva para señoritas estudiantes. Muy bien iluminada, closet empotrado de melamine, cortinas incluidas.",
    rules: "Solo visitas familiares permitidas los fines de semana. Ambiente 100% de estudio.",
    features: ["Baño Privado", "Servicios Incluidos", "Seguridad 24/7"]
  },
  {
    id: 4,
    title: "Espacio moderno e independiente en San Miguel",
    district: "San Miguel",
    address: "Av. Universitaria 840",
    proximity: "A 5 min de la PUCP",
    price: 850,
    genderTarget: "Mixto",
    privateBathroom: true,
    servicesIncluded: false,
    daysLeft: 8,
    ownerId: 102,
    image: "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=600&q=80",
    description: "Habitación amplia con kitchenette incluido. Edificio moderno con ascensor y cámaras de seguridad.",
    rules: "Convivencia pacífica. Se permite una mascota pequeña bajo responsabilidad.",
    features: ["Kitchenette", "Cámaras de Seguridad", "Wifi de 150 Mbps"]
  }
];

export const INITIAL_COMPLAINTS: Complaint[] = [
  {
    id: 501,
    reporterEmail: "alumno.usmp@usmp.pe",
    targetRoomId: 2,
    reason: "El anunciante exige depósito de garantía por adelantado sin mostrar el inmueble de manera presencial.",
    status: "Pendiente",
    date: "2026-06-16"
  }
];
