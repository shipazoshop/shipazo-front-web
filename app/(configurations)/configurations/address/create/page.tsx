"use client";

import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import { useAddressRepository } from "@/presentation/hooks/repositories/useAddressRepository";
import { AddressForm } from "@/presentation/components/configurations/AddressForm";
import { AddressFormData } from "@/presentation/validation/address.schema";

export default function CreateAddressPage() {
  const router = useRouter();
  const { getAddresses, createAddress } = useAddressRepository();
  const addressesQuery = getAddresses();
  const createMutation = createAddress();

  const addresses = addressesQuery.data || [];
  const isFirstAddress = addresses.length === 0;

  const handleSubmit = (data: AddressFormData) => {
    createMutation.mutate(data as Required<AddressFormData>, {
      onSuccess: () => {
        router.push("/configurations/address");
      },
    });
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
        Crear Nueva Dirección
      </Typography>

      {createMutation.isError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Error al crear la dirección. Por favor, intenta nuevamente.
        </Alert>
      )}

      <Paper elevation={2} sx={{ p: 4 }}>
        <AddressForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={createMutation.isLoading}
          isFirstAddress={isFirstAddress}
        />
      </Paper>
    </Box>
  );
}
