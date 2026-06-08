import { ChevronDown, Search } from "lucide-react";
import { useState } from "react";
import type { Market, Navigate } from "../types";
import { DomButton } from "./ui/DomButton";

interface SearchHeroProps {
  go: Navigate;
}

export function SearchHero({ go }: SearchHeroProps) {
  const [market, setMarket] = useState<Market>("all");

  return (
    <section className="search-box" aria-label="Поиск машино-мест">
      <div className="search-box__tabs">
        <button className="is-active">Купить</button>
        <button disabled title="Сценарий аренды не входит в демо">
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
          <select defaultValue="any" aria-label="Цена">
            <option value="any">Любая цена</option>
            <option value="to-2">До 2 млн ₽</option>
            <option value="2-3">2–3 млн ₽</option>
            <option value="from-3">От 3 млн ₽</option>
          </select>
          <ChevronDown size={17} />
        </label>
        <DomButton size="large" onClick={() => go("catalog", market)}>
          Найти
        </DomButton>
      </div>
    </section>
  );
}
