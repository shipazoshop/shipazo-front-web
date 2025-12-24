import * as yup from 'yup';

export const addressSchema = yup.object({
  address: yup
    .string()
    .required('La dirección es requerida')
    .min(10, 'La dirección debe tener al menos 10 caracteres')
    .max(200, 'La dirección no puede exceder 200 caracteres'),
  postalCode: yup
    .string()
    .required('El código postal es requerido')
    .matches(/^[0-9]{5}(-[0-9]{4})?$/, 'Código postal inválido'),
  additionalSpecifications: yup
    .string()
    .max(300, 'Las especificaciones no pueden exceder 300 caracteres')
    .optional(),
  city: yup
    .string()
    .required('La ciudad es requerida')
    .min(2, 'La ciudad debe tener al menos 2 caracteres')
    .max(100, 'La ciudad no puede exceder 100 caracteres'),
  stateProvince: yup
    .string()
    .required('El departamento/estado es requerido')
    .min(2, 'El departamento/estado debe tener al menos 2 caracteres')
    .max(100, 'El departamento/estado no puede exceder 100 caracteres'),
  countryCode: yup
    .string()
    .required('El país es requerido')
    .length(2, 'El código del país debe ser de 2 caracteres'),
  alias: yup
    .string()
    .required('El alias es requerido')
    .min(2, 'El alias debe tener al menos 2 caracteres')
    .max(50, 'El alias no puede exceder 50 caracteres'),
  isDefault: yup.boolean().default(false),
});

export type AddressFormData = yup.InferType<typeof addressSchema>;