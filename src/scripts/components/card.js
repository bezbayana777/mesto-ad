
export const likeCard = (likeButton) => {
  likeButton.classList.toggle("card__like-button_is-active");
};

export const deleteCard = (cardElement) => {
  cardElement.remove();
};

const getTemplate = () => {
  return document
    .getElementById("card-template")
    .content.querySelector(".card")
    .cloneNode(true);
};

export const createCardElement = (
  data,
  currentUserId,
  { onPreviewPicture, onLikeIcon, onDeleteCard, onInfoClick}
) => {
  const cardElement = getTemplate();
  const likeButton = cardElement.querySelector(".card__like-button");
  const deleteButton = cardElement.querySelector(".card__control-button_type_delete");
  const cardImage = cardElement.querySelector(".card__image");
  const likeCountElement = cardElement.querySelector(".card__like-count");
  const cardTitleElement = cardElement.querySelector(".card__title");
  const infoButton = cardElement.querySelector(".card__control-button_type_info"); 

  cardImage.src = data.link;
  cardImage.alt = data.name;
  cardTitleElement.textContent = data.name;
  
  likeCountElement.textContent = data.likes.length;
  
  const isLikedByCurrentUser = data.likes.some(like => like._id === currentUserId);
  if (isLikedByCurrentUser) {
    likeButton.classList.add("card__like-button_is-active");
  }
  if (data.owner._id !== currentUserId) {
    deleteButton.style.display = 'none';
  }
  
  likeButton.addEventListener("click", () => {
    if (onLikeIcon) {
      const isCurrentlyLiked = likeButton.classList.contains("card__like-button_is-active");
      onLikeIcon(data._id, likeButton, likeCountElement, isCurrentlyLiked);
    }
  });

  deleteButton.addEventListener("click", () => {
    if (onDeleteCard) {
      onDeleteCard(data._id, cardElement);
    }
  });

  if (onPreviewPicture) {
    cardImage.addEventListener("click", () => onPreviewPicture({
      name: data.name, 
      link: data.link
    }));
  }

  infoButton.addEventListener("click", () => {
    if (onInfoClick) {
      onInfoClick(data._id);
    }
  });

  return cardElement;
};