import { ArrowRight, Building2, MapPin, Navigation, RotateCcw } from "lucide-react";
import { useState } from "react";
import { mapAreas } from "../data/mapAreas";
import type { MapArea, Navigate } from "../types";
import { DomButton } from "./ui/DomButton";

interface MapSearchProps {
  go: Navigate;
}

export function MapSearch({ go }: MapSearchProps) {
  const [selectedArea, setSelectedArea] = useState<MapArea>(mapAreas[0]);

  const openCatalog = (area = selectedArea) => {
    go("catalog", { market: area.market, area });
  };

  return (
    <section className="map-search" aria-label="Поиск машино-мест на карте">
      <div className="map-search__top">
        <div>
          <span className="eyebrow">Поиск на карте</span>
          <h2>Выберите район, улицу или ЖК</h2>
        </div>
        <button className="icon-button" onClick={() => setSelectedArea(mapAreas[0])} aria-label="Сбросить выбор">
          <RotateCcw size={18} />
        </button>
      </div>

      <div className="map-search__canvas">
        <div className="map-search__river" />
        <div className="map-search__road map-search__road--main" />
        <div className="map-search__road map-search__road--second" />
        <div className="map-search__metro">
          <span>М</span>
          Аэропорт
        </div>
        <div className="map-search__district map-search__district--one">Хорошёвский</div>
        <div className="map-search__district map-search__district--two">Сокол</div>
        {mapAreas.map((area, index) => (
          <button
            aria-pressed={selectedArea.id === area.id}
            className={`map-area map-area--${area.size} ${index > 2 ? "map-area--secondary" : ""} ${
              selectedArea.id === area.id ? "is-active" : ""
            }`}
            key={area.id}
            onClick={() => setSelectedArea(area)}
            style={{ left: `${area.x}%`, top: `${area.y}%` }}
          >
            <span className="map-area__dot" />
            <span className="map-area__label">{area.name}</span>
          </button>
        ))}
      </div>

      <div className="map-search__more" aria-label="Ещё районы">
        <strong>Ещё районы</strong>
        <div>
          {mapAreas.slice(3).map((area) => (
            <button
              className={selectedArea.id === area.id ? "is-active" : ""}
              key={area.id}
              onClick={() => setSelectedArea(area)}
            >
              {area.name}
            </button>
          ))}
        </div>
      </div>

      <article className="map-search__card">
        <div>
          <span>
            {selectedArea.type}
            {selectedArea.district ? ` · ${selectedArea.district}` : ""}
          </span>
          <h3>{selectedArea.name}</h3>
          <p>{selectedArea.description}</p>
        </div>
        <div className="map-search__facts">
          <span>
            <Building2 size={16} />
            {selectedArea.available} {getPlacePlural(selectedArea.available)}
          </span>
          <span>
            <MapPin size={16} />
            Средняя цена {selectedArea.averagePrice}
          </span>
        </div>
        <div className="map-search__actions">
          <DomButton onClick={() => openCatalog()}>
            Показать предложения
            <ArrowRight size={17} />
          </DomButton>
          <DomButton variant="ghost" onClick={() => setSelectedArea(mapAreas[0])}>
            Сбросить выбор
          </DomButton>
        </div>
      </article>

      <button className="map-search__hint" onClick={() => openCatalog(mapAreas[2])}>
        <Navigation size={17} />
        Показать более доступные места в Северном парке
      </button>
    </section>
  );
}

function getPlacePlural(count: number) {
  if (count % 10 === 1 && count % 100 !== 11) return "машино-место";
  if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100)) return "машино-места";
  return "машино-мест";
}
