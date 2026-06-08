import { ChevronRight } from "lucide-react";
import type { Navigate } from "../../types";

interface BreadcrumbsProps {
  go: Navigate;
  items: string[];
}

export function Breadcrumbs({ go, items }: BreadcrumbsProps) {
  return (
    <nav className="breadcrumbs" aria-label="Хлебные крошки">
      {items.map((item, index) => (
        <span key={item}>
          {index === 0 ? <button onClick={() => go("home")}>{item}</button> : item}
          {index < items.length - 1 && <ChevronRight size={14} />}
        </span>
      ))}
    </nav>
  );
}
