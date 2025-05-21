document.addEventListener("DOMContentLoaded", function () {
  // Мобильное меню
  const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
  const nav = document.querySelector("nav");

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener("click", function () {
      nav.classList.toggle("active");
      this.querySelector("i").classList.toggle("fa-bars");
      this.querySelector("i").classList.toggle("fa-times");
    });
  }

  // Переключатель цен (месячные/годовые)
  const pricingToggle = document.getElementById("pricing-toggle");

  if (pricingToggle) {
    pricingToggle.addEventListener("change", function () {
      document.body.classList.toggle("annual");
    });
  }

  // Анимация при скролле
  const animateOnScroll = function () {
    const elements = document.querySelectorAll(
      ".problem-card, .feature-block, .pricing-card, .testimonial-card"
    );

    elements.forEach((element) => {
      const elementPosition = element.getBoundingClientRect().top;
      const screenPosition = window.innerHeight / 1.3;

      if (elementPosition < screenPosition) {
        element.classList.add("fade-in");
      }
    });
  };

  window.addEventListener("scroll", animateOnScroll);
  animateOnScroll(); // Запуск при загрузке страницы

  // FAQ аккордеон
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question");

    question.addEventListener("click", function () {
      // Закрываем все остальные элементы
      faqItems.forEach((otherItem) => {
        if (otherItem !== item) {
          otherItem.classList.remove("active");
        }
      });

      // Открываем/закрываем текущий элемент
      item.classList.toggle("active");
    });
  });

  // Автоматически открываем первый FAQ элемент
  if (faqItems.length > 0) {
    faqItems[0].classList.add("active");
  }

  // Слайдер отзывов
  const testimonialDots = document.querySelectorAll(".testimonial-dots .dot");
  const testimonialSlider = document.querySelector(".testimonials-slider");

  if (testimonialDots.length > 0 && testimonialSlider) {
    testimonialDots.forEach((dot, index) => {
      dot.addEventListener("click", function () {
        // Удаляем активный класс у всех точек
        testimonialDots.forEach((d) => d.classList.remove("active"));

        // Делаем текущую точку активной
        this.classList.add("active");

        // Прокручиваем слайдер
        const testimonialCards = document.querySelectorAll(".testimonial-card");
        if (testimonialCards.length > 0) {
          const cardWidth = testimonialCards[0].offsetWidth + 30; // 30px это gap между карточками
          testimonialSlider.scrollTo({
            left: cardWidth * index,
            behavior: "smooth",
          });
        }
      });
    });

    // Автоматическое переключение слайдов
    let currentSlide = 0;

    const autoSlide = function () {
      currentSlide = (currentSlide + 1) % testimonialDots.length;
      testimonialDots[currentSlide].click();
    };

    // Запускаем автоматическое переключение каждые 5 секунд
    let slideInterval = setInterval(autoSlide, 5000);

    // Останавливаем автоматическое переключение при наведении мыши на слайдер
    testimonialSlider.addEventListener("mouseenter", function () {
      clearInterval(slideInterval);
    });

    // Возобновляем автоматическое переключение при уходе мыши
    testimonialSlider.addEventListener("mouseleave", function () {
      slideInterval = setInterval(autoSlide, 5000);
    });
  }

  // Плавная прокрутка для якорных ссылок
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");

      if (targetId === "#") return;

      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 100, // 100px отступ для учета фиксированной шапки
          behavior: "smooth",
        });

        // Закрываем мобильное меню при клике на ссылку
        if (nav.classList.contains("active")) {
          nav.classList.remove("active");
          mobileMenuBtn.querySelector("i").classList.remove("fa-times");
          mobileMenuBtn.querySelector("i").classList.add("fa-bars");
        }
      }
    });
  });

  // Обработка отправки формы
  const demoForm = document.getElementById("demo-form");

  if (demoForm) {
    demoForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Собираем данные формы
      const formData = new FormData(demoForm);

      // Для отладки
      const formDataObj = {};
      formData.forEach((value, key) => {
        formDataObj[key] = value;
      });
      console.log("Form submission:", formDataObj);

      // Показываем сообщение об отправке
      const formElements = demoForm.elements;
      for (let i = 0; i < formElements.length; i++) {
        formElements[i].disabled = true;
      }

      // Отправляем данные на сервер
      fetch("form/save_form.php", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Server response:", data);

          // Элементы для сообщений
          const successMessage = document.querySelector(".success-message");
          const errorMessage = document.querySelector(".error-message");

          if (data.success) {
            // Показываем сообщение об успехе
            successMessage.innerHTML =
              '<i class="fas fa-check-circle"></i> Thank you for your request! Our specialist will contact you shortly.';
            successMessage.style.display = "block";
            errorMessage.style.display = "none";

            // Сбрасываем форму при успехе
            demoForm.reset();
          } else {
            // Показываем сообщение об ошибке
            errorMessage.innerHTML =
              '<i class="fas fa-exclamation-circle"></i> ' +
              (data.message ||
                "An error occurred while submitting the form. Please try again.");
            errorMessage.style.display = "block";
            successMessage.style.display = "none";
          }

          // Через 5 секунд возвращаем форму к исходному состоянию
          setTimeout(function () {
            for (let i = 0; i < formElements.length; i++) {
              formElements[i].disabled = false;
            }

            // Скрываем сообщения через 5 секунд, если это сообщение об успехе
            if (data.success) {
              setTimeout(function () {
                successMessage.style.display = "none";
              }, 5000);
            }
          }, 1000);
        })
        .catch((error) => {
          console.error("Error:", error);

          // Показываем сообщение об ошибке
          const errorMessage = document.querySelector(".error-message");
          errorMessage.innerHTML =
            '<i class="fas fa-exclamation-circle"></i> An error occurred while submitting the form. Please try again.';
          errorMessage.style.display = "block";

          // Разблокируем форму
          setTimeout(function () {
            for (let i = 0; i < formElements.length; i++) {
              formElements[i].disabled = false;
            }
          }, 1000);
        });
    });
  }

  // Анимация подсветки шапки при скролле
  const header = document.querySelector("header");

  if (header) {
    window.addEventListener("scroll", function () {
      if (window.scrollY > 50) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    });
  }

  // Добавляем стили для анимаций
  const style = document.createElement("style");
  style.textContent = `
        .fade-in {
            animation: fadeIn 0.5s ease forwards;
        }
        
        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .problem-card, .feature-block, .pricing-card, .testimonial-card {
            opacity: 0;
        }
        
        .success-message {
            background-color: var(--success-color, #28a745);
            color: white;
            padding: 15px;
            border-radius: var(--border-radius, 5px);
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .error-message {
            background-color: var(--error-color, #dc3545);
            color: white;
            padding: 15px;
            border-radius: var(--border-radius, 5px);
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .success-message i, .error-message i {
            font-size: 1.5rem;
        }
        
        header.scrolled {
            padding: 10px 0;
            background-color: rgba(255, 255, 255, 0.95);
        }
        
        /* Стили мобильного меню */
        @media (max-width: 768px) {
            nav {
                display: none;
                position: absolute;
                top: 100%;
                left: 0;
                width: 100%;
                background: white;
                padding: 20px;
                box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
            }
            
            nav.active {
                display: block;
            }
            
            nav ul {
                flex-direction: column;
                gap: 15px;
            }
            
            nav ul li {
                width: 100%;
                text-align: center;
            }
            
            nav ul li a {
                display: block;
                padding: 10px;
            }
        }
    `;
  //Слайдер для экрана
  document.head.appendChild(style);

  const heroSlides = document.querySelectorAll(
    ".pre-screen .screen-slider .screen-slide"
  );
  let currentHeroSlide = 0;

  if (heroSlides.length > 0) {
    heroSlides[0].classList.add("active");
  }

  const changeHeroSlide = () => {
    heroSlides[currentHeroSlide].classList.remove("active");
    currentHeroSlide = (currentHeroSlide + 1) % heroSlides.length;
    heroSlides[currentHeroSlide].classList.add("active");
  };

  let heroSlideInterval;
  if (heroSlides.length > 1) {
    heroSlideInterval = setInterval(changeHeroSlide, 5000);
  }

  // Слайдер для pad
  const padSlides = document.querySelectorAll(
    ".pre-pad .pad-slider .pad-slide"
  );
  let currentPadSlide = 0;

  if (padSlides.length > 0) {
    padSlides[0].classList.add("active");
  }

  const changePadSlide = () => {
    padSlides[currentPadSlide].classList.remove("active");
    currentPadSlide = (currentPadSlide + 1) % padSlides.length;
    padSlides[currentPadSlide].classList.add("active");
  };

  let padSlideInterval;
  if (padSlides.length > 1) {
    padSlideInterval = setInterval(changePadSlide, 5000);
  }

  // Слайдер для phone
  const phoneSlides = document.querySelectorAll(
    ".pre-phone .phone-slider .phone-slide"
  );
  let currentPhoneSlide = 0;

  if (phoneSlides.length > 0) {
    phoneSlides[0].classList.add("active");
  }

  const changePhoneSlide = () => {
    phoneSlides[currentPhoneSlide].classList.remove("active");
    currentPhoneSlide = (currentPhoneSlide + 1) % phoneSlides.length;
    phoneSlides[currentPhoneSlide].classList.add("active");
  };

  let phoneSlideInterval;
  if (phoneSlides.length > 1) {
    phoneSlideInterval = setInterval(changePhoneSlide, 5000);
  }

  // Добавляем переменную для хранения таймера автовозобновления слайдеров
  let autoResumeTimer = null;

  // Создаем функцию для синхронного переключения слайдов во всех трех слайдерах
  const syncChangeSlides = (direction) => {
    // Останавливаем все интервалы
    clearInterval(heroSlideInterval);
    clearInterval(padSlideInterval);
    clearInterval(phoneSlideInterval);
    
    // Очищаем существующий таймер, если он был установлен
    if (autoResumeTimer) {
      clearTimeout(autoResumeTimer);
      autoResumeTimer = null;
    }
    
    // Screen slider
    heroSlides[currentHeroSlide].classList.remove('active');
    if (direction === 'prev') {
      currentHeroSlide = (currentHeroSlide - 1 + heroSlides.length) % heroSlides.length;
    } else {
      currentHeroSlide = (currentHeroSlide + 1) % heroSlides.length;
    }
    heroSlides[currentHeroSlide].classList.add('active');
    
    // Pad slider
    padSlides[currentPadSlide].classList.remove('active');
    if (direction === 'prev') {
      currentPadSlide = (currentPadSlide - 1 + padSlides.length) % padSlides.length;
    } else {
      currentPadSlide = (currentPadSlide + 1) % padSlides.length;
    }
    padSlides[currentPadSlide].classList.add('active');
    
    // Phone slider
    phoneSlides[currentPhoneSlide].classList.remove('active');
    if (direction === 'prev') {
      currentPhoneSlide = (currentPhoneSlide - 1 + phoneSlides.length) % phoneSlides.length;
    } else {
      currentPhoneSlide = (currentPhoneSlide + 1) % phoneSlides.length;
    }
    phoneSlides[currentPhoneSlide].classList.add('active');
    
    // Устанавливаем таймер на возобновление автоматической смены слайдов через 30 секунд
    autoResumeTimer = setTimeout(() => {
      // Проверяем, что ни один из слайдеров не находится в полноэкранном режиме
      const allClosed = !screenSlider.classList.contains('fullscreen') && 
                        !padSlider.classList.contains('fullscreen') && 
                        !phoneSlider.classList.contains('fullscreen');
      
      // Возобновляем интервалы только если все слайдеры закрыты
      if (allClosed) {
        if (heroSlides.length > 1) {
          heroSlideInterval = setInterval(changeHeroSlide, 5000);
        }
        if (padSlides.length > 1) {
          padSlideInterval = setInterval(changePadSlide, 5000);
        }
        if (phoneSlides.length > 1) {
          phoneSlideInterval = setInterval(changePhoneSlide, 5000);
        }
      }
      
      autoResumeTimer = null;
    }, 30000); // 30 секунд
  };

  // Навигация по стрелкам для слайдеров
  // Стрелки навигации для экрана
  const screenPrevArrow = document.querySelector('.pre-screen .slider-arrow-prev');
  const screenNextArrow = document.querySelector('.pre-screen .slider-arrow-next');
  
  if (screenPrevArrow && screenNextArrow && heroSlides.length > 1) {
    screenPrevArrow.addEventListener('click', (e) => {
      e.preventDefault();
      syncChangeSlides('prev');
    });
    
    screenNextArrow.addEventListener('click', (e) => {
      e.preventDefault();
      syncChangeSlides('next');
    });
  }
  
  // Стрелки навигации для планшета
  const padPrevArrow = document.querySelector('.pre-pad .slider-arrow-prev');
  const padNextArrow = document.querySelector('.pre-pad .slider-arrow-next');
  
  if (padPrevArrow && padNextArrow && padSlides.length > 1) {
    padPrevArrow.addEventListener('click', (e) => {
      e.preventDefault();
      syncChangeSlides('prev');
    });
    
    padNextArrow.addEventListener('click', (e) => {
      e.preventDefault();
      syncChangeSlides('next');
    });
  }
  
  // Стрелки навигации для телефона
  const phonePrevArrow = document.querySelector('.pre-phone .slider-arrow-prev');
  const phoneNextArrow = document.querySelector('.pre-phone .slider-arrow-next');
  
  if (phonePrevArrow && phoneNextArrow && phoneSlides.length > 1) {
    phonePrevArrow.addEventListener('click', (e) => {
      e.preventDefault();
      syncChangeSlides('prev');
    });
    
    phoneNextArrow.addEventListener('click', (e) => {
      e.preventDefault();
      syncChangeSlides('next');
    });
  }

  // Добавляем функциональность полноэкранного режима для слайдеров
  const overlay = document.querySelector('.fullscreen-overlay');
  const preScreen = document.querySelector('.pre-screen');
  const prePad = document.querySelector('.pre-pad');
  const prePhone = document.querySelector('.pre-phone');
  const screenSlider = document.querySelector('.screen-slider');
  const padSlider = document.querySelector('.pad-slider');
  const phoneSlider = document.querySelector('.phone-slider');

  // Функция для центрирования слайдов внутри контейнеров в полноэкранном режиме
  const centerSlides = () => {
    // Центрирование экранных слайдов
    const screenSlider = document.querySelector('.screen-slider');
    const screenSlides = document.querySelectorAll('.screen-slide');
    
    if (screenSlider && screenSlides.length > 0 && screenSlider.classList.contains('fullscreen')) {
      const sliderWidth = screenSlider.offsetWidth;
      
      screenSlides.forEach(slide => {
        const slideWidth = slide.offsetWidth;
        const leftPosition = (sliderWidth - slideWidth) / 2;
        slide.style.left = `${leftPosition}px`;
      });
    }
    
    // Центрирование слайдов планшета
    const padSlider = document.querySelector('.pad-slider');
    const padSlides = document.querySelectorAll('.pad-slide');
    
    if (padSlider && padSlides.length > 0 && padSlider.classList.contains('fullscreen')) {
      const sliderWidth = padSlider.offsetWidth;
      
      padSlides.forEach(slide => {
        const slideWidth = slide.offsetWidth;
        const leftPosition = (sliderWidth - slideWidth) / 2;
        slide.style.left = `${leftPosition}px`;
      });
    }
    
    // Центрирование слайдов телефона
    const phoneSlider = document.querySelector('.phone-slider');
    const phoneSlides = document.querySelectorAll('.phone-slide');
    
    if (phoneSlider && phoneSlides.length > 0 && phoneSlider.classList.contains('fullscreen')) {
      const sliderWidth = phoneSlider.offsetWidth;
      
      phoneSlides.forEach(slide => {
        const slideWidth = slide.offsetWidth;
        const leftPosition = (sliderWidth - slideWidth) / 2;
        slide.style.left = `${leftPosition}px`;
      });
    }
  };

  // Функция для сброса позиционирования слайдов
  const resetSlidesPosition = () => {
    // Сброс экранных слайдов
    const screenSlides = document.querySelectorAll('.screen-slide');
    screenSlides.forEach(slide => {
      slide.style.left = '';
    });
    
    // Сброс слайдов планшета
    const padSlides = document.querySelectorAll('.pad-slide');
    padSlides.forEach(slide => {
      slide.style.left = '';
    });
    
    // Сброс слайдов телефона
    const phoneSlides = document.querySelectorAll('.phone-slide');
    phoneSlides.forEach(slide => {
      slide.style.left = '';
    });
  };

  // Добавляем обработчик изменения размеров окна только для полноэкранных слайдеров
  window.addEventListener('resize', () => {
    // Проверяем, есть ли слайдеры в полноэкранном режиме
    const hasFullscreenSlider = 
      document.querySelector('.screen-slider.fullscreen') || 
      document.querySelector('.pad-slider.fullscreen') || 
      document.querySelector('.phone-slider.fullscreen');
    
    // Вызываем центрирование только если есть полноэкранный слайдер
    if (hasFullscreenSlider) {
      centerSlides();
    }
  });

  // Функция для открытия слайдера в полноэкранном режиме
  const openFullscreenSlider = (slider) => {
    // Запоминаем родителя и следующий элемент для последующего восстановления позиции
    slider.dataset.parent = slider.parentNode.className;
    
    // Находим соответствующие стрелки в родительском контейнере слайдера
    const parentContainer = slider.parentNode;
    const prevArrow = parentContainer.querySelector('.slider-arrow-prev');
    const nextArrow = parentContainer.querySelector('.slider-arrow-next');
    
    // Сохраняем информацию о родителе стрелок
    if (prevArrow) prevArrow.dataset.parent = parentContainer.className;
    if (nextArrow) nextArrow.dataset.parent = parentContainer.className;
    
    // Делаем overlay видимым и активным перед добавлением слайдера
    overlay.classList.add('active');
    
    // Перемещаем слайдер внутрь overlay вместо body
    overlay.appendChild(slider);
    
    // Перемещаем стрелки навигации на уровень overlay и добавляем класс fullscreen
    if (prevArrow) {
      overlay.appendChild(prevArrow);
      prevArrow.classList.add('slider-arrow-fullscreen', 'fullscreen-ui-element');
    }
    
    if (nextArrow) {
      overlay.appendChild(nextArrow);
      nextArrow.classList.add('slider-arrow-fullscreen', 'fullscreen-ui-element');
    }
    
    // Создаем и добавляем кнопку закрытия (крестик)
    const closeButton = document.createElement('button');
    closeButton.classList.add('fullscreen-close-btn', 'fullscreen-ui-element');
    closeButton.innerHTML = '&#10005;'; // HTML-код для символа крестика
    closeButton.setAttribute('title', 'Закрыть');
    
    // Добавляем обработчик события клика на кнопку закрытия
    closeButton.addEventListener('click', (e) => {
      e.stopPropagation();
      closeFullscreenSlider();
    });
    
    // Создаем и добавляем кнопку увеличения (лупа)
    const zoomButton = document.createElement('button');
    zoomButton.classList.add('fullscreen-zoom-btn', 'fullscreen-ui-element');
    zoomButton.setAttribute('title', 'Увеличить');
    zoomButton.setAttribute('data-zoom-level', '1'); // Начальный уровень масштабирования

    // Создаем элемент для иконки лупы
    const zoomIcon = document.createElement('span');
    zoomIcon.classList.add('zoom-icon');
    zoomButton.appendChild(zoomIcon);

    // Добавляем обработчик события клика на кнопку увеличения
    zoomButton.addEventListener('click', (e) => {
      e.stopPropagation();
      
      // Получаем текущий слайд
      let currentSlide;
      if (slider.classList.contains('screen-slider')) {
        currentSlide = slider.querySelector('.screen-slide.active');
      } else if (slider.classList.contains('pad-slider')) {
        currentSlide = slider.querySelector('.pad-slide.active');
      } else if (slider.classList.contains('phone-slider')) {
        currentSlide = slider.querySelector('.phone-slide.active');
      }
      
      if (!currentSlide) return;
      
      // Получаем изображение в текущем слайде
      const img = currentSlide.querySelector('img');
      if (!img) return;
      
      // Получаем и изменяем уровень масштабирования
      let zoomLevel = parseFloat(zoomButton.getAttribute('data-zoom-level'));
      
      // Сначала удаляем все классы масштабирования
      img.classList.remove('slide-img-zoomed', 'slide-img-zoomed-1-5', 'slide-img-zoomed-2');
      
      // Циклически меняем уровень масштабирования: 1 -> 1.5 -> 2 -> 1
      if (zoomLevel === 1) {
        zoomLevel = 1.5;
        img.classList.add('slide-img-zoomed', 'slide-img-zoomed-1-5');
      } else if (zoomLevel === 1.5) {
        zoomLevel = 2;
        img.classList.add('slide-img-zoomed', 'slide-img-zoomed-2');
      } else {
        zoomLevel = 1;
      }
      
      // Обновляем атрибут
      zoomButton.setAttribute('data-zoom-level', zoomLevel.toString());
      
      // Обновляем содержимое кнопки в зависимости от уровня масштабирования
      if (zoomLevel === 1) {
        // Очищаем содержимое и добавляем иконку лупы
        zoomButton.innerHTML = '';
        const newZoomIcon = document.createElement('span');
        newZoomIcon.classList.add('zoom-icon');
        zoomButton.appendChild(newZoomIcon);
      } else {
        // Показываем текстовое значение масштаба
        zoomButton.innerHTML = `${zoomLevel}x`;
      }
    });
    
    // Создаем панель с миниатюрами устройств
    const devicesPanel = document.createElement('div');
    devicesPanel.classList.add('fullscreen-devices-panel');
    
    // Создаем и добавляем миниатюры устройств
    const deviceTypes = [
      { type: 'screen', src: 'images/screen.png', target: '.screen-slider' },
      { type: 'pad', src: 'images/pad.png', target: '.pad-slider' },
      { type: 'phone', src: 'images/phone.png', target: '.phone-slider' }
    ];
    
    deviceTypes.forEach(device => {
      const deviceIcon = document.createElement('img');
      deviceIcon.src = device.src;
      deviceIcon.classList.add('fullscreen-device-icon');
      deviceIcon.setAttribute('data-target', device.target);
      deviceIcon.setAttribute('title', `Показать ${device.type}`);
      
      // Если текущий слайдер соответствует этому устройству, делаем иконку активной
      if (slider.classList.contains(`${device.type}-slider`)) {
        deviceIcon.classList.add('active');
      }
      
      // Добавляем обработчик клика для переключения между устройствами
      deviceIcon.addEventListener('click', (e) => {
        e.stopPropagation();
        
        // Получаем целевой слайдер
        const targetSlider = document.querySelector(device.target);
        if (!targetSlider || targetSlider === slider) return;
        
        // Закрываем текущий слайдер и открываем новый
        closeFullscreenSlider();
        
        // Находим родительский контейнер целевого слайдера
        const targetContainer = document.querySelector(`.pre-${device.type}`);
        if (targetContainer) {
          // Имитируем клик по контейнеру для открытия слайдера
          setTimeout(() => {
            openFullscreenSlider(targetSlider);
          }, 100);
        }
      });
      
      devicesPanel.appendChild(deviceIcon);
    });
    
    // Создаем блок для описания слайда (пока не используется)
    const slideDescription = document.createElement('div');
    slideDescription.classList.add('fullscreen-slide-description');
    // В будущем здесь будет добавляться описание слайда

    // Создаем контейнер для элементов управления и описания
    const controlsContainer = document.createElement('div');
    controlsContainer.classList.add('fullscreen-controls-container', 'fullscreen-ui-element');

    // Добавляем панель и описание в контейнер
    controlsContainer.appendChild(slideDescription);
    controlsContainer.appendChild(devicesPanel);

    // Добавляем кнопки и контейнер в overlay
    overlay.appendChild(closeButton);
    overlay.appendChild(zoomButton);
    overlay.appendChild(controlsContainer);
    
    // Сохраняем ссылки на элементы интерфейса для последующего удаления
    slider.dataset.closeButton = 'fullscreen-close-btn';
    slider.dataset.zoomButton = 'fullscreen-zoom-btn';
    slider.dataset.controlsContainer = 'fullscreen-controls-container';
    
    slider.classList.add('fullscreen');
    
    // Центрируем слайды после перехода в полноэкранный режим
    setTimeout(centerSlides, 100); // Добавляем небольшую задержку для корректного расчета
    
    // Останавливаем автоматическую смену слайдов во ВСЕХ слайдерах при открытии полноэкранного режима
    if (heroSlideInterval) {
      clearInterval(heroSlideInterval);
      heroSlideInterval = null;
    }
    
    if (padSlideInterval) {
      clearInterval(padSlideInterval);
      padSlideInterval = null;
    }
    
    if (phoneSlideInterval) {
      clearInterval(phoneSlideInterval);
      phoneSlideInterval = null;
    }
    
    // Добавляем обработчики для автоматического скрытия/отображения элементов интерфейса
    setupUserActivityTracking(overlay);
  };

  // Функция для настройки отслеживания активности пользователя
  const setupUserActivityTracking = (overlay) => {
    let inactivityTimer;
    
    // Функция для показа UI элементов
    const showUI = () => {
      overlay.classList.remove('inactive');
    };
    
    // Функция для скрытия UI элементов
    const hideUI = () => {
      overlay.classList.add('inactive');
    };
    
    // Функция для сброса таймера неактивности
    const resetInactivityTimer = () => {
      clearTimeout(inactivityTimer);
      showUI();
      inactivityTimer = setTimeout(hideUI, 2000); // 2 секунды неактивности
    };
    
    // Обработчики событий для отслеживания активности пользователя
    overlay.addEventListener('mousemove', resetInactivityTimer);
    overlay.addEventListener('mousedown', resetInactivityTimer);
    overlay.addEventListener('touchstart', resetInactivityTimer);
    overlay.addEventListener('touchmove', resetInactivityTimer);
    overlay.addEventListener('keydown', resetInactivityTimer);
    
    // Изначально запускаем таймер скрытия
    resetInactivityTimer();
    
    // Сохраняем функцию для удаления обработчиков при закрытии
    overlay.dataset.removeActivityTracking = 'true';
  };

  // Функция для удаления обработчиков отслеживания активности
  const removeUserActivityTracking = (overlay) => {
    if (overlay.dataset.removeActivityTracking === 'true') {
      overlay.removeEventListener('mousemove', () => {});
      overlay.removeEventListener('mousedown', () => {});
      overlay.removeEventListener('touchstart', () => {});
      overlay.removeEventListener('touchmove', () => {});
      overlay.removeEventListener('keydown', () => {});
      delete overlay.dataset.removeActivityTracking;
    }
  };

  // Функция для закрытия полноэкранного режима
  const closeFullscreenSlider = () => {
    // Удаляем обработчики активности пользователя
    removeUserActivityTracking(overlay);
    
    // Сбрасываем масштабирование изображений перед закрытием
    const activeImages = document.querySelectorAll('.fullscreen .active img');
    activeImages.forEach(img => {
      img.classList.remove('slide-img-zoomed', 'slide-img-zoomed-1-5', 'slide-img-zoomed-2');
    });
    
    // Удаляем кнопки закрытия, увеличения и контейнер с элементами управления
    const closeButton = document.querySelector('.fullscreen-close-btn');
    const zoomButton = document.querySelector('.fullscreen-zoom-btn');
    const controlsContainer = document.querySelector('.fullscreen-controls-container');
    
    if (closeButton) closeButton.remove();
    if (zoomButton) zoomButton.remove();
    if (controlsContainer) controlsContainer.remove();
    
    // Сбрасываем позиционирование слайдов перед возвратом
    resetSlidesPosition();
    
    // Возвращаем слайдеры и стрелки на их исходное место в DOM
    if (screenSlider.classList.contains('fullscreen')) {
      const parentClass = screenSlider.dataset.parent;
      const parent = document.querySelector('.' + parentClass);
      if (parent) {
        // Возвращаем слайдер
        parent.appendChild(screenSlider);
        
        // Ищем и возвращаем стрелки
        const prevArrow = document.querySelector('.slider-arrow-prev[data-parent="' + parentClass + '"]');
        const nextArrow = document.querySelector('.slider-arrow-next[data-parent="' + parentClass + '"]');
        
        if (prevArrow) {
          parent.appendChild(prevArrow);
          // Удаляем класс полноэкранного режима
          prevArrow.classList.remove('slider-arrow-fullscreen');
        }
        
        if (nextArrow) {
          parent.appendChild(nextArrow);
          // Удаляем класс полноэкранного режима
          nextArrow.classList.remove('slider-arrow-fullscreen');
        }
      }
      screenSlider.classList.remove('fullscreen');
    }
    
    if (padSlider.classList.contains('fullscreen')) {
      const parentClass = padSlider.dataset.parent;
      const parent = document.querySelector('.' + parentClass);
      if (parent) {
        // Возвращаем слайдер
        parent.appendChild(padSlider);
        
        // Ищем и возвращаем стрелки
        const prevArrow = document.querySelector('.slider-arrow-prev[data-parent="' + parentClass + '"]');
        const nextArrow = document.querySelector('.slider-arrow-next[data-parent="' + parentClass + '"]');
        
        if (prevArrow) {
          parent.appendChild(prevArrow);
          // Удаляем класс полноэкранного режима
          prevArrow.classList.remove('slider-arrow-fullscreen');
        }
        
        if (nextArrow) {
          parent.appendChild(nextArrow);
          // Удаляем класс полноэкранного режима
          nextArrow.classList.remove('slider-arrow-fullscreen');
        }
      }
      padSlider.classList.remove('fullscreen');
    }
    
    if (phoneSlider.classList.contains('fullscreen')) {
      const parentClass = phoneSlider.dataset.parent;
      const parent = document.querySelector('.' + parentClass);
      if (parent) {
        // Возвращаем слайдер
        parent.appendChild(phoneSlider);
        
        // Ищем и возвращаем стрелки
        const prevArrow = document.querySelector('.slider-arrow-prev[data-parent="' + parentClass + '"]');
        const nextArrow = document.querySelector('.slider-arrow-next[data-parent="' + parentClass + '"]');
        
        if (prevArrow) {
          parent.appendChild(prevArrow);
          // Удаляем класс полноэкранного режима
          prevArrow.classList.remove('slider-arrow-fullscreen');
        }
        
        if (nextArrow) {
          parent.appendChild(nextArrow);
          // Удаляем класс полноэкранного режима
          nextArrow.classList.remove('slider-arrow-fullscreen');
        }
      }
      phoneSlider.classList.remove('fullscreen');
    }
    
    overlay.classList.remove('active');
    
    // Проверяем, что все слайдеры закрыты (не в полноэкранном режиме)
    const allClosed = !screenSlider.classList.contains('fullscreen') && 
                      !padSlider.classList.contains('fullscreen') && 
                      !phoneSlider.classList.contains('fullscreen');
    
    // Возобновляем автоматическую смену слайдов только если все слайдеры закрыты
    if (allClosed) {
      if (heroSlides.length > 1 && !heroSlideInterval) {
        heroSlideInterval = setInterval(changeHeroSlide, 5000);
      }
      if (padSlides.length > 1 && !padSlideInterval) {
        padSlideInterval = setInterval(changePadSlide, 5000);
      }
      if (phoneSlides.length > 1 && !phoneSlideInterval) {
        phoneSlideInterval = setInterval(changePhoneSlide, 5000);
      }
    }
  };

  // Добавляем обработчики событий
  if (preScreen) {
    preScreen.addEventListener('click', (e) => {
      // Игнорируем клики на стрелки
      if (e.target.classList.contains('slider-arrow')) return;
      openFullscreenSlider(screenSlider);
    });
  }

  if (prePad) {
    prePad.addEventListener('click', (e) => {
      // Игнорируем клики на стрелки
      if (e.target.classList.contains('slider-arrow')) return;
      openFullscreenSlider(padSlider);
    });
  }

  if (prePhone) {
    prePhone.addEventListener('click', (e) => {
      // Игнорируем клики на стрелки
      if (e.target.classList.contains('slider-arrow')) return;
      openFullscreenSlider(phoneSlider);
    });
  }

  // Закрытие при клике на затемнение
  if (overlay) {
    overlay.addEventListener('click', (e) => {
      // Проверяем, что клик был именно по overlay, а не по его дочерним элементам
      if (e.target === overlay) {
        closeFullscreenSlider();
      }
    });
  }

  // Закрытие по клавише Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && (
      screenSlider.classList.contains('fullscreen') || 
      padSlider.classList.contains('fullscreen') || 
      phoneSlider.classList.contains('fullscreen')
    )) {
      closeFullscreenSlider();
    }
  });
});
