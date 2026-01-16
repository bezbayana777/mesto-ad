
import {TOKEN, ID_GROUP } from '/config.js'

const config = {
  baseUrl: `https://mesto.nomoreparties.co/v1/${ ID_GROUP }`,
  headers: {
    authorization: `${ TOKEN }`,
    "Content-Type": "application/json",
  },
};

const getResponseData = (res) => {
  if (res.ok) return res.json();
  return Promise.reject(res.status);
}

export const getUserInfo = () => {
  return fetch(`${config.baseUrl}/users/me`, { 
    headers: config.headers,
  }).then(getResponseData);
};

export const getCardList = () => {
  return fetch(`${config.baseUrl}/cards`, {
    headers: config.headers,
  }).then(getResponseData);
}

export const setUserInfo = ({ name, about }) => {
  return fetch(`${config.baseUrl}/users/me`, {
    method: "PATCH",
    headers: config.headers,
    body: JSON.stringify({
      name,
      about,
    }),
  }).then(getResponseData);
};

export const setAvatar = ({ avatar}) => {
  return  fetch(`${config.baseUrl}/users/me/avatar`, {
    method: "PATCH",
    headers: config.headers,
    body: JSON.stringify({
      avatar
    })
  }).then(getResponseData)
}

export const addNewCard = ({ name, link }) => {
  return fetch(`${config.baseUrl}/cards`, {
    method: "POST",
    headers: config.headers,
    body: JSON.stringify({
      name,
      link
    })
  }).then(getResponseData)
}

export const deleteCardRequest = (cardID) => {
  return fetch(`${config.baseUrl}/cards/${cardID}`, {
    method: "DELETE",
    headers: config.headers,
    })
    .then(getResponseData)
}

export const changeLikeCardStatus = (cardID, isLiked) => {
  return fetch(`${config.baseUrl}/cards/likes/${cardID}`, {
    method: isLiked ?  "DELETE" : "PUT",
    headers: config.headers,
  }).then((res) => getResponseData(res));
};