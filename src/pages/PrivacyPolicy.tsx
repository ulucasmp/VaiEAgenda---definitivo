
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { Shield, Eye, Lock, UserCheck } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="w-16 h-16 gradient-bg rounded-xl flex items-center justify-center mx-auto mb-6">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              Política de Privacidade
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Sua privacidade é importante para nós. Saiba como coletamos, usamos e protegemos suas informações.
            </p>
            <p className="text-sm text-gray-500 mt-4">
              Última atualização: Janeiro de 2025
            </p>
          </div>

          {/* Quick Overview */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <div className="text-center p-6 bg-blue-50 rounded-xl">
              <Eye className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Transparência</h3>
              <p className="text-sm text-gray-600">Explicamos claramente como seus dados são usados</p>
            </div>
            <div className="text-center p-6 bg-green-50 rounded-xl">
              <Lock className="w-8 h-8 text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Segurança</h3>
              <p className="text-sm text-gray-600">Protegemos suas informações com tecnologia moderna</p>
            </div>
            <div className="text-center p-6 bg-purple-50 rounded-xl">
              <UserCheck className="w-8 h-8 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Seus Direitos</h3>
              <p className="text-sm text-gray-600">Você tem controle total sobre seus dados</p>
            </div>
          </div>

          {/* Policy Content */}
          <div className="prose prose-lg max-w-none">
            <div className="bg-white rounded-xl border border-gray-200 p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Informações que Coletamos</h2>
              <div className="space-y-4 text-gray-700">
                <p><strong>Informações de Conta:</strong> Nome, e-mail, telefone e outras informações fornecidas durante o cadastro.</p>
                <p><strong>Dados de Agendamento:</strong> Informações sobre seus clientes e agendamentos para funcionamento do serviço.</p>
                <p><strong>Dados de Uso:</strong> Como você utiliza nossa plataforma para melhorar a experiência.</p>
                <p><strong>Informações Técnicas:</strong> Endereço IP, tipo de dispositivo e navegador para segurança e suporte.</p>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Como Usamos suas Informações</h2>
              <div className="space-y-4 text-gray-700">
                <p><strong>Prestação do Serviço:</strong> Para disponibilizar e manter as funcionalidades do VaiEAgenda.</p>
                <p><strong>Comunicação:</strong> Para enviar notificações importantes e responder suas dúvidas.</p>
                <p><strong>Melhorias:</strong> Para aprimorar nossos serviços e desenvolver novas funcionalidades.</p>
                <p><strong>Segurança:</strong> Para proteger sua conta e prevenir fraudes.</p>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Compartilhamento de Dados</h2>
              <div className="space-y-4 text-gray-700">
                <p>Não vendemos, alugamos ou compartilhamos suas informações pessoais com terceiros para fins de marketing.</p>
                <p><strong>Podemos compartilhar dados apenas quando:</strong></p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Você autorizar expressamente</li>
                  <li>Para cumprir obrigações legais</li>
                  <li>Com prestadores de serviços essenciais (sob rigorosos contratos de confidencialidade)</li>
                  <li>Para proteger direitos, segurança e propriedade</li>
                </ul>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Segurança dos Dados</h2>
              <div className="space-y-4 text-gray-700">
                <p>Implementamos medidas técnicas e organizacionais para proteger suas informações:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Criptografia de dados sensíveis</li>
                  <li>Acesso restrito apenas a funcionários autorizados</li>
                  <li>Monitoramento contínuo de segurança</li>
                  <li>Backup regular e seguro dos dados</li>
                </ul>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Seus Direitos (LGPD)</h2>
              <div className="space-y-4 text-gray-700">
                <p>De acordo com a Lei Geral de Proteção de Dados, você tem direito a:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Acesso:</strong> Saber quais dados temos sobre você</li>
                  <li><strong>Correção:</strong> Atualizar informações incorretas</li>
                  <li><strong>Exclusão:</strong> Solicitar remoção de seus dados</li>
                  <li><strong>Portabilidade:</strong> Receber seus dados em formato legível</li>
                  <li><strong>Oposição:</strong> Se opor ao tratamento de seus dados</li>
                </ul>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Retenção de Dados</h2>
              <div className="space-y-4 text-gray-700">
                <p>Mantemos suas informações apenas pelo tempo necessário para:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Prestação do serviço contratado</li>
                  <li>Cumprimento de obrigações legais</li>
                  <li>Resolução de disputas</li>
                </ul>
                <p>Após esse período, os dados são excluídos de forma segura.</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Contato</h2>
              <div className="space-y-4 text-gray-700">
                <p>Para exercer seus direitos ou esclarecer dúvidas sobre esta política, entre em contato:</p>
                <p><strong>E-mail:</strong> privacidade@vaieagenda.com</p>
                <p><strong>WhatsApp:</strong> (85) 99785-8919</p>
                <p><strong>Endereço:</strong> Fortaleza, CE - Brasil</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default PrivacyPolicy;
