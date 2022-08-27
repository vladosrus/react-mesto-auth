import { Link, Switch, Route } from "react-router-dom";
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
        <Switch>
          <Route exact path="/">
            <p className="header__email">{props.email}</p>
            <nav onClick={props.logout}>
              <Link
                to={"/sign-in"}
                className="header__link header__link_type_exit"
              >
                Выйти
              </Link>
            </nav>
          </Route>
          <Route exact path="/sign-in">
            <nav>
              <Link to={"/sign-up"} className="header__link">
                Регистрация
              </Link>
            </nav>
          </Route>
          <Route exact path="/sign-up">
            <nav>
              <Link to={"/sign-in"} className="header__link">
                Войти
              </Link>
            </nav>
          </Route>
        </Switch>
      </div>
    </header>
  );
}
