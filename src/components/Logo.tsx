const logoUrl = "https://statics.dmclk.ru/web-ui-library/images/logo/domclick-logo.svg?d=2026-05-15";

export function Logo() {
  return (
    <span className="logo">
      <img className="logo__image" src={logoUrl} alt="Домклик" />
      <span className="logo__fallback">Домклик</span>
    </span>
  );
}
