import { useState } from "react";
import { CatalogScreen } from "./components/CatalogScreen";
import { DealFlow } from "./components/DealFlow";
import { FlowScheme } from "./components/FlowScheme";
import { Header } from "./components/Header";
import { HomeScreen } from "./components/HomeScreen";
import { LotDetails } from "./components/LotDetails";
import { PartnerDashboard } from "./components/PartnerDashboard";
import { SuccessScreen } from "./components/SuccessScreen";
import { lots } from "./data/lots";
import type { Lot, Market, Navigate, Screen } from "./types";

export default function App() {
  const [screen, setScreen] = useState<Screen>("home");
  const [selectedLot, setSelectedLot] = useState<Lot>(lots[0]);
  const [initialMarket, setInitialMarket] = useState<Market>("all");

  const go: Navigate = (next, payload) => {
    if (next === "catalog") {
      setInitialMarket(typeof payload === "string" ? payload : "all");
    }
    if (typeof payload === "object" && payload !== null) {
      setSelectedLot(payload);
    }
    setScreen(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="app">
      <Header go={go} />
      {screen === "home" && <HomeScreen go={go} />}
      {screen === "catalog" && <CatalogScreen go={go} initialMarket={initialMarket} />}
      {screen === "detail" && <LotDetails go={go} lot={selectedLot} />}
      {screen === "deal" && <DealFlow go={go} lot={selectedLot} />}
      {screen === "partner" && <PartnerDashboard go={go} />}
      {screen === "flow" && <FlowScheme go={go} />}
      {screen === "success" && <SuccessScreen go={go} lot={selectedLot} />}
      <footer className="shell footer">
        Учебный кликабельный прототип. Логотип подключён как открытый брендовый ресурс Домклик,
        изображения парковок — локальные нейтральные иллюстрации.
      </footer>
    </div>
  );
}
