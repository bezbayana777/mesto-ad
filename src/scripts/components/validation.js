
const showInputError = (formElement, inputElement, errorMessage) => {
  const errorElement = formElement.querySelector(`#${inputElement.id}-error`);
  inputElement.classList.add('popup__input_type_error');
  
  if (errorElement) {
    errorElement.textContent = errorMessage;
    errorElement.classList.add('popup__error_visible');
  }
};

const hideInputError = (formElement, inputElement) => {
  const errorElement = formElement.querySelector(`#${inputElement.id}-error`);
  inputElement.classList.remove('popup__input_type_error');
  
  if (errorElement) {
    errorElement.classList.remove('popup__error_visible');
    errorElement.textContent = '';
  }
};

const checkInputValidity = (formElement, inputElement) => {
  if (!inputElement.validity.valid) {
    if (inputElement.dataset.errorMessage && inputElement.validity.patternMismatch) {
      showInputError(formElement, inputElement, inputElement.dataset.errorMessage);
    } else {
      showInputError(formElement, inputElement, inputElement.validationMessage);
    }
  } else {
    hideInputError(formElement, inputElement);
  }
};

const hasInvalidInput = (inputList) => {
  return inputList.some((inputElement) => {
    return !inputElement.validity.valid;
  });
};

const disableSubmitButton = (buttonElement) => {
  buttonElement.classList.add('popup__button_disabled');
  buttonElement.disabled = true;
};

const enableSubmitButton = (buttonElement) => {
  buttonElement.classList.remove('popup__button_disabled');
  buttonElement.disabled = false;
};

const toggleButtonState = (inputList, buttonElement) => {
  if (hasInvalidInput(inputList)) {
    disableSubmitButton(buttonElement);
  } else {
    enableSubmitButton(buttonElement);
  }
};

const setEventListeners = (formElement) => {
  const inputList = Array.from(formElement.querySelectorAll('.popup__input'));
  const buttonElement = formElement.querySelector('.popup__button');
  
  toggleButtonState(inputList, buttonElement);
  
  inputList.forEach((inputElement) => {
    inputElement.addEventListener('input', () => {
      checkInputValidity(formElement, inputElement);
      toggleButtonState(inputList, buttonElement);
    });
  });
};

export const clearValidation = (formElement) => {
  const inputList = Array.from(formElement.querySelectorAll('.popup__input'));
  const buttonElement = formElement.querySelector('.popup__button');
  
  inputList.forEach((inputElement) => {
    hideInputError(formElement, inputElement);
  });
  
  disableSubmitButton(buttonElement);
  formElement.reset();
};

export const enableValidation = () => {
  const formList = Array.from(document.querySelectorAll('.popup__form'));
  formList.forEach((formElement) => {
    setEventListeners(formElement);
  });
};