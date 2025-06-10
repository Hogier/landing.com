// DevCraft - JavaScript для интерактивности

document.addEventListener('DOMContentLoaded', function() {
    
    // ============= Переключение категорий услуг =============
    const categoryButtons = document.querySelectorAll('.category-btn');
    const serviceGrids = document.querySelectorAll('.services-grid');
    
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // Убираем активный класс у всех кнопок
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            // Добавляем активный класс к текущей кнопке
            this.classList.add('active');
            
            // Скрываем все сетки услуг
            serviceGrids.forEach(grid => {
                grid.classList.add('hidden');
            });
            
            // Показываем нужную сетку
            const targetGrid = document.getElementById(`${category}-services`);
            if (targetGrid) {
                targetGrid.classList.remove('hidden');
                
                // Анимация появления карточек
                const cards = targetGrid.querySelectorAll('.service-card');
                cards.forEach((card, index) => {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.transition = 'all 0.5s ease';
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, index * 100);
                });
            }
        });
    });
    
    // ============= Переключение карточек в hero =============
    const showcaseCards = document.querySelectorAll('.showcase-card');
    
    showcaseCards.forEach(card => {
        card.addEventListener('click', function() {
            // Убираем активный класс у всех карточек
            showcaseCards.forEach(c => c.classList.remove('active'));
            // Добавляем активный класс к текущей
            this.classList.add('active');
        });
    });
    
    // Автоматическое переключение карточек hero
    let currentCardIndex = 0;
    setInterval(() => {
        showcaseCards[currentCardIndex].classList.remove('active');
        currentCardIndex = (currentCardIndex + 1) % showcaseCards.length;
        showcaseCards[currentCardIndex].classList.add('active');
    }, 6000); // Увеличил интервал до 6 секунд
    
    // ============= Плавная прокрутка к секциям =============
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#' || href === '#consultation') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ============= Обработка формы контактов =============
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
            
            setTimeout(() => {
                showNotification('Заявка отправлена! Свяжусь с вами в течение 24 часов', 'success');
                this.reset();
                submitButton.textContent = originalText;
                submitButton.disabled = false;
                
                // Логирование данных (в реальном проекте здесь был бы AJAX запрос)
                console.log('Форма отправлена:', data);
            }, 2000);
        });
    }
    
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
    
    // ============= Анимация при скролле =============
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Наблюдаем за элементами для анимации
    const animateElements = document.querySelectorAll('.expertise-card, .value-card, .service-card, .approach-step, .testimonial-card');
    animateElements.forEach(el => {
        observer.observe(el);
    });
    
    // Добавляем CSS для анимаций
    if (!document.querySelector('#scroll-animations')) {
        const style = document.createElement('style');
        style.id = 'scroll-animations';
        style.textContent = `
            .expertise-card,
            .value-card,
            .service-card,
            .approach-step,
            .testimonial-card {
                opacity: 0;
                transform: translateY(30px);
                transition: all 0.6s ease;
            }
            
            .expertise-card.animate-in,
            .value-card.animate-in,
            .service-card.animate-in,
            .approach-step.animate-in,
            .testimonial-card.animate-in {
                opacity: 1;
                transform: translateY(0);
            }
        `;
        document.head.appendChild(style);
    }
    
    // ============= Мобильное меню =============
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('nav');
    
    if (mobileMenuBtn && nav) {
        mobileMenuBtn.addEventListener('click', function() {
            nav.classList.toggle('mobile-active');
            
            // Меняем иконку
            const icon = this.querySelector('i');
            if (nav.classList.contains('mobile-active')) {
                icon.className = 'fas fa-times';
            } else {
                icon.className = 'fas fa-bars';
            }
        });
        
        // Закрываем меню при клике на ссылку
        const navLinks = nav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('mobile-active');
                mobileMenuBtn.querySelector('i').className = 'fas fa-bars';
            });
        });
    }
    
    // ============= Эффект печатающего текста в hero =============
    const heroTitle = document.querySelector('.hero-content h1');
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        heroTitle.style.borderRight = '2px solid var(--primary-color)';
        
        let i = 0;
        const typeSpeed = 40; // Замедлил для лучшего эффекта
        
        function typeWriter() {
            if (i < text.length) {
                heroTitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, typeSpeed);
            } else {
                // Убираем курсор после завершения
                setTimeout(() => {
                    heroTitle.style.borderRight = 'none';
                }, 1000);
            }
        }
        
        // Запускаем эффект через 800мс после загрузки
        setTimeout(typeWriter, 800);
    }
    
    // ============= Счетчики в статистике =============
    const statNumbers = document.querySelectorAll('.stat-number');
    
    function animateCounter(element) {
        const target = element.textContent;
        const isNumber = /^\d+/.test(target);
        
        if (!isNumber) return;
        
        const finalNumber = parseInt(target.match(/\d+/)[0]);
        const suffix = target.replace(/^\d+/, '');
        let current = 0;
        const increment = finalNumber / 60; // Анимация за 1 секунду (60 кадров)
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= finalNumber) {
                element.textContent = finalNumber + suffix;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current) + suffix;
            }
        }, 16);
    }
    
    // Запускаем анимацию счетчиков при появлении в области видимости
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                statsObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    statNumbers.forEach(stat => {
        statsObserver.observe(stat);
    });
    
    // ============= Предзаполнение формы из URL параметров =============
    const urlParams = new URLSearchParams(window.location.search);
    const automationArea = urlParams.get('area');
    
    if (automationArea && contactForm) {
        const areaSelect = contactForm.querySelector('#automation-area');
        if (areaSelect) {
            areaSelect.value = automationArea;
        }
    }
    
    // ============= Консоль приветствие =============
    console.log('%c🎯 DevCraft', 'font-size: 24px; font-weight: bold; color: #f97316;');
    console.log('%cЭксперт по автоматизации бизнес-процессов', 'font-size: 14px; color: #64748b;');
    console.log('%cСвязаться: expert@devcraft.ru', 'font-size: 12px; color: #22c55e;');
});

// ============= Утилиты =============

// Функция для плавного скролла к элементу
function scrollToElement(elementId, offset = 100) {
    const element = document.getElementById(elementId);
    if (element) {
        const headerHeight = document.querySelector('header').offsetHeight;
        const targetPosition = element.offsetTop - headerHeight - offset;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

// Функция для отправки события в аналитику (заглушка)
function trackEvent(category, action, label = '') {
    console.log('Analytics Event:', { category, action, label });
    // Здесь можно добавить код для Google Analytics, Yandex Metrica и т.д.
}

// Отслеживание кликов по кнопкам
document.addEventListener('click', function(e) {
    if (e.target.matches('.btn-primary')) {
        trackEvent('CTA', 'click', e.target.textContent.trim());
    }
    
    if (e.target.matches('.service-card .btn')) {
        const serviceName = e.target.closest('.service-card').querySelector('h3').textContent;
        trackEvent('Service', 'interest', serviceName);
    }
    
    if (e.target.matches('.showcase-card')) {
        const areaName = e.target.getAttribute('data-area');
        trackEvent('Expertise', 'showcase_click', areaName);
    }
});

// Экспорт функций для внешнего использования
window.DevCraft = {
    scrollToElement,
    trackEvent
}; 