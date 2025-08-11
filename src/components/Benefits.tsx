
import { ArrowRight, TrendingUp, Clock, Users, Share2 } from 'lucide-react';

const Benefits = () => {
  const benefits = [
    {
      icon: TrendingUp,
      title: 'Aumente sua produtividade',
      description: 'Organize melhor seu tempo e atenda mais clientes'
    },
    {
      icon: Users,
      title: 'Facilite o agendamento',
      description: 'Seus clientes agendam sozinhos, 24h por dia'
    },
    {
      icon: Clock,
      title: 'Reduza cancelamentos',
      description: 'Lembretes automáticos diminuem faltas e retrabalho'
    },
    {
      icon: Share2,
      title: 'Divulgue com facilidade',
      description: 'Compartilhe sua agenda no Instagram e WhatsApp'
    }
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            Transforme seu negócio
          </h2>
          <p className="text-lg text-gray-600 max-w-xl mx-auto px-2">
            Descubra como profissionais estão revolucionando seus atendimentos
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid lg:grid-cols-2 gap-12 sm:gap-16 items-center">
          {/* Left side - Benefits */}
          <div className="space-y-6 sm:space-y-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="group flex items-start space-x-3 sm:space-x-4 p-4 sm:p-6 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <benefit.icon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                </div>
                
                <div className="flex-1">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">
                    {benefit.title}
                  </h3>
                  
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>

                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-300 group-hover:text-blue-600 transition-colors duration-200" />
              </div>
            ))}
          </div>

          {/* Right side - Visual */}
          <div className="relative">
            <div className="bg-gray-50 rounded-xl sm:rounded-2xl p-8 sm:p-12 text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <Users className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
                +87%
              </h3>
              <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">
                de aumento na produtividade
              </p>

              <div className="space-y-2 sm:space-y-3">
                {['Menos tempo organizando', 'Mais clientes atendidos', 'Zero agendamentos perdidos'].map((item, i) => (
                  <div key={i} className="flex items-center justify-center space-x-2 py-1.5 sm:py-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                    <span className="text-gray-700 text-xs sm:text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Benefits;
