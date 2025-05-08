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

  if (heroSlides.length > 1) {
    setInterval(changeHeroSlide, 5000);
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

  if (padSlides.length > 1) {
    setInterval(changePadSlide, 5000);
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

  if (phoneSlides.length > 1) {
    setInterval(changePhoneSlide, 5000);
  }
});
