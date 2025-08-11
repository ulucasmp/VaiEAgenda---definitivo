
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { Calendar, Users, Target, Award } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-12 h-12 gradient-bg rounded-xl flex items-center justify-center">
                <Calendar className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900">
                Sobre o Vai<span className="text-primary">E</span><span className="text-accent">Agenda</span>
              </h1>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Transformando a forma como profissionais brasileiros gerenciam seus agendamentos
            </p>
          </div>

          {/* Mission */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Nossa Missão</h2>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8">
              <p className="text-lg text-gray-700 leading-relaxed text-center">
                Simplificar o dia a dia de profissionais autônomos e pequenos negócios, 
                oferecendo uma solução moderna, intuitiva e feita especialmente para o mercado brasileiro. 
                Acreditamos que organizar agendamentos não deve ser complicado.
              </p>
            </div>
          </div>

          {/* Values */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Nossos Valores</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <div className="w-12 h-12 gradient-bg rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Simplicidade</h3>
                <p className="text-gray-600">
                  Desenvolvemos soluções intuitivas que qualquer pessoa pode usar, 
                  sem necessidade de treinamento complexo.
                </p>
              </div>
              
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <div className="w-12 h-12 gradient-bg rounded-lg flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Foco no Cliente</h3>
                <p className="text-gray-600">
                  Cada funcionalidade é pensada para resolver problemas reais 
                  dos nossos usuários brasileiros.
                </p>
              </div>
              
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <div className="w-12 h-12 gradient-bg rounded-lg flex items-center justify-center mb-4">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Qualidade</h3>
                <p className="text-gray-600">
                  Comprometidos em entregar uma experiência confiável e de alta qualidade 
                  em cada interação.
                </p>
              </div>
              
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <div className="w-12 h-12 gradient-bg rounded-lg flex items-center justify-center mb-4">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Inovação</h3>
                <p className="text-gray-600">
                  Sempre buscando novas formas de melhorar e modernizar 
                  a gestão de agendamentos.
                </p>
              </div>
            </div>
          </div>

          {/* Story */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Nossa História</h2>
            <div className="bg-gray-50 rounded-2xl p-8">
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                O VaiEAgenda nasceu da necessidade real de profissionais brasileiros que 
                enfrentavam dificuldades para organizar seus atendimentos de forma eficiente.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Desenvolvemos uma solução que combina tecnologia moderna com a simplicidade 
                que o mercado brasileiro precisa, criando uma ferramenta verdadeiramente útil 
                para quem quer focar no que faz de melhor: atender bem seus clientes.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default About;
