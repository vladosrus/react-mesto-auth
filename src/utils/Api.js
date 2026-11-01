// Наш API отдаёт owner и likes как id, а компоненты ждут объекты с _id
const normalizeCard = (card) => ({
  ...card,
  owner: { _id: card.owner },
  likes: card.likes.map((_id) => ({ _id })),
});

const normalize = (data) => {
  if (Array.isArray(data)) return data.map(normalizeCard);
  return data && data.owner ? normalizeCard(data) : data;
};

class Api {
  constructor(options) {
    this._baseURL = options.baseUrl;
    this._headers = options.headers;
  }

  _getResponseData(res) {
    if (res.ok) {
      return res.json().then(normalize);
    } else {
      return Promise.reject(`Ошибка: ${res.status}`);
    }
  }

  getProfileInfo() {
    return fetch(`${this._baseURL}/users/me`, {
      method: "GET",
      headers: this._headers,
    }).then(this._getResponseData);
  }

  getInitialCards() {
    return fetch(`${this._baseURL}/cards`, {
      method: "GET",
      headers: this._headers,
    }).then(this._getResponseData);
  }

  changeProfileInfo(data) {
    return fetch(`${this._baseURL}/users/me`, {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify({
        name: data["name"],
        about: data["about"],
      }),
    }).then(this._getResponseData);
  }

  changeProfileImg(data) {
    return fetch(`${this._baseURL}/users/me/avatar`, {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify({
        avatar: data["avatar"],
      }),
    }).then(this._getResponseData);
  }

  addNewCard(data) {
    return fetch(`${this._baseURL}/cards`, {
      method: "POST",
      headers: this._headers,
      body: JSON.stringify({
        name: data["name"],
        link: data["link"],
      }),
    }).then(this._getResponseData);
  }

  deleteCard(cardId) {
    return fetch(`${this._baseURL}/cards/${cardId}`, {
      method: "DELETE",
      headers: this._headers,
    }).then(this._getResponseData);
  }

  changeLikeCardStatus(cardId, isLiked) {
    if (isLiked) {
      return fetch(`${this._baseURL}/cards/${cardId}/likes`, {
        method: "DELETE",
        headers: this._headers,
      }).then(this._getResponseData);
    } else {
      return fetch(`${this._baseURL}/cards/${cardId}/likes`, {
        method: "PUT",
        headers: this._headers,
      }).then(this._getResponseData);
    }
  }
}

const api = new Api({
  baseUrl: "/mesto-api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
