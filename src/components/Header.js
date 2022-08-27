import { Link } from "react-router-dom";
import header__logo from "../images/header__logo.svg";

export default function Header(props) {
  return (
    <header className="header">
      <a href="/">
        <img
          src={header__logo}
          alt="Логотип проекта Место Россия"
          className="header__logo"
        />
      </a>
      <div className="header__container">
        {props.children}
      </div>
    </header>
  );
}
