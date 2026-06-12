export type Market = "all" | "primary" | "secondary";
export type Screen = "home" | "catalog" | "detail" | "deal" | "partner" | "flow" | "success" | "smart";
export type VerificationState = "passed" | "attention";
export type DealServiceId = "registration" | "object_check" | "party_check" | "safe_payment" | "promotion";
export type DealCalculatorMode = "package" | "separate";
export type MapAreaType = "ЖК" | "район" | "улица" | "метро";
export type SmartCriterion =
  | "near_home"
  | "safe"
  | "low_price"
  | "underground"
  | "near_lift"
  | "online"
  | "developer"
  | "owner"
  | "charger"
  | "investment";
export type SmartLocationAnswer = "own_complex" | "near_flat" | "district" | "metro" | "unknown";
export type SmartBudgetAnswer = "to_2" | "from_2_to_2_5" | "from_2_5_to_3_5" | "any";
export type SmartDealAnswer = "safe" | "fast" | "cheap" | "compare";
export type SmartMarketAnswer = "primary" | "secondary" | "all";
export type SmartFeedbackId =
  | "too_expensive"
  | "far"
  | "underground_only"
  | "verified_only"
  | "developer_only"
  | "owner_only"
  | "near_lift"
  | "more";
export type SmartRecommendationLabel = "Лучшее совпадение" | "Самый безопасный вариант" | "Выгодная цена";

export interface Lot {
  id: number;
  market: Exclude<Market, "all">;
  title: string;
  project: string;
  address: string;
  price: string;
  meter: string;
  area: string;
  type: string;
  level: string;
  distance: string;
  seller: string;
  sellerNote: string;
  verification: VerificationState;
  tags: string[];
  image: string;
  imageAlt: string;
  description: string;
}

export interface MapArea {
  id: string;
  name: string;
  type: MapAreaType;
  district?: string;
  available: number;
  averagePrice: string;
  market: Exclude<Market, "all">;
  lotIds: number[];
  x: number;
  y: number;
  size: "small" | "medium" | "large";
  description: string;
}

export interface CatalogNavigationPayload {
  market?: Market;
  area?: MapArea | null;
  filters?: Partial<CatalogFilterState>;
}

export interface CatalogFilterState {
  priceFrom: string;
  priceTo: string;
  passedOnly: boolean;
  onlineOnly: boolean;
  chargerOnly: boolean;
}

export interface SmartAnswers {
  criteria: SmartCriterion[];
  location?: SmartLocationAnswer;
  budget?: SmartBudgetAnswer;
  deal?: SmartDealAnswer;
  market?: SmartMarketAnswer;
}

export interface SmartQuestionOption<T extends string> {
  id: T;
  label: string;
}

export interface SmartQuestion<T extends string> {
  id: string;
  question: string;
  helper?: string;
  maxSelected?: number;
  options: SmartQuestionOption<T>[];
}

export interface SmartRecommendation {
  lot: Lot;
  reasons: string[];
  matches: string[];
  score: number;
  label: SmartRecommendationLabel;
}

export interface DealService {
  id: DealServiceId;
  title: string;
  shortTitle: string;
  price: number;
  description: string;
}

export type NavigationPayload = Lot | Market | CatalogNavigationPayload;
export type Navigate = (screen: Screen, payload?: NavigationPayload) => void;
