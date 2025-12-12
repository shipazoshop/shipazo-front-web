"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Grid from '@mui/material/Grid';
import Typography from "@mui/material/Typography";
import { Save, ArrowLeft } from "lucide-react";
import { addressSchema, AddressFormData } from "@/presentation/validation/address.schema";
import { Address } from "@/domain/entities/address.entity";

interface AddressFormProps {
  initialData?: Address;
  onSubmit: (data: AddressFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
  isFirstAddress?: boolean;
}

export function AddressForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
  isFirstAddress = false,
}: AddressFormProps) {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<AddressFormData>({
    resolver: yupResolver(addressSchema) as any,
    defaultValues: initialData
      ? {
        address: initialData.address,
        postalCode: initialData.postalCode,
        additionalSpecifications: initialData.additionalSpecifications || "",
        city: initialData.city,
        state: initialData.state,
        country: initialData.country,
        alias: initialData.alias,
        isDefault: initialData.isDefault,
      }
      : {
        address: "",
        postalCode: "",
        additionalSpecifications: "",
        city: "",
        state: "",
        country: "SV",
        alias: "",
        isDefault: false,
      },
  });

  // Si es la primera dirección, marcarla como predeterminada automáticamente
  useEffect(() => {
    if (isFirstAddress && !initialData) {
      setValue("isDefault", true);
    }
  }, [isFirstAddress, initialData, setValue]);

  const handleFormSubmit = (data: AddressFormData) => {
    // Si es la primera dirección, forzar isDefault a true
    if (isFirstAddress && !initialData) {
      onSubmit({ ...data, isDefault: true });
    } else {
      onSubmit(data);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(handleFormSubmit)} noValidate>
      <Grid container spacing={3}>
        {/* Alias */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Controller
            name="alias"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Alias de la dirección"
                placeholder="Ej: Casa, Oficina, etc."
                variant="outlined"
                fullWidth
                error={!!errors.alias}
                helperText={errors.alias?.message}
                required
              />
            )}
          />
        </Grid>

        {/* País */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Controller
            name="country"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="País (código ISO)"
                placeholder="SV"
                variant="outlined"
                fullWidth
                error={!!errors.country}
                helperText={errors.country?.message || "Código de 2 letras (Ej: SV, GT, HN)"}
                required
              />
            )}
          />
        </Grid>

        {/* Dirección completa */}
        <Grid size={{ xs: 12 }}>
          <Controller
            name="address"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Dirección completa"
                placeholder="Calle Principal #123, Colonia Centro, entre 5a y 7a Avenida"
                variant="outlined"
                fullWidth
                multiline
                rows={2}
                error={!!errors.address}
                helperText={errors.address?.message}
                required
              />
            )}
          />
        </Grid>

        {/* Ciudad */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Controller
            name="city"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Ciudad"
                placeholder="San Salvador"
                variant="outlined"
                fullWidth
                error={!!errors.city}
                helperText={errors.city?.message}
                required
              />
            )}
          />
        </Grid>

        {/* Departamento/Estado */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Controller
            name="state"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Departamento/Estado"
                placeholder="San Salvador"
                variant="outlined"
                fullWidth
                error={!!errors.state}
                helperText={errors.state?.message}
                required
              />
            )}
          />
        </Grid>

        {/* Código Postal */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Controller
            name="postalCode"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Código Postal"
                placeholder="01101"
                variant="outlined"
                fullWidth
                error={!!errors.postalCode}
                helperText={errors.postalCode?.message}
                required
              />
            )}
          />
        </Grid>

        {/* Especificaciones adicionales */}
        <Grid size={{ xs: 12 }}>
          <Controller
            name="additionalSpecifications"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Especificaciones adicionales (opcional)"
                placeholder="Casa de dos pisos, portón color negro. Llamar al timbre."
                variant="outlined"
                fullWidth
                multiline
                rows={3}
                error={!!errors.additionalSpecifications}
                helperText={errors.additionalSpecifications?.message || "Detalles que ayuden al repartidor"}
              />
            )}
          />
        </Grid>

        {/* Nota informativa si es primera dirección */}
        {isFirstAddress && !initialData && (
          <Grid size={{ xs: 12 }}>
            <Box
              sx={{
                p: 2,
                bgcolor: "info.light",
                borderRadius: 1,
                border: "1px solid",
                borderColor: "info.main",
              }}
            >
              <Typography variant="body2" color="info.dark">
                Esta será tu primera dirección y se marcará automáticamente como predeterminada.
              </Typography>
            </Box>
          </Grid>
        )}

        {/* Botones de acción */}
        <Grid size={{ xs: 12 }}>
          <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end", mt: 2 }}>
            <Button
              type="button"
              variant="outlined"
              startIcon={<ArrowLeft size={18} />}
              onClick={onCancel}
              disabled={isLoading}
              sx={{ textTransform: "none", fontWeight: 600 }}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              startIcon={<Save size={18} />}
              disabled={isLoading}
              sx={{ textTransform: "none", fontWeight: 600 }}
            >
              {isLoading ? "Guardando..." : initialData ? "Actualizar" : "Crear Dirección"}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
