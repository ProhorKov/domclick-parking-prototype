import { ListFilter, Map } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { lots } from "../data/lots";
import type { Market, Navigate } from "../types";
import { Filters } from "./Filters";
import { LotCard } from "./LotCard";
import { Breadcrumbs } from "./shared/Breadcrumbs";
import { DomButton } from "./ui/DomButton";

interface CatalogScreenProps {
  go: Navigate;
  initialMarket: Market;
}

export function CatalogScreen({ go, initialMarket }: CatalogScreenProps) {
  const [market, setMarket] = useState<Market>(initialMarket);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    setMarket(initialMarket);
  }, [initialMarket]);

  const visibleLots = useMemo(
    () => (market === "all" ? lots : lots.filter((lot) => lot.market === market)),
    [market],
  );

  const marketText =
    market === "primary" ? "от застройщиков" : market === "secondary" ? "от собственников" : "для покупки";

  return (
    <main className="shell page">
      <Breadcrumbs go={go} items={["Главная", "Купить", "Гаражи и машино-места"]} />

      <div className="catalog-heading">
        <div>
          <h1>Машино-места в Москве</h1>
          <p>
            {visibleLots.length} {getPlural(visibleLots.length)} {marketText}
          </p>
        </div>
        <DomButton variant="secondary" onClick={() => setNotice("Карта не подключена в учебном прототипе")}>
          <Map size={18} />
          На карте
        </DomButton>
      </div>
      {notice && <div className="inline-notice">{notice}</div>}

      <div className="catalog-layout">
        <Filters market={market} onMarketChange={setMarket} />
        <section className="catalog-results" aria-label="Результаты поиска">
          <div className="catalog-results__toolbar">
            <span>
              <ListFilter size={17} />
              Сначала рекомендованные
            </span>
            <span>{visibleLots.length} варианта</span>
          </div>
          {visibleLots.map((lot) => (
            <LotCard key={lot.id} lot={lot} onOpen={(selected) => go("detail", selected)} />
          ))}
        </section>
      </div>
    </main>
  );
}

function getPlural(count: number) {
  if (count === 1) return "предложение";
  if (count > 1 && count < 5) return "предложения";
  return "предложений";
}
