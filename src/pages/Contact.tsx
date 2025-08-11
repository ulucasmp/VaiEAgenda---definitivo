
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { MessageCircle, Instagram, Mail, MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Contact = () => {
  const handleWhatsAppClick = () => {
    const phoneNumber = "5585997858919";
    const message = "Olá, gostaria de saber como o Vai e Agenda pode ajudar meu negócio.";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleInstagramClick = () => {
    window.open('https://instagram.com/vaieagenda', '_blank');
  };

  const handleEmailClick = () => {
    window.open('mailto:contato@vaieagenda.com', '_blank');
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              Entre em Contato
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Estamos aqui para ajudar! Escolha a forma de contato que preferir
            </p>
          </div>

          {/* Contact Options */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {/* WhatsApp */}
            <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                  <MessageCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">WhatsApp</h3>
                  <p className="text-gray-600">Resposta rápida e direta</p>
                </div>
              </div>
              <p className="text-gray-700 mb-6">
                A forma mais rápida de falar conosco. Tire suas dúvidas ou solicite uma demonstração.
              </p>
              <Button 
                onClick={handleWhatsAppClick}
                className="w-full bg-green-500 hover:bg-green-600 text-white"
              >
                Falar no WhatsApp
              </Button>
            </div>

            {/* Instagram */}
            <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mr-4">
                  <Instagram className="w-6 h-6 text-pink-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Instagram</h3>
                  <p className="text-gray-600">@vaieagenda</p>
                </div>
              </div>
              <p className="text-gray-700 mb-6">
                Siga-nos para dicas, novidades e conteúdo sobre gestão de agendamentos.
              </p>
              <Button 
                onClick={handleInstagramClick}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
              >
                Seguir no Instagram
              </Button>
            </div>

            {/* Email */}
            <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <Mail className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">E-mail</h3>
                  <p className="text-gray-600">contato@vaieagenda.com</p>
                </div>
              </div>
              <p className="text-gray-700 mb-6">
                Para assuntos mais formais ou solicitações detalhadas.
              </p>
              <Button 
                onClick={handleEmailClick}
                variant="outline"
                className="w-full"
              >
                Enviar E-mail
              </Button>
            </div>

            {/* Support Hours */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 gradient-bg rounded-lg flex items-center justify-center mr-4">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Horário de Atendimento</h3>
                  <p className="text-gray-600">Quando estamos disponíveis</p>
                </div>
              </div>
              <div className="space-y-2 text-gray-700">
                <p><strong>Segunda a Sexta:</strong> 8h às 18h</p>
                <p><strong>Sábado:</strong> 8h às 12h</p>
                <p><strong>Domingo:</strong> Fechado</p>
                <p className="text-sm text-gray-600 mt-4">
                  * Horário de Brasília. Respostas do WhatsApp em até 2 horas úteis.
                </p>
              </div>
            </div>
          </div>

          {/* FAQ Quick Links */}
          <div className="text-center bg-gray-50 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Precisa de ajuda rápida?
            </h2>
            <p className="text-gray-600 mb-6">
              Consulte nossas perguntas frequentes ou entre em contato diretamente
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" className="px-8">
                Ver FAQ
              </Button>
              <Button 
                onClick={handleWhatsAppClick}
                className="gradient-bg border-0 hover:opacity-90 px-8"
              >
                Falar Agora
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Contact;
