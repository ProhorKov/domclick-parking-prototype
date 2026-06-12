import type { SmartQuestion } from "../types";

interface SmartCatalogQuestionProps<T extends string> {
  question: SmartQuestion<T>;
  selected: T[];
  onToggle: (value: T) => void;
}

export function SmartCatalogQuestion<T extends string>({
  question,
  selected,
  onToggle,
}: SmartCatalogQuestionProps<T>) {
  const maxSelected = question.maxSelected ?? 1;

  return (
    <section className="smart-question">
      <div className="smart-question__heading">
        <h2>{question.question}</h2>
        {question.helper && <p>{question.helper}</p>}
      </div>
      <div className="smart-question__options">
        {question.options.map((option) => {
          const isSelected = selected.includes(option.id);
          const isDisabled = maxSelected > 1 && !isSelected && selected.length >= maxSelected;

          return (
            <button
              aria-pressed={isSelected}
              className={isSelected ? "is-selected" : ""}
              disabled={isDisabled}
              key={option.id}
              onClick={() => onToggle(option.id)}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </section>
  );
}
