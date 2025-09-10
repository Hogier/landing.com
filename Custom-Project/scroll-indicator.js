class ScrollIndicator {
    constructor() {
        this.indicator = document.querySelector('.scroll-indicator');
        this.dots = document.querySelectorAll('.indicator-dot');
        this.sections = document.querySelectorAll('section[id]');
        this.scrollTimeout = null;
        this.isView = false;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.checkActiveSection();
    }

    setupEventListeners() {
        window.addEventListener('scroll', () => {
            this.handleScroll();
            this.checkActiveSection();
        });

        this.indicator.addEventListener("mouseover", () => {
            console.log("mouseover");
            clearTimeout(this.scrollTimeout);
            this.showIndicator();
        });

        this.indicator.addEventListener("mouseout", () => {
            console.log("mouseout");
            this.handleScroll();
        });

        this.dots.forEach(dot => {
            dot.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = dot.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    handleScroll() {
        this.showIndicator();
        
        if (this.scrollTimeout) {
            clearTimeout(this.scrollTimeout);
        }

        this.scrollTimeout = setTimeout(() => {
            this.hideIndicator();
        }, 3000);
    }

    showIndicator() {
        this.indicator.classList.add('visible');
    }

    hideIndicator() {
        this.indicator.classList.remove('visible');
    }

    checkActiveSection() {
        let currentSection = '';
        const scrollPosition = window.scrollY + 100;

        this.sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });


        const sectionName = {
            "Start": "hero",
            "Principles of our work": "expertise",
            "What are we developing?": "services",
            "Our technology stack": "tech-stack",
            "Development process": "process",
            "StaffPRO": "cases",
            "Contact": "contact"
        } 
        
        this.dots.forEach(dot => {
            dot.classList.remove('active');
            const dotSection = dot.getAttribute('data-section');
            
            if (sectionName[dotSection] === currentSection) {
                dot.classList.add('active');
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ScrollIndicator();
});

// Альтернатива для старых браузеров
if (typeof IntersectionObserver !== 'undefined') {
    // Дополнительная оптимизация с IntersectionObserver
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.3
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                document.querySelectorAll('.indicator-dot').forEach(dot => {
                    dot.classList.remove('active');
                    if (dot.getAttribute('data-section') === id) {
                        dot.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    document.querySelectorAll('section[id]').forEach(section => {
        observer.observe(section);
    });
}