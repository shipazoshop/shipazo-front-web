import React, { useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { Trash2, Edit } from "lucide-react";
import { Address } from "@/domain/entities/address.entity";

interface AddressItemProps {
  address: Address;
  onSetDefault: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (address: Address) => void;
  isSingleAddress: boolean;
}

export function AddressItem({
  address,
  onSetDefault,
  onDelete,
  onEdit,
  isSingleAddress,
}: AddressItemProps) {
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const handleToggleDefault = () => {
    // Si es la única dirección o ya está marcada como predeterminada, no hacer nada
    if (isSingleAddress || address.isDefault) {
      return;
    }
    onSetDefault(address.id);
  };

  return (
    <Card
      sx={{
        mb: 2,
        border: address.isDefault ? 2 : 1,
        borderColor: address.isDefault ? "primary.main" : "divider",
        boxShadow: address.isDefault ? 3 : 1,
        transition: "all 0.2s",
        "&:hover": {
          boxShadow: 4,
        },
      }}
    >
      <CardContent>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          {/* Información de la dirección */}
          <Box sx={{ flex: 1, mr: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              {address.alias}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 1 }}
              title={address.address}
            >
              {truncateText(address.address, 90)}
            </Typography>
            <Typography variant="caption" color="text.disabled">
              {address.city}, {address.stateProvince} - CP: {address.postalCode}
            </Typography>
          </Box>

          {/* Controles */}
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 1 }}>
            {/* Switch de predeterminado */}
            <Tooltip
              title={
                isSingleAddress
                  ? "No puedes desmarcar la única dirección"
                  : address.isDefault
                    ? "Esta es tu dirección predeterminada"
                    : "Marcar como predeterminada"
              }
            >
              <FormControlLabel
                control={
                  <Switch
                    checked={address.isDefault}
                    onChange={handleToggleDefault}
                    disabled={isSingleAddress}
                    color="primary"
                  />
                }
                label={
                  <Typography variant="caption" sx={{ fontWeight: 500 }}>
                    Predeterminada
                  </Typography>
                }
                labelPlacement="start"
                sx={{ m: 0 }}
              />
            </Tooltip>

            {/* Botones de acción */}
            <Box sx={{ display: "flex", gap: 0.5 }}>
              <Tooltip title="Editar dirección">
                <IconButton
                  size="small"
                  color="primary"
                  onClick={() => onEdit(address)}
                  sx={{
                    "&:hover": {
                      bgcolor: "primary.light",
                      color: "white",
                    },
                  }}
                >
                  <Edit size={18} />
                </IconButton>
              </Tooltip>

              <Tooltip title="Eliminar dirección">
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => onDelete(address.id)}
                  sx={{
                    "&:hover": {
                      bgcolor: "error.light",
                      color: "white",
                    },
                  }}
                >
                  <Trash2 size={18} />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
