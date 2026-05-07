"use client";
import React from "react";

interface TestimonialItem {
  name: string;
  city: string;
  rating: number;
  body: string;
  product: string;
  avatar: string;
  color: string;
}

const TESTIMONIALS: TestimonialItem[] = [
  {
    name: "Karla Mendoza",
    city: "Lima · Miraflores",
    rating: 5,
    body: "Compré mis zapatillas Nike directo de Estados Unidos y llegaron en 7 días. El precio total fue exactamente lo que me cotizaron, sin sorpresas en aduana.",
    product: "Nike · Sneakers",
    avatar: "K",
    color: "linear-gradient(135deg, #dc6f34, #f4a261)",
  },
  {
    name: "Joaquín Vargas",
    city: "Arequipa",
    rating: 5,
    body: "Llevo 4 pedidos y todos perfectos. Lo que más me gusta es el tracking en tiempo real, te avisan por WhatsApp en cada paso. Ya no compro de otra forma.",
    product: "Amazon · Electrónica",
    avatar: "J",
    color: "linear-gradient(135deg, #562b7f, #6a3a99)",
  },
  {
    name: "Mariana Quispe",
    city: "Cusco",
    rating: 5,
    body: "Pedí maquillaje de Sephora que aquí cuesta el doble. Llegó en una semana, original y bien empacado. El soporte por WhatsApp es buenísimo, me respondieron en 5 minutos.",
    product: "Sephora · Beauty",
    avatar: "M",
    color: "linear-gradient(135deg, #f4a261, #dc6f34)",
  },
  {
    name: "Andrés Chávez",
    city: "Trujillo",
    rating: 5,
    body: "Compré un drone que costaba 40% menos en eBay. El cotizador me dio el precio total al toque, pagué en soles y listo. Nada de tarjetas internacionales.",
    product: "eBay · Tech",
    avatar: "A",
    color: "linear-gradient(135deg, #562b7f, #dc6f34)",
  },
  {
    name: "Camila Rojas",
    city: "Lima · Surco",
    rating: 5,
    body: "La interfaz es súper simple. Pegas el link, te dice cuánto cuesta todo y compras. Me ayudaron incluso a confirmar la talla antes de procesar el pedido.",
    product: "Shein · Moda",
    avatar: "C",
    color: "linear-gradient(135deg, #6a3a99, #562b7f)",
  },
  {
    name: "Diego Salas",
    city: "Piura",
    rating: 5,
    body: "Hace tiempo quería un teclado mecánico que solo se vendía en Best Buy. Shipazo lo trajo en 9 días con seguro incluido. La calidad del servicio supera mis expectativas.",
    product: "Best Buy · Gaming",
    avatar: "D",
    color: "linear-gradient(135deg, #dc6f34, #562b7f)",
  },
];

function TestiCard({ t }: Readonly<{ t: TestimonialItem }>) {
  return (
    <div className="tv8-card">
      <div className="tv8-quote" aria-hidden="true">"</div>
      <div className="tv8-stars">{"★".repeat(t.rating)}</div>
      <p className="tv8-body">{t.body}</p>
      <div className="tv8-who">
        <span className="tv8-avatar" style={{ background: t.color }}>{t.avatar}</span>
        <div>
          <div className="tv8-name">{t.name}</div>
          <div className="tv8-meta">{t.city}</div>
        </div>
      </div>
      <div className="tv8-product">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
        </svg>
        {t.product}
      </div>
    </div>
  );
}

export default function TestimonialsV8() {
  return (
    <>
      <section className="tv8-section">
        {/* Header */}
        <div className="tv8-head">
          <div className="tv8-head-left">
            <div className="hv8-section-eyebrow">Lo que dicen quienes ya compraron</div>
            <h2 className="tv8-h2">
              Historias reales,{" "}
              <span className="tv8-acc">compras felices.</span>
            </h2>
            <p className="tv8-sub">
              Más de 12,400 personas en Perú confían en Shipazo para traer lo que buscan, sin complicaciones.
            </p>
          </div>
          <div className="tv8-head-right">
            <div className="tv8-agg-stars">★★★★★</div>
            <div className="tv8-agg-num">4.9 / 5</div>
            <div className="tv8-agg-lb">Basado en 3,200+ reseñas</div>
          </div>
        </div>

        {/* Grid 3×2 */}
        <div className="tv8-grid">
          {TESTIMONIALS.map((t) => (
            <TestiCard key={t.name} t={t} />
          ))}
        </div>
      </section>

      <style>{`
        .tv8-section {
          padding: 80px 40px;
          max-width: 1280px;
          margin: 0 auto;
        }

        .tv8-head {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 40px;
          gap: 32px;
          flex-wrap: wrap;
        }

        .tv8-h2 {
          font-family: var(--font-archivo-black), 'Archivo Black', system-ui, sans-serif;
          font-weight: 900;
          font-size: clamp(28px, 4vw, 52px);
          line-height: 1;
          letter-spacing: -0.02em;
          margin: 12px 0 0;
          color: white;
        }

        .tv8-acc {
          background: linear-gradient(135deg, #dc6f34, #f4a261);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .tv8-sub {
          font-size: 16px;
          color: rgba(255,255,255,0.65);
          margin: 14px 0 0;
          max-width: 520px;
        }

        .tv8-head-right { text-align: right; flex-shrink: 0; }

        .tv8-agg-stars {
          color: #f4a261;
          font-size: 18px;
          letter-spacing: 2px;
        }

        .tv8-agg-num {
          font-family: var(--font-archivo-black), 'Archivo Black', system-ui, sans-serif;
          font-weight: 900;
          font-size: 28px;
          color: white;
          line-height: 1;
          margin-top: 6px;
        }

        .tv8-agg-lb {
          font-size: 11px;
          color: rgba(255,255,255,0.55);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-top: 4px;
          font-weight: 700;
        }

        .tv8-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
        }

        /* Card */
        .tv8-card {
          position: relative;
          padding: 28px;
          border-radius: 22px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.12);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          color: white;
          overflow: hidden;
          transition: transform 0.3s, background 0.3s, border-color 0.3s;
          display: flex;
          flex-direction: column;
        }

        .tv8-card:hover {
          transform: translateY(-3px);
          background: rgba(255,255,255,0.09);
          border-color: rgba(255,255,255,0.2);
        }

        .tv8-quote {
          position: absolute;
          top: 14px; right: 18px;
          font-family: var(--font-archivo-black), 'Archivo Black', system-ui, sans-serif;
          font-weight: 900;
          font-size: 80px;
          line-height: 0.7;
          color: rgba(220,111,52,0.18);
          pointer-events: none;
        }

        .tv8-stars {
          color: #f4a261;
          font-size: 14px;
          letter-spacing: 1px;
          margin-bottom: 14px;
        }

        .tv8-body {
          font-size: 14.5px;
          line-height: 1.6;
          color: rgba(255,255,255,0.85);
          margin: 0 0 22px;
          flex: 1;
        }

        .tv8-who {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .tv8-avatar {
          width: 42px; height: 42px;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 14px;
          color: white;
          flex-shrink: 0;
        }

        .tv8-name {
          font-size: 14px;
          font-weight: 700;
          color: white;
        }

        .tv8-meta {
          font-size: 12px;
          color: rgba(255,255,255,0.55);
          margin-top: 2px;
        }

        .tv8-product {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 10px;
          background: rgba(220,111,52,0.15);
          border: 1px solid rgba(220,111,52,0.3);
          border-radius: 999px;
          font-size: 11px;
          color: #f4a261;
          font-weight: 700;
          letter-spacing: 0.04em;
          margin-top: 14px;
          align-self: flex-start;
        }

        @media (max-width: 900px) {
          .tv8-grid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 580px) {
          .tv8-section { padding: 60px 20px; }
          .tv8-grid { grid-template-columns: 1fr; }
          .tv8-head { flex-direction: column; align-items: flex-start; }
          .tv8-head-right { text-align: left; }
        }
      `}</style>
    </>
  );
}
