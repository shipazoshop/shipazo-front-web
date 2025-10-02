import Image from "next/image";

const brands = [
  { src: "/images/brand/lead-ecommerce.svg", alt: "Lead Ecommerce" },
  { src: "/images/brand/global-brand.svg", alt: "Global Brand" },
  { src: "/images/brand/great-deal.svg", alt: "Great Deal" },
  { src: "/images/brand/walmart.svg", alt: "Walmart" },
  { src: "/images/brand/rodem.svg", alt: "Rodem" },
  { src: "/images/brand/fabric.svg", alt: "Fabric" },
  { src: "/images/brand/sudo.svg", alt: "Sudo" },
  { src: "/images/brand/ctaecom.svg", alt: "CTA Ecommerce" },
];

const animationStyle = {
  display: "flex",
  flexFlow: "row",
  alignItems: "center",
  animation: "12.72s linear 0s infinite normal none running infiniteslider",
};

const itemStyle = { flex: "0 0 auto", display: "block" };

const CLONE_LOOPS = 1;

export default function BrandsSlider({ fullWidth = false, typeClass = "" }) {
  return (
    <div className="themesFlat">
      <div className={fullWidth ? "" : "container"}>
        <div className="line-bt line-tp">
          <div className="infiniteslide_wrap" style={{ overflow: "hidden" }}>
            <div className={`infiniteslide tf-brand ${typeClass}`} style={animationStyle}>
              {Array.from({ length: CLONE_LOOPS + 1 }).map((_, loopIndex) =>
                brands.map((brand, index) => (
                  <div
                    key={`${loopIndex}-${brand.src}`}
                    className={`brand-item${loopIndex > 0 ? " infiniteslide_clone" : ""}`}
                    style={itemStyle}
                    aria-hidden={loopIndex > 0}
                  >
                    <Image alt={brand.alt} src={brand.src} width={159} height={100} />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
