import { CheckCircle2 } from "lucide-react";
import type { Lot, Navigate } from "../types";
import { DomButton } from "./ui/DomButton";

interface SuccessScreenProps {
  go: Navigate;
  lot: Lot;
}

export function SuccessScreen({ go, lot }: SuccessScreenProps) {
  return (
    <main className="shell page success-page">
      <section className="surface success">
        <CheckCircle2 className="success__icon" size={48} />
        <span className="eyebrow">Заявка отправлена</span>
        <h1>Начали оформление сделки</h1>
        <p>Статусы появятся в личном кабинете. Если потребуется уточнить документы, менеджер подключится к проверке.</p>

        <div className="success__lot">
          <strong>{lot.project}</strong>
          <span>
            {lot.title}, {lot.price}
          </span>
          <div>
            <small>Проверка запущена</small>
            <small>Договор готовится</small>
            <small>Расчёты выбраны</small>
          </div>
        </div>

        <div className="success__actions">
          <DomButton onClick={() => go("home")}>На главную</DomButton>
          <DomButton variant="secondary" onClick={() => go("catalog")}>
            В каталог
          </DomButton>
          {lot.market === "primary" && (
            <DomButton variant="secondary" onClick={() => go("partner")}>
              Кабинет партнёра
            </DomButton>
          )}
        </div>
      </section>
    </main>
  );
}
