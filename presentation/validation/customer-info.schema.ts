import * as yup from 'yup';

export const customerInfoSchema = yup.object({
  recipientName: yup
    .string()
    .required('El nombre del destinatario es requerido')
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres')
    .matches(
      /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
      'El nombre solo puede contener letras y espacios'
    ),
  identificationNumber: yup
    .string()
    .required('El número de identificación es requerido')
    .matches(
      /^[0-9]{8}-[0-9]$/,
      'Formato inválido. Use el formato: 12345678-9'
    ),
  phoneNumber: yup
    .string()
    .required('El número de teléfono es requerido')
    .matches(
      /^\+503\s[0-9]{4}-[0-9]{4}$/,
      'Formato inválido. Use el formato: +503 7890-1234'
    ),
});

export type CustomerInfoFormData = yup.InferType<typeof customerInfoSchema>;
