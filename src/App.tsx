import React, { useState, useMemo } from 'react';
import { 
  Shield, 
  CheckCircle2, 
  User, 
  Building,
  GraduationCap,
  Search,
  MapPin,
  SlidersHorizontal,
  Smartphone,
  X,
  AlertTriangle,
  Clock,
  Plus,
  RefreshCw,
  Upload,
  Trash2,
  LogOut,
  Lock,
  FileText,
  Check,
  Info
} from 'lucide-react';

// Type definitions
export interface Owner {
  id: number;
  name: string;
  dni: string;
  status: 'Pendiente' | 'Aprobado' | 'Rechazado';
  dniFile: string; // empty string means not uploaded yet
  receiptFile: string; // empty string means not uploaded yet
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
  daysLeft: number; // t (0 <= t <= 14)
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
  identifier: string; // Email or DNI
}

// Initial Mock Data
const INITIAL_BLACKLIST = ["40392817"];

const INITIAL_OWNERS: Owner[] = [
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

const INITIAL_ROOMS: Room[] = [
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
    daysLeft: 0, // Expired to trigger Rule B
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

const INITIAL_COMPLAINTS: Complaint[] = [
  {
    id: 501,
    reporterEmail: "alumno.usmp@usmp.pe",
    targetRoomId: 2,
    reason: "El anunciante exige depósito de garantía por adelantado sin mostrar el inmueble de manera presencial.",
    status: "Pendiente",
    date: "2026-06-16"
  }
];

const App = () => {
  // Global React States
  const [currentUser, setCurrentUser] = useState<CurrentUser>({
    isLoggedIn: false,
    role: 'guest',
    identifier: ''
  });
  const [blacklist, setBlacklist] = useState<string[]>(INITIAL_BLACKLIST);
  const [owners, setOwners] = useState<Owner[]>(INITIAL_OWNERS);
  const [rooms, setRooms] = useState<Room[]>(INITIAL_ROOMS);
  const [complaints, setComplaints] = useState<Complaint[]>(INITIAL_COMPLAINTS);

  // Simulator profile
  const [activeProfile, setActiveProfile] = useState<'student' | 'owner' | 'admin'>('student');

  // Custom Toast State
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4500);
  };

  // Sub-states: Student Profile View
  const [loginInput, setLoginInput] = useState('');
  const [loginError, setLoginError] = useState('');
  
  // Student filters
  const [searchDistrict, setSearchDistrict] = useState('Todos');
  const [filterPrice, setFilterPrice] = useState(1500);
  const [filterPrivateBathroom, setFilterPrivateBathroom] = useState(false);
  const [filterSoloSenoritas, setFilterSoloSenoritas] = useState(false);
  const [filterServicesIncluded, setFilterServicesIncluded] = useState(false);

  // Room modal details
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  
  // Complaint modal trigger inside Room Details
  const [showReportForm, setShowReportForm] = useState(false);
  const [reportReason, setReportReason] = useState('');

  // Sub-states: Owner Profile View
  const [selectedOwnerId, setSelectedOwnerId] = useState<number>(102); // Defaults to Martha (Pendiente) to showcase warning
  
  // New room inputs
  const [newRoomTitle, setNewRoomTitle] = useState('');
  const [newRoomDistrict, setNewRoomDistrict] = useState('Santa Anita');
  const [newRoomAddress, setNewRoomAddress] = useState('');
  const [newRoomProximity, setNewRoomProximity] = useState('');
  const [newRoomPrice, setNewRoomPrice] = useState('');
  const [newRoomGender, setNewRoomGender] = useState<'Mixto' | 'Solo Señoritas' | 'Solo Varones'>('Mixto');
  const [newRoomBathroom, setNewRoomBathroom] = useState(false);
  const [newRoomServices, setNewRoomServices] = useState(true);
  const [newRoomDesc, setNewRoomDesc] = useState('');
  const [newRoomFeatures, setNewRoomFeatures] = useState({
    wifi: true,
    amoblado: false,
    entradaIndep: false,
    cocinaComp: false
  });

  // Sub-states: Admin Profile View
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminLogged, setAdminLogged] = useState(false);
  const [inspectingOwner, setInspectingOwner] = useState<Owner | null>(null);

  // Computed states
  const currentOwnerData = useMemo(() => {
    return owners.find(o => o.id === selectedOwnerId) || owners[0];
  }, [owners, selectedOwnerId]);

  // Tenant Catalog Filtered Rooms: Excludes rooms where daysLeft === 0 (Rule B)
  const filteredRoomsForStudent = useMemo(() => {
    return rooms.filter(room => {
      // Rule B: Exclude t = 0
      if (room.daysLeft <= 0) return false;

      // District filter
      if (searchDistrict !== 'Todos' && room.district !== searchDistrict) return false;

      // Price filter
      if (room.price > filterPrice) return false;

      // Boolean filters
      if (filterPrivateBathroom && !room.privateBathroom) return false;
      if (filterSoloSenoritas && room.genderTarget !== 'Solo Señoritas') return false;
      if (filterServicesIncluded && !room.servicesIncluded) return false;

      return true;
    });
  }, [rooms, searchDistrict, filterPrice, filterPrivateBathroom, filterSoloSenoritas, filterServicesIncluded]);

  // Admin KPIs computations
  const adminKPIs = useMemo(() => {
    const activeRoomsCount = rooms.filter(r => r.daysLeft > 0).length;
    // Owners pending validation who have uploaded files
    const pendingOwnersCount = owners.filter(o => o.status === 'Pendiente' && (o.dniFile || o.receiptFile)).length;
    const totalComplaintsCount = complaints.length;
    // Simulated total registered users
    const registeredCount = 840 + owners.length; 
    
    return {
      activeRoomsCount,
      pendingOwnersCount,
      totalComplaintsCount,
      registeredCount
    };
  }, [rooms, owners, complaints]);

  // Expiration console data sorted by daysLeft ascending
  const sortedRoomsForAdmin = useMemo(() => {
    return [...rooms].sort((a, b) => a.daysLeft - b.daysLeft);
  }, [rooms]);

  // Hanlders
  const handleStudentLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const input = loginInput.trim();
    if (!input) return;

    // Check DNI Blacklist
    if (blacklist.includes(input)) {
      setLoginError('ACCESO DENEGADO: El DNI provisto se encuentra en la Lista Negra por reportes de fraude.');
      showToast('Intento de acceso bloqueado: DNI en lista negra.', 'error');
      return;
    }

    // Regla Anti-Fraude validation: institutional email or 8-digit DNI
    const isInstitutionalEmail = /^[a-zA-Z0-9._%+-]+@(tecsup\.edu\.pe|usmp\.pe)$/.test(input);
    const isValidDni = /^\d{8}$/.test(input);

    if (isInstitutionalEmail || isValidDni) {
      setLoginError('');
      setCurrentUser({
        isLoggedIn: true,
        role: 'student',
        identifier: input
      });
      showToast(`¡Sesión iniciada con éxito! Bienvenido(a) ${input}`, 'success');
    } else {
      setLoginError('Error: Debe ingresar un correo institucional válido (@tecsup.edu.pe o @usmp.pe) o un DNI de 8 dígitos.');
    }
  };

  const handleStudentLogout = () => {
    setCurrentUser({ isLoggedIn: false, role: 'guest', identifier: '' });
    showToast('Sesión de estudiante cerrada.', 'info');
  };

  const submitComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportReason.trim() || !selectedRoom) return;

    const newComplaint: Complaint = {
      id: Date.now(),
      reporterEmail: currentUser.identifier || 'anonimo@tecsup.edu.pe',
      targetRoomId: selectedRoom.id,
      reason: reportReason.trim(),
      status: 'Pendiente',
      date: new Date().toISOString().split('T')[0]
    };

    setComplaints([newComplaint, ...complaints]);
    setShowReportForm(false);
    setReportReason('');
    setSelectedRoom(null);
    showToast('Alerta de fraude enviada correctamente a moderación. Gracias por su reporte.', 'success');
  };

  // Owner Actions
  const handleOwnerFileUpload = (fileType: 'dni' | 'receipt') => {
    setOwners(prevOwners => prevOwners.map(owner => {
      if (owner.id === selectedOwnerId) {
        return {
          ...owner,
          dniFile: fileType === 'dni' ? `dni_${owner.name.toLowerCase().replace(' ', '_')}.png` : owner.dniFile,
          receiptFile: fileType === 'receipt' ? `recibo_${owner.name.toLowerCase().replace(' ', '_')}.pdf` : owner.receiptFile
        };
      }
      return owner;
    }));
    showToast(`Documento (${fileType.toUpperCase()}) subido correctamente.`, 'success');
  };

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomTitle || !newRoomAddress || !newRoomPrice || !newRoomProximity) {
      showToast('Faltan campos obligatorios para registrar la habitación.', 'error');
      return;
    }

    const feats: string[] = [];
    if (newRoomFeatures.wifi) feats.push('Wifi de Alta Velocidad');
    if (newRoomFeatures.amoblado) feats.push('Habitación Amoblada');
    if (newRoomFeatures.entradaIndep) feats.push('Entrada Independiente');
    if (newRoomFeatures.cocinaComp) feats.push('Cocina Compartida');

    const createdRoom: Room = {
      id: Date.now(),
      title: newRoomTitle,
      district: newRoomDistrict,
      address: newRoomAddress,
      proximity: newRoomProximity,
      price: parseFloat(newRoomPrice),
      genderTarget: newRoomGender,
      privateBathroom: newRoomBathroom,
      servicesIncluded: newRoomServices,
      daysLeft: 14, // Rule B starts with t = 14
      ownerId: selectedOwnerId,
      image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80",
      description: newRoomDesc || "Habitación ideal para estudiantes universitarios, ubicada en zona segura y bien conectada.",
      rules: "Mantener orden, puntualidad en los pagos, respeto mutuo con otros inquilinos.",
      features: feats
    };

    setRooms([createdRoom, ...rooms]);
    showToast('¡Habitación publicada correctamente! Vigencia inicial: 14 días.', 'success');

    // Reset Inputs
    setNewRoomTitle('');
    setNewRoomAddress('');
    setNewRoomProximity('');
    setNewRoomPrice('');
    setNewRoomDesc('');
  };

  const renewRoomDays = (roomId: number) => {
    setRooms(prev => prev.map(r => {
      if (r.id === roomId) {
        return { ...r, daysLeft: 14 };
      }
      return r;
    }));
    showToast('Anuncio renovado exitosamente por 14 días.', 'success');
  };

  // Admin Actions
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminUsername === 'admin' && adminPassword === 'admin123') {
      setAdminLogged(true);
      showToast('Consola de Administrador iniciada correctamente.', 'success');
    } else {
      showToast('Credenciales incorrectas de administrador.', 'error');
    }
  };

  const handleAdminLogout = () => {
    setAdminLogged(false);
    setAdminUsername('');
    setAdminPassword('');
    showToast('Consola de Administrador cerrada.', 'info');
  };

  const approveOwner = (ownerId: number) => {
    setOwners(prev => prev.map(o => o.id === ownerId ? { ...o, status: 'Aprobado' } : o));
    setInspectingOwner(null);
    showToast('Propietario aprobado. Sus anuncios ahora tienen la insignia de confianza.', 'success');
  };

  const rejectOwner = (ownerId: number) => {
    setOwners(prev => prev.map(o => o.id === ownerId ? { ...o, status: 'Rechazado' } : o));
    setInspectingOwner(null);
    showToast('Documentación rechazada. Se ha notificado al propietario.', 'error');
  };

  const triggerBanning = (ownerId: number, dni: string) => {
    // 1. Purge owner from owners list
    setOwners(prev => prev.filter(o => o.id !== ownerId));

    // 2. Purge all rooms owned by this owner
    setRooms(prev => prev.filter(r => r.ownerId !== ownerId));

    // 3. Add DNI to blacklist
    if (!blacklist.includes(dni)) {
      setBlacklist(prev => [...prev, dni]);
    }

    // 4. If current student is logged in with this DNI, log them out
    if (currentUser.identifier === dni) {
      setCurrentUser({ isLoggedIn: false, role: 'guest', identifier: '' });
    }

    // 5. Clean pending complaints related to this owner's rooms
    const activeRoomsIds = rooms.filter(r => r.ownerId === ownerId).map(r => r.id);
    setComplaints(prev => prev.filter(c => !activeRoomsIds.includes(c.targetRoomId)));

    showToast(`Baneo aplicado. Propietario purgado, anuncios borrados y DNI ${dni} bloqueado permanentemente.`, 'error');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1E293B] font-sans flex flex-col antialiased">
      
      {/* 1. TOAST NOTIFICATION CONTAINER */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce">
          <div className={`flex items-center space-x-3 px-5 py-4 rounded-xl shadow-2xl border transition-all duration-300 max-w-md ${
            toast.type === 'success' 
              ? 'bg-[#10B981]/10 border-[#10B981] text-[#10B981] bg-white' 
              : toast.type === 'error'
              ? 'bg-[#EF4444]/10 border-[#EF4444] text-[#EF4444] bg-white'
              : 'bg-slate-100 border-slate-300 text-slate-700 bg-white'
          }`}>
            <div className={`p-1.5 rounded-full ${
              toast.type === 'success' ? 'bg-[#10B981]/20' : toast.type === 'error' ? 'bg-[#EF4444]/20' : 'bg-slate-200'
            }`}>
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold tracking-wide leading-snug">{toast.message}</span>
          </div>
        </div>
      )}

      {/* 2. PERSISTENT GLOBAL SIMULATOR HEADER */}
      <header className="sticky top-0 z-40 bg-[#1E293B] text-white px-4 sm:px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4 border-b border-slate-700 shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="bg-[#10B981] p-2 rounded-xl text-white shadow-md shadow-[#10B981]/30">
            <Shield className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <span className="font-black text-lg tracking-wider block text-white flex items-center">
              Fijo.pe <span className="text-xs ml-2 px-2 py-0.5 rounded-full bg-emerald-500/20 text-[#10B981] border border-emerald-500/30">Prototipo Seguro</span>
            </span>
            <span className="text-[10px] text-slate-400 block -mt-1 font-mono">LIMA METROPOLITANA • MULTI-ROL INTERACTIVO</span>
          </div>
        </div>

        {/* PROFILE SWITCHER CONTROLS */}
        <div className="flex items-center space-x-2 bg-slate-900/60 p-1.5 rounded-xl border border-slate-700">
          <span className="text-[10px] uppercase font-bold text-slate-400 px-2 hidden lg:inline-block">Modo Simulador:</span>
          <button 
            onClick={() => setActiveProfile('student')}
            className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all duration-200 ${
              activeProfile === 'student' 
                ? 'bg-[#10B981] text-white shadow shadow-emerald-700/50' 
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Inquilino (Estudiante)</span>
          </button>
          <button 
            onClick={() => setActiveProfile('owner')}
            className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all duration-200 ${
              activeProfile === 'owner' 
                ? 'bg-indigo-600 text-white shadow shadow-indigo-700/50' 
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Building className="w-4 h-4" />
            <span>Propietario (Dueño)</span>
          </button>
          <button 
            onClick={() => setActiveProfile('admin')}
            className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all duration-200 ${
              activeProfile === 'admin' 
                ? 'bg-rose-600 text-white shadow shadow-rose-700/50' 
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Administrador (Backoffice)</span>
          </button>
        </div>
      </header>

      {/* 3. MAIN INTERACTIVE VIEWS */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">

        {/* ========================================================================= */}
        {/* VIEW 1: INQUILINO (STUDENT) */}
        {/* ========================================================================= */}
        {activeProfile === 'student' && (
          <div className="space-y-6">
            {!currentUser.isLoggedIn ? (
              /* RESTRICTIVE STUDENT REGISTRATION (LOGIN) */
              <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-xl border border-slate-200 p-8 space-y-6 mt-6">
                <div className="text-center space-y-3">
                  <div className="w-16 h-16 bg-emerald-50 text-[#10B981] rounded-2xl flex items-center justify-center mx-auto border border-emerald-100 shadow-sm">
                    <Shield className="w-8 h-8" />
                  </div>
                  <h2 className="text-2xl font-black text-[#1E293B]">Buscador de Habitaciones Seguro</h2>
                  <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                    Para acceder al contacto directo de WhatsApp de los propietarios verificados, debes ingresar con tu correo universitario o verificar tu número de DNI peruano.
                  </p>
                </div>

                <form onSubmit={handleStudentLogin} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-extrabold uppercase text-slate-500 mb-1 tracking-wider">
                      Correo Institucional o DNI de Estudiante
                    </label>
                    <input 
                      type="text" 
                      required
                      value={loginInput}
                      onChange={(e) => setLoginInput(e.target.value)}
                      placeholder="Ej: estudiante@tecsup.edu.pe / @usmp.pe o DNI de 8 dígitos"
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981] outline-none transition-all"
                    />
                    <span className="text-[10px] text-slate-400 block mt-1 leading-snug">
                      Dominios de prueba autorizados: <strong className="text-slate-600">@tecsup.edu.pe, @usmp.pe</strong>. O cualquier número DNI de 8 dígitos (ej. "12345678").
                    </span>
                  </div>

                  {loginError && (
                    <div className="p-3.5 bg-[#EF4444]/10 rounded-xl text-xs text-[#EF4444] border border-[#EF4444]/20 font-bold leading-relaxed flex items-start space-x-2">
                      <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>{loginError}</span>
                    </div>
                  )}

                  <button 
                    type="submit" 
                    className="w-full py-3 bg-[#10B981] hover:bg-emerald-600 active:scale-95 text-white font-extrabold rounded-xl text-xs tracking-wider uppercase transition-all duration-200 shadow shadow-emerald-500/20"
                  >
                    Verificar y Buscar Habitaciones
                  </button>
                </form>

                <div className="bg-[#10B981]/5 p-4 rounded-xl border border-emerald-500/10 flex items-start space-x-3">
                  <Info className="w-5 h-5 text-[#10B981] mt-0.5 flex-shrink-0" />
                  <div className="text-xs text-slate-600 leading-relaxed font-medium">
                    <strong>¿Cómo funciona la verificación institucional?</strong> 
                    <p className="mt-0.5 text-[11px] text-slate-500">
                      Evitamos publicaciones falsas y propietarios abusivos. Todos los propietarios pasan por auditoría física de DNI y recibos de luz en el Backoffice.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              /* STUDENT DASHBOARD & DIRECTORY BROWSER */
              <div className="space-y-6">
                
                {/* Header Welcome Bar */}
                <div className="flex flex-wrap justify-between items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase font-bold text-white bg-[#10B981] px-2.5 py-1 rounded-full shadow-sm">
                      Estudiante Verificado
                    </span>
                    <h2 className="text-lg font-black text-[#1E293B]">
                      Hola, <span className="text-indigo-600">{currentUser.identifier}</span>
                    </h2>
                  </div>
                  <button 
                    onClick={handleStudentLogout}
                    className="text-xs text-slate-500 hover:text-[#EF4444] hover:bg-rose-50 border border-slate-300 hover:border-[#EF4444]/30 px-4 py-2 rounded-xl transition-all duration-200 font-bold flex items-center space-x-1.5"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Cerrar Sesión</span>
                  </button>
                </div>

                {/* ADVANCED MULTI-FILTER SEARCH PANEL */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
                  <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
                    <SlidersHorizontal className="w-4 h-4 text-slate-700" />
                    <h3 className="font-extrabold text-xs text-[#1E293B] uppercase tracking-wider">Filtros Avanzados de Búsqueda</h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {/* Filter Distrito */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">Distrito de Lima</label>
                      <select 
                        value={searchDistrict}
                        onChange={(e) => setSearchDistrict(e.target.value)}
                        className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-xs font-semibold outline-none focus:ring-2 focus:ring-[#10B981] transition-all bg-white"
                      >
                        <option value="Todos">Todos los Distritos</option>
                        <option value="Santa Anita">Santa Anita</option>
                        <option value="San Miguel">San Miguel</option>
                        <option value="Los Olivos">Los Olivos</option>
                        <option value="Santiago de Surco">Santiago de Surco</option>
                        <option value="La Molina">La Molina</option>
                      </select>
                    </div>

                    {/* Filter Max Price */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">Presupuesto Máximo</label>
                        <span className="text-xs font-extrabold text-[#10B981]">S/ {filterPrice}</span>
                      </div>
                      <input 
                        type="range" 
                        min="300" 
                        max="1500" 
                        step="50"
                        value={filterPrice}
                        onChange={(e) => setFilterPrice(parseInt(e.target.value))}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#10B981]"
                      />
                    </div>

                    {/* Boolean Toggles */}
                    <div className="col-span-1 sm:col-span-2 flex flex-wrap gap-2.5 items-end">
                      <button 
                        onClick={() => setFilterPrivateBathroom(!filterPrivateBathroom)}
                        className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all duration-200 border ${
                          filterPrivateBathroom 
                            ? 'bg-[#10B981]/15 border-[#10B981] text-emerald-800' 
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        🚿 Baño Privado
                      </button>
                      <button 
                        onClick={() => setFilterSoloSenoritas(!filterSoloSenoritas)}
                        className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all duration-200 border ${
                          filterSoloSenoritas 
                            ? 'bg-[#10B981]/15 border-[#10B981] text-emerald-800' 
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        🚺 Solo Señoritas
                      </button>
                      <button 
                        onClick={() => setFilterServicesIncluded(!filterServicesIncluded)}
                        className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all duration-200 border ${
                          filterServicesIncluded 
                            ? 'bg-[#10B981]/15 border-[#10B981] text-emerald-800' 
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        💡 Servicios Incluidos
                      </button>
                    </div>
                  </div>
                </div>

                {/* ROOM CARDS CATALOGUE GRID */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-extrabold text-lg text-[#1E293B]">Habitaciones Seguras Disponibles ({filteredRoomsForStudent.length})</h3>
                    <span className="text-xs text-slate-400 font-medium">Búsqueda restringida a Lima</span>
                  </div>

                  {filteredRoomsForStudent.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 space-y-4">
                      <Search className="w-12 h-12 text-slate-300 mx-auto" />
                      <p className="text-slate-500 font-bold text-sm">No se encontraron habitaciones disponibles con esos filtros.</p>
                      <p className="text-xs text-slate-400 max-w-sm mx-auto">Prueba ampliando tu presupuesto máximo o seleccionando "Todos los Distritos".</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredRoomsForStudent.map(room => {
                        const ownerObj = owners.find(o => o.id === room.ownerId);
                        const isVerifiedOwner = ownerObj?.status === 'Aprobado';

                        return (
                          <div 
                            key={room.id}
                            onClick={() => setSelectedRoom(room)}
                            className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-200 cursor-pointer flex flex-col justify-between"
                          >
                            <div className="relative">
                              <img 
                                src={room.image} 
                                alt={room.title}
                                className="w-full h-48 object-cover" 
                              />
                              {/* Confidence shield icon verification badge */}
                              {isVerifiedOwner ? (
                                <div className="absolute top-3 left-3 bg-[#10B981] text-white px-2.5 py-1 rounded-lg text-[10px] font-black tracking-wide flex items-center space-x-1 shadow-lg shadow-emerald-950/20">
                                  <Shield className="w-3.5 h-3.5 fill-white text-[#10B981]" />
                                  <span>🛡️ PROPIETARIO FIJO</span>
                                </div>
                              ) : (
                                <div className="absolute top-3 left-3 bg-amber-500 text-white px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wide shadow-lg shadow-amber-950/20">
                                  <span>EN REVISIÓN</span>
                                </div>
                              )}
                              
                              <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-xs text-white px-2 py-0.5 rounded text-[10px] font-semibold flex items-center space-x-1">
                                <Clock className="w-3 h-3 text-[#10B981]" />
                                <span>Caduca en {room.daysLeft}d</span>
                              </div>
                            </div>

                            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                              <div className="space-y-2">
                                <div className="flex justify-between items-baseline">
                                  <span className="text-[10px] font-extrabold text-indigo-600 uppercase tracking-widest">{room.district}</span>
                                  <span className="text-xl font-black text-[#1E293B]">
                                    S/ {room.price} <span className="text-[10px] text-slate-400 font-medium">/ mes</span>
                                  </span>
                                </div>
                                <h4 className="font-extrabold text-sm text-[#1E293B] line-clamp-1 leading-snug">{room.title}</h4>
                                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{room.description}</p>
                              </div>

                              <div className="pt-3 border-t border-slate-100 flex flex-wrap gap-1.5">
                                <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-2.5 py-0.5 rounded-md">{room.genderTarget}</span>
                                <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-2.5 py-0.5 rounded-md">
                                  {room.privateBathroom ? '🚿 Baño Propio' : '🚽 Baño Comp.'}
                                </span>
                                <span className="text-[10px] bg-indigo-50 text-indigo-700 font-bold px-2.5 py-0.5 rounded-md flex items-center">
                                  📍 {room.proximity}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* DETAILED OVERLAY MODAL */}
                {selectedRoom && (
                  <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
                      
                      {/* Banner Image */}
                      <div className="relative">
                        <img 
                          src={selectedRoom.image} 
                          alt={selectedRoom.title}
                          className="w-full h-64 object-cover" 
                        />
                        <button 
                          onClick={() => { setSelectedRoom(null); setShowReportForm(false); }}
                          className="absolute top-4 right-4 bg-slate-900/80 text-white hover:bg-slate-900 p-2.5 rounded-full transition-all duration-200 shadow"
                        >
                          <X className="w-5 h-5" />
                        </button>

                        {/* Verified Banner */}
                        {(owners.find(o => o.id === selectedRoom.ownerId)?.status === 'Aprobado') ? (
                          <div className="absolute bottom-4 left-4 bg-[#10B981] text-white px-3.5 py-2 rounded-xl text-xs font-black tracking-wide flex items-center space-x-1.5 shadow-lg shadow-emerald-950/20">
                            <Shield className="w-4 h-4 fill-white text-[#10B981]" />
                            <span>VERIFICACIÓN FIJO.PE ACTIVADA</span>
                          </div>
                        ) : (
                          <div className="absolute bottom-4 left-4 bg-amber-500 text-white px-3 py-1.5 rounded-xl text-xs font-bold tracking-wide shadow-lg shadow-amber-950/20">
                            <span>REGISTRO EN EVALUACIÓN ADMINISTRATIVA</span>
                          </div>
                        )}
                      </div>

                      {/* Modal Content Details */}
                      <div className="p-6 sm:p-8 space-y-6">
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <span className="text-xs font-black text-indigo-600 uppercase tracking-widest">{selectedRoom.district}</span>
                            <h3 className="text-xl font-black text-[#1E293B] mt-1">{selectedRoom.title}</h3>
                            <p className="text-xs text-slate-500 mt-1.5 flex items-center font-medium">
                              <MapPin className="w-4 h-4 mr-1 text-slate-400" />
                              {selectedRoom.address} • <strong className="text-indigo-600 ml-1">{selectedRoom.proximity}</strong>
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="text-2xl font-black text-[#1E293B] block">S/ {selectedRoom.price}</span>
                            <span className="text-[10px] text-slate-400 font-bold bg-slate-100 px-2 py-0.5 rounded block mt-1">
                              Servicios: {selectedRoom.servicesIncluded ? 'INCLUIDOS 💡' : 'NO INCLUIDOS'}
                            </span>
                          </div>
                        </div>

                        {/* Specs Panel */}
                        <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                          <div>
                            <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wide">Público Preferido</span>
                            <span className="text-xs font-bold text-slate-800">{selectedRoom.genderTarget}</span>
                          </div>
                          <div>
                            <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wide">Propietario</span>
                            <span className="text-xs font-bold text-slate-800">
                              {owners.find(o => o.id === selectedRoom.ownerId)?.name || 'Anunciante'}
                            </span>
                          </div>
                          <div>
                            <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wide">Baño</span>
                            <span className="text-xs font-bold text-slate-800">{selectedRoom.privateBathroom ? 'Baño Privado Propio' : 'Baño Compartido'}</span>
                          </div>
                          <div>
                            <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wide">Vigencia del Anuncio</span>
                            <span className="text-xs font-bold text-[#10B981] flex items-center">
                              <Clock className="w-3.5 h-3.5 mr-1" />
                              {selectedRoom.daysLeft} días restantes
                            </span>
                          </div>
                        </div>

                        {/* Room Descriptions */}
                        <div className="space-y-2">
                          <h4 className="font-extrabold text-xs text-[#1E293B] uppercase tracking-wider">Descripción del Cuarto</h4>
                          <p className="text-xs text-slate-600 leading-relaxed font-medium">{selectedRoom.description}</p>
                        </div>

                        {/* Rules of coexistence */}
                        <div className="space-y-2">
                          <h4 className="font-extrabold text-xs text-[#1E293B] uppercase tracking-wider">Reglamento Interno de Convivencia</h4>
                          <div className="p-3 bg-indigo-50/50 border border-indigo-500/10 rounded-xl text-xs text-indigo-950 italic leading-relaxed">
                            "{selectedRoom.rules}"
                          </div>
                        </div>

                        {/* Key Features List */}
                        <div className="space-y-2.5">
                          <h4 className="font-extrabold text-xs text-[#1E293B] uppercase tracking-wider">Comodidades Destacadas</h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedRoom.features.map((feat, index) => (
                              <span key={index} className="bg-emerald-50 text-[#10B981] border border-emerald-500/10 px-3 py-1 rounded-lg text-xs font-bold">
                                ✓ {feat}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Anti-Fraud Warning */}
                        <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 flex items-start space-x-3">
                          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                          <div className="text-xs text-amber-800 leading-relaxed">
                            <strong>Consejo de Seguridad Anti-Fraude:</strong> No realices transferencias electrónicas previas de adelantos ni depósitos de garantía antes de visitar presencialmente el inmueble y constatar la validez de los contratos.
                          </div>
                        </div>

                        {/* CONVERSION BAR (WHATSAPP LOGIC) */}
                        <div className="pt-4 border-t border-slate-100 space-y-4">
                          
                          {/* Main safe WhatsApp button & Report Trigger */}
                          <div className="flex flex-col sm:flex-row gap-3">
                            <a 
                              href={`https://wa.me/51${owners.find(o => o.id === selectedRoom.ownerId)?.phone || '999999999'}?text=${encodeURIComponent(
                                `Hola, estoy interesado en tu habitación Fijo.pe en ${selectedRoom.district} listada a S/${selectedRoom.price}. Me gustaría agendar una visita presencial.`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 bg-[#10B981] hover:bg-emerald-600 text-white font-extrabold text-center py-3.5 rounded-xl text-xs tracking-wider uppercase transition-all duration-200 shadow-md shadow-emerald-600/20 flex items-center justify-center space-x-2"
                            >
                              <Smartphone className="w-4 h-4" />
                              <span>Contactar por WhatsApp Seguro</span>
                            </a>
                            
                            <button 
                              onClick={() => setShowReportForm(!showReportForm)}
                              className="bg-rose-50 hover:bg-rose-100 text-[#EF4444] border border-rose-200 font-extrabold text-xs px-4 py-3.5 rounded-xl transition-all duration-200 flex items-center justify-center space-x-1.5"
                            >
                              <AlertTriangle className="w-4 h-4" />
                              <span>Reportar Anuncio</span>
                            </button>
                          </div>

                          {/* Dynamic Inline Complaint Form */}
                          {showReportForm && (
                            <form onSubmit={submitComplaint} className="p-4 bg-rose-50 rounded-xl border border-rose-200/50 space-y-3 animate-in slide-in-from-top-3 duration-200">
                              <label className="block text-[10px] font-bold uppercase text-slate-700">
                                Motivo de Denuncia de Fraude:
                              </label>
                              <textarea
                                required
                                value={reportReason}
                                onChange={(e) => setReportReason(e.target.value)}
                                placeholder="Indica detalladamente por qué consideras que este anuncio es sospechoso (ej: exige adelantos de dinero, datos del predio falsos, etc.)"
                                className="w-full p-3 border border-rose-300 rounded-lg text-xs outline-none focus:ring-1 focus:ring-rose-500 bg-white resize-none"
                                rows={3}
                              ></textarea>
                              <div className="flex justify-end space-x-2">
                                <button 
                                  type="button" 
                                  onClick={() => setShowReportForm(false)} 
                                  className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-700 font-semibold"
                                >
                                  Cancelar
                                </button>
                                <button 
                                  type="submit" 
                                  className="px-4 py-1.5 bg-[#EF4444] hover:bg-rose-700 text-white font-extrabold text-xs rounded-lg uppercase tracking-wider transition-colors shadow"
                                >
                                  Enviar Denuncia
                                </button>
                              </div>
                            </form>
                          )}

                        </div>

                      </div>
                    </div>
                  </div>
                )}

              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 2: PROPIETARIO (OWNER) */}
        {/* ========================================================================= */}
        {activeProfile === 'owner' && (
          <div className="space-y-6">
            
            {/* Account Simulator Selector Box for Evaluator */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap justify-between items-center gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase text-indigo-600 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full">
                  Prueba de Cuenta en Vivo
                </span>
                <p className="text-xs text-slate-500">Permite simular el cambio entre un dueño Aprobado y un dueño Pendiente de verificación.</p>
              </div>

              <div className="flex items-center space-x-3">
                <label className="text-xs font-bold text-slate-700">Simular como:</label>
                <select 
                  value={selectedOwnerId}
                  onChange={(e) => setSelectedOwnerId(parseInt(e.target.value))}
                  className="px-3 py-2 border border-slate-300 rounded-xl text-xs font-semibold outline-none focus:ring-2 focus:ring-indigo-600 bg-white cursor-pointer text-[#1E293B]"
                >
                  <option value={101}>Alejandro Villanueva (Aprobado)</option>
                  <option value={102}>Martha Espinoza (Pendiente)</option>
                </select>
              </div>
            </div>

            {/* MONITOR DE ESTADO DE CUENTA BANNER */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-xl border ${
                    currentOwnerData.status === 'Aprobado' 
                      ? 'bg-emerald-50 border-[#10B981]/20 text-[#10B981]' 
                      : 'bg-amber-50 border-amber-500/20 text-amber-600'
                  }`}>
                    <Shield className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-extrabold text-base text-[#1E293B]">
                      Arrendador: <span className="text-indigo-600">{currentOwnerData.name}</span>
                    </h3>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-bold text-slate-500 font-mono">DNI: {currentOwnerData.dni}</span>
                      <span className="text-slate-300">•</span>
                      {currentOwnerData.status === 'Aprobado' ? (
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-100 border border-emerald-300 px-3 py-0.5 rounded-full flex items-center">
                          <Check className="w-3.5 h-3.5 mr-1" />
                          Cuenta Verificada (Check Verde Activo)
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-amber-700 bg-amber-100 border border-amber-300 px-3 py-0.5 rounded-full">
                          Advertencia: Cuenta Pendiente de Validación
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Simulated Verification shortcuts */}
                {currentOwnerData.status === 'Pendiente' ? (
                  <button 
                    onClick={() => {
                      setOwners(prev => prev.map(o => o.id === selectedOwnerId ? { ...o, status: 'Aprobado' } : o));
                      showToast(`Identidad de ${currentOwnerData.name} validada con éxito.`, 'success');
                    }}
                    className="bg-[#10B981] hover:bg-emerald-600 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl transition-all duration-200 shadow shadow-emerald-500/20 active:scale-95"
                  >
                    Auto-Aprobar Identidad
                  </button>
                ) : (
                  <button 
                    onClick={() => {
                      setOwners(prev => prev.map(o => o.id === selectedOwnerId ? { ...o, status: 'Pendiente', dniFile: '', receiptFile: '' } : o));
                      showToast(`Estado de ${currentOwnerData.name} reiniciado a Pendiente.`, 'info');
                    }}
                    className="text-xs text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-slate-300 px-3 py-2 rounded-xl transition-all duration-200 font-semibold"
                  >
                    Reiniciar Estado Cuenta
                  </button>
                )}
              </div>
            </div>

            {/* ZONA DE VALIDACION DOCUMENTARIA (Faux Drag & Drop widget) */}
            {currentOwnerData.status === 'Pendiente' && (
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 animate-in fade-in duration-300">
                <div className="space-y-1">
                  <h4 className="font-extrabold text-sm text-[#1E293B] uppercase tracking-wider">Carga Obligatoria de Documentos de Propiedad</h4>
                  <p className="text-xs text-slate-500">
                    Sube copias legibles de tus documentos. El analista validará que coincidan con tus datos antes de activar la insignia de confianza en tus cuartos.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* DNI File box */}
                  <div 
                    onClick={() => handleOwnerFileUpload('dni')}
                    className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200 hover:-translate-y-0.5 ${
                      currentOwnerData.dniFile 
                        ? 'border-emerald-500 bg-emerald-500/5 text-emerald-800 shadow' 
                        : 'border-slate-300 hover:border-indigo-500 bg-slate-50 text-slate-500'
                    }`}
                  >
                    <Upload className="w-8 h-8 mx-auto text-slate-400 mb-2.5" />
                    <span className="text-xs font-bold block">
                      {currentOwnerData.dniFile ? `✓ DNI Cargado: ${currentOwnerData.dniFile}` : 'Cargar Copia de DNI del Titular'}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-1">Haz clic para simular subida (JPG/PDF)</span>
                  </div>

                  {/* Recibo Luz/Agua box */}
                  <div 
                    onClick={() => handleOwnerFileUpload('receipt')}
                    className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200 hover:-translate-y-0.5 ${
                      currentOwnerData.receiptFile 
                        ? 'border-emerald-500 bg-emerald-500/5 text-emerald-800 shadow' 
                        : 'border-slate-300 hover:border-indigo-500 bg-slate-50 text-slate-500'
                    }`}
                  >
                    <Upload className="w-8 h-8 mx-auto text-slate-400 mb-2.5" />
                    <span className="text-xs font-bold block">
                      {currentOwnerData.receiptFile ? `✓ Recibo Cargado: ${currentOwnerData.receiptFile}` : 'Cargar Recibo de Enel / Sedapal'}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-1">Debe corresponder a la dirección del cuarto</span>
                  </div>
                </div>

                {currentOwnerData.dniFile && currentOwnerData.receiptFile && (
                  <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-xl text-center text-xs font-bold animate-pulse">
                    ✓ Todos los archivos cargados correctamente. Pendientes de validación por el Administrador.
                  </div>
                )}
              </div>
            )}

            {/* FORM AND LIST GRID LAYOUT */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* FORMULARIO DE ALTA RAPIDA */}
              <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
                  <Plus className="w-5 h-5 text-indigo-600" />
                  <h4 className="font-extrabold text-sm text-[#1E293B] uppercase tracking-wider">Publicar Nueva Habitación</h4>
                </div>

                <form onSubmit={handleCreateRoom} className="space-y-4">
                  {/* Title */}
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold uppercase text-slate-500">Título Comercial *</label>
                    <input 
                      type="text" 
                      required
                      value={newRoomTitle}
                      onChange={(e) => setNewRoomTitle(e.target.value)}
                      placeholder="Ej. Cuarto moderno a 2 min de Tecsup"
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-600 outline-none"
                    />
                  </div>

                  {/* Price & District Row */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold uppercase text-slate-500">Distrito *</label>
                      <select 
                        value={newRoomDistrict}
                        onChange={(e) => setNewRoomDistrict(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-indigo-600 outline-none bg-white"
                      >
                        <option value="Santa Anita">Santa Anita</option>
                        <option value="San Miguel">San Miguel</option>
                        <option value="Los Olivos">Los Olivos</option>
                        <option value="Santiago de Surco">Santiago de Surco</option>
                        <option value="La Molina">La Molina</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold uppercase text-slate-500">Precio Mensual (S/) *</label>
                      <input 
                        type="number" 
                        required
                        value={newRoomPrice}
                        onChange={(e) => setNewRoomPrice(e.target.value)}
                        placeholder="Ej. 500"
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-indigo-600 outline-none"
                      />
                    </div>
                  </div>

                  {/* Address */}
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold uppercase text-slate-500">Dirección Física Exacta *</label>
                    <input 
                      type="text" 
                      required
                      value={newRoomAddress}
                      onChange={(e) => setNewRoomAddress(e.target.value)}
                      placeholder="Calle Los tulipanes 410, Urb. Los Ficus"
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-600 outline-none"
                    />
                  </div>

                  {/* Proximity & Coexistence Preference */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold uppercase text-slate-500">Referencia de Proximidad *</label>
                      <input 
                        type="text" 
                        required
                        value={newRoomProximity}
                        onChange={(e) => setNewRoomProximity(e.target.value)}
                        placeholder="Ej: A 3 min de Tecsup"
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-600 outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold uppercase text-slate-500">Perfil de Convivencia</label>
                      <select 
                        value={newRoomGender}
                        onChange={(e) => setNewRoomGender(e.target.value as any)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-indigo-600 outline-none bg-white"
                      >
                        <option value="Mixto">Mixto</option>
                        <option value="Solo Señoritas">Solo Señoritas</option>
                        <option value="Solo Varones">Solo Varones</option>
                      </select>
                    </div>
                  </div>

                  {/* Boolean Checkboxes */}
                  <div className="flex space-x-6 pt-1">
                    <label className="flex items-center space-x-2 text-xs font-bold text-slate-600 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={newRoomBathroom}
                        onChange={(e) => setNewRoomBathroom(e.target.checked)}
                        className="rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                      />
                      <span>¿Baño Propio?</span>
                    </label>

                    <label className="flex items-center space-x-2 text-xs font-bold text-slate-600 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={newRoomServices}
                        onChange={(e) => setNewRoomServices(e.target.checked)}
                        className="rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                      />
                      <span>¿Servicios Incluidos?</span>
                    </label>
                  </div>

                  {/* Description */}
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold uppercase text-slate-500">Descripción Corta</label>
                    <textarea 
                      value={newRoomDesc}
                      onChange={(e) => setNewRoomDesc(e.target.value)}
                      placeholder="Ventajas del inmueble, amoblado detallado, etc."
                      className="w-full p-3 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-600 outline-none resize-none"
                      rows={2}
                    ></textarea>
                  </div>

                  {/* Features checkboxes */}
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold uppercase text-slate-500">Amenidades Disponibles</label>
                    <div className="grid grid-cols-2 gap-2">
                      <label className="flex items-center space-x-2 text-xs font-medium cursor-pointer">
                        <input type="checkbox" checked={newRoomFeatures.wifi} onChange={(e) => setNewRoomFeatures({...newRoomFeatures, wifi: e.target.checked})} className="rounded text-indigo-600 focus:ring-indigo-500 border-slate-300" />
                        <span>Wifi Fibra</span>
                      </label>
                      <label className="flex items-center space-x-2 text-xs font-medium cursor-pointer">
                        <input type="checkbox" checked={newRoomFeatures.amoblado} onChange={(e) => setNewRoomFeatures({...newRoomFeatures, amoblado: e.target.checked})} className="rounded text-indigo-600 focus:ring-indigo-500 border-slate-300" />
                        <span>Amoblado</span>
                      </label>
                      <label className="flex items-center space-x-2 text-xs font-medium cursor-pointer">
                        <input type="checkbox" checked={newRoomFeatures.entradaIndep} onChange={(e) => setNewRoomFeatures({...newRoomFeatures, entradaIndep: e.target.checked})} className="rounded text-indigo-600 focus:ring-indigo-500 border-slate-300" />
                        <span>Entrada Indep.</span>
                      </label>
                      <label className="flex items-center space-x-2 text-xs font-medium cursor-pointer">
                        <input type="checkbox" checked={newRoomFeatures.cocinaComp} onChange={(e) => setNewRoomFeatures({...newRoomFeatures, cocinaComp: e.target.checked})} className="rounded text-indigo-600 focus:ring-indigo-500 border-slate-300" />
                        <span>Cocina Compartida</span>
                      </label>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-extrabold rounded-xl text-xs tracking-wider uppercase transition-all duration-200 shadow-md shadow-indigo-600/20"
                  >
                    Publicar Anuncio (Vigencia 14 Días)
                  </button>
                </form>
              </div>

              {/* LISTADO DE ANUNCIOS EXCLUSIVOS DEL PROPIETARIO */}
              <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <h4 className="font-extrabold text-sm text-[#1E293B] uppercase tracking-wider">Mis Habitaciones Registradas</h4>
                  <span className="text-xs text-slate-400 font-bold">Control de Expiración</span>
                </div>

                <div className="space-y-4">
                  {rooms.filter(room => room.ownerId === selectedOwnerId).length === 0 ? (
                    <div className="text-center py-12 text-slate-400 text-xs">
                      Aún no has registrado habitaciones bajo este perfil. Completa el formulario de la izquierda.
                    </div>
                  ) : (
                    rooms.filter(room => room.ownerId === selectedOwnerId).map(room => {
                      const isExpired = room.daysLeft === 0;

                      return (
                        <div 
                          key={room.id}
                          className={`p-4 rounded-xl border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all duration-200 ${
                            isExpired 
                              ? 'bg-rose-500/5 border-[#EF4444]/20 opacity-80' 
                              : 'bg-slate-50 border-slate-200 hover:shadow-md'
                          }`}
                        >
                          <div className={`flex items-start space-x-3 ${isExpired ? 'opacity-40' : ''}`}>
                            <img src={room.image} alt={room.title} className="w-16 h-16 rounded-xl object-cover border border-slate-200" />
                            <div className="space-y-1">
                              <h5 className="font-bold text-xs text-[#1E293B] line-clamp-1 leading-snug">{room.title}</h5>
                              <p className="text-[10px] text-slate-500 font-semibold">{room.district} • S/ {room.price}</p>
                              
                              {/* Expiration Progress Bar representation */}
                              <div className="w-40 sm:w-56 mt-2 space-y-1">
                                <div className="flex justify-between text-[9px] font-bold text-slate-400">
                                  <span>Vigencia:</span>
                                  {isExpired ? (
                                    <span className="text-[#EF4444] font-black uppercase">EXPIRED / OCULTO</span>
                                  ) : (
                                    <span>{room.daysLeft} días restantes</span>
                                  )}
                                </div>
                                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                                  <div 
                                    className={`h-full rounded-full transition-all duration-300 ${
                                      isExpired 
                                        ? 'bg-[#EF4444]' 
                                        : room.daysLeft > 7 
                                        ? 'bg-[#10B981]' 
                                        : 'bg-amber-500'
                                    }`}
                                    style={{ width: `${(room.daysLeft / 14) * 100}%` }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="w-full sm:w-auto flex flex-col items-end gap-2">
                            {isExpired ? (
                              <button 
                                onClick={() => renewRoomDays(room.id)}
                                className="w-full sm:w-auto bg-[#10B981] hover:bg-emerald-600 text-white font-extrabold text-xs px-3.5 py-2 rounded-xl transition-all duration-200 shadow-md shadow-emerald-600/20 flex items-center justify-center space-x-1"
                              >
                                <RefreshCw className="w-3.5 h-3.5" />
                                <span>Renovar Anuncio (+14 días)</span>
                              </button>
                            ) : (
                              <div className="flex space-x-2 w-full">
                                <button 
                                  onClick={() => renewRoomDays(room.id)}
                                  className="flex-1 sm:flex-none text-[10px] bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-700 font-bold px-3 py-1.5 rounded-lg border border-indigo-500/20 flex items-center justify-center space-x-1"
                                >
                                  <RefreshCw className="w-3 h-3" />
                                  <span>Renovar temprano</span>
                                </button>
                                <button 
                                  disabled
                                  className="flex-1 sm:flex-none text-[10px] bg-slate-100 text-slate-400 font-semibold px-3 py-1.5 rounded-lg cursor-not-allowed opacity-50"
                                  title="El anuncio está activo"
                                >
                                  Editar
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 3: ADMINISTRADOR (BACKOFFICE) */}
        {/* ========================================================================= */}
        {activeProfile === 'admin' && (
          <div className="space-y-6">
            {!adminLogged ? (
              /* ADMIN ACCESS CARD */
              <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl border border-slate-200 p-8 space-y-6 mt-6">
                <div className="text-center space-y-3">
                  <div className="w-16 h-16 bg-rose-50 text-[#EF4444] rounded-2xl flex items-center justify-center mx-auto border border-rose-100 shadow-sm">
                    <Lock className="w-7 h-7" />
                  </div>
                  <h2 className="text-xl font-black text-[#1E293B]">Portal de Auditoría Gubernamental</h2>
                  <p className="text-xs text-slate-500">Acceso restringido a moderadores de AlquilaUniversitario</p>
                </div>

                <form onSubmit={handleAdminLogin} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Nombre de Administrador</label>
                    <input 
                      type="text" 
                      required
                      value={adminUsername}
                      onChange={(e) => setAdminUsername(e.target.value)}
                      placeholder="admin"
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-xs font-semibold outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Clave de Seguridad</label>
                    <input 
                      type="password" 
                      required
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      placeholder="admin123"
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-xs font-semibold outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-extrabold rounded-xl text-xs uppercase tracking-wider transition-colors shadow-md shadow-rose-600/20"
                  >
                    Ingresar al Panel de Moderación
                  </button>
                </form>
              </div>
            ) : (
              /* CORE AUDITING DASHBOARD */
              <div className="space-y-6">
                
                {/* Control bar */}
                <div className="flex justify-between items-center bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="space-y-0.5">
                    <h2 className="text-xl font-black text-[#1E293B]">Panel de Control Centralizado (Métricas KPI)</h2>
                    <p className="text-xs text-slate-400 font-medium">Moderación de propietarios e integridad de seguridad en Lima.</p>
                  </div>
                  <button 
                    onClick={handleAdminLogout}
                    className="flex items-center space-x-1.5 text-xs text-rose-600 hover:text-rose-800 font-bold px-4 py-2 border border-rose-200 hover:border-rose-300 rounded-xl transition-all duration-200 bg-rose-50/50"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Cerrar Panel</span>
                  </button>
                </div>

                {/* KPI METRIC CARDS GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Cuartos Activos (Lima)</span>
                    <div className="flex items-baseline space-x-2 mt-2">
                      <span className="text-3xl font-black text-slate-800">{adminKPIs.activeRoomsCount}</span>
                      <span className="text-xs font-bold text-[#10B981] bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">daysLeft &gt; 0</span>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Propietarios x Validar</span>
                    <div className="flex items-baseline space-x-2 mt-2">
                      <span className="text-3xl font-black text-slate-800">{adminKPIs.pendingOwnersCount}</span>
                      {adminKPIs.pendingOwnersCount > 0 ? (
                        <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">Acción requerida</span>
                      ) : (
                        <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">Al día</span>
                      )}
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Usuarios Registrados</span>
                    <div className="flex items-baseline space-x-2 mt-2">
                      <span className="text-3xl font-black text-slate-800">{adminKPIs.registeredCount}</span>
                      <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">Alumnos + Socios</span>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Denuncias Activas</span>
                    <div className="flex items-baseline space-x-2 mt-2">
                      <span className="text-3xl font-black text-[#EF4444]">{adminKPIs.totalComplaintsCount}</span>
                      <span className="text-xs font-bold text-[#EF4444] bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">Sospecha Fraude</span>
                    </div>
                  </div>
                </div>

                {/* BLACKLIST SHOWCASE BANNER */}
                <div className="bg-slate-900 text-white p-4 rounded-2xl border border-slate-800 shadow-sm flex flex-wrap justify-between items-center gap-3">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-5 h-5 text-[#EF4444]" />
                    <div>
                      <span className="text-xs font-extrabold uppercase tracking-wide block">DNI Lista Negra (Baneos de Fraude)</span>
                      <span className="text-[10px] text-slate-400 font-mono">DNI bloqueados para registro y login.</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {blacklist.map((dni, index) => (
                      <span key={index} className="text-xs font-bold bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/30 px-3 py-1 rounded-lg">
                        🚫 {dni}
                      </span>
                    ))}
                  </div>
                </div>

                {/* DOUBLE COLUMN: AUDIT DOCUMENTAL & CONSOLA CADUCIDAD */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  
                  {/* MODULO DE AUDITORIA DOCUMENTAL */}
                  <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                    <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
                      <Shield className="w-5 h-5 text-[#10B981]" />
                      <h3 className="font-extrabold text-sm text-[#1E293B] uppercase tracking-wider">Auditoría Documental (Pendientes)</h3>
                    </div>

                    <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
                      {owners.filter(o => o.status === 'Pendiente').length === 0 ? (
                        <div className="text-center py-10 text-slate-400 text-xs">
                          No hay solicitudes de verificación de identidad pendientes.
                        </div>
                      ) : (
                        owners.filter(o => o.status === 'Pendiente').map(owner => (
                          <div key={owner.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-bold text-xs text-[#1E293B]">{owner.name}</h4>
                                <p className="text-[10px] text-slate-500 font-mono mt-0.5">DNI: {owner.dni} | Celular: {owner.phone}</p>
                              </div>
                              <span className="text-[9px] bg-amber-100 text-amber-800 font-black px-2 py-0.5 rounded-full uppercase">Pendiente</span>
                            </div>

                            <div className="flex items-center space-x-2 text-[11px] text-slate-600 font-medium">
                              <span className="flex items-center"><FileText className="w-3.5 h-3.5 mr-1 text-slate-400" />{owner.dniFile || '(Falta DNI)'}</span>
                              <span>|</span>
                              <span className="flex items-center"><FileText className="w-3.5 h-3.5 mr-1 text-slate-400" />{owner.receiptFile || '(Falta Recibo)'}</span>
                            </div>

                            <div className="flex space-x-2 pt-2 border-t border-slate-200">
                              {owner.dniFile || owner.receiptFile ? (
                                <button 
                                  onClick={() => setInspectingOwner(owner)}
                                  className="flex-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-extrabold text-xs py-1.5 rounded-lg border border-indigo-200 transition-colors"
                                >
                                  Ver Visor Documentos
                                </button>
                              ) : (
                                <button 
                                  disabled
                                  className="flex-1 bg-slate-100 text-slate-400 font-bold text-xs py-1.5 rounded-lg cursor-not-allowed opacity-50"
                                >
                                  Sin archivos subidos
                                </button>
                              )}
                              <button 
                                onClick={() => approveOwner(owner.id)}
                                className="bg-[#10B981] hover:bg-emerald-600 text-white font-extrabold text-xs px-3 py-1.5 rounded-lg transition-colors"
                              >
                                Aprobar Cuenta
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* CONSOLA DE MONITOREO DE CADUCIDAD */}
                  <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                    <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
                      <Clock className="w-5 h-5 text-indigo-600" />
                      <h3 className="font-extrabold text-sm text-[#1E293B] uppercase tracking-wider">Monitoreo de Expiración General</h3>
                    </div>

                    <div className="overflow-x-auto max-h-[380px] overflow-y-auto pr-1">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-slate-100 text-slate-400 uppercase font-black text-[9px] tracking-wider">
                            <th className="py-2 pr-2">Anuncio</th>
                            <th className="py-2 px-2">Dueño</th>
                            <th className="py-2 px-2 text-center">Vigencia (t)</th>
                            <th className="py-2 pl-2 text-right">Acción</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sortedRoomsForAdmin.map(room => {
                            const isExpired = room.daysLeft === 0;
                            const owner = owners.find(o => o.id === room.ownerId);

                            return (
                              <tr key={room.id} className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${isExpired ? 'bg-rose-50/30' : ''}`}>
                                <td className="py-3 pr-2">
                                  <div className="font-bold text-slate-800 line-clamp-1">{room.title}</div>
                                  <div className="text-[10px] text-slate-400">{room.district} • S/ {room.price}</div>
                                </td>
                                <td className="py-3 px-2 text-slate-500 font-semibold">{room.ownerId === 101 ? 'A. Villanueva' : 'M. Espinoza'}</td>
                                <td className="py-3 px-2 text-center">
                                  {isExpired ? (
                                    <span className="text-[9px] bg-rose-100 text-rose-700 font-black px-2 py-0.5 rounded uppercase">Caducado</span>
                                  ) : (
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                      room.daysLeft > 7 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                                    }`}>
                                      {room.daysLeft} días
                                    </span>
                                  )}
                                </td>
                                <td className="py-3 pl-2 text-right">
                                  {isExpired ? (
                                    <button 
                                      onClick={() => renewRoomDays(room.id)}
                                      className="bg-[#10B981] hover:bg-emerald-600 text-white font-extrabold text-[9px] py-1 px-2.5 rounded-md uppercase tracking-wider transition-colors shadow shadow-emerald-500/10"
                                    >
                                      Renovar
                                    </button>
                                  ) : (
                                    <button 
                                      onClick={() => showToast(`Recordatorio de renovación enviado a: ${owner?.name}`, 'info')}
                                      className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 border border-indigo-200 text-[9px] py-1 px-2 rounded-md font-bold transition-all"
                                    >
                                      Recordar
                                    </button>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>

                {/* MODAL VISOR DE DOCUMENTOS DNI Y RECIBOS */}
                {inspectingOwner && (
                  <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 animate-in zoom-in-95 duration-200 overflow-hidden">
                      <div className="bg-[#1E293B] text-white p-5 flex justify-between items-center">
                        <div>
                          <h4 className="font-extrabold text-sm uppercase tracking-wider">Visor de Documentos de Propiedad</h4>
                          <span className="text-[10px] text-slate-400 font-medium">Inspección Física - Arrendador: {inspectingOwner.name}</span>
                        </div>
                        <button 
                          onClick={() => setInspectingOwner(null)}
                          className="text-slate-400 hover:text-white transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          
                          {/* Simulated DNI Card Visualizer */}
                          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-3 shadow-xs">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">DNI SIMULADO</span>
                            <div className="border border-indigo-500/20 bg-indigo-500/5 p-4 rounded-lg space-y-2 relative overflow-hidden">
                              {/* Decors */}
                              <div className="absolute top-0 right-0 w-8 h-8 bg-indigo-600/10 rounded-full -mr-2 -mt-2"></div>
                              <div className="w-12 h-12 bg-slate-300 rounded-lg flex items-center justify-center text-slate-600 font-black text-xs">FOTO</div>
                              <div className="space-y-1 text-slate-800">
                                <p className="text-[10px] font-bold">NOMBRE: {inspectingOwner.name.toUpperCase()}</p>
                                <p className="text-[10px] font-bold">DNI: {inspectingOwner.dni}</p>
                                <p className="text-[9px] text-slate-500">ESTADO REGISTRO: PENDIENTE</p>
                              </div>
                            </div>
                            <span className="text-[10px] text-slate-500 block text-center font-mono">{inspectingOwner.dniFile}</span>
                          </div>

                          {/* Simulated Electricity Utility Receipt */}
                          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-3 shadow-xs">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">RECIBO DE ENEL / SEDAPAL</span>
                            <div className="border border-emerald-500/20 bg-emerald-500/5 p-4 rounded-lg space-y-2 relative overflow-hidden">
                              <div className="absolute top-0 right-0 w-8 h-8 bg-[#10B981]/10 rounded-full -mr-2 -mt-2"></div>
                              <div className="flex justify-between items-center border-b border-emerald-500/10 pb-1.5">
                                <span className="text-[10px] font-black text-emerald-800 uppercase">ENEL DISTRIBUCIÓN</span>
                                <span className="text-[9px] text-emerald-600">PAGADO</span>
                              </div>
                              <div className="space-y-1 text-slate-800">
                                <p className="text-[9px] font-semibold">DIRECCIÓN PREDIO: Av. Universitaria 1200</p>
                                <p className="text-[9px] font-bold">MONTO FACTURA: S/ 142.50</p>
                                <p className="text-[8px] text-slate-400">MES DE CONSUMO: ENERO 2026</p>
                              </div>
                            </div>
                            <span className="text-[10px] text-slate-500 block text-center font-mono">{inspectingOwner.receiptFile}</span>
                          </div>

                        </div>

                        {/* Audit actions */}
                        <div className="flex space-x-3 border-t border-slate-100 pt-4">
                          <button 
                            onClick={() => rejectOwner(inspectingOwner.id)}
                            className="flex-1 bg-rose-50 hover:bg-rose-100 text-[#EF4444] border border-rose-200 font-extrabold text-xs py-3 rounded-xl transition-colors uppercase tracking-wider"
                          >
                            Rechazar Documentos
                          </button>
                          <button 
                            onClick={() => approveOwner(inspectingOwner.id)}
                            className="flex-1 bg-[#10B981] hover:bg-emerald-600 text-white font-extrabold text-xs py-3 rounded-xl transition-colors uppercase tracking-wider shadow shadow-emerald-500/20"
                          >
                            Aprobar y Verificar Cuenta
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* BANDEJA DE REPORTES / DENUNCIAS Y BANEO */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
                    <AlertTriangle className="w-5 h-5 text-rose-600" />
                    <h3 className="font-extrabold text-sm text-[#1E293B] uppercase tracking-wider">Bandeja de Denuncias Estudiantiles</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {complaints.length === 0 ? (
                      <div className="col-span-2 text-center py-10 text-slate-400 text-xs">
                        No hay denuncias de fraude reportadas por alumnos en el sistema.
                      </div>
                    ) : (
                      complaints.map(complaint => {
                        const targetRoom = rooms.find(r => r.id === complaint.targetRoomId);
                        const ownerObj = targetRoom ? owners.find(o => o.id === targetRoom.ownerId) : null;

                        return (
                          <div key={complaint.id} className="p-4 bg-rose-500/5 border border-[#EF4444]/15 rounded-xl flex flex-col justify-between space-y-4 shadow-2xs">
                            <div className="space-y-2">
                              <div className="flex justify-between items-start">
                                <span className="text-[9px] text-slate-400 font-bold font-mono">Reportado: {complaint.date}</span>
                                <span className="text-[9px] bg-rose-100 text-[#EF4444] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">Sospecha Fraude</span>
                              </div>
                              
                              <h5 className="font-extrabold text-xs text-[#1E293B] leading-snug">
                                Habitación ID {complaint.targetRoomId}: "{targetRoom?.title || '(Anuncio ya borrado)'}"
                              </h5>
                              <p className="text-xs text-slate-600 italic bg-white p-2.5 rounded-lg border border-rose-200/50 leading-relaxed font-medium">
                                "{complaint.reason}"
                              </p>
                              {ownerObj && (
                                <div className="text-[10px] text-slate-500 font-semibold pt-1">
                                  Propietario Asociado: <strong className="text-slate-800">{ownerObj.name}</strong> (DNI: {ownerObj.dni})
                                </div>
                              )}
                            </div>

                            <div className="border-t border-rose-200/30 pt-3 flex flex-wrap justify-between items-center gap-2">
                              <span className="text-[9px] text-slate-500">Por: <strong className="text-slate-700">{complaint.reporterEmail}</strong></span>
                              
                              {ownerObj ? (
                                <button 
                                  onClick={() => triggerBanning(ownerObj.id, ownerObj.dni)}
                                  className="bg-[#EF4444] hover:bg-rose-700 text-white font-extrabold text-[10px] py-1.5 px-3 rounded-lg flex items-center space-x-1 uppercase tracking-wider transition-all shadow"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span>Baneo Inmediato por DNI</span>
                                </button>
                              ) : (
                                <button 
                                  onClick={() => {
                                    setComplaints(prev => prev.filter(c => c.id !== complaint.id));
                                    showToast('Queja eliminada (arrendador ya no existe en el sistema).', 'info');
                                  }}
                                  className="text-xs text-slate-400 hover:text-slate-600 font-bold"
                                >
                                  Descartar Denuncia
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

              </div>
            )}
          </div>
        )}

      </main>

      {/* 4. FOOTER */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <div className="space-y-1">
            <span className="font-extrabold text-slate-800 text-sm tracking-wide">Fijo.pe (AlquilaUniversitario)</span>
            <p className="text-[11px] text-slate-400">Plataforma Segura Integrada para Búsqueda de Habitaciones en Lima Metropolitana.</p>
          </div>
          <div className="flex space-x-6 text-[11px] text-slate-500 font-bold">
            <a href="#terminos" onClick={(e) => e.preventDefault()} className="hover:text-[#10B981] transition-colors">Términos de Servicio</a>
            <a href="#privacidad" onClick={(e) => e.preventDefault()} className="hover:text-[#10B981] transition-colors">Privacidad de Datos</a>
            <a href="#libro" onClick={(e) => e.preventDefault()} className="hover:text-[#10B981] transition-colors">Libro de Reclamaciones</a>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default App;
