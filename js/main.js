'use strict';

// defer гарантирует, что HTML уже разобран к моменту выполнения скрипта.
const orderDialog = document.getElementById('order-dialog');
const orderForm = document.getElementById('order-form');
const orderButtons = document.querySelectorAll('.product-card__button');
const closeDialogButton = document.getElementById('close-order-dialog');
const selectedProductInput = document.getElementById('selected-product');
const selectedProductName = document.getElementById('selected-product-name');
const successMessage = document.getElementById('success-message');
const formFields = Array.from(orderForm.elements).filter((field) => field.willValidate);

function clearValidation() {
  formFields.forEach((field) => field.removeAttribute('aria-invalid'));
}

function openOrderDialog(productName) {
  orderForm.reset();
  clearValidation();
  successMessage.hidden = true;
  selectedProductInput.value = productName;
  selectedProductName.textContent = productName;
  orderDialog.showModal();
}

orderButtons.forEach((button) => {
  button.addEventListener('click', () => openOrderDialog(button.dataset.product));
});

closeDialogButton.addEventListener('click', () => orderDialog.close());

// После исправления поля снимаем его отметку ошибки.
formFields.forEach((field) => {
  const clearFieldError = () => {
    if (field.validity.valid) {
      field.removeAttribute('aria-invalid');
    }
  };
  field.addEventListener('input', clearFieldError);
  field.addEventListener('change', clearFieldError);
});

orderForm.addEventListener('submit', (event) => {
  // novalidate отключает автоматическую проверку, preventDefault - отправку.
  event.preventDefault();
  clearValidation();

  if (!orderForm.checkValidity()) {
    formFields.forEach((field) => {
      if (!field.validity.valid) {
        field.setAttribute('aria-invalid', 'true');
      }
    });
    orderForm.reportValidity();
    return;
  }

  // Это демонстрация: сетевого запроса и сохранения данных здесь нет.
  orderForm.reset();
  selectedProductInput.value = '';
  selectedProductName.textContent = '';
  orderDialog.close();
  successMessage.hidden = false;
  successMessage.scrollIntoView({ block: 'center' });
});
