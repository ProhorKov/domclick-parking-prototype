import { ArrowRight, BadgeCheck, Building2, CheckCircle2, CreditCard, FileText, Search, UserRound } from "lucide-react";
import type { Navigate } from "../types";
import { Breadcrumbs } from "./shared/Breadcrumbs";
import { DomButton } from "./ui/DomButton";

interface FlowSchemeProps {
  go: Navigate;
}

const rows = [
  { icon: UserRound, title: "Покупатель", items: ["Ищет место", "Выбирает объект", "Запускает сделку"] },
  { icon: BadgeCheck, title: "Домклик", items: ["Проверяет объект", "Готовит договор", "Ведёт расчёты"] },
  { icon: Building2, title: "Продавец", items: ["Публикует лот", "Подтверждает условия", "Получает оплату"] },
];

export function FlowScheme({ go }: FlowSchemeProps) {
  return (
    <main className="shell page">
      <Breadcrumbs go={go} items={["Главная", "Сервисы", "Сценарий сделки"]} />
      <section className="surface flow">
        <span className="eyebrow">Как это работает</span>
        <h1>От выбора места до безопасной сделки</h1>
        <p className="flow__lead">
          Покупатель видит не только объявление, а весь путь: проверку, договор, расчёты и электронное оформление.
        </p>

        <div className="flow__rows">
          {rows.map((row) => (
            <div className="flow-row" key={row.title}>
              <div className="flow-row__title">
                <row.icon size={20} />
                <strong>{row.title}</strong>
              </div>
              {row.items.map((item, index) => (
                <div className="flow-row__item" key={item}>
                  {getFlowIcon(index)}
                  <span>{item}</span>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="flow__actions">
          <DomButton onClick={() => go("catalog")}>
            Пройти как покупатель
            <ArrowRight size={17} />
          </DomButton>
          <DomButton variant="secondary" onClick={() => go("partner")}>
            Открыть кабинет партнёра
          </DomButton>
        </div>
      </section>
    </main>
  );
}

function getFlowIcon(index: number) {
  const icons = [Search, FileText, CreditCard, CheckCircle2];
  const Icon = icons[index] ?? CheckCircle2;
  return <Icon size={18} />;
}
