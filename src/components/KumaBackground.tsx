const ribbonText = "КУМА • СПАСИ • КУМА • ЗА СЕКУНДУ • КУМА • ";

export function KumaBackground() {
  return (
    <div className="kuma-background" aria-hidden="true">
      <div className="kuma-bg-ribbon kuma-bg-ribbon--one">{ribbonText.repeat(3)}</div>
      <div className="kuma-bg-ribbon kuma-bg-ribbon--two">{ribbonText.repeat(3)}</div>

      <span className="kuma-bg-word kuma-bg-word--one">КУМА</span>
      <span className="kuma-bg-word kuma-bg-word--two">КУМА</span>
      <span className="kuma-bg-word kuma-bg-word--three">КУМА</span>
      <span className="kuma-bg-word kuma-bg-word--four">КУМА</span>

      <div className="kuma-bg-sparks">
        <i />
        <i />
        <i />
        <i />
        <i />
        <i />
        <i />
        <i />
      </div>
    </div>
  );
}
