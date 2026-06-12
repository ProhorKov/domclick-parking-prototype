import { ListFilter, Map, Sparkles, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { lots } from "../data/lots";
import type { CatalogFilterState, MapArea, Market, Navigate } from "../types";
import { Filters } from "./Filters";
import { LotCard } from "./LotCard";
import { Breadcrumbs } from "./shared/Breadcrumbs";
import { DomButton } from "./ui/DomButton";

interface CatalogScreenProps {
  go: Navigate;
  initialFilters: CatalogFilterState;
  initialMarket: Market;
  selectedArea?: MapArea | null;
}

export function CatalogScreen({ go, initialFilters, initialMarket, selectedArea }: CatalogScreenProps) {
  const [market, setMarket] = useState<Market>(initialMarket);
  const [areaFilter, setAreaFilter] = useState<MapArea | null>(selectedArea ?? null);
  const [filters, setFilters] = useState<CatalogFilterState>(initialFilters);

  useEffect(() => {
    setMarket(initialMarket);
  }, [initialMarket]);

  useEffect(() => {
    setAreaFilter(selectedArea ?? null);
  }, [selectedArea]);

  useEffect(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  const handleMarketChange = (nextMarket: Market) => {
    setMarket(nextMarket);
    setAreaFilter(null);
    go("catalog", { filters, market: nextMarket });
  };

  const visibleLots = useMemo(
    () =>
      lots.filter((lot) => {
        const matchesMarket = market === "all" || lot.market === market;
        const matchesArea = !areaFilter || areaFilter.lotIds.includes(lot.id);
        const price = parsePrice(lot.price);
        const priceFrom = parseMoneyInput(filters.priceFrom);
        const priceTo = parseMoneyInput(filters.priceTo);
        const matchesPriceFrom = priceFrom === null || price >= priceFrom;
        const matchesPriceTo = priceTo === null || price <= priceTo;
        const matchesPassed = !filters.passedOnly || lot.verification === "passed";
        const matchesOnline = !filters.onlineOnly || hasTag(lot.tags, "Электронная сделка");
        const matchesCharger = !filters.chargerOnly || hasTag(lot.tags, "Зарядка рядом");

        return (
          matchesMarket &&
          matchesArea &&
          matchesPriceFrom &&
          matchesPriceTo &&
          matchesPassed &&
          matchesOnline &&
          matchesCharger
        );
      }),
    [areaFilter, filters, market],
  );

  const marketText =
    areaFilter
      ? "в выбранной зоне"
      : market === "primary"
        ? "от застройщиков"
        : market === "secondary"
          ? "от собственников"
          : "для покупки";

  return (
    <main className="shell page">
      <Breadcrumbs go={go} items={["Главная", "Купить", "Гаражи и машино-места"]} />

      <div className="catalog-heading">
        <div>
          <h1>{areaFilter ? `Машино-места: ${areaFilter.name}` : "Машино-места в Москве"}</h1>
          <p>
            {visibleLots.length} {getPlural(visibleLots.length)} {marketText}
          </p>
        </div>
        <div className="catalog-heading__actions">
          <DomButton variant="secondary" onClick={() => go("smart")}>
            <Sparkles size={18} />
            Подобрать варианты
          </DomButton>
          <DomButton variant="secondary" onClick={() => go("home")}>
            <Map size={18} />
            На карте
          </DomButton>
        </div>
      </div>
      {areaFilter && (
        <section className="catalog-area-context">
          <div>
            <strong>
              {areaFilter.type}
              {areaFilter.district ? ` · ${areaFilter.district}` : ""}
            </strong>
            <span>
              {areaFilter.available} доступно, средняя цена {areaFilter.averagePrice}
            </span>
          </div>
          <DomButton variant="ghost" onClick={() => go("catalog", { filters, market })}>
            <X size={17} />
            Сбросить выбор
          </DomButton>
        </section>
      )}

      <div className="catalog-layout">
        <Filters
          filters={filters}
          market={market}
          onFiltersChange={setFilters}
          onMarketChange={handleMarketChange}
        />
        <section className="catalog-results" aria-label="Результаты поиска">
          <div className="catalog-results__toolbar">
            <span>
              <ListFilter size={17} />
              Сначала рекомендованные
            </span>
            <span>
              {visibleLots.length} {getPlural(visibleLots.length)}
            </span>
          </div>
          {visibleLots.length > 0 ? (
            visibleLots.map((lot) => <LotCard key={lot.id} lot={lot} onOpen={(selected) => go("detail", selected)} />)
          ) : (
            <div className="catalog-empty">
              <h2>В этой подборке пока нет вариантов</h2>
              <p>Ответьте на 4 вопроса, и Домклик подберёт 3 подходящих машино-места.</p>
              <DomButton onClick={() => go("smart")}>
                <Sparkles size={17} />
                Подобрать с AI
              </DomButton>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function getPlural(count: number) {
  const lastTwo = count % 100;
  const last = count % 10;

  if (last === 1 && lastTwo !== 11) return "предложение";
  if ([2, 3, 4].includes(last) && ![12, 13, 14].includes(lastTwo)) return "предложения";
  return "предложений";
}

function parsePrice(price: string) {
  return Number(price.replace(/[^\d]/g, ""));
}

function parseMoneyInput(value: string) {
  const normalized = value.replace(",", ".").replace(/[^\d.]/g, "");
  if (!normalized) return null;

  const number = Number(normalized);
  if (!Number.isFinite(number)) return null;

  return number <= 1000 ? number * 1_000_000 : number;
}

function hasTag(tags: string[], target: string) {
  return tags.some((tag) => tag.toLowerCase() === target.toLowerCase());
}
