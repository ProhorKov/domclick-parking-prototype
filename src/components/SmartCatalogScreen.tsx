import { ArrowRight, ListFilter, RotateCcw, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { lots } from "../data/lots";
import {
  budgetQuestion,
  criteriaQuestion,
  dealQuestion,
  feedbackOptions,
  locationQuestion,
  marketQuestion,
} from "../data/smartQuestions";
import { getFeedbackNotice, getSmartRecommendations } from "../utils/recommendations";
import type {
  Market,
  Navigate,
  SmartAnswers,
  SmartBudgetAnswer,
  SmartCriterion,
  SmartDealAnswer,
  SmartFeedbackId,
  SmartLocationAnswer,
  SmartMarketAnswer,
} from "../types";
import { SmartCatalogQuestion } from "./SmartCatalogQuestion";
import { SmartRecommendationCard } from "./SmartRecommendationCard";
import { Breadcrumbs } from "./shared/Breadcrumbs";
import { DomButton } from "./ui/DomButton";

type SmartStep = "criteria" | "details" | "results";

export function SmartCatalogScreen({ go }: { go: Navigate }) {
  const [step, setStep] = useState<SmartStep>("criteria");
  const [answers, setAnswers] = useState<SmartAnswers>({ criteria: [] });
  const [feedback, setFeedback] = useState<SmartFeedbackId | undefined>();

  const recommendations = useMemo(() => getSmartRecommendations(lots, answers, feedback), [answers, feedback]);
  const canContinueDetails = Boolean(answers.location && answers.budget && answers.deal && answers.market);
  const catalogMarket: Market =
    feedback === "developer_only" ? "primary" : feedback === "owner_only" ? "secondary" : answers.market ?? "all";

  const toggleCriterion = (criterion: SmartCriterion) => {
    setFeedback(undefined);
    setAnswers((current) => {
      if (current.criteria.includes(criterion)) {
        return { ...current, criteria: current.criteria.filter((item) => item !== criterion) };
      }

      if (current.criteria.length >= 3) return current;
      return { ...current, criteria: [...current.criteria, criterion] };
    });
  };

  const applyFeedback = (nextFeedback: SmartFeedbackId) => {
    setFeedback(nextFeedback);
    setStep("results");
  };

  const restart = () => {
    setAnswers({ criteria: [] });
    setFeedback(undefined);
    setStep("criteria");
  };

  return (
    <main className="shell page smart-page">
      <Breadcrumbs go={go} items={["Главная", "Умный подбор"]} />

      <section className="smart-hero">
        <div>
          <span className="eyebrow">Умный подбор</span>
          <h1>Домклик подберёт 3 подходящих машино-места</h1>
          <p>Ответьте на несколько вопросов. Мы учтём рынок, бюджет, проверку объекта и сценарий сделки.</p>
        </div>
        <div className="smart-hero__actions">
          <DomButton variant="secondary" onClick={() => go("catalog", catalogMarket)}>
            <ListFilter size={17} />
            Открыть обычный каталог
          </DomButton>
          <DomButton variant="ghost" onClick={restart}>
            <RotateCcw size={17} />
            Начать заново
          </DomButton>
        </div>
      </section>

      <div className="smart-progress" aria-label="Шаги умного подбора">
        <span className={step === "criteria" ? "is-active" : ""}>1. Критерии</span>
        <span className={step === "details" ? "is-active" : ""}>2. Уточнения</span>
        <span className={step === "results" ? "is-active" : ""}>3. Подборка</span>
      </div>

      {step === "criteria" && (
        <section className="surface smart-panel">
          <SmartCatalogQuestion
            question={criteriaQuestion}
            selected={answers.criteria}
            onToggle={(criterion) => toggleCriterion(criterion)}
          />
          <div className="smart-panel__footer">
            <span>{answers.criteria.length > 0 ? `Выбрано: ${answers.criteria.length} из 3` : "Выберите хотя бы один критерий"}</span>
            <DomButton disabled={answers.criteria.length === 0} onClick={() => setStep("details")}>
              Продолжить
              <ArrowRight size={17} />
            </DomButton>
          </div>
        </section>
      )}

      {step === "details" && (
        <section className="surface smart-panel">
          <div className="smart-details-grid">
            <SmartCatalogQuestion
              question={locationQuestion}
              selected={answers.location ? [answers.location] : []}
              onToggle={(location: SmartLocationAnswer) => setAnswers((current) => ({ ...current, location }))}
            />
            <SmartCatalogQuestion
              question={budgetQuestion}
              selected={answers.budget ? [answers.budget] : []}
              onToggle={(budget: SmartBudgetAnswer) => setAnswers((current) => ({ ...current, budget }))}
            />
            <SmartCatalogQuestion
              question={dealQuestion}
              selected={answers.deal ? [answers.deal] : []}
              onToggle={(deal: SmartDealAnswer) => setAnswers((current) => ({ ...current, deal }))}
            />
            <SmartCatalogQuestion
              question={marketQuestion}
              selected={answers.market ? [answers.market] : []}
              onToggle={(market: SmartMarketAnswer) => setAnswers((current) => ({ ...current, market }))}
            />
          </div>
          <div className="smart-panel__footer">
            <DomButton variant="secondary" onClick={() => setStep("criteria")}>
              Назад
            </DomButton>
            <DomButton disabled={!canContinueDetails} onClick={() => setStep("results")}>
              Подобрать варианты
              <Sparkles size={17} />
            </DomButton>
          </div>
        </section>
      )}

      {step === "results" && (
        <>
          <section className="smart-results-heading">
            <div>
              <span className="eyebrow">Персональная выдача</span>
              <h2>Подобрали 3 варианта</h2>
              <p>
                {feedback
                  ? "Новые варианты отличаются от предыдущих по выбранному критерию."
                  : "Карточки ранжированы по совпадению с вашими ответами."}
              </p>
            </div>
            <DomButton onClick={() => go("catalog", catalogMarket)}>
              Показать весь каталог
              <ArrowRight size={17} />
            </DomButton>
          </section>

          {feedback && (
            <div className="smart-feedback-notice" role="status" aria-live="polite">
              {getFeedbackNotice(feedback)}
            </div>
          )}

          {recommendations.length < 3 ? (
            <section className="surface smart-low-results">
              <h2>Подходящих вариантов мало</h2>
              <p>Можно открыть весь каталог и сравнить предложения без жёстких ограничений.</p>
              <DomButton onClick={() => go("catalog", catalogMarket)}>Открыть весь каталог</DomButton>
            </section>
          ) : (
            <section className="smart-recommendations" aria-label="Рекомендации Домклик">
              {recommendations.map((recommendation) => (
                <SmartRecommendationCard
                  key={`${recommendation.label}-${recommendation.lot.id}`}
                  recommendation={recommendation}
                  onOpen={() => go("detail", recommendation.lot)}
                  onReject={() => applyFeedback("more")}
                />
              ))}
            </section>
          )}

          <section className="surface smart-feedback">
            <div>
              <h2>Не понравились варианты?</h2>
              <p>Выберите, что изменить, и Домклик перестроит подборку</p>
            </div>
            <div className="smart-feedback__options">
              {feedbackOptions.map((option) => (
                <button
                  className={feedback === option.id ? "is-selected" : ""}
                  key={option.id}
                  onClick={() => applyFeedback(option.id)}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <DomButton variant="secondary" onClick={() => go("catalog", catalogMarket)}>
              Открыть весь каталог
            </DomButton>
          </section>
        </>
      )}
    </main>
  );
}
