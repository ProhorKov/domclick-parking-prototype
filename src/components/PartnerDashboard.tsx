import { BarChart3, Clock3, FileUp, Layers3, MessageSquare, ShieldCheck, Sparkles, Star } from "lucide-react";
import { useState } from "react";
import { partnerLots } from "../data/lots";
import type { Navigate } from "../types";
import { Breadcrumbs } from "./shared/Breadcrumbs";
import { DomButton } from "./ui/DomButton";

interface PartnerDashboardProps {
  go: Navigate;
}

export function PartnerDashboard({ go }: PartnerDashboardProps) {
  const [notice, setNotice] = useState("");

  return (
    <main className="shell page">
      <Breadcrumbs go={go} items={["Главная", "Домклик Pro", "Кабинет партнёра"]} />
      <div className="partner-layout">
        <aside className="surface partner-sidebar">
          <span className="eyebrow">Домклик Pro</span>
          <h1>Кабинет партнёра</h1>
          <p>Загружайте пул машино-мест, следите за заявками и смотрите спрос по объектам.</p>
          <DomButton onClick={() => setNotice("Шаблон загрузки лотов подготовлен")}>
            <FileUp size={18} />
            Загрузить лоты
          </DomButton>
          <DomButton variant="secondary" onClick={() => setNotice("Открыт план паркинга ЖК «Зелёный квартал»")}>
            <Layers3 size={18} />
            План паркинга
          </DomButton>
          <DomButton variant="secondary" onClick={() => setNotice("Открыт список заявок покупателей")}>
            <MessageSquare size={18} />
            Заявки покупателей
          </DomButton>
          {notice && <div className="partner-sidebar__notice">{notice}</div>}
        </aside>

        <div className="partner-content">
          <div className="metrics">
            <Metric icon={BarChart3} label="Заявки" value="20" />
            <Metric icon={Clock3} label="Средний срок продажи" value="31 день" />
            <Metric icon={Star} label="Конверсия в заявку" value="21%" />
          </div>

          <section className="surface partner-table">
            <div className="section-heading">
              <div>
                <h2>Лоты партнёра</h2>
                <p>Пул мест по ЖК «Зелёный квартал»</p>
              </div>
              <DomButton variant="secondary" onClick={() => setNotice("Импорт XML готов к настройке")}>
                <FileUp size={17} />
                Импорт
              </DomButton>
            </div>
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>Место</th>
                    <th>Статус</th>
                    <th>Цена</th>
                    <th>Заявки</th>
                    <th>Конверсия</th>
                  </tr>
                </thead>
                <tbody>
                  {partnerLots.map((lot) => (
                    <tr key={lot.id}>
                      <td>
                        <strong>{lot.id}</strong>
                      </td>
                      <td>
                        <span className="table-status">{lot.status}</span>
                      </td>
                      <td>{lot.price}</td>
                      <td>{lot.leads}</td>
                      <td>{lot.conversion}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="surface recommendations">
            <div className="section-heading">
              <div>
                <h2>Рекомендации</h2>
                <p>Что поможет получить больше заявок</p>
              </div>
            </div>
            <div className="recommendations__grid">
              <Recommendation icon={Sparkles} title="Продвинуть места у лифта" text="По ним выше конверсия в заявку" />
              <Recommendation icon={ShieldCheck} title="Проверить 12 лотов" text="После проверки появится бейдж доверия" />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function Metric({ icon: Icon, label, value }: { icon: typeof BarChart3; label: string; value: string }) {
  return (
    <div className="surface metric">
      <Icon size={22} />
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function Recommendation({
  icon: Icon,
  title,
  text,
}: {
  icon: typeof Sparkles;
  title: string;
  text: string;
}) {
  return (
    <div>
      <Icon size={21} />
      <strong>{title}</strong>
      <span>{text}</span>
    </div>
  );
}
