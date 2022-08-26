import { Link } from "react-router-dom";
import header__logo from "../images/header__logo.svg";

export default function Header(props) {
  return (
    <header className="header">
      <a href="/mesto">
        <img
          src={header__logo}
          alt="Логотип проекта Место Россия"
          className="header__logo"
        />
      </a>
      <div className="header__container">
        <p className="header__email">{props.userEmail}</p>
        <nav onClick={props.onLogout}>
          {
            props.userEmail ? (
              <Link to={props.headerButtonLink} className="header__link header__link_type_exit">
                {props.headerButtonText}
              </Link>
            ) : (
              <Link to={props.headerButtonLink} className="header__link">
                {props.headerButtonText}
              </Link>
            )
          }
        </nav>
      </div>
    </header>
  );
}
