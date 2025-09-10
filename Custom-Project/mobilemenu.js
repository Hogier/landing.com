document.addEventListener("DOMContentLoaded", function () {
    const menuBtn = document.querySelector(".mobile-menu-btn");
    const menuBtnIcon = menuBtn.querySelector("i");
    const menu = document.querySelector(".mobile-menu");
    const menuList = menu.querySelector("ul");
  
    const menuItems = {
      "Start": "hero",
      "Principles of our work": "expertise",
      "What are we developing?": "services",
      "Our technology stack": "tech-stack",
      "Development process": "process",
      "StaffPRO": "cases",
      "Contact": "contact"
    };
  
    // Заполняем меню
    for (let text in menuItems) {
      const li = document.createElement("li");
      li.textContent = text;
      li.dataset.target = menuItems[text];
      menuList.appendChild(li);
    }
  
    function openMenu() {
      menu.style.display = "block";
      if (menuBtnIcon) {
        menuBtnIcon.classList.remove("fa-bars");
        menuBtnIcon.classList.add("fa-times");
      }
    }
  
    function closeMenu() {
      menu.style.display = "none";
      if (menuBtnIcon) {
        menuBtnIcon.classList.remove("fa-times");
        menuBtnIcon.classList.add("fa-bars");
      }
    }
  
    function toggleMenu() {
      if (menu.style.display === "block") {
        closeMenu();
      } else {
        openMenu();
      }
    }
  
    // Переключение меню
    menuBtn.addEventListener("click", toggleMenu);
  
    // Клик по пункту меню
    menuList.addEventListener("click", function (e) {
      if (e.target.tagName === "LI") {
        const targetId = e.target.dataset.target;
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: "smooth" });
        }
        closeMenu();
      }
    });
  });
  