
import { 
  Users, Clock, Link, Calendar, Bell
} from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: Users,
      title: 'Cadastro de Profissionais',
      description: 'Horários personalizados para cada membro da equipe'
    },
    {
      icon: Clock,
      title: 'Serviços Configuráveis',
      description: 'Tempo e valor ajustáveis para cada tipo de atendimento'
    },
    {
      icon: Link,
      title: 'Link Único',
      description: 'Compartilhe sua agenda personalizada em qualquer lugar'
    },
    {
      icon: Calendar,
      title: 'Calendário Inteligente',
      description: 'Mostra apenas horários realmente disponíveis'
    },
    {
      icon: Users,
      title: 'Painel de Controle',
      description: 'Acompanhe agendamentos e desempenho em tempo real'
    },
    {
      icon: Bell,
      title: 'Notificação WhatsApp',
      description: 'Avisos automáticos para você e seus clientes'
    }
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            Tudo que você precisa em um só lugar
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-2">
            Funcionalidades pensadas para simplificar sua rotina e impressionar seus clientes
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="group relative p-6 sm:p-8 rounded-xl sm:rounded-2xl bg-white border border-gray-200 hover:bg-white/90 hover:backdrop-blur-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
            >
              {/* Hover overlay effect */}
              <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-50/50 to-blue-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Content */}
              <div className="relative z-10 text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 group-hover:bg-blue-200 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 transition-colors duration-300">
                  <feature.icon className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400 group-hover:scale-110 transition-transform duration-300" />
                </div>
                
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3 group-hover:text-blue-400 transition-colors duration-300">
                  {feature.title}
                </h3>
                
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
