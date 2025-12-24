"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import { Plus } from "lucide-react";
import { useAddressRepository } from "@/presentation/hooks/repositories/useAddressRepository";
import { AddressItem } from "@/presentation/components/configurations/AddressItem";
import { ConfirmationModal } from "@/presentation/components/configurations/ConfirmationModal";
import { Address } from "@/domain/entities/address.entity";

export default function AddressPage() {
  const router = useRouter();
  const { getAddresses, deleteAddress, setDefaultAddress } = useAddressRepository();
  const addressesQuery = getAddresses();

  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [defaultModalOpen, setDefaultModalOpen] = useState(false);

  const deleteMutation = deleteAddress(selectedAddressId);
  const setDefaultMutation = setDefaultAddress(selectedAddressId);
  const addresses = addressesQuery.data || [];
  const isSingleAddress = addresses.length === 1;

  const handleCreateAddress = () => {
    router.push("/configurations/address/create");
  };

  const handleEditAddress = (address: Address) => {
    router.push(`/configurations/address/edit/${address.id}`);
  };

  const handleDeleteClick = (id: string) => {
    setSelectedAddressId(id);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedAddressId) {
      deleteMutation.mutate(
        { id: selectedAddressId },
        {
          onSuccess: () => {
            setDeleteModalOpen(false);
            setSelectedAddressId(null);
          },
        }
      );
    }
  };

  const handleSetDefaultClick = (id: string) => {
    setSelectedAddressId(id);
    setDefaultModalOpen(true);
  };

  const handleSetDefaultConfirm = () => {
    if (selectedAddressId) {
      setDefaultMutation.mutate(
        { id: selectedAddressId },
        {
          onSuccess: () => {
            setDefaultModalOpen(false);
            setSelectedAddressId(null);
          },
        }
      );
    }
  };

  if (addressesQuery.isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (addressesQuery.isError) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          Error al cargar las direcciones. Por favor, intenta nuevamente.
        </Alert>
      </Box>
    );
  }
  console.log("🚀 ~ AddressPage ~ addresses:", addresses)

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Tus Direcciones
        </Typography>
        <Button
          variant="contained"
          startIcon={<Plus size={20} />}
          onClick={handleCreateAddress}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            px: 3,
          }}
        >
          Crear Dirección
        </Button>
      </Box>

      {/* Lista de direcciones */}
      {addresses.length === 0 ? (
        <Box
          sx={{
            textAlign: "center",
            py: 8,
            px: 3,
            bgcolor: "grey.50",
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
            No tienes direcciones guardadas
          </Typography>
          <Typography variant="body2" color="text.disabled" sx={{ mb: 3 }}>
            Agrega tu primera dirección de envío para continuar
          </Typography>
          <Button
            variant="contained"
            startIcon={<Plus size={20} />}
            onClick={handleCreateAddress}
            sx={{ textTransform: "none", fontWeight: 600 }}
          >
            Crear Primera Dirección
          </Button>
        </Box>
      ) : (
        <Box>
          {addresses.map((address) => (
            <AddressItem
              key={address.id}
              address={address}
              onSetDefault={handleSetDefaultClick}
              onDelete={handleDeleteClick}
              onEdit={handleEditAddress}
              isSingleAddress={isSingleAddress}
            />
          ))}
        </Box>
      )}

      {/* Modal de confirmación para eliminar */}
      <ConfirmationModal
        open={deleteModalOpen}
        title="Eliminar Dirección"
        message="¿Estás seguro de que deseas eliminar esta dirección? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setDeleteModalOpen(false);
          setSelectedAddressId(null);
        }}
        loading={deleteMutation.isLoading}
        danger
      />

      {/* Modal de confirmación para marcar como predeterminada */}
      <ConfirmationModal
        open={defaultModalOpen}
        title="Cambiar Dirección Predeterminada"
        message="¿Deseas marcar esta dirección como predeterminada? La dirección predeterminada actual se desmarcará automáticamente."
        confirmText="Cambiar"
        cancelText="Cancelar"
        onConfirm={handleSetDefaultConfirm}
        onCancel={() => {
          setDefaultModalOpen(false);
          setSelectedAddressId(null);
        }}
        loading={setDefaultMutation.isLoading}
      />
    </Box>
  );
}
