// Type definitions for CuartoOK application

export interface Owner {
  id: number;
  name: string;
  dni: string;
  status: 'Pendiente' | 'Aprobado' | 'Rechazado';
  dniFile: string;
  receiptFile: string;
  phone: string;
}

export interface Room {
  id: number;
  title: string;
  district: string;
  address: string;
  proximity: string;
  price: number;
  genderTarget: 'Mixto' | 'Solo Señoritas' | 'Solo Varones';
  privateBathroom: boolean;
  servicesIncluded: boolean;
  daysLeft: number;
  ownerId: number;
  image: string;
  description: string;
  rules: string;
  features: string[];
}

export interface Complaint {
  id: number;
  reporterEmail: string;
  targetRoomId: number;
  reason: string;
  status: 'Pendiente' | 'Resuelto';
  date: string;
}

export interface CurrentUser {
  isLoggedIn: boolean;
  role: 'guest' | 'student' | 'owner' | 'admin';
  identifier: string;
}

export interface AdminKPIs {
  activeRoomsCount: number;
  pendingOwnersCount: number;
  totalComplaintsCount: number;
  registeredCount: number;
}
