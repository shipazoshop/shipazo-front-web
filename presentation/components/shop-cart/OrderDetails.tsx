"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useNewOrderStore } from "@/application/stores/useNewOrderStore";
import { formatGTQ } from "@/shared/utils";

export default function OrderDetails() {
  const router = useRouter();
  const order = useNewOrderStore((state) => state.order);
  const clearOrder = useNewOrderStore((state) => state.clearOrder);

  // Si no hay orden, redirigir al home
  useEffect(() => {
    if (!order) {
      router.push("/home");
    }
  }, [order, router]);

  // Limpiar la orden cuando el componente se desmonte
  useEffect(() => {
    return () => {
      clearOrder();
    };
  }, [clearOrder]);

  if (!order) {
    return null;
  }

  return (
    <section className="tf-sp-2">
      <div className="container">
        <div className="checkout-status tf-sp-2 pt-0">
          <div className="checkout-wrap">
            <span className="checkout-bar end" />
            <div className="step-payment">
              <span className="icon">
                <i className="icon-shop-cart-1" />
              </span>
              <Link href={`/shop-cart`} className="link-secondary body-text-3">
                Shopping Cart
              </Link>
            </div>
            <div className="step-payment">
              <span className="icon">
                <i className="icon-shop-cart-2" />
              </span>
              <Link href={`/checkout`} className="link-secondary body-text-3">
                Shopping &amp; Checkout
              </Link>
            </div>
            <div className="step-payment">
              <span className="icon">
                <i className="icon-shop-cart-3" />
              </span>
              <Link
                href={`/order-details`}
                className="text-secondary body-text-3"
              >
                Confirmation
              </Link>
            </div>
          </div>
        </div>
        <div className="tf-order-detail">
          <div className="order-notice">
            <span className="icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={30}
                height={30}
                fill="#ffffff"
                viewBox="0 0 256 256"
              >
                <path d="M225.86,102.82c-3.77-3.94-7.67-8-9.14-11.57-1.36-3.27-1.44-8.69-1.52-13.94-.15-9.76-.31-20.82-8-28.51s-18.75-7.85-28.51-8c-5.25-.08-10.67-.16-13.94-1.52-3.56-1.47-7.63-5.37-11.57-9.14C146.28,23.51,138.44,16,128,16s-18.27,7.51-25.18,14.14c-3.94,3.77-8,7.67-11.57,9.14C88,40.64,82.56,40.72,77.31,40.8c-9.76.15-20.82.31-28.51,8S41,67.55,40.8,77.31c-.08,5.25-.16,10.67-1.52,13.94-1.47,3.56-5.37,7.63-9.14,11.57C23.51,109.72,16,117.56,16,128s7.51,18.27,14.14,25.18c3.77,3.94,7.67,8,9.14,11.57,1.36,3.27,1.44,8.69,1.52,13.94.15,9.76.31,20.82,8,28.51s18.75,7.85,28.51,8c5.25.08,10.67.16,13.94,1.52,3.56,1.47,7.63,5.37,11.57,9.14C109.72,232.49,117.56,240,128,240s18.27-7.51,25.18-14.14c3.94-3.77,8-7.67,11.57-9.14,3.27-1.36,8.69-1.44,13.94-1.52,9.76-.15,20.82-.31,28.51-8s7.85-18.75,8-28.51c.08-5.25.16-10.67,1.52-13.94,1.47-3.56,5.37-7.63,9.14-11.57C232.49,146.28,240,138.44,240,128S232.49,109.73,225.86,102.82Zm-11.55,39.29c-4.79,5-9.75,10.17-12.38,16.52-2.52,6.1-2.63,13.07-2.73,19.82-.1,7-.21,14.33-3.32,17.43s-10.39,3.22-17.43,3.32c-6.75.1-13.72.21-19.82,2.73-6.35,2.63-11.52,7.59-16.52,12.38S132,224,128,224s-9.15-4.92-14.11-9.69-10.17-9.75-16.52-12.38c-6.1-2.52-13.07-2.63-19.82-2.73-7-.1-14.33-.21-17.43-3.32s-3.22-10.39-3.32-17.43c-.1-6.75-.21-13.72-2.73-19.82-2.63-6.35-7.59-11.52-12.38-16.52S32,132,32,128s4.92-9.15,9.69-14.11,9.75-10.17,12.38-16.52c2.52-6.1,2.63-13.07,2.73-19.82.1-7,.21-14.33,3.32-17.43S70.51,56.9,77.55,56.8c6.75-.1,13.72-.21,19.82-2.73,6.35-2.63,11.52-7.59,16.52-12.38S124,32,128,32s9.15,4.92,14.11,9.69,10.17,9.75,16.52,12.38c6.1,2.52,13.07,2.63,19.82,2.73,7,.1,14.33.21,17.43,3.32s3.22,10.39,3.32,17.43c.1,6.75.21,13.72,2.73,19.82,2.63,6.35,7.59,11.52,12.38,16.52S224,124,224,128,219.08,137.15,214.31,142.11ZM173.66,98.34a8,8,0,0,1,0,11.32l-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35A8,8,0,0,1,173.66,98.34Z" />
              </svg>
            </span>
            <p>Gracias. Tu orden ha sido recibida.</p>
          </div>
          <ul className="order-overview-list">
            <li>
              Número de orden: <strong>{order.orderNumber}</strong>
            </li>
            <li>
              Fecha:{" "}
              <strong>
                {new Date(order.createdAt).toLocaleDateString("es-GT", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </strong>
            </li>
            <li>
              Total: <strong>{formatGTQ(order.totalAmount)}</strong>
            </li>
            <li>
              Método de pago: <strong>{order.paymentMethod}</strong>
            </li>
          </ul>
          <div className="order-detail-wrap">
            <h5 className="fw-bold">Detalles de la orden</h5>
            <table className="tf-table-order-detail">
              <thead>
                <tr>
                  <td>
                    <h6 className="fw-semibold">Producto</h6>
                  </td>
                  <td>
                    <h6 className="fw-semibold">Total</h6>
                  </td>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr key={item.itemId} className="tf-order-item">
                    <td className="tf-order-item_product">
                      <span className="link fw-normal">
                        {item.productDetails.name}
                        <span className="text-black"> ×{item.quantity}</span>
                      </span>
                    </td>
                    <td>
                      <span className="fw-medium">{formatGTQ(item.subtotal)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <th>
                    <span>Subtotal:</span>
                  </th>
                  <td>
                    <span>{formatGTQ(order.subtotalAmount)}</span>
                  </td>
                </tr>
                <tr>
                  <th>
                    <span>Envío:</span>
                  </th>
                  <td>
                    <span>
                      {order.shippingCost === 0
                        ? "Envío gratuito"
                        : formatGTQ(order.shippingCost)}
                    </span>
                  </td>
                </tr>
                <tr>
                  <th>
                    <span>Impuestos:</span>
                  </th>
                  <td>
                    <span>{formatGTQ(order.taxAmount)}</span>
                  </td>
                </tr>
                <tr>
                  <th>
                    <span>Método de pago:</span>
                  </th>
                  <td>
                    <span>{order.paymentMethod}</span>
                  </td>
                </tr>
                <tr>
                  <th>
                    <p className="fw-semibold product-title text-uppercase">
                      Total:
                    </p>
                  </th>
                  <td>
                    <span className="fw-semibold">{formatGTQ(order.totalAmount)}</span>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="row gap-30 gap-sm-0">
            <div className="col-sm-12 col-12">
              <div className="order-detail-wrap">
                <h5 className="fw-bold">Dirección de envío</h5>
                <div className="billing-info">
                  <p>{order.shippingAddress.fullAddress}</p>
                  <p>Código postal: {order.shippingAddress.postalCode}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="row gap-30 gap-sm-0 mt-4">
            <div className="col-12 d-flex gap-3 justify-content-center">
              <Link
                href={`/orders/${order.orderId}`}
                className="tf-btn btn-fill radius-4"
                style={{ minWidth: "200px" }}
              >
                Ver detalles completos
              </Link>
              <Link
                href="/home"
                className="tf-btn btn-gray-2 radius-4"
                style={{ minWidth: "200px" }}
              >
                Continuar comprando
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
