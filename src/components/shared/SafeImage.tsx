import { useState } from "react";

interface SafeImageProps {
  alt: string;
  className?: string;
  src: string;
}

export function SafeImage({ alt, className = "", src }: SafeImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className={`image-fallback ${className}`} role="img" aria-label={alt}>
        <span>Изображение недоступно</span>
      </div>
    );
  }

  return <img className={className} src={src} alt={alt} loading="lazy" onError={() => setHasError(true)} />;
}
