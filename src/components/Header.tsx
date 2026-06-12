import { Bell, Heart, Menu, UserRound } from "lucide-react";
import { useState } from "react";
import type { Navigate } from "../types";
import { Logo } from "./Logo";

interface HeaderProps {
  go: Navigate;
}

export function Header({ go }: HeaderProps) {
  const [notice, setNotice] = useState("");

  const showStub = (text: string) => {
    setNotice(text);
    window.setTimeout(() => setNotice(""), 2200);
  };

  return (
    <header className="header">
      <div className="header__inner shell">
        <button className="header__logo" onClick={() => go("home")} aria-label="На главную">
          <Logo />
        </button>

        <nav className="header__nav" aria-label="Основная навигация">
          <button onClick={() => go("catalog")}>Купить</button>
          <button onClick={() => go("catalog", "primary")}>Новостройки</button>
          <button onClick={() => go("flow")}>Сервисы</button>
          <button onClick={() => go("partner")}>Партнёрам</button>
        </nav>

        <div className="header__actions">
          <button className="header__publish" onClick={() => go("partner")}>
            Разместить объявление
          </button>
          <button
            className="icon-button header__desktop-action"
            onClick={() => showStub("Избранное появится в личном кабинете")}
            aria-label="Избранное"
          >
            <Heart size={18} />
          </button>
          <button
            className="icon-button header__desktop-action"
            onClick={() => showStub("Уведомления появятся после входа")}
            aria-label="Уведомления"
          >
            <Bell size={18} />
          </button>
          <button className="header__login" onClick={() => showStub("Вход в личный кабинет сейчас недоступен")}>
            <UserRound size={17} />
            Войти
          </button>
          <button className="icon-button header__menu" onClick={() => showStub("Основные разделы доступны в сценариях ниже")} aria-label="Меню">
            <Menu size={20} />
          </button>
        </div>
      </div>
      {notice && (
        <div className="header-toast" role="status" aria-live="polite">
          {notice}
        </div>
      )}
    </header>
  );
}
