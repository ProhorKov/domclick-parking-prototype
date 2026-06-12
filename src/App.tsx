import { useState } from "react";
import { CatalogScreen } from "./components/CatalogScreen";
import { DealFlow } from "./components/DealFlow";
import { FlowScheme } from "./components/FlowScheme";
import { Header } from "./components/Header";
import { HomeScreen } from "./components/HomeScreen";
import { LotDetails } from "./components/LotDetails";
import { PartnerDashboard } from "./components/PartnerDashboard";
import { SmartCatalogScreen } from "./components/SmartCatalogScreen";
import { SuccessScreen } from "./components/SuccessScreen";
import { lots } from "./data/lots";
import type {
  CatalogFilterState,
  CatalogNavigationPayload,
  Lot,
  MapArea,
  Market,
  Navigate,
  NavigationPayload,
  Screen,
} from "./types";

const emptyCatalogFilters: CatalogFilterState = {
  priceFrom: "",
  priceTo: "",
  passedOnly: false,
  onlineOnly: false,
  chargerOnly: false,
};

export default function App() {
  const [screen, setScreen] = useState<Screen>("home");
  const [selectedLot, setSelectedLot] = useState<Lot>(lots[0]);
  const [initialMarket, setInitialMarket] = useState<Market>("all");
  const [selectedArea, setSelectedArea] = useState<MapArea | null>(null);
  const [initialFilters, setInitialFilters] = useState<CatalogFilterState>(emptyCatalogFilters);

  const go: Navigate = (next, payload) => {
    if (next === "catalog") {
      if (typeof payload === "string") {
        setInitialMarket(payload);
        setSelectedArea(null);
        setInitialFilters(emptyCatalogFilters);
      } else if (isCatalogPayload(payload)) {
        setInitialMarket(payload.market ?? payload.area?.market ?? "all");
        setSelectedArea(payload.area ?? null);
        setInitialFilters({ ...emptyCatalogFilters, ...payload.filters });
      } else {
        setInitialMarket("all");
        setSelectedArea(null);
        setInitialFilters(emptyCatalogFilters);
      }
    }
    if (next === "home" || next === "smart") {
      setSelectedArea(null);
    }
    if (isLotPayload(payload)) {
      setSelectedLot(payload);
    }
    setScreen(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="app">
      <Header go={go} />
      {screen === "home" && <HomeScreen go={go} />}
      {screen === "catalog" && (
        <CatalogScreen
          go={go}
          initialFilters={initialFilters}
          initialMarket={initialMarket}
          selectedArea={selectedArea}
        />
      )}
      {screen === "detail" && <LotDetails go={go} lot={selectedLot} selectedArea={selectedArea} />}
      {screen === "deal" && <DealFlow go={go} lot={selectedLot} />}
      {screen === "partner" && <PartnerDashboard go={go} />}
      {screen === "flow" && <FlowScheme go={go} />}
      {screen === "smart" && <SmartCatalogScreen go={go} />}
      {screen === "success" && <SuccessScreen go={go} lot={selectedLot} />}
      <footer className="shell footer">
        Учебный кликабельный прототип. Брендовый знак стилизован в интерфейсе, изображения парковок —
        локальные нейтральные иллюстрации.
      </footer>
    </div>
  );
}

function isLotPayload(payload: NavigationPayload | undefined): payload is Lot {
  return typeof payload === "object" && payload !== null && "price" in payload && "project" in payload;
}

function isCatalogPayload(payload: NavigationPayload | undefined): payload is CatalogNavigationPayload {
  return typeof payload === "object" && payload !== null && ("market" in payload || "area" in payload || "filters" in payload);
}
