export type Market = "all" | "primary" | "secondary";
export type Screen = "home" | "catalog" | "detail" | "deal" | "partner" | "flow" | "success";
export type VerificationState = "passed" | "attention";
export type DealServiceId = "registration" | "object_check" | "party_check" | "safe_payment" | "promotion";
export type DealCalculatorMode = "package" | "separate";

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

export interface DealService {
  id: DealServiceId;
  title: string;
  shortTitle: string;
  price: number;
  description: string;
}

export type NavigationPayload = Lot | Market;
export type Navigate = (screen: Screen, payload?: NavigationPayload) => void;
