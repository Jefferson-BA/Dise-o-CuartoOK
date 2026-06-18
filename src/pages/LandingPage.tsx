import React from 'react';
import { Shield, MapPin, Users, CheckCircle, ArrowRight, Star } from 'lucide-react';

export const LandingPage: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-emerald-500 p-2 rounded-lg text-white">
              <Shield className="w-6 h-6" />
            </div>
            <span className="text-2xl font-black text-slate-900">CuartoOK</span>
          </div>
          <button
            onClick={() => onNavigate('app')}
            className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg transition-all duration-200"
          >
            Entrar a la Plataforma
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-8">
        <div className="text-center space-y-6">
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 leading-tight">
            Encuentra tu habitación ideal <span className="text-emerald-500">verificada y segura</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            CuartoOK es la plataforma más segura para que estudiantes universitarios encuentren habitaciones en Lima Metropolitana. Todos nuestros propietarios son verificados.
          </p>
          <button
            onClick={() => onNavigate('app')}
            className="inline-flex items-center space-x-2 px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-lg transition-all duration-200 shadow-lg shadow-emerald-500/30"
          >
            <span>Explorar Habitaciones</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200 text-center">
            <div className="text-4xl font-black text-emerald-500 mb-2">840+</div>
            <p className="text-slate-600 font-semibold">Estudiantes Registrados</p>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200 text-center">
            <div className="text-4xl font-black text-emerald-500 mb-2">100+</div>
            <p className="text-slate-600 font-semibold">Habitaciones Disponibles</p>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200 text-center">
            <div className="text-4xl font-black text-emerald-500 mb-2">2</div>
            <p className="text-slate-600 font-semibold">Propietarios Verificados</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-slate-900 mb-4">¿Por qué elegir CuartoOK?</h2>
            <p className="text-lg text-slate-600">Seguridad, transparencia y confianza en cada búsqueda</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Shield, title: "Propietarios Verificados", desc: "Todos nuestros anfitriones se validan con documentos oficiales" },
              { icon: MapPin, title: "Ubicaciones Estratégicas", desc: "Habitaciones cerca de universidades principales de Lima" },
              { icon: Users, title: "Comunidad Segura", desc: "Sistema de reportes y moderación constante" },
              { icon: CheckCircle, title: "Garantía de Seguridad", desc: "Protección contra fraudes y estafas garantizada" }
            ].map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div key={idx} className="text-center space-y-4 p-6 rounded-xl bg-slate-50 border border-slate-200 hover:shadow-lg transition-all duration-200">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <Icon className="w-8 h-8" />
                  </div>
                  <h3 className="font-bold text-lg text-slate-900">{feature.title}</h3>
                  <p className="text-slate-600 text-sm">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-4xl font-black text-slate-900 text-center mb-16">Testimonios de Estudiantes</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { name: "Carlos M.", uni: "USMP", text: "Encontré la habitación perfecta en 2 días. El proceso fue muy seguro y transparente." },
            { name: "Ana P.", uni: "Tecsup", text: "Excelente plataforma. Los propietarios fueron verificados y todo muy profesional." },
            { name: "Roberto L.", uni: "PUCP", text: "CuartoOK me dio la tranquilidad que necesitaba. Recomendado 100%." }
          ].map((testimonial, idx) => (
            <div key={idx} className="bg-white rounded-xl p-8 border border-slate-200 shadow-lg hover:shadow-xl transition-all duration-200">
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-slate-700 mb-4 italic">"{testimonial.text}"</p>
              <div className="border-t border-slate-200 pt-4">
                <p className="font-bold text-slate-900">{testimonial.name}</p>
                <p className="text-xs text-slate-500">{testimonial.uni}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-emerald-500 to-emerald-600 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-4xl font-black text-white">¿Listo para encontrar tu habitación?</h2>
          <p className="text-xl text-emerald-50">Accede ahora a nuestra plataforma y descubre habitaciones verificadas en Lima</p>
          <button
            onClick={() => onNavigate('app')}
            className="inline-flex items-center space-x-2 px-8 py-4 bg-white text-emerald-600 font-bold rounded-xl text-lg hover:bg-slate-50 transition-all duration-200 shadow-lg"
          >
            <span>Explorar Ahora</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-white mb-4">CuartoOK</h3>
              <p className="text-sm">Plataforma segura de habitaciones para estudiantes en Lima Metropolitana.</p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Plataforma</h4>
              <ul className="space-y-2 text-sm"><li><a href="#" className="hover:text-white transition-colors">Buscar Habitaciones</a></li><li><a href="#" className="hover:text-white transition-colors">Publica tu Habitación</a></li></ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Soporte</h4>
              <ul className="space-y-2 text-sm"><li><a href="#" className="hover:text-white transition-colors">Centro de Ayuda</a></li><li><a href="#" className="hover:text-white transition-colors">Contacto</a></li></ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm"><li><a href="#" className="hover:text-white transition-colors">Privacidad</a></li><li><a href="#" className="hover:text-white transition-colors">Términos</a></li></ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-sm">
            <p>&copy; 2026 CuartoOK. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
