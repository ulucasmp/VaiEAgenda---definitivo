
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { Check, Clock, User } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative bg-white py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 min-h-screen flex items-center">
      <div className="max-w-6xl mx-auto w-full">
        {/* Main Content */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h1 className="text-3xl sm:text-3xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
            Agendamentos simples para
            <br />
            <span className="text-blue-400">negócios incríveis</span>
          </h1>
          
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-8 sm:mb-12 max-w-3xl mx-auto px-2">
            O sistema ideal para barbearias, salões, clínicas e autônomos organizarem
            <br className="hidden sm:block" />
            seus horários com praticidade.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-8 sm:mb-12 lg:mb-16">
            <Button 
              size="lg" 
              className="bg-blue-600 hover:bg-blue-700 border-0 transition-colors text-base sm:text-lg px-4 py-3 sm:px-8 sm:py-4 rounded-xl w-full sm:w-auto text-white max-w-xs sm:max-w-none"
              asChild
            >
              <Link to="/cadastro">Experimente Grátis</Link>
            </Button>
            <Link 
              to="/login"
              className="text-base sm:text-lg text-gray-700 hover:text-blue-400 transition-colors"
            >
              Já tenho conta
            </Link>
          </div>
        </div>

        {/* Agenda Card */}
        <div className="max-w-xs sm:max-w-sm lg:max-w-md mx-auto">
          <Card className="p-0 bg-white shadow-xl border border-gray-200 rounded-2xl overflow-hidden">
            {/* Header do Card */}
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-4 py-3 border-b border-blue-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">Minha Agenda</h3>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-gray-600 font-medium">Online</span>
                </div>
              </div>
              <p className="text-xs text-gray-600 mt-1">Quinta-feira, 6 de Janeiro</p>
            </div>
            
            {/* Lista de Agendamentos */}
            <div className="p-4 space-y-3">
              {/* Agendamento 1 */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-xl border border-green-200">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-gray-900 text-sm">João Silva</h4>
                      <Badge className="bg-green-500 hover:bg-green-600 text-white text-xs px-2 py-0.5">
                        <Check className="w-2.5 h-2.5 mr-1" />
                        Confirmado
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-700 font-medium mb-1">Corte + Barba</p>
                    <div className="flex items-center gap-3 text-xs text-gray-600">
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        <span>Carlos</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>45min</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-600 mb-1">14:30</div>
                    <div className="text-xs font-semibold text-gray-900">R$ 35,00</div>
                  </div>
                </div>
              </div>
              
              {/* Agendamento 2 */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-xl border border-green-200">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-gray-900 text-sm">Maria Santos</h4>
                      <Badge className="bg-green-500 hover:bg-green-600 text-white text-xs px-2 py-0.5">
                        <Check className="w-2.5 h-2.5 mr-1" />
                        Confirmado
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-700 font-medium mb-1">Manicure + Pedicure</p>
                    <div className="flex items-center gap-3 text-xs text-gray-600">
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        <span>Ana</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>60min</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-600 mb-1">15:00</div>
                    <div className="text-xs font-semibold text-gray-900">R$ 45,00</div>
                  </div>
                </div>
              </div>
              
              {/* Agendamento 3 */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-xl border border-green-200">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-gray-900 text-sm">Pedro Costa</h4>
                      <Badge className="bg-green-500 hover:bg-green-600 text-white text-xs px-2 py-0.5">
                        <Check className="w-2.5 h-2.5 mr-1" />
                        Confirmado
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-700 font-medium mb-1">Corte + Lavagem</p>
                    <div className="flex items-center gap-3 text-xs text-gray-600">
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        <span>Lucas</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>40min</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-600 mb-1">15:30</div>
                    <div className="text-xs font-semibold text-gray-900">R$ 30,00</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer do Card */}
            <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">3 agendamentos hoje</span>
                <span className="font-semibold text-gray-900">Total: R$ 110,00</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Hero;

