import { useState, useEffect } from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import { Redirect, Route, useHistory, Switch } from "react-router-dom";
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import EditProfilePopup from "./EditPropilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import ImagePopup from "./ImagePopup";
import DeleteCardPopup from "./DeleteCardPopup";
import api from "../utils/Api";
import * as Auth from "../utils/Auth";
import Login from "./Login";
import Register from "./Register";
import InfoTooltip from "./InfoTooltip";
import ProtectedRoute from "./ProtectedRoute";
import successImg from "../images/success.svg";
import unSuccessImg from "../images/unsuccess.svg";

export default function App() {
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [selectedDeleteCard, setSelectedDeleteCard] = useState({});
  const [isDeleteCardPopupOpen, setIsDeleteCardPopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState({});
  const [isImagePopupOpen, setIsImagePopupOpen] = useState(false);

  const [isRegistrationPopupOpen, setIsRegistrationPopupOpen] = useState(false);
  const [registrationPopupImg, setRegistrationPopupImg] = useState(successImg);
  const [registrationPopupText, setRegistrationPopupText] = useState(
    "Вы успешно зарегистрировались!"
  );
  const [userEmail, setUserEmail] = useState("");

  const [loggedIn, setLoggedIn] = useState(false);
  const history = useHistory();

  useEffect(() => {
    tokenCheck();
    Promise.all([api.getProfileInfo(), api.getInitialCards()])
      .then(([currentUserInfo, initCards]) => {
        setCurrentUser(currentUserInfo);
        setCards(initCards);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  function handleCardLike(card) {
    //Проверка, есть ли уже лайк на этой карточке
    const isLiked = card.likes.some((i) => i._id === currentUser._id);

    //Отправляем запрос в API, получаем обновлённые данные карточки, находим нужную карточку и обновляем
    api
      .changeLikeCardStatus(card._id, isLiked)
      .then((newCard) => {
        setCards((state) =>
          state.map((c) => (c._id === card._id ? newCard : c))
        );
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  function handleDeleteCardClick(card) {
    setSelectedDeleteCard(card);
    setIsDeleteCardPopupOpen(true);
  }

  function handleCardClick(card) {
    setSelectedCard(card);
    setIsImagePopupOpen(true);
  }

  function handleRegistrationClick() {
    setIsRegistrationPopupOpen(true);
  }

  function handleUnsuccessRegistrationClick() {
    setRegistrationPopupImg(unSuccessImg);
    setRegistrationPopupText("Что-то пошло не так! Попробуйте ещё раз.");
    setIsRegistrationPopupOpen(true);
  }

  function closeAllPopups() {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsImagePopupOpen(false);
    setIsDeleteCardPopupOpen(false);
    setIsRegistrationPopupOpen(false);
    setSelectedCard({});
  }

  function handleUpdateUser(data) {
    api
      .changeProfileInfo(data)
      .then((result) => {
        setCurrentUser(result);
        closeAllPopups();
      })
      .catch((error) => {
        console.log(error);
      });
  }
  function handleUpdateAvatar(data) {
    api
      .changeProfileImg(data)
      .then((result) => {
        setCurrentUser(result);
        closeAllPopups();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function handleAddPlace(data) {
    api
      .addNewCard(data)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function handleDeleteCard(card) {
    api
      .deleteCard(card._id)
      .then(() => {
        setCards((state) => state.filter((c) => c._id !== card._id));
        closeAllPopups();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function handleLogin() {
    setLoggedIn(true);
    history.push("/mesto");
  }

  function handleLogout() {
    localStorage.removeItem("token");
  }

  function tokenCheck() {
    const token = localStorage.getItem("token");
    if (token) {
      Auth.getEmail(token).then((res) => {
        setUserEmail(res.data.email);
        handleLogin();
      });
    }
  }

  function Mesto() {
    return (
      <>
        <Header
          component={Header}
          userEmail={userEmail}
          headerButtonText={"Выйти"}
          headerButtonLink={"/sign-in"}
          onLogout={handleLogout}
        />
        <Main
          onEditProfile={handleEditProfileClick}
          onEditAvatar={handleEditAvatarClick}
          onAddPlace={handleAddPlaceClick}
          onCardClick={handleCardClick}
          cards={cards}
          onCardLike={handleCardLike}
          onDeleteCardClick={handleDeleteCardClick}
        />
        <Footer />
        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
        />
        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
        />
        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onAddPlace={handleAddPlace}
        />
        <DeleteCardPopup
          isOpen={isDeleteCardPopupOpen}
          onClose={closeAllPopups}
          onDeleteCard={handleDeleteCard}
          card={selectedDeleteCard}
        />
        <ImagePopup
          name="zoom"
          card={selectedCard}
          isOpen={isImagePopupOpen}
          onClose={closeAllPopups}
        />
      </>
    );
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <Switch>
          <ProtectedRoute
            exact
            path="/mesto"
            loggedIn={loggedIn}
            component={Mesto}
          />

          <Route exact path="/sign-up">
            <Header headerButtonText={"Войти"} headerButtonLink={"/sign-in"} />
            <Register
              onSuccessRegistration={handleRegistrationClick}
              onUnSuccessRegistration={handleUnsuccessRegistrationClick}
            />
            <InfoTooltip
              isOpen={isRegistrationPopupOpen}
              onClose={closeAllPopups}
              popupImg={registrationPopupImg}
              popupText={registrationPopupText}
            />
          </Route>

          <Route exact path="/sign-in">
            <Header
              headerButtonText={"Регистрация"}
              headerButtonLink={"/sign-up"}
            />
            <Login
              onLogin={handleLogin}
              onUnSuccessLogin={handleUnsuccessRegistrationClick}
            />
            <InfoTooltip
              isOpen={isRegistrationPopupOpen}
              onClose={closeAllPopups}
              popupImg={registrationPopupImg}
              popupText={registrationPopupText}
            />
          </Route>

          <Route path="/">
            {loggedIn ? <Redirect to="/mesto" /> : <Redirect to="/sign-in" />}
          </Route>
        </Switch>
      </div>
    </CurrentUserContext.Provider>
  );
}
