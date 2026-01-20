"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { MapPinHouse, Edit, User, Phone, CreditCard } from "lucide-react";
import { useCartProducts, useCartTotalPrice } from "@/application/stores/useCartStore";
import { useAddressRepository } from "@/presentation/hooks/repositories/useAddressRepository";
import { useCustomerInfoRepository } from "@/presentation/hooks/repositories/useCustomerInfoRepository";
import { useOrdersRepository } from "@/presentation/hooks/repositories/useOrdersRepository";
import { useNewOrderStore } from "@/application/stores/useNewOrderStore";
import { formatGTQ } from "@/shared/utils";
import type { CreateOrderDto } from "@/domain/entities/order.entity";

export default function Checkout() {
  const router = useRouter();
  const cartProducts = useCartProducts();
  const totalPrice = useCartTotalPrice();

  // Obtener datos del cliente y direcciones
  const { getCustomerInfo } = useCustomerInfoRepository();
  const { getAddresses } = useAddressRepository();
  const { createOrder } = useOrdersRepository();
  const { setOrder } = useNewOrderStore();

  const customerInfoQuery = getCustomerInfo();
  const addressesQuery = getAddresses();
  const createOrderMutation = createOrder();

  const customerInfo = customerInfoQuery.data;
  const addresses = addressesQuery.data || [];

  // Estado para la dirección seleccionada
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
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

  // Validación y creación de orden
  const handleCreateOrder = async () => {
    // Validar que exista información del cliente
    if (!customerInfo) {
      alert("Por favor, complete su información de contacto primero.");
      return;
    }

    // Validar que haya una dirección seleccionada
    if (!selectedAddressId || !selectedAddress) {
      alert("Por favor, seleccione una dirección de entrega.");
      return;
    }

    // Validar que haya productos en el carrito
    if (cartProducts.length === 0) {
      alert("El carrito está vacío. Agrega productos para crear una orden.");
      return;
    }

    // VALIDACIONES DE PAGO - ACTUALMENTE DESHABILITADAS
    // Descomentar estas validaciones cuando se implemente la pasarela de pago:
    /*
    const paymentMethod = document.querySelector<HTMLInputElement>(
      'input[name="payment-method"]:checked'
    );

    if (!paymentMethod) {
      alert("Por favor, seleccione un método de pago.");
      return;
    }

    const cardNumber = document.querySelector<HTMLInputElement>(
      '.number-credit-card'
    )?.value;

    if (!cardNumber || cardNumber.trim() === "") {
      alert("Por favor, ingrese el número de tarjeta.");
      return;
    }

    // Agregar más validaciones de campos de pago según sea necesario
    */

    // Crear el DTO para la orden
    const orderData: CreateOrderDto = {
      products: cartProducts.map((item) => ({
        storeLink: item.url,
        productDetails: {
          name: item.productData.title,
          description: item.productData.description || "",
          price: item.productData.price_details.calculatedPriceGtq,
          imageUrl: item.productData.images?.[0] || "",
          additionalInfo: {
            brand: item.productData.brand,
            weight: item.productData.weight,
            dimensions: item.productData.dimensions,
          },
          // TODO: Descomentar cuando el backend soporte este campo
          // productSpecification: item.productSpecification || undefined,
        },
        quantity: item.quantity,
      })),
      shippingAddressId: selectedAddressId,
      paymentMethod: "pending", // Cambiar cuando se implemente la pasarela de pago
    };

    setIsCreatingOrder(true);

    try {
      // Crear la orden
      createOrderMutation.mutate(orderData, {
        onSuccess: (response) => {
          // Guardar la orden en el store
          setOrder(response.data);
          // Navegar a order-details
          router.push("/order-details");
        },
        onError: (error: any) => {
          console.error("Error al crear la orden:", error);
          alert(
            error?.message || "Ocurrió un error al crear la orden. Intenta nuevamente."
          );
          setIsCreatingOrder(false);
        },
      });
    } catch (error) {
      console.error("Error al crear la orden:", error);
      alert("Ocurrió un error al crear la orden. Intenta nuevamente.");
      setIsCreatingOrder(false);
    }
  };

  return (
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
                <div className="payment-box" id="payment-box">
                  <div className="payment-item payment-choose-card active">
                    <label
                      htmlFor="credit-card-method"
                      className="payment-header"
                      data-bs-toggle="collapse"
                      data-bs-target="#credit-card-payment"
                      aria-controls="credit-card-payment"
                      aria-expanded="true"
                    >
                      <span className="body-md-2 fw-semibold title">
                        Select payment method
                      </span>
                      <input
                        type="radio"
                        name="payment-method"
                        className="d-none tf-check-rounded"
                        id="credit-card-method"
                        defaultChecked
                      />
                      <p className="select-payment">Mastercard</p>
                    </label>
                    <div
                      id="credit-card-payment"
                      className="collapse show"
                      data-bs-parent="#payment-box"
                    >
                      <div className="payment-body">
                        <fieldset>
                          <label>Credit Card number</label>
                          <input
                            type="text"
                            className="number-credit-card"
                            placeholder="xxxx   xxxx   xxxx   xxxx"
                          />
                        </fieldset>
                        <div className="cols">
                          <fieldset>
                            <label>Expiration date</label>
                            <input type="date" />
                          </fieldset>
                          <fieldset>
                            <label>CVV</label>
                            <input type="number" placeholder="xxx" />
                          </fieldset>
                        </div>
                        <fieldset>
                          <label>Name on card</label>
                          <input type="text" placeholder="e.g. JOHNDOE" />
                        </fieldset>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="box-btn">
                  <button
                    onClick={handleCreateOrder}
                    className="tf-btn w-100"
                    disabled={isCreatingOrder}
                    style={{ opacity: isCreatingOrder ? 0.6 : 1 }}
                  >
                    <span className="text-white">
                      {isCreatingOrder ? "Creando orden..." : "Crear orden"}
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
              <div className="">
                <p className="body-md-2 fw-semibold sub-type">Discount code</p>
                <form action="#" className="ip-discount-code style-2">
                  <input
                    type="text"
                    className="def"
                    placeholder="Your code"
                    required
                  />
                  <button type="submit" className="tf-btn btn-gray-2">
                    <span>Apply</span>
                  </button>
                </form>
              </div>
              <ul className="sec-total-price">
                <li>
                  <span className="body-text-3">Sub total</span>
                  <span className="body-text-3">{formatGTQ(totalPrice)}</span>
                </li>
                <li>
                  <span className="body-text-3">Shipping</span>
                  <span className="body-text-3">Free shipping</span>
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
  );
}
