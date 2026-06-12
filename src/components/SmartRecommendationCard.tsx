import { BadgeCheck, MapPin, ThumbsDown } from "lucide-react";
import type { SmartRecommendation } from "../types";
import { SafeImage } from "./shared/SafeImage";
import { DomButton } from "./ui/DomButton";

interface SmartRecommendationCardProps {
  recommendation: SmartRecommendation;
  onOpen: () => void;
  onReject: () => void;
}

export function SmartRecommendationCard({ recommendation, onOpen, onReject }: SmartRecommendationCardProps) {
  const { lot } = recommendation;

  return (
    <article className="smart-card">
      <div className="smart-card__media">
        <SafeImage src={lot.image} alt={lot.imageAlt} />
        <span>{recommendation.label}</span>
      </div>
      <div className="smart-card__body">
        <div className="smart-card__score">
          <BadgeCheck size={17} />
          {recommendation.score} баллов совпадения
        </div>
        <h3>{lot.title}</h3>
        <p className="smart-card__project">{lot.project}</p>
        <p className="smart-card__address">
          <MapPin size={16} />
          {lot.address}
        </p>
        <strong className="smart-card__price">{lot.price}</strong>
        <div className="smart-card__why">
          <span>Почему показываем этот вариант</span>
          <p>{recommendation.reasons.join(". ")}.</p>
        </div>
        <div className="tag-list">
          {recommendation.matches.map((match) => (
            <span className="tag" key={match}>
              {match}
            </span>
          ))}
        </div>
      </div>
      <div className="smart-card__actions">
        <DomButton onClick={onOpen}>Смотреть</DomButton>
        <DomButton variant="ghost" onClick={onReject}>
          <ThumbsDown size={17} />
          Не подходит
        </DomButton>
      </div>
    </article>
  );
}
