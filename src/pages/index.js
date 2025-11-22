/******************************************************
 *  1. IMPORTACIONES DE ESTILOS E IMÁGENES
 ******************************************************/
import "./index.css";

import logoImg from "../images/logo.svg";
import editPenImg from "../images/edit_pen.svg";
import addImg from "../images/add.svg";
import closeXImg from "../images/close_x.svg";
import deleteWhiteXImg from "../images/delete_white_x.svg";

/******************************************************
 *  2. INSERTAR IMÁGENES EN EL DOM
 *  - Asigna las imágenes importadas a los elementos HTML
 ******************************************************/
document.querySelector(".header__logo").src = logoImg;
document.querySelector(".profile__edit-btn-icon").src = editPenImg;
document.querySelector(".profile__add-btn-icon").src = addImg;
document.querySelectorAll(".modal__close-btn-icon").forEach((icon) => {
  icon.src = closeXImg;
});
document.querySelector(".preview-modal__close-btn-icon").src = deleteWhiteXImg;
document.querySelector(".popupModal__close-btn-icon").src = deleteWhiteXImg;

/******************************************************
 *  3. IMPORTAR VALIDACIÓN Y API
 ******************************************************/
import {
  enableValidation,
  settings,
  resetValidation,
  toggleButtonState,
} from "../scripts/validation.js";

import Api from "../utils/Api.js";

/******************************************************
 *  4. CONFIGURAR API
 ******************************************************/
const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1/",
  headers: {
    authorization: "b2223205-75cd-4d97-9d28-09c1fa70d69e",
    "Content-Type": "application/json",
  },
});

/******************************************************
 *  5. OBTENER DATA INICIAL (usuario + cards)
 ******************************************************/
api
  .getAppInfo()
  .then(([userData, cards]) => {
    // Insertar tarjetas
    cards.forEach((item) => {
      const cardElement = getCardElement(item);
      cardsList.append(cardElement);
    });

    // Insertar información del usuario
    document.querySelector(".profile__avatar").src = userData.avatar;
    document.querySelector(".profile__name").textContent = userData.name;
    document.querySelector(".profile__description").textContent =
      userData.about;
  })
  .catch(console.error);

/******************************************************
 *  6. SELECCIÓN DE ELEMENTOS DEL DOM
 ******************************************************/

// ---- Perfil ----
const editProfileBtn = document.querySelector(".profile__edit-btn");
const avatarModalBtn = document.querySelector(".profile__avatar-btn");
const profileNameEl = document.querySelector(".profile__name");
const profileDescriptionEl = document.querySelector(".profile__description");

// ---- Modal Editar Perfil ----
const editProfileModal = document.querySelector("#edit-profile-modal");
const editProfileCloseBtn = editProfileModal.querySelector(".modal__close-btn");
const editProfileFormEl = editProfileModal.querySelector(".modal__form");
const editProfileNameInput = editProfileModal.querySelector(
  "#profile-name-input"
);
const editProfileDescriptionInput = editProfileModal.querySelector(
  "#profile-description-input"
);

// ---- Modal Nueva Tarjeta ----
const newPostBtn = document.querySelector(".profile__add-btn");
const newPostModal = document.querySelector("#new-post-modal");
const newPostCloseBtn = newPostModal.querySelector(".modal__close-btn");
const newPostAddCard = newPostModal.querySelector(".modal__submit-btn");
const newPostImageLink = newPostModal.querySelector("#card-image-input");
const newPostCaption = newPostModal.querySelector("#caption-image-input");
const newPostFormEl = newPostModal.querySelector(".modal__form");

// ---- Modal Edite Avatar ----
const avatarModal = document.querySelector("#avatar-modal");
const avatarForm = avatarModal.querySelector(".modal__form");
const avatarCloseBtn = avatarModal.querySelector(".modal__close-btn");
const avatarInput = avatarModal.querySelector("#profile-avatar-input");


//Delete Popup Card Modal

const popupDeleteCardModal = document.querySelector("#popup-delete-card-modal");
const popupDeleteCardForm = popupDeleteCardModal.querySelector(".modal__form");

const deleteCardCancelBtn = popupDeleteCardModal.querySelector(".modal__submit-btn_cancel");
const deleteCardXBtn = popupDeleteCardModal.querySelector(".modal__close-btn_delete");

// ---- Modal Previsualización ----
const previewModal = document.querySelector("#preview-modal");
const previewModalCloseBtn = previewModal.querySelector(
  ".preview-modal__close-btn"
);
const previewImageEl = previewModal.querySelector(".modal__image");
const previewImageName = previewModal.querySelector(".modal__caption");

// ---- Cards ----
const cardTemplate = document
  .querySelector("#card-template")
  .content.querySelector(".card");
const cardsList = document.querySelector(".cards__list");

//--Delete Cards confirmation

let selectedCard, selectedCardId;

/******************************************************
 *  7. FUNCIONES DE MODALES (abrir/cerrar)
 ******************************************************/
function closeModal(modal) {
  modal.classList.remove("modal_is-opened");
  document.removeEventListener("keydown", handleEscape);
  modal.removeEventListener("mousedown", handleOverlayClick);
}

function openModal(modal) {
  modal.classList.add("modal_is-opened");
  document.addEventListener("keydown", handleEscape);
  modal.addEventListener("mousedown", handleOverlayClick);
}

function handleEscape(evt) {
  if (evt.key === "Escape") {
    const openedModal = document.querySelector(".modal_is-opened");
    if (openedModal) closeModal(openedModal);
  }
}

function handleOverlayClick(evt) {
  if (evt.target === evt.currentTarget) {
    closeModal(evt.currentTarget);
  }
}


function popupCloseModal(modal, ...buttons) {
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => closeModal(modal));
  });
}

// Aplicar a tu modal de eliminar tarjeta
popupCloseModal(popupDeleteCardModal, deleteCardCancelBtn, deleteCardXBtn);



/******************************************************
 *  8. GENERATES CARDS
 ******************************************************/
function getCardElement(data) {
  const cardElement = cardTemplate.cloneNode(true);
  const cardTitleEl = cardElement.querySelector(".card__title");
  const cardImageEl = cardElement.querySelector(".card__image");

  cardImageEl.src = data.link;
  cardImageEl.alt = data.name;
  cardTitleEl.textContent = data.name;

  // Like
  const cardLikeBtnEl = cardElement.querySelector(".card__like-btn");
  cardLikeBtnEl.addEventListener("click", () => {
    cardLikeBtnEl.classList.toggle("card__like-btn_active");
  });

  // Delete
  const cardDeleteBtnEl = cardElement.querySelector(".card__delete-btn");
  cardDeleteBtnEl.addEventListener("click", () =>
    handleDeleteCard(cardElement, data._id)
  );

  // Preview
  cardImageEl.addEventListener("click", () => {
    previewImageEl.src = data.link;
    previewImageEl.alt = data.name;
    previewImageName.textContent = data.name;
    openModal(previewModal);
  });

  return cardElement;
}

/******************************************************
 *  9. HANDLERS DE FORMULARIOS
 ******************************************************/

// ---- Edit profile ----
function handleProfileFormSubmit(evt) {
  evt.preventDefault();

  api
    .editUserInfo({
      name: editProfileNameInput.value,
      about: editProfileDescriptionInput.value,
    })
    .then((data) => {
      profileNameEl.textContent = data.name;
      profileDescriptionEl.textContent = data.about;
      closeModal(editProfileModal);
    })
    .catch(console.error);
}

// ---- Create new card ----
function handleNewPostSubmit(evt) {
  evt.preventDefault();

  const inputValues = {
    name: newPostCaption.value,
    link: newPostImageLink.value,
  };

  api
    .addNewCard(inputValues)
    .then((data) => {
      const cardElement = getCardElement(data);
      cardsList.prepend(cardElement);

      newPostFormEl.reset();

      const inputList = Array.from(
        newPostFormEl.querySelectorAll(settings.inputSelector)
      );
      toggleButtonState(inputList, newPostAddCard, settings);

      closeModal(newPostModal);
    })
    .catch(console.error);
}

// ---- Editar Avatar ----
avatarForm.addEventListener("submit", (evt) => {
  evt.preventDefault();

  api
    .editAvatar(avatarInput.value)
    .then((data) => {
      document.querySelector(".profile__avatar").src = data.avatar;
      avatarForm.reset();
      closeModal(avatarModal);
    })
    .catch(console.error);
});

/******************************************************
 *  10. EVENT LISTENERS
 ******************************************************/

// Edit profile
editProfileBtn.addEventListener("click", () => {
  editProfileNameInput.value = profileNameEl.textContent;
  editProfileDescriptionInput.value = profileDescriptionEl.textContent;
  resetValidation(editProfileFormEl, settings);
  openModal(editProfileModal);
});
editProfileCloseBtn.addEventListener("click", () =>
  closeModal(editProfileModal)
);
editProfileFormEl.addEventListener("submit", handleProfileFormSubmit);

// New post
newPostBtn.addEventListener("click", () => openModal(newPostModal));
newPostCloseBtn.addEventListener("click", () => closeModal(newPostModal));
newPostFormEl.addEventListener("submit", handleNewPostSubmit);

// Avatar modal
avatarModalBtn.addEventListener("click", () => openModal(avatarModal));
avatarCloseBtn.addEventListener("click", () => closeModal(avatarModal));

// Preview modal
previewModalCloseBtn.addEventListener("click", () => closeModal(previewModal));

// Delete Avatar Form

function handleDeleteSubmit(evt) {
  evt.preventDefault();
  api
    .deleteCard(selectedCardId)
    .then(() => {
      selectedCard.remove();
      closeModal(popupDeleteCardModal);
    })
    .catch(console.error);
}

popupDeleteCardForm.addEventListener("submit", handleDeleteSubmit);

/******************************************************
 *  11. ELIMINAR TARJETA
 ******************************************************/
function handleDeleteCard(cardElement, cardId) {
  selectedCard = cardElement;
  selectedCardId = cardId;
  // api
  //   .deleteCard(data._id)
  //   .then(() => cardElement.remove())
  //   .catch(console.error);
  openModal(popupDeleteCardModal);
}

/******************************************************
 *  12. ACTIVAR VALIDACIÓN
 ******************************************************/
enableValidation(settings);
