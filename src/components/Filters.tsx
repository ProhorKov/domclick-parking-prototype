import { ChevronDown, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import type { CatalogFilterState, Market } from "../types";
import { DomButton } from "./ui/DomButton";

interface FiltersProps {
  filters: CatalogFilterState;
  market: Market;
  onFiltersChange: (filters: CatalogFilterState) => void;
  onMarketChange: (market: Market) => void;
}

const emptyFilters: CatalogFilterState = {
  priceFrom: "",
  priceTo: "",
  passedOnly: false,
  onlineOnly: false,
  chargerOnly: false,
};

export function Filters({ filters, market, onFiltersChange, onMarketChange }: FiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  const updateFilter = <Key extends keyof CatalogFilterState>(key: Key, value: CatalogFilterState[Key]) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <aside className={`filters ${isOpen ? "is-open" : ""}`}>
      <button
        className="filters__mobile-toggle"
        onClick={() => setIsOpen((current) => !current)}
        aria-expanded={isOpen}
      >
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
            <input
              aria-label="Цена от"
              inputMode="decimal"
              onChange={(event) => updateFilter("priceFrom", event.target.value)}
              placeholder="от 1,5 млн"
              value={filters.priceFrom}
            />
            <input
              aria-label="Цена до"
              inputMode="decimal"
              onChange={(event) => updateFilter("priceTo", event.target.value)}
              placeholder="до 3,5 млн"
              value={filters.priceTo}
            />
          </div>
        </fieldset>

        <fieldset className="filter-group">
          <legend>Проверка Домклик</legend>
          <label className="check-row">
            <input
              checked={filters.passedOnly}
              onChange={(event) => updateFilter("passedOnly", event.target.checked)}
              type="checkbox"
            />
            <span>Проверка пройдена</span>
          </label>
          <label className="check-row">
            <input
              checked={filters.onlineOnly}
              onChange={(event) => updateFilter("onlineOnly", event.target.checked)}
              type="checkbox"
            />
            <span>Электронная сделка</span>
          </label>
          <label className="check-row">
            <input
              checked={filters.chargerOnly}
              onChange={(event) => updateFilter("chargerOnly", event.target.checked)}
              type="checkbox"
            />
            <span>Зарядка рядом</span>
          </label>
        </fieldset>

        <div className="filters__actions">
          <DomButton variant="secondary" onClick={() => onFiltersChange(emptyFilters)}>
            Сбросить
          </DomButton>
          <DomButton onClick={() => setIsOpen(false)}>Показать варианты</DomButton>
        </div>
      </div>
    </aside>
  );
}
