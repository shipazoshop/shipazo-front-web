import React from "react";
import { normalizeDescription } from "../../utils/normalizeDescription";

interface ProductDescriptionProps {
  text: string;
}

export default function ProductDescription({ text }: Readonly<ProductDescriptionProps>) {
  const { sections, disclaimers } = normalizeDescription(text);

  if (sections.length === 0 && disclaimers.length === 0) {
    return null;
  }

  return (
    <div className="product-description-normalized">
      {sections.map((section, sIdx) => (
        <div key={sIdx} className="description-section" style={{ marginBottom: "16px" }}>
          {section.title && (
            <p className="body-md-2 fw-semibold" style={{ marginBottom: "6px" }}>
              {section.title}
            </p>
          )}
          {section.paragraphs.map((paragraph, pIdx) => (
            <p key={pIdx} className="body-text-3" style={{ marginBottom: "8px" }}>
              {paragraph}
            </p>
          ))}
        </div>
      ))}

      {disclaimers.length > 0 && (
        <div
          className="description-disclaimers"
          style={{
            marginTop: "16px",
            paddingTop: "12px",
            borderTop: "1px solid var(--line)",
          }}
        >
          {disclaimers.map((d, i) => (
            <p key={i} className="body-text-3" style={{ color: "var(--text-2)", fontSize: "12px", marginBottom: "4px" }}>
              {d}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
