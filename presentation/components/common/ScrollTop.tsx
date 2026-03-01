// El scroll listener (show/hide + progress ring) vive en ClientLayout
// para evitar tener dos listeners competidores en la misma página.
export default function ScrollTop() {
  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button id="goTop" onClick={handleClick}>
      <span className="border-progress"></span>
      <span className="icon icon-arrow-right"></span>
    </button>
  );
}
