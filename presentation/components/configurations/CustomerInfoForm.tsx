"use client";

import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import { customerInfoSchema, CustomerInfoFormData } from "@/presentation/validation/customer-info.schema";
import { CustomerInfo } from "@/domain/entities/customer-info.entity";

interface CustomerInfoFormProps {
  initialData?: CustomerInfo;
  onSubmit: (data: CustomerInfoFormData) => void;
  formId: string;
}

export function CustomerInfoForm({ initialData, onSubmit, formId }: CustomerInfoFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CustomerInfoFormData>({
    resolver: yupResolver(customerInfoSchema) as any,
    defaultValues: initialData
      ? {
        recipientName: initialData.recipientName,
        identificationNumber: initialData.identificationNumber,
        phoneNumber: initialData.phoneNumber,
      }
      : {
        recipientName: "",
        identificationNumber: "",
        phoneNumber: "",
      },
  });

  return (
    <Box component="form" id={formId} onSubmit={handleSubmit(onSubmit)} noValidate>
      <Grid container spacing={3}>
        {/* Nombre del destinatario */}
        <Grid size={{ xs: 12 }}>
          <Controller
            name="recipientName"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Nombre del destinatario"
                placeholder="Juan Antonio Pérez García"
                variant="outlined"
                fullWidth
                error={!!errors.recipientName}
                helperText={errors.recipientName?.message || "Nombre completo de la persona que recibirá los pedidos"}
                required
              />
            )}
          />
        </Grid>

        {/* Número de identificación */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Controller
            name="identificationNumber"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Número de identificación (CUI)"
                placeholder="1245678910121"
                variant="outlined"
                fullWidth
                error={!!errors.identificationNumber}
                helperText={errors.identificationNumber?.message || "Formato: 1245678910121"}
                required
              />
            )}
          />
        </Grid>

        {/* Número de teléfono */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Controller
            name="phoneNumber"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Número de teléfono"
                placeholder="+503 7890-1234"
                variant="outlined"
                fullWidth
                error={!!errors.phoneNumber}
                helperText={errors.phoneNumber?.message || "Formato: +503 7890-1234"}
                required
              />
            )}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
