// Получаем модальное окно по id. Оно есть только на главной странице,
// а форма заявки - и в модальном окне, и на странице order.html.
const orderDialog = document.getElementById('order-dialog');

// Получаем форму заявки.
const orderForm = document.getElementById('order-form');

// Получаем сообщение об успешной отправке.
const successMessage = document.getElementById('success-message');

// Получаем блок с сообщением об успехе внутри модального окна.
const dialogSuccess = document.getElementById('order-dialog-success');

// Убираем признаки ошибок у всех полей формы.
function clearErrors() {
  orderForm.querySelectorAll('[aria-invalid]').forEach((field) => {
    field.removeAttribute('aria-invalid');
  });
}

// Проверяем, был ли клик внутри окна, а не по затемнённому фону вокруг него.
function isClickInsideDialog(event) {
  const rect = orderDialog.getBoundingClientRect();

  return event.clientX >= rect.left && event.clientX <= rect.right
    && event.clientY >= rect.top && event.clientY <= rect.bottom;
}

// В окне сообщение об успехе заменяет форму. Фокус переводим на сообщение,
// иначе он остался бы на скрытой кнопке отправки.
function showDialogSuccess() {
  orderForm.hidden = true;
  dialogSuccess.hidden = false;
  successMessage.focus();
}

if (orderDialog) {
  // Получаем все кнопки заказа в карточках товаров.
  const orderButtons = document.querySelectorAll('.product-card__button');

  // Получаем скрытое поле, в которое будет записан выбранный товар.
  const selectedProductInput = document.getElementById('selected-product');

  // Получаем место в окне, где показывается выбранный товар.
  const dialogProduct = document.getElementById('order-dialog-product');

  // Перебираем все кнопки «Заказать».
  orderButtons.forEach((button) => {
    button.addEventListener('click', () => {
      // Получаем название товара из data-атрибута.
      const productName = button.dataset.product;

      // Записываем товар в скрытое поле формы и показываем его в окне.
      selectedProductInput.value = productName;
      dialogProduct.textContent = productName;

      // Открываем модальное окно.
      orderDialog.showModal();
    });
  });

  // Закрываем модальное окно по кнопкам «Закрыть» и «Готово».
  document.getElementById('close-order-dialog').addEventListener('click', () => {
    orderDialog.close();
  });

  document.getElementById('order-dialog-done').addEventListener('click', () => {
    orderDialog.close();
  });

  // Закрываем окно кликом по затемнённому фону.
  orderDialog.addEventListener('click', (event) => {
    if (event.target === orderDialog && !isClickInsideDialog(event)) {
      orderDialog.close();
    }
  });

  // При любом закрытии окно возвращается к форме без старых ошибок.
  orderDialog.addEventListener('close', () => {
    orderForm.hidden = false;
    dialogSuccess.hidden = true;
    clearErrors();
  });
}

// Обрабатываем отправку формы.
orderForm.addEventListener('submit', (event) => {
  // Отменяем стандартную отправку формы,
  // потому что backend пока не подключён.
  event.preventDefault();

  // Сбрасываем предыдущие признаки ошибок.
  clearErrors();

  // Проверяем встроенные HTML-ограничения формы.
  if (!orderForm.checkValidity()) {
    Array.from(orderForm.elements).forEach((element) => {
      if (element.willValidate && !element.checkValidity()) {
        element.setAttribute('aria-invalid', 'true');
      }
    });

    // Показываем стандартные сообщения браузера.
    orderForm.reportValidity();
    return;
  }

  // Очищаем форму.
  orderForm.reset();

  // Показываем сообщение об успешной отправке.
  if (orderDialog) {
    showDialogSuccess();
  } else {
    successMessage.hidden = false;
  }
});
