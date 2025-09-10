 // ============= Обработка формы контактов =============
 
 document.addEventListener('DOMContentLoaded', function() {
 
 const contactForm = document.querySelector('#consultation');
    
 if (contactForm) {
     contactForm.addEventListener('submit', function(e) {
         e.preventDefault();
         
         // Получаем данные формы
         const formData = new FormData(this);
         const data = Object.fromEntries(formData.entries());
         
         // Простая валидация
         if (!data.name || !data.email) {
             showNotification('Пожалуйста, заполните обязательные поля', 'error');
             return;
         }
         
         if (!data.privacy) {
             showNotification('Необходимо согласие на обработку персональных данных', 'error');
             return;
         }
         
         // Симуляция отправки
         const submitButton = this.querySelector('button[type="submit"]');
         const originalText = submitButton.textContent;
         submitButton.textContent = 'Отправляем...';
         submitButton.disabled = true;
         
         // Отправка данных на сервер
         fetch('/Custom-Project/form/save_form.php', {
             method: 'POST',
             body: JSON.stringify(data),
         })
         .then(response => response.json())
         .then(data => {
             console.log(data);
             showNotification('Заявка отправлена! Свяжусь с вами в течение 24 часов', 'success');
             this.reset();
             submitButton.textContent = originalText;
             submitButton.disabled = false;
         })
         .catch(error => {
             console.error('Ошибка:', error);
         });
/*
         setTimeout(() => {

             
             // Логирование данных (в реальном проекте здесь был бы AJAX запрос)
             console.log('Форма отправлена:', data);
         }, 2000);
         */
     });
 }
});
 // ============= Система уведомлений =============
 function showNotification(message, type = 'info') {
     // Создаем элемент уведомления
     const notification = document.createElement('div');
     notification.className = `notification notification-${type}`;
     notification.innerHTML = `
         <div class="notification-content">
             <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
             <span>${message}</span>
             <button class="notification-close">&times;</button>
         </div>
     `;
     
     // Добавляем стили для уведомлений (если их еще нет)
     if (!document.querySelector('#notification-styles')) {
         const style = document.createElement('style');
         style.id = 'notification-styles';
         style.textContent = `
             .notification {
                 position: fixed;
                 top: 100px;
                 right: 20px;
                 background: white;
                 padding: 20px;
                 border-radius: 12px;
                 box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
                 z-index: 10000;
                 transform: translateX(400px);
                 transition: transform 0.3s ease;
                 max-width: 400px;
             }
             
             .notification.show {
                 transform: translateX(0);
             }
             
             .notification-success {
                 border-left: 4px solid var(--accent-color);
             }
             
             .notification-error {
                 border-left: 4px solid var(--danger-color);
             }
             
             .notification-info {
                 border-left: 4px solid var(--primary-color);
             }
             
             .notification-content {
                 display: flex;
                 align-items: center;
                 gap: 12px;
             }
             
             .notification-content i {
                 font-size: 1.2rem;
             }
             
             .notification-success i {
                 color: var(--accent-color);
             }
             
             .notification-error i {
                 color: var(--danger-color);
             }
             
             .notification-info i {
                 color: var(--primary-color);
             }
             
             .notification-content span {
                 flex: 1;
                 color: var(--dark-color);
                 font-weight: 500;
             }
             
             .notification-close {
                 background: none;
                 border: none;
                 font-size: 1.5rem;
                 color: var(--gray-color);
                 cursor: pointer;
                 padding: 0;
                 width: 24px;
                 height: 24px;
                 display: flex;
                 align-items: center;
                 justify-content: center;
             }
             
             .notification-close:hover {
                 color: var(--dark-color);
             }
         `;
         document.head.appendChild(style);
     }
     
     // Добавляем на страницу
     document.body.appendChild(notification);
     
     // Показываем с анимацией
     setTimeout(() => notification.classList.add('show'), 100);
     
     // Обработка закрытия
     const closeBtn = notification.querySelector('.notification-close');
     closeBtn.addEventListener('click', () => {
         notification.classList.remove('show');
         setTimeout(() => notification.remove(), 300);
     });
     
     // Автоматическое закрытие через 5 секунд
     setTimeout(() => {
         if (notification.parentNode) {
             notification.classList.remove('show');
             setTimeout(() => notification.remove(), 300);
         }
     }, 5000);
 }
 