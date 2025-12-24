"use client";

import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import { Save } from "lucide-react";
import { useCustomerInfoRepository } from "@/presentation/hooks/repositories/useCustomerInfoRepository";
import { CustomerInfoForm } from "@/presentation/components/configurations/CustomerInfoForm";
import { CustomerInfoFormData } from "@/presentation/validation/customer-info.schema";
import { useState } from "react";

const FORM_ID = "customer-info-form";

export default function PersonalInfoPage() {
  const { getCustomerInfo, createCustomerInfo, updateCustomerInfo } = useCustomerInfoRepository();
  const customerInfoQuery = getCustomerInfo();
  const createMutation = createCustomerInfo();
  const updateMutation = updateCustomerInfo(customerInfoQuery?.data?.id);

  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  const customerInfo = customerInfoQuery.data;
  const isLoading = createMutation.isLoading || updateMutation.isLoading;
  const isError = createMutation.isError || updateMutation.isError;

  const handleSubmit = (data: CustomerInfoFormData) => {
    debugger
    if (customerInfo) {
      // Actualizar información existente
      updateMutation.mutate(
        {
          ...data as Required<CustomerInfoFormData>,
        },
        {
          onSuccess: () => {
            setShowSuccessAlert(true);
            setTimeout(() => setShowSuccessAlert(false), 3000);
          },
        }
      );
    } else {
      // Crear nueva información
      createMutation.mutate(
        data as Required<CustomerInfoFormData>,
        {
          onSuccess: () => {
            setShowSuccessAlert(true);
            setTimeout(() => setShowSuccessAlert(false), 3000);
          },
        }
      );
    }
  };

  if (customerInfoQuery.isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Mi Información Personal
        </Typography>
        <Button
          type="submit"
          form={FORM_ID}
          variant="contained"
          startIcon={<Save size={20} />}
          disabled={isLoading}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            px: 3,
          }}
        >
          {isLoading ? "Guardando..." : "Guardar"}
        </Button>
      </Box>

      {/* Alertas */}
      {showSuccessAlert && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setShowSuccessAlert(false)}>
          Información guardada exitosamente.
        </Alert>
      )}

      {isError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Error al guardar la información. Por favor, intenta nuevamente.
        </Alert>
      )}

      {/* Formulario */}
      <Paper elevation={2} sx={{ p: 4 }}>
        <CustomerInfoForm
          initialData={customerInfo}
          onSubmit={handleSubmit}
          formId={FORM_ID}
        />

        {!customerInfo && (
          <Box
            sx={{
              mt: 3,
              p: 2,
              bgcolor: "info.light",
              borderRadius: 1,
              border: "1px solid",
              borderColor: "info.main",
            }}
          >
            <Typography variant="body2" color="white">
              Esta información se utilizará para identificarte en tus pedidos y entregas.
              Asegúrate de que sea correcta.
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
}
