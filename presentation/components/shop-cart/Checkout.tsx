"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { MapPinHouse, Edit, User, Phone, CreditCard, CalendarDays, AlertCircle } from "lucide-react";
import { useCartProducts, useCartTotalPrice } from "@/application/stores/useCartStore";
import { useAddressRepository } from "@/presentation/hooks/repositories/useAddressRepository";
import { useCustomerInfoRepository } from "@/presentation/hooks/repositories/useCustomerInfoRepository";
import { useOrdersRepository } from "@/presentation/hooks/repositories/useOrdersRepository";
import { usePaymentRepository } from "@/presentation/hooks/repositories/usePaymentRepository";
import { useAuthStore } from "@/application/stores/useAuthStore";
import { useNewOrderStore } from "@/application/stores/useNewOrderStore";
import { formatGTQ } from "@/shared/utils";
import type { CreateOrderDto } from "@/domain/entities/order.entity";
import type { PaymentConfiguration, PaymentQuota } from "@/domain/entities/payment.entity";

// ── Tipos del formulario de tarjeta ─────────────────────────────────────────
interface CardFormState {
  cardNumber: string;     // Mostrado con espacios: "4111 1111 1111 1111"
  cardholderName: string;
  expiry: string;         // Formato "MM/AA"
  cvv: string;
}

const EMPTY_CARD_FORM: CardFormState = {
  cardNumber: "",
  cardholderName: "",
  expiry: "",
  cvv: "",
};

// ── Utilidades de seguridad ──────────────────────────────────────────────────

/** Security: extrae email del payload del JWT sin verificación de firma
 *  (la verificación real ocurre en el servidor). */
function decodeJwtEmail(token: string | null): string {
  if (!token) return "";
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(atob(base64));
    return (payload.email ?? payload.sub ?? "") as string;
  } catch {
    return "";
  }
}

/** Algoritmo de Luhn para validar el número de tarjeta. */
function luhnCheck(cardNumber: string): boolean {
  const digits = cardNumber.replace(/\D/g, "");
  if (digits.length < 13) return false;
  let sum = 0;
  let isEven = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits[i], 10);
    if (isEven) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    isEven = !isEven;
  }
  return sum % 10 === 0;
}

/** Valida todos los campos del formulario de tarjeta.
 *  Retorna un string con el error, o null si es válido. */
function validateCardForm(form: CardFormState): string | null {
  const rawNumber = form.cardNumber.replace(/\s/g, "");
  if (rawNumber.length < 13 || rawNumber.length > 19)
    return "Número de tarjeta inválido.";
  if (!luhnCheck(rawNumber))
    return "El número de tarjeta no es válido.";
  if (!form.cardholderName.trim())
    return "El nombre del titular es requerido.";

  const expiryMatch = form.expiry.match(/^(\d{2})\/(\d{2})$/);
  if (!expiryMatch)
    return "Fecha de expiración inválida. Usa el formato MM/AA.";

  const month = parseInt(expiryMatch[1], 10);
  const year = parseInt(expiryMatch[2], 10) + 2000;
  const now = new Date();
  if (month < 1 || month > 12)
    return "Mes de expiración inválido.";
  if (year < now.getFullYear() || (year === now.getFullYear() && month < now.getMonth() + 1))
    return "La tarjeta está vencida.";

  if (form.cvv.length < 3 || form.cvv.length > 4)
    return "CVV inválido (3 o 4 dígitos).";

  return null;
}

// ── Error Modal ──────────────────────────────────────────────────────────────
function ErrorModal({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div
      style={{
        position: "fixed", inset: 0,
        backgroundColor: "rgba(0,0,0,0.55)",
        zIndex: 9999,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}
    >
      <div
        style={{
          backgroundColor: "#fff", borderRadius: "16px",
          padding: "40px 32px", maxWidth: "420px", width: "90%",
          textAlign: "center", boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
        }}
      >
        <div style={{ color: "#ef4444", marginBottom: "16px", display: "flex", justifyContent: "center" }}>
          <AlertCircle size={52} strokeWidth={1.5} />
        </div>
        <h5 className="fw-bold mb-2">No se pudo realizar el pago</h5>
        <p className="body-text-3 text-main-2 mb-4">{message}</p>
        <button type="button" className="tf-btn w-100" onClick={onClose}>
          <span className="text-white">Intentar nuevamente</span>
        </button>
      </div>
    </div>
  );
}

interface PaymentMethodSelectorProps {
  selectedPaymentType: "single" | "quota";
  onSelectSingle: () => void;
  onSelectQuota: () => void;
  quotasAvailable: boolean;
  availableQuotas: PaymentQuota[];
  selectedQuota: number | null;
  onSelectQuotaValue: (v: number) => void;
  isConfigError: boolean;
  paymentConfig: PaymentConfiguration | undefined;
}

function PaymentMethodSelector({
  selectedPaymentType,
  onSelectSingle,
  onSelectQuota,
  quotasAvailable,
  availableQuotas,
  selectedQuota,
  onSelectQuotaValue,
  isConfigError,
  paymentConfig,
}: PaymentMethodSelectorProps) {
  const isSingle = selectedPaymentType === "single";
  const isQuota = selectedPaymentType === "quota";

  const quotaBgColor = quotasAvailable
    ? isQuota ? "#eff6ff" : "#fff"
    : "#f9fafb";

  const quotaDescription = (() => {
    if (isConfigError) return "No disponible en este momento.";
    if (!quotasAvailable && paymentConfig) {
      return `Disponible para compras mayores a ${formatGTQ(paymentConfig.amount_min_quotas)}.`;
    }
    return "Paga en cuotas mensuales con 0% interés.";
  })();

  return (
    <div style={{ marginBottom: "28px" }}>
      <p className="body-md-2 fw-semibold mb-1">Método de Pago</p>
      <p className="body-text-3 text-main-2 mb-3">Selecciona cómo te gustaría pagar tu orden.</p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        {/* Card: Pago Único */}
        <button
          type="button"
          onClick={onSelectSingle}
          style={{
            border: `2px solid ${isSingle ? "var(--primary)" : "#e5e7eb"}`,
            borderRadius: "12px",
            padding: "20px",
            cursor: "pointer",
            backgroundColor: isSingle ? "#eff6ff" : "#fff",
            transition: "all 0.2s ease",
            textAlign: "left",
            width: "100%",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
            <CreditCard size={24} style={{ color: "var(--primary)" }} />
            <div style={{
              width: "18px", height: "18px", borderRadius: "50%",
              border: `2px solid ${isSingle ? "var(--primary)" : "#ccc"}`,
              backgroundColor: isSingle ? "var(--primary)" : "transparent",
              flexShrink: 0,
            }} />
          </div>
          <p className="body-md-2 fw-bold mb-1">Pago Único</p>
          <p className="body-text-3 text-main-2 mb-0">Paga el monto total ahora sin intereses.</p>
        </button>

        {/* Card: Cuotas sin Interés */}
        <button
          type="button"
          onClick={onSelectQuota}
          disabled={!quotasAvailable}
          style={{
            border: `2px solid ${isQuota ? "var(--primary)" : "#e5e7eb"}`,
            borderRadius: "12px",
            padding: "20px",
            cursor: quotasAvailable ? "pointer" : "not-allowed",
            backgroundColor: quotaBgColor,
            opacity: quotasAvailable ? 1 : 0.55,
            transition: "all 0.2s ease",
            textAlign: "left",
            width: "100%",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
            <CalendarDays size={24} style={{ color: quotasAvailable ? "var(--primary)" : "#9ca3af" }} />
            <div style={{
              width: "18px", height: "18px", borderRadius: "50%",
              border: `2px solid ${isQuota ? "var(--primary)" : "#ccc"}`,
              backgroundColor: isQuota ? "var(--primary)" : "transparent",
              flexShrink: 0,
            }} />
          </div>
          <p className="body-md-2 fw-bold mb-1">Cuotas sin Interés</p>
          <p className="body-text-3 text-main-2 mb-0">{quotaDescription}</p>
        </button>
      </div>

      {/* Dropdown de cuotas */}
      {isQuota && availableQuotas.length > 0 && (
        <div style={{ marginTop: "16px" }}>
          <label htmlFor="quota-select" className="body-md-2 fw-semibold mb-2" style={{ display: "block" }}>
            Selecciona tu plan de cuotas
          </label>
          <div className="tf-select">
            <select
              id="quota-select"
              value={selectedQuota ?? availableQuotas[0].ncuotas}
              onChange={(e) => onSelectQuotaValue(Number(e.target.value))}
              style={{ width: "100%", padding: "12px", borderRadius: "6px", border: "1px solid #e5e7eb" }}
            >
              {availableQuotas.map((q) => (
                <option key={q.ncuotas} value={q.ncuotas}>
                  {q.ncuotas} cuotas
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Checkout() {
  const router = useRouter();
  const cartProducts = useCartProducts();
  const totalPrice = useCartTotalPrice();

  // Obtener datos del cliente y direcciones
  const { getCustomerInfo } = useCustomerInfoRepository();
  const { getAddresses } = useAddressRepository();
  const { createOrder } = useOrdersRepository();
  const { setOrder } = useNewOrderStore();
  const { getPaymentConfiguration, processPayment } = usePaymentRepository();

  // Security: token leído desde el store (nunca de localStorage directamente)
  const accessToken = useAuthStore((state) => state.accessToken);

  const customerInfoQuery = getCustomerInfo();
  const addressesQuery = getAddresses();
  // Silent: desactivamos snackbars, manejamos errores con el modal
  const createOrderMutation = createOrder(true);
  const processPaymentMutation = processPayment();
  const paymentConfigQuery = getPaymentConfiguration();

  const customerInfo = customerInfoQuery.data;
  const addresses = addressesQuery.data || [];

  // Configuración de pago
  const paymentConfig = paymentConfigQuery.data?.data?.[0];
  const quotasAvailable =
    !paymentConfigQuery.isError &&
    paymentConfig?.active_quota === "true" &&
    totalPrice >= (paymentConfig?.amount_min_quotas ?? 0);
  const availableQuotas = paymentConfig?.quotas ?? [];

  // Estado para la dirección seleccionada
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");

  // Estado del flujo de pago
  const [processingStep, setProcessingStep] = useState<"order" | "payment" | null>(null);
  const [errorModal, setErrorModal] = useState<{ show: boolean; message: string }>({
    show: false,
    message: "",
  });

  // Estado para método de pago
  const [selectedPaymentType, setSelectedPaymentType] = useState<"single" | "quota">("single");
  const [selectedQuota, setSelectedQuota] = useState<number | null>(null);

  // Security: datos sensibles de tarjeta en estado local — nunca persistidos
  const [cardForm, setCardForm] = useState<CardFormState>(EMPTY_CARD_FORM);

  const selectedAddress = addresses.find((addr) => addr.id === selectedAddressId);

  // Seleccionar la dirección por defecto al cargar
  useEffect(() => {
    if (addresses.length > 0 && !selectedAddressId) {
      const defaultAddress = addresses.find((addr) => addr.isDefault);
      if (defaultAddress) {
        setSelectedAddressId(defaultAddress.id);
      } else {
        // Si no hay dirección por defecto, seleccionar la primera
        setSelectedAddressId(addresses[0].id);
      }
    }
  }, [addresses, selectedAddressId]);

  // Función para truncar texto
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  // Función para editar dirección
  const handleEditAddress = () => {
    if (selectedAddressId) {
      // Guardar la ruta actual para volver después de editar
      sessionStorage.setItem("redirectAfterAddressEdit", "/checkout");
      router.push(`/configurations/address/edit/${selectedAddressId}`);
    }
  };

  // Manejadores de los campos de tarjeta (controlados y sanitizados)
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Security: solo dígitos, máximo 16, luego formateado con espacios
    const digits = e.target.value.replace(/\D/g, "").slice(0, 16);
    const formatted = digits.replace(/(\d{4})(?=\d)/g, "$1 ");
    setCardForm((prev) => ({ ...prev, cardNumber: formatted }));
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 4);
    const formatted = raw.length > 2 ? `${raw.slice(0, 2)}/${raw.slice(2)}` : raw;
    setCardForm((prev) => ({ ...prev, expiry: formatted }));
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Security: solo dígitos, máximo 4
    const digits = e.target.value.replace(/\D/g, "").slice(0, 4);
    setCardForm((prev) => ({ ...prev, cvv: digits }));
  };

  // Creación de orden + procesamiento de pago (flujo de dos pasos)
  const handleCreateOrder = async () => {
    if (!customerInfo) {
      alert("Por favor, complete su información de contacto primero.");
      return;
    }
    if (!selectedAddressId || !selectedAddress) {
      alert("Por favor, seleccione una dirección de entrega.");
      return;
    }
    if (cartProducts.length === 0) {
      alert("El carrito está vacío. Agrega productos para crear una orden.");
      return;
    }

    // Security: validar tarjeta antes de cualquier llamada a la API
    const cardError = validateCardForm(cardForm);
    if (cardError) {
      setErrorModal({ show: true, message: cardError });
      return;
    }

    setProcessingStep("order");

    try {
      // ── Paso 1: Crear la orden ─────────────────────────────────────────
      const orderData: CreateOrderDto = {
        products: cartProducts.map((item) => ({
          storeLink: item.url,
          store: item.store,
          productDetails: {
            name: item.productData.title,
            description: item.productData.description || "",
            price: item.productData.price,
            imageUrl: item.productData.images?.[0] || "",
            additionalInfo: {},
            productSpecification: item.productSpecification, // <-- Nuevo
            priceDetails: item.productData.price_details,
          },
          quantity: item.quantity,
        })),
        shippingAddressId: selectedAddressId,
        paymentMethod: selectedPaymentType === "quota" ? "cuotas" : "contado",
      };

      const orderResponse = await createOrderMutation.mutateAsync(orderData);
      const orderId = orderResponse.data.orderId;

      // ── Paso 2: Procesar el pago ───────────────────────────────────────
      setProcessingStep("payment");

      const nameParts = (customerInfo.recipientName ?? "").trim().split(" ");
      const firstName = nameParts[0] ?? "";
      const lastName = nameParts.slice(1).join(" ") || firstName;
      const [expirationMonth, expirationYear] = cardForm.expiry.split("/");

      await processPaymentMutation.mutateAsync({
        orderId,
        paymentCode: paymentConfig?.payment_code ?? "PAGALO",
        paymentMethod: "card",
        businessUuid: paymentConfig?.business_uuid ?? "",
        ...(selectedPaymentType === "quota" && selectedQuota ? { installments: selectedQuota } : {}),
        cardData: {
          // Security: eliminar espacios antes de enviar
          cardNumber: cardForm.cardNumber.replace(/\s/g, ""),
          expirationMonth: (expirationMonth ?? "").trim(),
          expirationYear: (expirationYear ?? "").trim(),
          cvv: cardForm.cvv,
          cardholderName: cardForm.cardholderName.trim().toUpperCase(),
        },
        customerData: {
          firstName,
          lastName,
          email: customerInfo.email,
          phone: customerInfo.phoneNumber.replace(/\D/g, ""),
          country: selectedAddress.countryCode,
          city: selectedAddress.city,
          state: selectedAddress.stateProvince,
          postalCode: selectedAddress.postalCode,
          address: selectedAddress.address,
        },
      });

      // ── Éxito ──────────────────────────────────────────────────────────
      setOrder(orderResponse.data);
      router.push("/order-details");
    } catch (error: unknown) {
      const msg =
        error instanceof Error
          ? error.message
          : "No se pudo realizar el pago. Por favor intente nuevamente.";
      setErrorModal({ show: true, message: msg });
    } finally {
      // Security: limpiar datos sensibles de tarjeta SIEMPRE (éxito o error)
      setCardForm(EMPTY_CARD_FORM);
      setProcessingStep(null);
    }
  };

  return (
    <>
      {errorModal.show && (
        <ErrorModal
          message={errorModal.message}
          onClose={() => setErrorModal({ show: false, message: "" })}
        />
      )}
      <section className="tf-sp-2">
        <div className="container">
          <div className="checkout-status tf-sp-2 pt-0">
            <div className="checkout-wrap">
              <span className="checkout-bar next" />
              <div className="step-payment">
                <span className="icon">
                  <i className="icon-shop-cart-1" />
                </span>
                <Link href={`/shop-cart`} className="link body-text-3">
                  Shopping Cart
                </Link>
              </div>
              <div className="step-payment">
                <span className="icon">
                  <i className="icon-shop-cart-2" />
                </span>
                <Link
                  href={`/checkout`}
                  className="text-secondary link body-text-3"
                >
                  Shopping &amp; Checkout
                </Link>
              </div>
              <div className="step-payment">
                <span className="icon">
                  <i className="icon-shop-cart-3" />
                </span>
                <Link href={`/order-details`} className="link body-text-3">
                  Confirmation
                </Link>
              </div>
            </div>
          </div>
          <div className="tf-checkout-wrap flex-lg-nowrap">
            <div className="page-checkout">
              {/* SECCIÓN DE CONTACTO */}
              <div className="wrap">
                <h5 className="title has-account">
                  <span className="fw-semibold">Contact</span>
                </h5>
                {customerInfoQuery.isLoading ? (
                  <div className="p-4 text-center">
                    <p>Cargando información del cliente...</p>
                  </div>
                ) : customerInfo ? (
                  <div
                    className="customer-info-card"
                    style={{
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      padding: "20px",
                      backgroundColor: "#f9fafb",
                    }}
                  >
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <User size={20} style={{ color: "var(--primary)" }} />
                        <div>
                          <p className="body-text-3 text-main-2 mb-0">Nombre</p>
                          <p className="body-md-2 fw-semibold mb-0">
                            {customerInfo.recipientName}
                          </p>
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <Phone size={20} style={{ color: "var(--primary)" }} />
                        <div>
                          <p className="body-text-3 text-main-2 mb-0">Teléfono</p>
                          <p className="body-md-2 fw-semibold mb-0">
                            {customerInfo.phoneNumber}
                          </p>
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <CreditCard size={20} style={{ color: "var(--primary)" }} />
                        <div>
                          <p className="body-text-3 text-main-2 mb-0">NIT/DPI</p>
                          <p className="body-md-2 fw-semibold mb-0">
                            {customerInfo.identificationNumber}
                          </p>
                        </div>
                      </div>
                    </div>
                    <p className="caption text-main-2 font-2 mt-3 mb-0">
                      La información de la orden será enviada a tu correo electrónico
                    </p>
                  </div>
                ) : (
                  <div className="p-4 text-center">
                    <p>No se encontró información del cliente</p>
                  </div>
                )}
              </div>

              {/* SECCIÓN DE ENTREGA */}
              <div className="wrap">
                <h5 className="title fw-semibold">Delivery</h5>
                {addressesQuery.isLoading ? (
                  <div className="p-4 text-center">
                    <p>Cargando direcciones...</p>
                  </div>
                ) : addresses.length > 0 ? (
                  <div>
                    {/* Select de direcciones */}
                    <div style={{ marginBottom: "20px" }}>
                      <label className="body-md-2 fw-semibold mb-2">
                        Selecciona tu dirección de entrega
                      </label>
                      <div className="tf-select">
                        <select
                          value={selectedAddressId}
                          onChange={(e) => setSelectedAddressId(e.target.value)}
                          style={{
                            width: "100%",
                            padding: "12px",
                            borderRadius: "6px",
                            border: "1px solid #e5e7eb",
                          }}
                        >
                          {addresses.map((address) => (
                            <option key={address.id} value={address.id}>
                              {address.alias} - {truncateText(address.address, 15)}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Card con detalles de la dirección seleccionada */}
                    {selectedAddress && (
                      <div
                        className="address-detail-card"
                        style={{
                          border: "1px solid #e5e7eb",
                          borderRadius: "8px",
                          padding: "20px",
                          backgroundColor: "#f9fafb",
                          position: "relative",
                        }}
                      >
                        <div style={{ display: "flex", gap: "15px", marginBottom: "15px" }}>
                          <MapPinHouse
                            size={24}
                            style={{ color: "var(--primary)", flexShrink: 0 }}
                          />
                          <div style={{ flex: 1 }}>
                            <h6 className="fw-semibold mb-2">{selectedAddress.alias}</h6>
                            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                              <div>
                                <p className="body-text-3 text-main-2 mb-0">Dirección</p>
                                <p className="body-md-2 mb-0">{selectedAddress.address}</p>
                              </div>
                              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                                <div>
                                  <p className="body-text-3 text-main-2 mb-0">Ciudad</p>
                                  <p className="body-md-2 mb-0">{selectedAddress.city}</p>
                                </div>
                                <div>
                                  <p className="body-text-3 text-main-2 mb-0">
                                    Código Postal
                                  </p>
                                  <p className="body-md-2 mb-0">
                                    {selectedAddress.postalCode}
                                  </p>
                                </div>
                              </div>
                              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                                <div>
                                  <p className="body-text-3 text-main-2 mb-0">
                                    Departamento
                                  </p>
                                  <p className="body-md-2 mb-0">
                                    {selectedAddress.stateProvince}
                                  </p>
                                </div>
                                <div>
                                  <p className="body-text-3 text-main-2 mb-0">País</p>
                                  <p className="body-md-2 mb-0">
                                    {selectedAddress.countryCode}
                                  </p>
                                </div>
                              </div>
                              {selectedAddress.additionalSpecifications && (
                                <div>
                                  <p className="body-text-3 text-main-2 mb-0">
                                    Información adicional
                                  </p>
                                  <p className="body-md-2 mb-0">
                                    {selectedAddress.additionalSpecifications}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={handleEditAddress}
                          className="tf-btn btn-gray-2"
                          style={{
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "8px",
                          }}
                        >
                          <Edit size={18} />
                          <span>Editar dirección</span>
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-4 text-center">
                    <p>No tienes direcciones registradas</p>
                    <Link
                      href="/configurations/address/create"
                      className="tf-btn mt-3"
                    >
                      Crear Dirección
                    </Link>
                  </div>
                )}
              </div>

              {/* SECCIÓN DE PAGO */}
              <div className="wrap">
                <h5 className="title">Payment</h5>
                <form action="#" className="form-payment">

                  {/* SELECTOR DE MÉTODO DE PAGO */}
                  <PaymentMethodSelector
                    selectedPaymentType={selectedPaymentType}
                    onSelectSingle={() => setSelectedPaymentType("single")}
                    onSelectQuota={() => {
                      setSelectedPaymentType("quota");
                      if (availableQuotas.length > 0 && selectedQuota === null) {
                        setSelectedQuota(availableQuotas[0].ncuotas);
                      }
                    }}
                    quotasAvailable={quotasAvailable}
                    availableQuotas={availableQuotas}
                    selectedQuota={selectedQuota}
                    onSelectQuotaValue={(v) => setSelectedQuota(v)}
                    isConfigError={paymentConfigQuery.isError}
                    paymentConfig={paymentConfig}
                  />

                  {/* Formulario de datos de tarjeta (controlado y seguro) */}
                  <div className="payment-body">
                    <fieldset>
                      <label htmlFor="card-number">Número de tarjeta</label>
                      {/* Security: inputMode="numeric" + type="text" evita autocompletado
                        agresivo y no muestra flechas de incremento del navegador */}
                      <input
                        id="card-number"
                        type="text"
                        inputMode="numeric"
                        autoComplete="cc-number"
                        placeholder="0000 0000 0000 0000"
                        maxLength={19}
                        value={cardForm.cardNumber}
                        onChange={handleCardNumberChange}
                      />
                    </fieldset>
                    <fieldset>
                      <label htmlFor="cardholder-name">Nombre del titular</label>
                      <input
                        id="cardholder-name"
                        type="text"
                        autoComplete="cc-name"
                        placeholder="JOHN DOE"
                        maxLength={60}
                        value={cardForm.cardholderName}
                        onChange={(e) =>
                          setCardForm((prev) => ({ ...prev, cardholderName: e.target.value }))
                        }
                      />
                    </fieldset>
                    <div className="cols">
                      <fieldset>
                        <label htmlFor="card-expiry">Vencimiento</label>
                        <input
                          id="card-expiry"
                          type="text"
                          inputMode="numeric"
                          autoComplete="cc-exp"
                          placeholder="MM/AA"
                          maxLength={5}
                          value={cardForm.expiry}
                          onChange={handleExpiryChange}
                        />
                      </fieldset>
                      <fieldset>
                        <label htmlFor="card-cvv">CVV</label>
                        {/* Security: type="password" oculta el CVV visualmente */}
                        <input
                          id="card-cvv"
                          type="password"
                          inputMode="numeric"
                          autoComplete="cc-csc"
                          placeholder="•••"
                          maxLength={4}
                          value={cardForm.cvv}
                          onChange={handleCvvChange}
                        />
                      </fieldset>
                    </div>
                  </div>

                  <div className="box-btn">
                    <button
                      type="button"
                      onClick={handleCreateOrder}
                      className="tf-btn w-100"
                      disabled={processingStep !== null}
                      style={{ opacity: processingStep !== null ? 0.6 : 1, marginTop: 20 }}
                    >
                      <span className="text-white">
                        {processingStep === "order"
                          ? "Creando orden..."
                          : processingStep === "payment"
                            ? "Procesando pago..."
                            : "Crear orden"}
                      </span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
            <div className="flat-sidebar-checkout">
              <div className="sidebar-checkout-content">
                <h5 className="fw-semibold">Order Summary</h5>
                {cartProducts.length ? (
                  <ul className="list-product">
                    {cartProducts.map((product, i) => (
                      <li key={i} className="item-product">
                        <a href="#" className="img-product">
                          <Image
                            alt=""
                            src={product.productData.images?.[0] || "/images/product/default.jpg"}
                            width={500}
                            height={500}
                          />
                        </a>
                        <div className="content-box">
                          <a
                            href="#"
                            className="link-secondary body-md-2 fw-semibold"
                          >
                            {product.productData.title}
                          </a>
                          <p className="price-quantity price-text fw-semibold">
                            {formatGTQ(product.productData.price_details.calculatedPriceGtq)}
                            <span className="body-md-2 text-main-2 fw-normal">
                              X{product.quantity}
                            </span>
                          </p>
                          <p className="body-md-2 text-main-2">{product.productData.brand}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="p-4">
                    <div className="col-4">
                      Your Cart is empty. Start adding favorite products to cart!{" "}
                    </div>
                    <Link
                      className="tf-btn mt-2 mb-3 text-white"
                      style={{ width: "fit-content" }}
                      href="/shop-default"
                    >
                      Explore Products
                    </Link>
                  </div>
                )}
                <ul className="sec-total-price">
                  <li>
                    <span className="body-text-3">Sub total</span>
                    <span className="body-text-3">{formatGTQ(totalPrice)}</span>
                  </li>
                  <li>
                    <span className="body-md-2 fw-semibold">Total</span>
                    <span className="body-md-2 fw-semibold text-primary">
                      {formatGTQ(totalPrice)}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
