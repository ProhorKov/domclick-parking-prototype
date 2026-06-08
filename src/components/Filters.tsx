import { ChevronDown, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import type { Market } from "../types";
import { DomButton } from "./ui/DomButton";

interface FiltersProps {
  market: Market;
  onMarketChange: (market: Market) => void;
}

export function Filters({ market, onMarketChange }: FiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <aside className={`filters ${isOpen ? "is-open" : ""}`}>
      <button className="filters__mobile-toggle" onClick={() => setIsOpen((current) => !current)}>
        <span>
          <SlidersHorizontal size={18} />
          Фильтры
        </span>
        <ChevronDown size={18} />
      </button>
      <div className="filters__body">
        <div className="filters__heading">
          <h2>Фильтры</h2>
          <SlidersHorizontal size={18} />
        </div>

        <fieldset className="filter-group">
          <legend>Продавец</legend>
          {[
            ["all", "Все предложения"],
            ["primary", "От застройщика"],
            ["secondary", "От собственника"],
          ].map(([value, label]) => (
            <label className="radio-row" key={value}>
              <input
                checked={market === value}
                name="market"
                onChange={() => onMarketChange(value as Market)}
                type="radio"
              />
              <span>{label}</span>
            </label>
          ))}
        </fieldset>

        <fieldset className="filter-group">
          <legend>Цена</legend>
          <div className="filter-group__inputs">
            <input aria-label="Цена от" placeholder="от 1,5 млн" />
            <input aria-label="Цена до" placeholder="до 3,5 млн" />
          </div>
        </fieldset>

        <fieldset className="filter-group">
          <legend>Проверка Домклик</legend>
          <label className="check-row">
            <input defaultChecked type="checkbox" />
            <span>Проверка пройдена</span>
          </label>
          <label className="check-row">
            <input defaultChecked type="checkbox" />
            <span>Электронная сделка</span>
          </label>
          <label className="check-row">
            <input type="checkbox" />
            <span>Зарядка рядом</span>
          </label>
        </fieldset>

        <DomButton className="filters__apply" onClick={() => setIsOpen(false)}>
          Показать варианты
        </DomButton>
      </div>
    </aside>
  );
}
