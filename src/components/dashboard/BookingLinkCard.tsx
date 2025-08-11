
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useEmpresa } from '@/hooks/useEmpresa';

interface BookingLinkCardProps {
  companyName: string;
}

const BookingLinkCard = ({ companyName }: BookingLinkCardProps) => {
  const { toast } = useToast();
  const { empresa } = useEmpresa();
  
  // Use o link_agendamento salvo no banco, com fallback para o slug
  const bookingLink = empresa?.link_agendamento || (empresa?.slug ? `${window.location.origin}/agendamento/${empresa.slug}` : '');

  const handleCopyLink = async () => {
    if (!bookingLink) {
      toast({
        title: "Link não disponível",
        description: "O slug da empresa não foi encontrado.",
        variant: "destructive",
      });
      return;
    }

    try {
      await navigator.clipboard.writeText(bookingLink);
      toast({
        title: "Link copiado!",
        description: "O link de agendamento foi copiado para a área de transferência.",
      });
    } catch (error) {
      console.error('Erro ao copiar link:', error);
      toast({
        title: "Erro ao copiar link",
        description: "Não foi possível copiar o link. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleViewPage = () => {
    if (!bookingLink) {
      toast({
        title: "Link não disponível",
        description: "O slug da empresa não foi encontrado.",
        variant: "destructive",
      });
      return;
    }
    window.open(bookingLink, '_blank', 'noopener,noreferrer');
  };

  const handleWhatsAppShare = () => {
    if (!bookingLink) {
      toast({
        title: "Link não disponível",
        description: "O slug da empresa não foi encontrado.",
        variant: "destructive",
      });
      return;
    }

    const message = `Olá! 👋\n\nVocê pode agendar seus horários comigo de forma rápida e fácil através do nosso sistema online.\n\n🔗 Acesse: ${bookingLink}\n\nÉ só clicar no link, escolher o serviço, data e horário que prefere. Super prático! 😊`;
    
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    
    toast({
      title: "WhatsApp aberto!",
      description: "Agora você pode escolher com quem compartilhar o link.",
    });
  };

  if (!bookingLink) {
    return (
      <Card className="border-blue-100 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <ExternalLink className="w-5 h-5 text-blue-500" />
            Link de Agendamento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">
            Link de agendamento não encontrado. Entre em contato com o suporte.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-blue-100 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <ExternalLink className="w-5 h-5 text-blue-500" />
          Link de Agendamento
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
          <p className="text-sm text-gray-600 mb-2">Seu link personalizado:</p>
          <code className="text-sm text-blue-600 bg-white p-2 rounded border block break-all">
            {bookingLink}
          </code>
        </div>
        
        <p className="text-sm text-gray-600">
          Compartilhe este link com seus clientes para que eles possam agendar seus serviços online.
        </p>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleCopyLink}
            className="flex-1 border-blue-200 text-blue-600 hover:bg-blue-50"
          >
            <Copy className="w-4 h-4 mr-2" />
            Copiar Link
          </Button>
          <Button 
            onClick={handleViewPage}
            className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Visualizar
          </Button>
        </div>
        
        <Button 
          onClick={handleWhatsAppShare}
          className="w-full bg-green-500 hover:bg-green-600 text-white transition-colors"
        >
          <svg
            className="w-4 h-4 mr-2"
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.893 3.386"/>
          </svg>
          Compartilhar no WhatsApp
        </Button>
      </CardContent>
    </Card>
  );
};

export default BookingLinkCard;
