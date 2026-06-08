import { CheckCircle2, ChevronDown, PackageCheck } from "lucide-react";
import { useMemo, useState } from "react";
import {
  allDealServiceIds,
  calculateSaving,
  calculateSeparateTotal,
  dealServices,
  formatMoney,
  packagePrice,
} from "../data/dealServices";
import type { DealCalculatorMode, DealServiceId } from "../types";
import { DomButton } from "./ui/DomButton";

interface DealCalculatorProps {
  compact?: boolean;
  onAction?: () => void;
  title?: string;
}

export function DealCalculator({ compact = false, onAction, title = "Стоимость сделки" }: DealCalculatorProps) {
  const [mode, setMode] = useState<DealCalculatorMode>("package");
  const [selectedServices, setSelectedServices] = useState<DealServiceId[]>(allDealServiceIds);
  const [isOpen, setIsOpen] = useState(!compact);

  const separateTotal = useMemo(() => calculateSeparateTotal(selectedServices), [selectedServices]);
  const saving = calculateSaving();
  const allSelected = selectedServices.length === allDealServiceIds.length;
  const total = mode === "package" ? packagePrice : separateTotal;
  const ctaText =
    mode === "package"
      ? `Оформить пакет за ${formatMoney(packagePrice)}`
      : `Продолжить с услугами на ${formatMoney(separateTotal)}`;

  const toggleService = (serviceId: DealServiceId) => {
    setSelectedServices((current) =>
      current.includes(serviceId) ? current.filter((id) => id !== serviceId) : [...current, serviceId],
    );
  };

  return (
    <section className={`deal-calculator ${compact ? "deal-calculator--compact" : ""}`}>
      <button className="deal-calculator__summary" onClick={() => compact && setIsOpen((current) => !current)}>
        <span>
          <PackageCheck size={19} />
          {title}
        </span>
        <strong>{formatMoney(total)}</strong>
        {compact && <ChevronDown className={isOpen ? "is-open" : ""} size={18} />}
      </button>

      {isOpen && (
        <div className="deal-calculator__body">
          <div className="calculator-mode">
            <label className={mode === "package" ? "is-selected" : ""}>
              <input
                checked={mode === "package"}
                name={`${title}-calculator-mode`}
                onChange={() => setMode("package")}
                type="radio"
              />
              <span>
                <strong>Пакет безопасной сделки</strong>
                <small>Выгоднее пакетом, экономия {formatMoney(saving)}</small>
              </span>
            </label>
            <label className={mode === "separate" ? "is-selected" : ""}>
              <input
                checked={mode === "separate"}
                name={`${title}-calculator-mode`}
                onChange={() => setMode("separate")}
                type="radio"
              />
              <span>
                <strong>Собрать услуги отдельно</strong>
                <small>Можно включить только нужные услуги</small>
              </span>
            </label>
          </div>

          <div className="calculator-services">
            {dealServices.map((service) => {
              const checked = mode === "package" || selectedServices.includes(service.id);

              return (
                <label className={checked ? "is-checked" : ""} key={service.id}>
                  <input
                    checked={checked}
                    disabled={mode === "package"}
                    onChange={() => toggleService(service.id)}
                    type="checkbox"
                  />
                  <span>
                    <strong>{service.title}</strong>
                    <small>{service.description}</small>
                  </span>
                  <b>{formatMoney(service.price)}</b>
                </label>
              );
            })}
          </div>

          <div className="calculator-total">
            {mode === "package" ? (
              <div className="calculator-hint is-good">
                <CheckCircle2 size={18} />
                Пакет дешевле отдельных услуг на {formatMoney(saving)}
              </div>
            ) : allSelected ? (
              <div className="calculator-hint">
                Пакет безопасной сделки дешевле на {formatMoney(saving)}
              </div>
            ) : (
              <div className="calculator-hint">Выбрано услуг на {formatMoney(separateTotal)}</div>
            )}

            <div className="calculator-total__row">
              <span>Итого</span>
              <strong>{formatMoney(total)}</strong>
            </div>

            {onAction && <DomButton onClick={onAction}>{ctaText}</DomButton>}
          </div>
        </div>
      )}
    </section>
  );
}
