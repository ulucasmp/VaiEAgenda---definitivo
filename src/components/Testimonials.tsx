
const Testimonials = () => {
  const testimonials = [
    {
      name: 'Julia Santos',
      business: 'Salão Essência',
      text: 'Antes do VaiEAgenda, eu esquecia horários direto. Agora tá tudo na palma da mão! Meus clientes adoram agendar pelo celular.',
      rating: 5
    },
    {
      name: 'Diego Oliveira',
      business: 'Barbearia Dom Diego',
      text: 'Aumentei 30% meus atendimentos só com o link personalizado. Coloquei no Instagram e os agendamentos dispararam!',
      rating: 5
    },
    {
      name: 'Carla Mendes',
      business: 'Estética Bella Vita',
      text: 'O WhatsApp automático é uma mão na roda! Nem preciso mais ligar para confirmar, tudo acontece sozinho. Recomendo demais!',
      rating: 5
    }
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: rating }, (_, i) => (
      <span key={i} className="text-yellow-400">⭐</span>
    ));
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Quem já usa, recomenda
          </h2>
          <p className="text-xl text-gray-600">
            Veja o que nossos clientes estão falando sobre o VaiEAgenda
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <div className="flex mb-4">
                {renderStars(testimonial.rating)}
              </div>
              
              <p className="text-gray-700 mb-6 italic leading-relaxed">
                "{testimonial.text}"
              </p>
              
              <div className="flex items-center">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-semibold">
                    {testimonial.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-gray-600 text-sm">{testimonial.business}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
