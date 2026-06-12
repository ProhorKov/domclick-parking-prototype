import type {
  SmartBudgetAnswer,
  SmartCriterion,
  SmartDealAnswer,
  SmartFeedbackId,
  SmartLocationAnswer,
  SmartMarketAnswer,
  SmartQuestion,
} from "../types";

export const criteriaQuestion: SmartQuestion<SmartCriterion> = {
  id: "criteria",
  question: "Что важнее всего при выборе машино-места?",
  helper: "Можно выбрать до 3 вариантов",
  maxSelected: 3,
  options: [
    { id: "near_home", label: "Ближе к дому" },
    { id: "safe", label: "Юридическая безопасность" },
    { id: "low_price", label: "Ниже цена" },
    { id: "underground", label: "Подземный паркинг" },
    { id: "near_lift", label: "Рядом с лифтом" },
    { id: "online", label: "Можно оформить онлайн" },
    { id: "developer", label: "От застройщика" },
    { id: "owner", label: "От собственника" },
    { id: "charger", label: "Есть зарядка рядом" },
    { id: "investment", label: "Подходит для инвестиции" },
  ],
};

export const locationQuestion: SmartQuestion<SmartLocationAnswer> = {
  id: "location",
  question: "Где ищем место?",
  options: [
    { id: "own_complex", label: "В моём ЖК" },
    { id: "near_flat", label: "Рядом с выбранной квартирой" },
    { id: "district", label: "В районе" },
    { id: "metro", label: "Около метро" },
    { id: "unknown", label: "Пока не знаю" },
  ],
};

export const budgetQuestion: SmartQuestion<SmartBudgetAnswer> = {
  id: "budget",
  question: "Какой бюджет комфортен?",
  options: [
    { id: "to_2", label: "До 2 млн ₽" },
    { id: "from_2_to_2_5", label: "2,0–2,5 млн ₽" },
    { id: "from_2_5_to_3_5", label: "2,5–3,5 млн ₽" },
    { id: "any", label: "Цена не главное" },
  ],
};

export const dealQuestion: SmartQuestion<SmartDealAnswer> = {
  id: "deal",
  question: "Какой сценарий сделки предпочтителен?",
  options: [
    { id: "safe", label: "Хочу максимально безопасно" },
    { id: "fast", label: "Хочу быстро оформить" },
    { id: "cheap", label: "Хочу дешевле" },
    { id: "compare", label: "Хочу сначала сравнить варианты" },
  ],
};

export const marketQuestion: SmartQuestion<SmartMarketAnswer> = {
  id: "market",
  question: "Какой рынок рассматривается?",
  options: [
    { id: "primary", label: "Только от застройщика" },
    { id: "secondary", label: "Только от собственника" },
    { id: "all", label: "Оба варианта" },
  ],
};

export const detailQuestions = [locationQuestion, budgetQuestion, dealQuestion, marketQuestion];

export const feedbackOptions: Array<{ id: SmartFeedbackId; label: string; notice: string }> = [
  {
    id: "too_expensive",
    label: "Слишком дорого",
    notice: "Учли: слишком дорого. Показываем варианты дешевле.",
  },
  {
    id: "far",
    label: "Далеко от дома",
    notice: "Учли: далеко от дома. Ищем ближе к корпусу и лифту.",
  },
  {
    id: "underground_only",
    label: "Нужен только подземный паркинг",
    notice: "Учли: нужен подземный паркинг. Поднимаем такие варианты выше.",
  },
  {
    id: "verified_only",
    label: "Хочу только проверенные объекты",
    notice: "Учли: нужны проверенные объекты. Показываем безопасные варианты.",
  },
  {
    id: "developer_only",
    label: "Хочу от застройщика",
    notice: "Учли: нужен застройщик. Показываем первичный рынок.",
  },
  {
    id: "owner_only",
    label: "Хочу от собственника",
    notice: "Учли: нужен собственник. Показываем вторичный рынок.",
  },
  {
    id: "near_lift",
    label: "Нужно ближе к лифту",
    notice: "Учли: нужен лифт рядом. Ищем места с коротким маршрутом.",
  },
  {
    id: "more",
    label: "Показать больше вариантов",
    notice: "Учли: покажем больше альтернатив с другим порядком выдачи.",
  },
];
