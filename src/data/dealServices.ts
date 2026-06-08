import type { DealService, DealServiceId } from "../types";

export const packagePrice = 7000;

export const dealServices: DealService[] = [
  {
    id: "registration",
    title: "Регистрация сделки",
    shortTitle: "Регистрация",
    price: 2000,
    description: "Подготовим электронную подачу и покажем статусы оформления.",
  },
  {
    id: "object_check",
    title: "Проверка объекта",
    shortTitle: "Объект",
    price: 1500,
    description: "Проверим сведения о машино-месте и ограничения.",
  },
  {
    id: "party_check",
    title: "Проверка продавца/покупателя",
    shortTitle: "Стороны",
    price: 3000,
    description: "Подтвердим участника сделки перед оформлением.",
  },
  {
    id: "safe_payment",
    title: "Безопасный расчёт",
    shortTitle: "Расчёты",
    price: 1500,
    description: "Деньги передаются после выполнения условий сделки.",
  },
  {
    id: "promotion",
    title: "Продвижение объявления",
    shortTitle: "Продвижение",
    price: 500,
    description: "Поможем быстрее найти покупателя или подтвердить спрос.",
  },
];

export const allDealServiceIds = dealServices.map((service) => service.id);

export function formatMoney(value: number) {
  return new Intl.NumberFormat("ru-RU", {
    maximumFractionDigits: 0,
    style: "currency",
    currency: "RUB",
  }).format(value);
}

export function calculateSeparateTotal(selectedServices: DealServiceId[]) {
  return dealServices.reduce((total, service) => {
    return selectedServices.includes(service.id) ? total + service.price : total;
  }, 0);
}

export function calculateSaving() {
  return calculateSeparateTotal(allDealServiceIds) - packagePrice;
}
