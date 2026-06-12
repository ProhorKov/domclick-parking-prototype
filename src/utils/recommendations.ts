import type {
  Lot,
  SmartAnswers,
  SmartFeedbackId,
  SmartRecommendation,
  SmartRecommendationLabel,
} from "../types";

const labels: SmartRecommendationLabel[] = ["Лучшее совпадение", "Самый безопасный вариант", "Выгодная цена"];

export function getSmartRecommendations(
  lots: Lot[],
  answers: SmartAnswers,
  feedback?: SmartFeedbackId,
): SmartRecommendation[] {
  const candidateLots = applyHardFilters(lots, answers, feedback);
  const scored = candidateLots
    .map((lot) => scoreLot(lot, answers, feedback))
    .sort((left, right) => right.score - left.score || parsePrice(left.lot.price) - parsePrice(right.lot.price));

  const picked: SmartRecommendation[] = [];
  addRecommendation(picked, labels[0], scored[0]);

  const safeVariant = scored.find((item) => item.lot.verification === "passed" && !picked.some((pick) => pick.lot.id === item.lot.id));
  addRecommendation(picked, labels[1], safeVariant ?? scored.find((item) => !picked.some((pick) => pick.lot.id === item.lot.id)));

  const cheapVariant = [...scored]
    .filter((item) => !picked.some((pick) => pick.lot.id === item.lot.id))
    .sort((left, right) => parsePrice(left.lot.price) - parsePrice(right.lot.price))[0];
  addRecommendation(picked, labels[2], cheapVariant ?? scored.find((item) => !picked.some((pick) => pick.lot.id === item.lot.id)));

  return picked;
}

export function getFeedbackNotice(feedback: SmartFeedbackId) {
  const fallback = "Учли ваш выбор. Перестраиваем подборку.";

  return (
    {
      too_expensive: "Учли: слишком дорого. Показываем варианты дешевле.",
      far: "Учли: далеко от дома. Ищем ближе к корпусу и лифту.",
      underground_only: "Учли: нужен только подземный паркинг. Поднимаем такие варианты выше.",
      verified_only: "Учли: нужны проверенные объекты. Показываем безопасные варианты.",
      developer_only: "Учли: нужен застройщик. Показываем первичный рынок.",
      owner_only: "Учли: нужен собственник. Показываем вторичный рынок.",
      near_lift: "Учли: нужен лифт рядом. Ищем места с коротким маршрутом.",
      more: "Учли: покажем больше альтернатив с другим порядком выдачи.",
    } satisfies Record<SmartFeedbackId, string>
  )[feedback] ?? fallback;
}

function addRecommendation(
  picked: SmartRecommendation[],
  label: SmartRecommendationLabel,
  recommendation?: Omit<SmartRecommendation, "label">,
) {
  if (!recommendation || picked.some((item) => item.lot.id === recommendation.lot.id)) return;
  picked.push({ ...recommendation, label });
}

function applyHardFilters(lots: Lot[], answers: SmartAnswers, feedback?: SmartFeedbackId) {
  return lots.filter((lot) => {
    if (answers.market === "primary" && lot.market !== "primary") return false;
    if (answers.market === "secondary" && lot.market !== "secondary") return false;
    if (feedback === "developer_only" && lot.market !== "primary") return false;
    if (feedback === "owner_only" && lot.market !== "secondary") return false;
    if (feedback === "verified_only" && lot.verification !== "passed") return false;
    if (feedback === "underground_only" && !isUnderground(lot)) return false;
    return true;
  });
}

function scoreLot(lot: Lot, answers: SmartAnswers, feedback?: SmartFeedbackId): Omit<SmartRecommendation, "label"> {
  let score = 0;
  const reasons = new Set<string>();
  const matches = new Set<string>();
  const price = parsePrice(lot.price);
  const isPassed = lot.verification === "passed";

  if (isPassed) {
    score += 12;
    reasons.add("объект уже прошёл проверку Домклик");
    matches.add("проверенный объект");
  } else {
    score -= 5;
  }

  if (lot.market === "primary") {
    score += 4;
    matches.add("от застройщика");
  } else {
    score += 3;
    matches.add("от собственника");
  }

  for (const criterion of answers.criteria) {
    if (criterion === "near_home" && isNearHome(lot)) {
      score += 16;
      reasons.add("место находится рядом с домом или корпусом");
      matches.add("близко к дому");
    }
    if (criterion === "safe" && isPassed) {
      score += 18;
      reasons.add("подходит для безопасной сделки с проверкой документов");
      matches.add("юридическая безопасность");
    }
    if (criterion === "low_price") {
      score += getPriceScore(price);
      reasons.add("цена ниже части похожих предложений");
      matches.add("ниже цена");
    }
    if (criterion === "underground" && isUnderground(lot)) {
      score += 14;
      reasons.add("это подземный паркинг с защищённым доступом");
      matches.add("подземный паркинг");
    }
    if (criterion === "near_lift" && isNearLift(lot)) {
      score += 15;
      reasons.add("короткий путь до лифта или подъезда");
      matches.add("рядом с лифтом");
    }
    if (criterion === "online" && hasText(lot, "электронная сделка")) {
      score += 12;
      reasons.add("можно пройти оформление онлайн");
      matches.add("онлайн оформление");
    }
    if (criterion === "developer" && lot.market === "primary") {
      score += 18;
      reasons.add("продавец — застройщик, сценарий проще показать в Домклик");
      matches.add("от застройщика");
    }
    if (criterion === "owner" && lot.market === "secondary") {
      score += 18;
      reasons.add("вариант от собственника с проверкой перед сделкой");
      matches.add("от собственника");
    }
    if (criterion === "charger" && hasText(lot, "зарядка")) {
      score += 14;
      reasons.add("рядом есть зарядка для электромобиля");
      matches.add("зарядка рядом");
    }
    if (criterion === "investment") {
      score += (lot.market === "primary" ? 7 : 3) + (isPassed ? 6 : 0) + (price <= 2_500_000 ? 5 : 0);
      reasons.add("может быть понятным инвестиционным вариантом по цене и статусу");
      matches.add("инвестиционный сценарий");
    }
  }

  if (answers.location === "own_complex" || answers.location === "near_flat") {
    if (isNearHome(lot) || isNearLift(lot)) {
      score += 10;
      reasons.add("удобно дойти от корпуса до места");
    }
  }
  if (answers.location === "metro" && /метро|аэропорт|сокол/i.test(`${lot.project} ${lot.address}`)) {
    score += 10;
    reasons.add("вариант расположен у понятного ориентира");
    matches.add("рядом с ориентиром");
  }

  score += getBudgetScore(price, answers.budget);

  if (answers.deal === "safe" && isPassed) score += 13;
  if (answers.deal === "fast" && hasText(lot, "электронная сделка")) score += 12;
  if (answers.deal === "cheap") score += getPriceScore(price);
  if (answers.deal === "compare") score += lot.tags.length >= 5 ? 6 : 2;

  if (feedback === "too_expensive") {
    score += getPriceScore(price) * 1.4;
    reasons.add("после обратной связи подняли более доступные варианты");
  }
  if (feedback === "far" && isNearHome(lot)) {
    score += 17;
    reasons.add("подборка перестроена в пользу близости к дому");
  }
  if (feedback === "near_lift" && isNearLift(lot)) {
    score += 18;
    reasons.add("учли запрос на короткий путь до лифта");
  }
  if (feedback === "underground_only" && isUnderground(lot)) score += 20;
  if (feedback === "verified_only" && isPassed) score += 20;
  if (feedback === "developer_only" && lot.market === "primary") score += 20;
  if (feedback === "owner_only" && lot.market === "secondary") score += 20;
  if (feedback === "more") score += lot.id % 2 === 0 ? 10 : -2;

  return {
    lot,
    score: Math.round(score),
    reasons: normalizeReasons(reasons, lot),
    matches: normalizeMatches(matches, lot),
  };
}

function parsePrice(price: string) {
  return Number(price.replace(/[^\d]/g, ""));
}

function getPriceScore(price: number) {
  if (price <= 2_000_000) return 18;
  if (price <= 2_500_000) return 13;
  if (price <= 3_000_000) return 7;
  return 2;
}

function getBudgetScore(price: number, budget?: SmartAnswers["budget"]) {
  if (!budget || budget === "any") return 0;
  if (budget === "to_2") return price <= 2_000_000 ? 24 : -12;
  if (budget === "from_2_to_2_5") return price >= 2_000_000 && price <= 2_500_000 ? 21 : -8;
  if (budget === "from_2_5_to_3_5") return price >= 2_500_000 && price <= 3_500_000 ? 18 : -5;
  return 0;
}

function hasText(lot: Lot, value: string) {
  const text = `${lot.type} ${lot.level} ${lot.distance} ${lot.tags.join(" ")} ${lot.description}`.toLowerCase();
  return text.includes(value.toLowerCase());
}

function isUnderground(lot: Lot) {
  return hasText(lot, "подземный");
}

function isNearLift(lot: Lot) {
  return hasText(lot, "лифт");
}

function isNearHome(lot: Lot) {
  return hasText(lot, "рядом с домом") || hasText(lot, "в корпусе") || /подъезд|двор|корпус/i.test(lot.distance);
}

function normalizeReasons(reasons: Set<string>, lot: Lot) {
  const list = Array.from(reasons);
  if (list.length === 0) {
    list.push(
      lot.verification === "passed"
        ? "подходит по рынку, цене и статусу проверки"
        : "вариант можно сравнить с проверкой перед сделкой",
    );
  }
  return list.slice(0, 3);
}

function normalizeMatches(matches: Set<string>, lot: Lot) {
  const list = Array.from(matches);
  for (const tag of lot.tags) {
    if (list.length >= 3) break;
    list.push(tag.toLowerCase());
  }
  return Array.from(new Set(list)).slice(0, 3);
}
