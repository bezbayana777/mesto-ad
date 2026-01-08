/*
  Файл index.js является точкой входа в наше приложение
  и только он должен содержать логику инициализации нашего приложения
  используя при этом импорты из других файлов

  Из index.js не допускается что то экспортировать
*/

import { createCardElement, deleteCard, likeCard } from "./components/card.js";
import { openModalWindow, closeModalWindow, setCloseModalWindowEventListeners } from "./components/modal.js";
import { getUserInfo, getCardList, setAvatar, setUserInfo, addNewCard, deleteCardRequest, changeLikeCardStatus } from "./components/api.js";
import { enableValidation, clearValidation } from './components/validation.js';


const placesWrap = document.querySelector(".places__list");
const profileFormModalWindow = document.querySelector(".popup_type_edit");
const profileForm = profileFormModalWindow.querySelector(".popup__form");
const profileTitleInput = profileForm.querySelector(".popup__input_type_name");
const profileDescriptionInput = profileForm.querySelector(".popup__input_type_description");

const cardFormModalWindow = document.querySelector(".popup_type_new-card");
const cardForm = cardFormModalWindow.querySelector(".popup__form");
const cardNameInput = cardForm.querySelector(".popup__input_type_card-name");
const cardLinkInput = cardForm.querySelector(".popup__input_type_url");

const imageModalWindow = document.querySelector(".popup_type_image");
const imageElement = imageModalWindow.querySelector(".popup__image");
const imageCaption = imageModalWindow.querySelector(".popup__caption");

const openProfileFormButton = document.querySelector(".profile__edit-button");
const openCardFormButton = document.querySelector(".profile__add-button");

const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
const profileAvatar = document.querySelector(".profile__image");

const avatarFormModalWindow = document.querySelector(".popup_type_edit-avatar");
const avatarForm = avatarFormModalWindow.querySelector(".popup__form");
const avatarInput = avatarForm.querySelector(".popup__input");

const cardInfoModalWindow = document.querySelector(".popup_type_info")
const cardInfoModalInfoList = cardInfoModalWindow.querySelector(".popup__info");

console.log(cardInfoModalInfoList);

let currentUserId = null;

const handlePreviewPicture = ({ name, link }) => {
  imageElement.src = link;
  imageElement.alt = name;
  imageCaption.textContent = name;
  openModalWindow(imageModalWindow);
};

const handleProfileFormSubmit = (evt) => {
  evt.preventDefault();

  const submitButton = evt.submitter;
  const initialText = submitButton.textContent;

  submitButton.textContent = "Сохранение..."

  setUserInfo({
    name: profileTitleInput.value,
    about: profileDescriptionInput.value,
  })
    .then((userData) => {
      profileTitle.textContent = userData.name;
      profileDescription.textContent = userData.about;
      closeModalWindow(profileFormModalWindow)
    })
    .catch((err) => {
      console.log(err)
    })
    .finally(() => {
      submitButton.textContent = initialText
    })
};

const handleAvatarFromSubmit = (evt) => {
  evt.preventDefault();
 const submitButton = evt.submitter;
  const initialText = submitButton.textContent;
  
  submitButton.textContent = "Сохранение...";
  
  setAvatar({ avatar: avatarInput.value })
    .then((userData) => {
      profileAvatar.style.backgroundImage = `url(${userData.avatar})`;
      closeModalWindow(avatarFormModalWindow);
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      submitButton.textContent = initialText;
    });
};

const handleCardFormSubmit = (evt) => {
  evt.preventDefault();
  const submitButton = evt.submitter;
  const initialText = submitButton.textContent;
  
  submitButton.textContent = "Создание...";
  
  addNewCard({
    name: cardNameInput.value,
    link: cardLinkInput.value,
  })
    .then((cardData) => {
      placesWrap.prepend(
        createCardElement(
          cardData,
          currentUserId,
          {
            onPreviewPicture: handlePreviewPicture,
            onLikeIcon: handleLikeCard,
            onDeleteCard: handleDeleteCard,
            onInfoClick: handleInfoClick
          }
        )
      );
      closeModalWindow(cardFormModalWindow);
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      submitButton.textContent = initialText;
    });
};

const handleLikeCard = (cardId, likeButton, likeCountElement, isLiked) => {
  changeLikeCardStatus(cardId, isLiked)
    .then((cardData) => {
      likeCard(likeButton);
      likeCountElement.textContent = cardData.likes.length;
    })
    .catch((err) => {
      console.log(err);
    });
};

const handleDeleteCard = (cardId, cardElement) => {
  deleteCardRequest(cardId)
    .then(() => {
      deleteCard(cardElement)
    })
    .catch((err) => {
      console.log(err);
    });
};

const formatDate = (date) =>
  date.toLocaleDateString("ru-RU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  
const createInfoString = (term, description) => {
  const template = document.getElementById('popup-info-definition-template');
  const infoElement = template.content.querySelector('.popup__info-item').cloneNode(true);
  infoElement.querySelector('.popup__info-term').textContent = term;
  infoElement.querySelector('.popup__info-description').textContent = description;
  return infoElement;
};


const createUserPreview = (user) => {
  const template = document.getElementById('popup-info-user-preview-template');
  const userElement = template.content.querySelector('.popup__list-item').cloneNode(true);
  
  userElement.textContent = user.name;
  
  return userElement;
};

const handleInfoClick = (cardId) => {
  const infoList = cardInfoModalWindow.querySelector('.popup__info');
  const userList = cardInfoModalWindow.querySelector('.popup__list');
  const textElement = cardInfoModalWindow.querySelector('.popup__text');
  
  infoList.innerHTML = '';
  userList.innerHTML = '';
  
  getCardList()
    .then((cards) => {
      const cardData = cards.find(card => card._id === cardId);
      
      infoList.append(
        createInfoString("Описание:", cardData.name) 
      );
      
      infoList.append(
        createInfoString("Дата создания:", formatDate(new Date(cardData.createdAt)))
      );
      
      infoList.append(
        createInfoString("Владелец:", cardData.owner.name || cardData.owner._id)
      );
      
      infoList.append(
        createInfoString("Количество лайков:", cardData.likes.length.toString())
      );
      
      textElement.textContent = "Лайкнули:";
      
      cardData.likes.forEach(user => {
        userList.append(createUserPreview(user));
      });
      
      openModalWindow(cardInfoModalWindow);
    })
    .catch((err) => {
      console.log(err);
    });
};

profileForm.addEventListener("submit", handleProfileFormSubmit);
cardForm.addEventListener("submit", handleCardFormSubmit);
avatarForm.addEventListener("submit", handleAvatarFromSubmit);

openProfileFormButton.addEventListener("click", () => {
  profileTitleInput.value = profileTitle.textContent;
  profileDescriptionInput.value = profileDescription.textContent;
  clearValidation(profileForm);
  openModalWindow(profileFormModalWindow);
});

profileAvatar.addEventListener("click", () => {
  avatarForm.reset();
  clearValidation(avatarForm);
  openModalWindow(avatarFormModalWindow);
});

openCardFormButton.addEventListener("click", () => {
  cardForm.reset();
  clearValidation(cardForm);
  openModalWindow(cardFormModalWindow);
});


const allPopups = document.querySelectorAll(".popup");
allPopups.forEach((popup) => {
  setCloseModalWindowEventListeners(popup);
});


document.addEventListener('DOMContentLoaded', () => {
  enableValidation();
});


Promise.all([getCardList(), getUserInfo()])
  .then(([cards, userData]) => {
    currentUserId = userData._id;
    profileTitle.textContent = userData.name;
    profileDescription.textContent = userData.about;
    profileAvatar.style.backgroundImage = `url(${userData.avatar})`;
    
    cards.forEach((cardData) => {
      placesWrap.append(
        createCardElement(
          cardData,
          currentUserId,
          {
            onPreviewPicture: handlePreviewPicture,
            onLikeIcon: handleLikeCard,
            onDeleteCard: handleDeleteCard,
            onInfoClick: handleInfoClick
          }
        )
      );
    });
  })
  .catch((err) => {
    console.log(err);
  });
