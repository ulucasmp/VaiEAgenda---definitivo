
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { FileText, CheckCircle, AlertTriangle, Users } from 'lucide-react';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="w-16 h-16 gradient-bg rounded-xl flex items-center justify-center mx-auto mb-6">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              Termos de Uso
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Conheça os termos e condições para uso da plataforma VaiEAgenda
            </p>
            <p className="text-sm text-gray-500 mt-4">
              Última atualização: Janeiro de 2025
            </p>
          </div>

          {/* Quick Summary */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <div className="text-center p-6 bg-green-50 rounded-xl">
              <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Uso Permitido</h3>
              <p className="text-sm text-gray-600">Para gestão profissional de agendamentos</p>
            </div>
            <div className="text-center p-6 bg-amber-50 rounded-xl">
              <AlertTriangle className="w-8 h-8 text-amber-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Responsabilidades</h3>
              <p className="text-sm text-gray-600">Suas obrigações como usuário</p>
            </div>
            <div className="text-center p-6 bg-blue-50 rounded-xl">
              <Users className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Suporte</h3>
              <p className="text-sm text-gray-600">Estamos aqui para ajudar</p>
            </div>
          </div>

          {/* Terms Content */}
          <div className="prose prose-lg max-w-none">
            <div className="bg-white rounded-xl border border-gray-200 p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Aceitação dos Termos</h2>
              <div className="space-y-4 text-gray-700">
                <p>Ao utilizar o VaiEAgenda, você concorda em cumprir estes Termos de Uso. Se não concordar com algum termo, não utilize nossos serviços.</p>
                <p>Podemos atualizar estes termos periodicamente. Continuando a usar o serviço após as alterações, você aceita as novas condições.</p>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Descrição do Serviço</h2>
              <div className="space-y-4 text-gray-700">
                <p>O VaiEAgenda é uma plataforma de gestão de agendamentos que oferece:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Sistema de agendamento online</li>
                  <li>Gestão de clientes e serviços</li>
                  <li>Notificações automáticas</li>
                  <li>Relatórios e estatísticas</li>
                  <li>Integração com WhatsApp</li>
                </ul>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Cadastro e Conta</h2>
              <div className="space-y-4 text-gray-700">
                <p><strong>Requisitos:</strong></p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Ser maior de 18 anos ou ter autorização legal</li>
                  <li>Fornecer informações verdadeiras e atualizadas</li>
                  <li>Manter a confidencialidade da sua senha</li>
                  <li>Notificar-nos sobre uso não autorizado da conta</li>
                </ul>
                <p><strong>Você é responsável por todas as atividades realizadas em sua conta.</strong></p>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Uso Aceitável</h2>
              <div className="space-y-4 text-gray-700">
                <p><strong>Você pode usar o VaiEAgenda para:</strong></p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Gerenciar agendamentos do seu negócio</li>
                  <li>Organizar informações de clientes</li>
                  <li>Automatizar notificações</li>
                  <li>Gerar relatórios de atividade</li>
                </ul>

                <p><strong>É proibido usar o serviço para:</strong></p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Atividades ilegais ou fraudulentas</li>
                  <li>Spam ou comunicações não solicitadas</li>
                  <li>Violar direitos de terceiros</li>
                  <li>Comprometer a segurança da plataforma</li>
                  <li>Fazer engenharia reversa do sistema</li>
                </ul>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Planos e Pagamento</h2>
              <div className="space-y-4 text-gray-700">
                <p><strong>Plano Gratuito:</strong> Funcionalidades básicas com limitações de uso.</p>
                <p><strong>Planos Pagos:</strong> Recursos avançados com cobrança mensal ou anual.</p>
                <p><strong>Política de Cobrança:</strong></p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Pagamentos processados no início de cada ciclo</li>
                  <li>Renovação automática salvo cancelamento</li>
                  <li>Sem reembolso para períodos já utilizados</li>
                  <li>Preços sujeitos a alteração com aviso prévio</li>
                </ul>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Propriedade Intelectual</h2>
              <div className="space-y-4 text-gray-700">
                <p><strong>Nossos Direitos:</strong> O VaiEAgenda, incluindo design, código, marca e conteúdo, são propriedade nossa.</p>
                <p><strong>Seus Dados:</strong> Você mantém a propriedade dos dados inseridos na plataforma.</p>
                <p><strong>Licença de Uso:</strong> Concedemos uma licença limitada para usar o serviço conforme estes termos.</p>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Limitação de Responsabilidade</h2>
              <div className="space-y-4 text-gray-700">
                <p>O VaiEAgenda é fornecido "como está". Não garantimos:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Funcionamento ininterrupto do serviço</li>
                  <li>Ausência total de bugs ou falhas</li>
                  <li>Compatibilidade com todos os dispositivos</li>
                </ul>
                <p><strong>Nossa responsabilidade é limitada ao valor pago pelo serviço no último ano.</strong></p>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Cancelamento</h2>
              <div className="space-y-4 text-gray-700">
                <p><strong>Por Você:</strong> Pode cancelar sua conta a qualquer momento através das configurações.</p>
                <p><strong>Por Nós:</strong> Podemos suspender ou cancelar contas que violem estes termos.</p>
                <p><strong>Após o Cancelamento:</strong> Seus dados podem ser mantidos por período limitado conforme nossa Política de Privacidade.</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Contato e Suporte</h2>
              <div className="space-y-4 text-gray-700">
                <p>Para dúvidas sobre estes termos ou suporte técnico:</p>
                <p><strong>E-mail:</strong> suporte@vaieagenda.com</p>
                <p><strong>WhatsApp:</strong> (85) 99785-8919</p>
                <p><strong>Horário:</strong> Segunda a Sexta, 8h às 18h</p>
                <p className="text-sm text-gray-600 mt-4">
                  Estes termos são regidos pelas leis brasileiras. Foro da comarca de Fortaleza/CE.
                </p>
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

export default TermsOfService;
