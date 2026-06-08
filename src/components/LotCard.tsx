import { Building2, Heart, MapPin, ShieldAlert, ShieldCheck } from "lucide-react";
import { useState } from "react";
import type { Lot } from "../types";
import { SafeImage } from "./shared/SafeImage";
import { DomButton } from "./ui/DomButton";

interface LotCardProps {
  lot: Lot;
  onOpen: (lot: Lot) => void;
}

export function LotCard({ lot, onOpen }: LotCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const passed = lot.verification === "passed";

  return (
    <article className="lot-card">
      <div className="lot-card__media">
        <SafeImage src={lot.image} alt={lot.imageAlt} />
        <button
          className={`lot-card__favorite ${isFavorite ? "is-active" : ""}`}
          onClick={() => setIsFavorite((current) => !current)}
          aria-label={isFavorite ? "Убрать из избранного" : "Добавить в избранное"}
        >
          <Heart size={18} />
        </button>
        <span className="lot-card__market">
          {lot.market === "primary" ? "От застройщика" : "От собственника"}
        </span>
      </div>

      <div className="lot-card__body">
        <div className={`verification-label ${passed ? "is-passed" : "is-attention"}`}>
          {passed ? <ShieldCheck size={17} /> : <ShieldAlert size={17} />}
          {passed ? "Проверка пройдена" : "Нужна дополнительная проверка"}
        </div>
        <h3>{lot.title}</h3>
        <p className="lot-card__project">{lot.project}</p>
        <p className="lot-card__address">
          <MapPin size={16} />
          {lot.address}
        </p>
        <p className="lot-card__address">
          <Building2 size={16} />
          {lot.type}, {lot.level}
        </p>
        <div className="tag-list">
          {lot.tags.slice(0, 2).map((tag) => (
            <span className="tag" key={tag}>
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="lot-card__aside">
        <strong>{lot.price}</strong>
        <span>{lot.meter}</span>
        <DomButton onClick={() => onOpen(lot)}>Смотреть</DomButton>
      </div>
    </article>
  );
}
