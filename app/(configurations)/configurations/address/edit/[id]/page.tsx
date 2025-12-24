"use client";

import { useParams, useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import { useAddressRepository } from "@/presentation/hooks/repositories/useAddressRepository";
import { AddressForm } from "@/presentation/components/configurations/AddressForm";
import { AddressFormData } from "@/presentation/validation/address.schema";

export default function EditAddressPage() {
  const params = useParams();
  const router = useRouter();
  const { getAddresses, updateAddress } = useAddressRepository();
  const addressesQuery = getAddresses();

  const addressId = params.id as string;
  const addresses = addressesQuery.data || [];
  const currentAddress = addresses.find((addr) => addr.id === addressId);
  console.log("🚀 ~ EditAddressPage ~ currentAddress:", currentAddress)
  const updateMutation = updateAddress(currentAddress?.id);

  const handleSubmit = (data: AddressFormData) => {
    updateMutation.mutate(
      {
        id: addressId,
        ...data as Required<AddressFormData>,
      },
      {
        onSuccess: () => {
          // Verificar si hay una URL de redirección guardada
          const redirectUrl = sessionStorage.getItem("redirectAfterAddressEdit");

          if (redirectUrl) {
            // Limpiar el sessionStorage y redirigir a la URL guardada
            sessionStorage.removeItem("redirectAfterAddressEdit");
            router.push(redirectUrl);
          } else {
            // Redirección por defecto
            router.push("/configurations/address");
          }
        },
      }
    );
  };

  const handleCancel = () => {
    router.back();
  };

  if (addressesQuery.isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!currentAddress) {
    return (
      <Box>
        <Alert severity="error">
          Dirección no encontrada. Por favor, verifica el ID e intenta nuevamente.
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
        Editar Dirección
      </Typography>

      {updateMutation.isError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Error al actualizar la dirección. Por favor, intenta nuevamente.
        </Alert>
      )}

      <Paper elevation={2} sx={{ p: 4 }}>
        <AddressForm
          initialData={currentAddress}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={updateMutation.isLoading}
        />
      </Paper>
    </Box>
  );
}
