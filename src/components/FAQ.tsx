
import { useState } from 'react';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: 'O que é o VaiEAgenda?',
      answer: 'O VaiEAgenda é um sistema completo de agendamentos online desenvolvido especialmente para pequenos negócios como barbearias, salões de beleza, clínicas estéticas e profissionais autônomos.'
    },
    {
      question: 'Preciso pagar para usar?',
      answer: 'Oferecemos um plano gratuito com funcionalidades básicas e planos pagos com recursos avançados. Você pode começar gratuitamente e evoluir conforme sua necessidade.'
    },
    {
      question: 'Posso colocar mais de um profissional?',
      answer: 'Sim! Você pode cadastrar quantos profissionais quiser, cada um com seus próprios horários, serviços e disponibilidade personalizada.'
    },
    {
      question: 'Como recebo meus agendamentos?',
      answer: 'Você recebe notificações em tempo real via WhatsApp, email e também pode acompanhar tudo pelo painel de controle do sistema.'
    },
    {
      question: 'É difícil de configurar?',
      answer: 'Não! O VaiEAgenda foi pensado para ser simples. Em poucos minutos você configura seus serviços, horários e já pode compartilhar seu link de agendamento.'
    },
    {
      question: 'Posso cancelar quando quiser?',
      answer: 'Claro! Não há fidelidade. Você pode cancelar sua assinatura a qualquer momento e seus dados ficam seguros conosco.'
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Perguntas Frequentes
          </h2>
          <p className="text-xl text-gray-600">
            Tire suas dúvidas sobre o VaiEAgenda
          </p>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-gray-200 rounded-xl overflow-hidden">
              <button
                className="w-full px-6 py-4 text-left bg-white hover:bg-gray-50 transition-colors flex justify-between items-center"
                onClick={() => toggleFAQ(index)}
              >
                <span className="font-semibold text-gray-900">{faq.question}</span>
                <span className="text-gray-500 text-xl">
                  {openIndex === index ? '−' : '+'}
                </span>
              </button>
              
              {openIndex === index && (
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
