import {
  ArrowLeft,
  BadgeCheck,
  Building2,
  CalendarDays,
  CheckCircle2,
  Heart,
  MapPin,
  MessageSquare,
  Phone,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";
import type { Lot, MapArea, Navigate } from "../types";
import { DealCalculator } from "./DealCalculator";
import { SafeImage } from "./shared/SafeImage";
import { DomButton } from "./ui/DomButton";

interface LotDetailsProps {
  go: Navigate;
  lot: Lot;
  selectedArea?: MapArea | null;
}

export function LotDetails({ go, lot, selectedArea }: LotDetailsProps) {
  const [requestSent, setRequestSent] = useState(false);
  const [favorite, setFavorite] = useState(false);
  const [notice, setNotice] = useState("");
  const passed = lot.verification === "passed";

  const showNotice = (text: string) => {
    setNotice(text);
    window.setTimeout(() => setNotice(""), 2400);
  };

  return (
    <main className="shell page">
      <button
        className="back-link"
        onClick={() => go("catalog", selectedArea ? { area: selectedArea, market: selectedArea.market } : lot.market)}
      >
        <ArrowLeft size={16} />
        Назад к списку
      </button>

      <div className="detail-layout">
        <div className="detail-main">
          <section className="surface detail-gallery">
            <SafeImage src={lot.image} alt={lot.imageAlt} />
            <button
              className={`detail-gallery__favorite ${favorite ? "is-active" : ""}`}
              onClick={() => setFavorite((current) => !current)}
              aria-label={favorite ? "Убрать из избранного" : "Добавить в избранное"}
            >
              <Heart size={19} />
            </button>
            <span>{lot.market === "primary" ? "От застройщика" : "От собственника"}</span>
          </section>

          <section className="surface detail-info">
            <div className={`verification-label ${passed ? "is-passed" : "is-attention"}`}>
              {passed ? <ShieldCheck size={17} /> : <ShieldAlert size={17} />}
              {passed ? "Проверка пройдена" : "Нужна дополнительная проверка"}
            </div>
            <h1>{lot.title}</h1>
            <p className="detail-info__project">{lot.project}</p>
            <p className="detail-info__address">
              <MapPin size={17} />
              {lot.address}
            </p>
            <div className="detail-facts">
              <Fact label="Площадь" value={lot.area} />
              <Fact label="Тип" value={lot.type} />
              <Fact label="Расположение" value={lot.level} />
              <Fact label="До дома" value={lot.distance} />
            </div>
            <h2>О машино-месте</h2>
            <p className="detail-info__description">{lot.description}</p>
          </section>

          <section className={`surface domclick-check ${passed ? "" : "is-attention"}`}>
            <div className="domclick-check__heading">
              {passed ? <BadgeCheck size={28} /> : <ShieldAlert size={28} />}
              <div>
                <h2>Проверка Домклик</h2>
                <p>{passed ? "Основные сведения подтверждены" : "Перед сделкой уточним документы"}</p>
              </div>
            </div>
            <div className="domclick-check__list">
              {(passed
                ? ["Право продавца подтверждено", "Обременения не найдены", "Можно оформить электронно"]
                : ["Объект найден в реестре", "Нужно уточнить сведения о доле", "Менеджер подключится к проверке"]
              ).map((item, index) => (
                <div key={item}>
                  {passed || index !== 1 ? <CheckCircle2 size={19} /> : <ShieldAlert size={19} />}
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="surface detail-cta">
          <strong className="detail-cta__price">{lot.price}</strong>
          <span className="detail-cta__meter">{lot.meter}</span>

          <DealCalculator compact onAction={() => go("deal", lot)} title="Пакет сделки" />

          <DomButton size="large" onClick={() => go("deal", lot)}>
            Начать оформление
          </DomButton>
          <DomButton
            variant={requestSent ? "ghost" : "secondary"}
            onClick={() => setRequestSent(true)}
            disabled={requestSent}
          >
            <CalendarDays size={17} />
            {requestSent ? "Заявка отправлена" : "Записаться на просмотр"}
          </DomButton>
          <DomButton variant="ghost" onClick={() => showNotice("Чат с продавцом откроется после заявки")}>
            <MessageSquare size={17} />
            Написать продавцу
          </DomButton>
          {notice && (
            <div className="inline-notice" role="status" aria-live="polite">
              {notice}
            </div>
          )}
          <div className="detail-cta__seller">
            <div>
              <Building2 size={18} />
              <span>Продавец</span>
            </div>
            <strong>{lot.seller}</strong>
            <p>{lot.sellerNote}</p>
            <button onClick={() => showNotice("+7 900 000-00-00 · номер скрыт для прототипа")}>
              <Phone size={15} />
              Показать телефон
            </button>
          </div>
        </aside>
      </div>
    </main>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
