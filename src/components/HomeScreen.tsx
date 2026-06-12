import { ArrowRight, Building2, Car, CreditCard, FileText, ShieldCheck } from "lucide-react";
import type { Market, Navigate } from "../types";
import { MapSearch } from "./MapSearch";
import { SearchHero } from "./SearchHero";
import { DomButton } from "./ui/DomButton";

interface HomeScreenProps {
  go: Navigate;
}

export function HomeScreen({ go }: HomeScreenProps) {
  return (
    <main className="shell page home">
      <section className="hero">
        <div className="hero__content">
          <span className="eyebrow">Машино-места на Домклик</span>
          <h1>Покупайте машино-место с проверкой и безопасной сделкой</h1>
          <p>
            Найдите место в своём ЖК или рядом с домом. Домклик проверит объект, подготовит договор и поможет с
            расчётами.
          </p>
          <SearchHero go={go} />
        </div>

        <MapSearch go={go} />
      </section>

      <section className="service-grid">
        <ServiceCard icon={ShieldCheck} title="Проверим объект" text="Покажем статус и риски прямо в карточке" />
        <ServiceCard icon={FileText} title="Подготовим договор" text="Соберём данные объекта и сторон сделки" />
        <ServiceCard icon={CreditCard} title="Поможем с расчётами" text="Пакет сделки стоит дешевле отдельных услуг" />
      </section>

      <section className="section-heading section-heading--home">
        <div>
          <span className="eyebrow">Выберите сценарий</span>
          <h2>Покупка от застройщика или собственника</h2>
          <p>Сравните новые места от партнёров и готовые предложения от собственников с проверкой перед сделкой.</p>
        </div>
        <DomButton variant="secondary" onClick={() => go("flow")}>
          Схема сделки
          <ArrowRight size={17} />
        </DomButton>
      </section>

      <section className="market-grid">
        <MarketCard
          go={go}
          icon={Building2}
          market="primary"
          title="От застройщика"
          text="Пул мест в новом ЖК: рядом с квартирой, лифтом или въездом в паркинг."
        />
        <MarketCard
          go={go}
          icon={Car}
          market="secondary"
          title="От собственника"
          text="Готовые места в районе с проверкой документов перед оформлением."
        />
      </section>
    </main>
  );
}

function ServiceCard({ icon: Icon, title, text }: { icon: typeof ShieldCheck; title: string; text: string }) {
  return (
    <article className="surface service-card">
      <Icon size={23} />
      <h3>{title}</h3>
      <p>{text}</p>
    </article>
  );
}

function MarketCard({
  go,
  icon: Icon,
  market,
  title,
  text,
}: {
  go: Navigate;
  icon: typeof Building2;
  market: Exclude<Market, "all">;
  title: string;
  text: string;
}) {
  return (
    <button className="surface market-card" onClick={() => go("catalog", market)}>
      <span className="market-card__icon">
        <Icon size={26} />
      </span>
      <ArrowRight size={20} />
      <h3>{title}</h3>
      <p>{text}</p>
    </button>
  );
}
