import { ChevronDown, Search, Sparkles } from "lucide-react";
import { useState } from "react";
import type { Market, Navigate } from "../types";
import { DomButton } from "./ui/DomButton";

interface SearchHeroProps {
  go: Navigate;
}

export function SearchHero({ go }: SearchHeroProps) {
  const [market, setMarket] = useState<Market>("all");
  const [price, setPrice] = useState("any");

  return (
    <section className="search-box" aria-label="Поиск машино-мест">
      <div className="search-box__tabs">
        <button className="is-active">Купить</button>
        <button disabled title="Аренда машино-мест пока недоступна">
          Снять
        </button>
        <button onClick={() => go("partner")}>Продать</button>
      </div>
      <div className="search-box__grid">
        <label className="search-field search-field--wide">
          <Search size={20} />
          <input aria-label="Район, адрес или ЖК" defaultValue="Москва" placeholder="Район, адрес или ЖК" />
        </label>
        <label className="search-field">
          <select value={market} onChange={(event) => setMarket(event.target.value as Market)} aria-label="Тип предложения">
            <option value="all">Все предложения</option>
            <option value="primary">От застройщика</option>
            <option value="secondary">От собственника</option>
          </select>
          <ChevronDown size={17} />
        </label>
        <label className="search-field">
          <select value={price} onChange={(event) => setPrice(event.target.value)} aria-label="Цена">
            <option value="any">Любая цена</option>
            <option value="to-2">До 2 млн ₽</option>
            <option value="2-3">2–3 млн ₽</option>
            <option value="from-3">От 3 млн ₽</option>
          </select>
          <ChevronDown size={17} />
        </label>
        <DomButton size="large" onClick={() => go("catalog", { filters: getPriceFilters(price), market })}>
          Найти
        </DomButton>
      </div>
      <div className="search-box__smart">
        <span>Ответьте на несколько вопросов, и Домклик подберёт подходящие машино-места</span>
        <DomButton variant="secondary" onClick={() => go("smart")}>
          <Sparkles size={17} />
          Подобрать с AI
        </DomButton>
      </div>
    </section>
  );
}

function getPriceFilters(price: string) {
  if (price === "to-2") return { priceTo: "2" };
  if (price === "2-3") return { priceFrom: "2", priceTo: "3" };
  if (price === "from-3") return { priceFrom: "3" };
  return {};
}
