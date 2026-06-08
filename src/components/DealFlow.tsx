import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  FileCheck2,
  FileText,
  Landmark,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";
import { dealChecks } from "../data/lots";
import type { Lot, Navigate } from "../types";
import { DealCalculator } from "./DealCalculator";
import { DomButton } from "./ui/DomButton";

interface DealFlowProps {
  go: Navigate;
  lot: Lot;
}

const steps = [
  { title: "Проверка", icon: ShieldCheck },
  { title: "Договор", icon: FileText },
  { title: "Расчёты", icon: CreditCard },
  { title: "Оформление", icon: FileCheck2 },
];

export function DealFlow({ go, lot }: DealFlowProps) {
  const [step, setStep] = useState(1);
  const [notice, setNotice] = useState("");
  const CurrentIcon = steps[step - 1].icon;

  const showNotice = (text: string) => {
    setNotice(text);
    window.setTimeout(() => setNotice(""), 2400);
  };

  return (
    <main className="shell page deal-page">
      <button className="back-link" onClick={() => go("detail", lot)}>
        <ArrowLeft size={16} />
        Назад к объявлению
      </button>

      <section className="surface deal">
        <div className="deal__top">
          <div>
            <span className="eyebrow">Сделка Домклик</span>
            <h1>Оформление машино-места</h1>
            <p>
              {lot.project}, {lot.title}
            </p>
          </div>
          <div className="deal__price">
            <strong>{lot.price}</strong>
            <span>цена объекта</span>
          </div>
        </div>

        <DealCalculator compact title="Сопровождение сделки" />

        <div className="deal__steps">
          {steps.map((item, index) => (
            <button
              className={step === index + 1 ? "is-active" : ""}
              key={item.title}
              onClick={() => setStep(index + 1)}
            >
              <span>{index + 1}</span>
              {item.title}
            </button>
          ))}
        </div>

        <div className="deal__content">
          <div className="deal__intro">
            <CurrentIcon size={28} />
            <h2>{steps[step - 1].title}</h2>
            <p>{getStepDescription(step)}</p>
          </div>
          <div className="deal__panel">{getStepPanel(step, showNotice)}</div>
        </div>

        {notice && <div className="inline-notice">{notice}</div>}

        <div className="deal__footer">
          <DomButton variant="secondary" disabled={step === 1} onClick={() => setStep((value) => value - 1)}>
            Назад
          </DomButton>
          {step < steps.length ? (
            <DomButton onClick={() => setStep((value) => value + 1)}>Продолжить</DomButton>
          ) : (
            <DomButton onClick={() => go("success", lot)}>Отправить на оформление</DomButton>
          )}
        </div>
      </section>
    </main>
  );
}

function getStepDescription(step: number) {
  return [
    "Проверим объект, продавца и доступность электронного оформления.",
    "Подготовим договор по данным объекта и сторон. Перед подписанием его можно открыть на просмотр.",
    "Выберите безопасный способ передачи денег и проверьте стоимость сопровождения.",
    "Соберём финальные статусы перед отправкой документов на оформление.",
  ][step - 1];
}

function getStepPanel(step: number, showNotice: (text: string) => void) {
  if (step === 1) {
    return (
      <>
        <h3>Результаты проверки</h3>
        <div className="deal-list">
          {dealChecks.map((item) => (
            <div key={item}>
              <CheckCircle2 size={19} />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </>
    );
  }

  if (step === 2) {
    return (
      <>
        <h3>Договор купли-продажи</h3>
        <p className="deal__copy">
          Заполним договор по данным объекта и сторон. Перед подписанием вы увидите документ и чек-лист сделки.
        </p>
        <DomButton variant="secondary" onClick={() => showNotice("Предпросмотр договора появится после проверки сторон")}>
          <FileText size={18} />
          Открыть предпросмотр
        </DomButton>
      </>
    );
  }

  if (step === 3) {
    return (
      <>
        <h3>Безопасные расчёты</h3>
        <div className="payment-options">
          <label className="is-selected">
            <input defaultChecked name="payment" type="radio" />
            <Landmark size={20} />
            <span>
              <strong>Защищённый платёж через Домклик</strong>
              Деньги поступят продавцу после регистрации
            </span>
          </label>
          <label>
            <input name="payment" type="radio" />
            <CreditCard size={20} />
            <span>
              <strong>Перевод после регистрации</strong>
              Подходит для сделки между клиентами Сбера
            </span>
          </label>
        </div>
        <DealCalculator compact title="Расчёт пакета" />
      </>
    );
  }

  return (
    <>
      <h3>Готово к отправке</h3>
      <div className="deal-list">
        {["Документы собраны", "Договор подготовлен", "Способ расчётов выбран", "Электронная подача доступна"].map(
          (item) => (
            <div key={item}>
              <CheckCircle2 size={19} />
              <span>{item}</span>
            </div>
          ),
        )}
      </div>
    </>
  );
}
