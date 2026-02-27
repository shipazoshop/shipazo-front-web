import { PaymentConfigurationResponse, PaymentDetailResponse, ProcessPaymentRequest, ProcessPaymentResponse } from '@/domain/entities/payment.entity';
import { useApiQuery } from '../api/useApiQuery';

import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '@/application/stores/useAuthStore';

export function usePaymentRepository() {
  /**
   * Configuración de métodos de pago disponibles
   * GET /api/v1/payments/configuration
   */
  const getPaymentConfiguration = () => {
    return useApiQuery<PaymentConfigurationResponse>({
      service: 'scrapper',
      endpoint: '/payments/configuration',
      showErrorSnackbar: false,
      queryOptions: {
        staleTime: 10 * 60 * 1000, // 10 minutos
        retry: 1,
      },
    });
  };

  /**
   * Procesa el pago a través de la API Route interna de Next.js.
   * Security: nunca llama directamente al backend externo — pasa por el proxy
   * en /api/v1/payments/process que aplica rate limiting y no almacena datos.
   */
  const processPayment = () => {
    // Security: leer el token en tiempo de render del hook (no en el mutationFn)
    // para seguir las reglas de hooks de React.
    const accessToken = useAuthStore((state) => state.accessToken);

    return useMutation<ProcessPaymentResponse, Error, ProcessPaymentRequest>({
      mutationFn: async (data: ProcessPaymentRequest) => {
        // Security: llamada same-origin al proxy de Next.js.
        // Los datos de tarjeta nunca son enviados directamente al backend externo.
        const response = await fetch('/api/v1/payments/process', {
          method: 'POST',
          credentials: 'same-origin', // Security: no enviar cookies cross-origin
          headers: {
            'Content-Type': 'application/json',
            ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            (errorData as Record<string, unknown>).message as string ||
            'No se pudo procesar el pago.',
          );
        }

        return response.json() as Promise<ProcessPaymentResponse>;
      },
      retry: false, // Security: no reintentar pagos automáticamente
    });
  };

  /**
   * Obtiene el detalle de un pago por su ID
   * GET /api/v1/payments/:paymentId
   */
  const getPaymentDetail = (paymentId: string) => {
    return useApiQuery<PaymentDetailResponse>({
      service: 'scrapper',
      endpoint: `/payments/${paymentId}`,
      enabled: !!paymentId,
      showErrorSnackbar: false,
      queryOptions: {
        staleTime: 10 * 60 * 1000, // 10 minutos
      },
    });
  };

  return { getPaymentConfiguration, getPaymentDetail, processPayment };
}
