console.log("tech-bar.js conected");
    // Прокрутка технологий при скролле и вручную
    //  При скролле

    let isGrabing = false;
    let offset = 0;

    document.addEventListener("DOMContentLoaded", function(){


    const techStack = document.querySelector('.tech-stack-grid');
    let isElementVisible = false;
    
    const observerTech = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        isElementVisible = entry.isIntersecting;
      });
    }, { threshold: 0 });
    
    observerTech.observe(techStack);
    
    window.addEventListener('scroll', () => {
        console.log("!isElementVisible", !isElementVisible);

      if (!isElementVisible) return;
      if (isGrabing) return;

      const scrollPosition = window.scrollY;
      const elementTop = techStack.getBoundingClientRect().top  + window.scrollY;
      const viewportHeight = window.innerHeight;
    
      const scrollProgress = Math.min(
        Math.max((scrollPosition - elementTop + viewportHeight - 200) / (viewportHeight - 200), 0),
        1
      );
    
      offset = -850 * scrollProgress;
      console.log("offset: ", offset);
      //techStack.style.left = `${offset}px`;
      techStack.style.transform = `translateX(${offset}px)`;
    });



    // вручную

        const container = document.querySelector('.scroll-gasket');
        let isDragging = false;
        let startX;
        let scrollLeft;
    
        // Для мыши
        container.addEventListener('mousedown', function(e) {
            isDragging = true;
            isGrabing = true;
            startX = e.pageX - container.offsetLeft;
            scrollLeft = -offset//techStack.scrollLeft;
            container.style.cursor = 'grabbing';
            e.preventDefault(); // Предотвращаем выделение текста при перетаскивании
        });
    
        // Для тач-устройств
        container.addEventListener('touchstart', function(e) {
            isDragging = true;
            isGrabing = true;
            startX = e.touches[0].pageX - container.offsetLeft;
            scrollLeft = -offset//techStack.scrollLeft;
            e.preventDefault(); // Предотвращаем стандартное поведение
        });
    
        document.addEventListener('mouseup', function() {
            isDragging = false;
            container.style.cursor = 'grab';
        });
    
        document.addEventListener('touchend', function() {
            isDragging = false;
        });
    
        document.addEventListener('mousemove', function(e) {
            if (!isDragging) return;
            const x = e.pageX - container.offsetLeft;
            const walk = (x - startX) * 2; // Умножаем для более плавного скролла
            handleScroll(walk);
        });
    
        document.addEventListener('touchmove', function(e) {
            if (!isDragging) return;
            const x = e.touches[0].pageX - container.offsetLeft;
            const walk = (x - startX) * 2;
            handleScroll(walk);
            e.preventDefault(); // Предотвращаем стандартное поведение
        });
    
        function handleScroll(walk) {
            // Вычисляем границы
            const maxScrollLeft = techStack.scrollWidth - container.offsetWidth;
            const newScrollLeft = scrollLeft - walk;
            

            console.log("scrollLeft", scrollLeft);
            console.log("walk", walk);
            console.log("newScrollLeft", newScrollLeft);

    
            // Применяем ограничения
            if (newScrollLeft <= 0) {
                techStack.style.transform = `translateX(0px)`;
            } else if (newScrollLeft >= maxScrollLeft) {
                techStack.style.transform = `translateX(-${maxScrollLeft}px)`;
            } else {
                offset = -newScrollLeft;
                techStack.style.transform = `translateX(-${newScrollLeft}px)`;
            }
        }
    
        // Инициализация стилей
        container.style.cursor = 'grab';

});
