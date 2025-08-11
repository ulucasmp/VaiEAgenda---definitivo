
import { Link } from 'react-router-dom';

const FinalCTA = () => {
  const benefits = [
    '7 dias grátis',
    'Cancele quando quiser'
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 gradient-bg">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
          Crie sua agenda grátis e compartilhe
          <br />
          com seus clientes
          <br />
          em minutos!
        </h2>
        
        <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
          Pare de perder clientes por desorganização. Comece hoje mesmo e veja
          seus agendamentos aumentarem.
        </p>
        
        <Link 
          to="/cadastro"
          className="bg-white text-blue-600 font-bold text-lg px-8 py-4 rounded-xl hover:bg-gray-100 transition-colors mb-8 inline-flex items-center"
        >
          Começar Agora - É Grátis! 🚀
        </Link>
        
        <div className="flex flex-col sm:flex-row justify-center items-center gap-6 text-white">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-center">
              <span className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-2">
                ✓
              </span>
              <span>{benefit}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
