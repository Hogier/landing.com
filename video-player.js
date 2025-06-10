/**
 * КАСТОМНЫЙ ВИДЕОПЛЕЕР ДЛЯ ЛЕНДИНГА
 * 
 * Возможности:
 * - Современный дизайн в стилистике лендинга
 * - Автоскрытие контролов при неактивности
 * - Полноэкранный режим
 * - Перетаскивание для перемотки
 * - Контроль громкости
 * - Клавиатурные сокращения:
 *   • Пробел - воспроизведение/пауза
 *   • ← → - перемотка на 10 сек назад/вперед
 *   • ↑ ↓ - увеличение/уменьшение громкости
 *   • M - включить/выключить звук
 *   • F - полноэкранный режим
 * - Адаптивный дизайн для мобильных устройств
 * - Сенсорное управление и жесты
 * - Индикатор загрузки
 * - Плавные анимации
 * 
 * Автор: AI Assistant
 * Дата: 2024
 */

class CustomVideoPlayer {
  constructor(videoElement) {
    this.video = videoElement;
    this.container = null;
    this.controls = null;
    this.playBtn = null;
    this.progressBar = null;
    this.progressFill = null;
    this.progressTooltip = null;
    this.progressSections = null;
    this.timeDisplay = null;
    this.volumeBtn = null;
    this.volumeSlider = null;
    this.fullscreenBtn = null;
    this.isPlaying = false;
    this.isDragging = false;
    this.lastKnownDuration = 0; // Для отслеживания стабильности длительности
    this.isMobile = this.detectMobile(); // Определение мобильного устройства
    this.controlsTimeout = null; // Таймер скрытия контролов
    this.lastTouchTime = 0; // Для double tap
    this.touchStartX = 0; // Для swipe жестов
    this.touchStartY = 0;
    this.seeking = false; // Флаг поиска
    
    // Конфигурация секций видео
    this.videoSections = [
      { start: 0, end: 60, title: "Introduction" },
      { start: 60, end: 180, title: "Submitting maintenance requests" },
      { start: 180, end: 240, title: "Maintenance Staff Portal" },
      { start: 240, end: 360, title: "Event Portal" },
      { start: 360, end: 540, title: "Inspections & Checklist" },
      { start: 540, end: 600, title: "Corporate Chat" },
      { start: 600, end: Infinity, title: "Conclusion" }
    ];
    
    this.init();
  }

  // Определение мобильного устройства
  detectMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
           ('ontouchstart' in window) ||
           (window.innerWidth <= 768);
  }

  init() {
    // Показываем индикатор загрузки
    this.showLoader();
    
    // Создаем контейнер для видеоплеера
    this.createPlayerContainer();
    this.createControls();
    this.bindEvents();
    this.updatePlayButton();
    this.updateTimeDisplay();
    
    // Для мобильных устройств показываем контролы изначально
    if (this.isMobile) {
      this.showControls();
    }
  }

  createPlayerContainer() {
    // Оборачиваем видео в контейнер
    this.container = document.createElement('div');
    this.container.className = `custom-video-player ${this.isMobile ? 'mobile' : ''}`;
    
    // Заменяем оригинальное видео
    this.video.parentNode.insertBefore(this.container, this.video);
    this.container.appendChild(this.video);
    
    // Убираем стандартные контролы
    this.video.removeAttribute('controls');
    this.video.style.width = '100%';
    this.video.style.height = '100%';
    this.video.style.display = 'block';
    
    // Для мобильных устройств добавляем возможность inline воспроизведения
    if (this.isMobile) {
      this.video.setAttribute('playsinline', '');
      this.video.setAttribute('webkit-playsinline', '');
    }
  }

  createControls() {
    this.controls = document.createElement('div');
    this.controls.className = `video-controls ${this.isMobile ? 'mobile' : ''}`;
    
    // Кнопка воспроизведения/паузы
    this.playBtn = document.createElement('button');
    this.playBtn.className = 'control-btn play-btn';
    this.playBtn.innerHTML = '<i class="fas fa-play"></i>';
    
    // Контейнер для прогресс бара с секциями
    const progressContainer = document.createElement('div');
    progressContainer.className = 'progress-container';
    
    // Прогресс бар
    this.progressBar = document.createElement('div');
    this.progressBar.className = 'progress-bar';
    
    // Создаем секции прогресс-бара
    this.progressSections = document.createElement('div');
    this.progressSections.className = 'progress-sections';
    
    this.progressFill = document.createElement('div');
    this.progressFill.className = 'progress-fill';
    
    // Всплывающая подсказка (скрываем на мобильных)
    this.progressTooltip = document.createElement('div');
    this.progressTooltip.className = `progress-tooltip ${this.isMobile ? 'mobile-hidden' : ''}`;
    this.progressTooltip.textContent = 'Section';
    
    // Добавляем элементы в прогресс бар
    this.progressBar.appendChild(this.progressSections);
    this.progressBar.appendChild(this.progressFill);
    progressContainer.appendChild(this.progressBar);
    if (!this.isMobile) {
      progressContainer.appendChild(this.progressTooltip);
    }
    
    // Отображение времени
    this.timeDisplay = document.createElement('span');
    this.timeDisplay.className = 'time-display';
    this.timeDisplay.textContent = '0:00 / 0:00';
    
    // Кнопка звука
    this.volumeBtn = document.createElement('button');
    this.volumeBtn.className = 'control-btn volume-btn';
    this.volumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
    
    // Слайдер громкости (скрываем на мобильных)
    this.volumeSlider = document.createElement('input');
    this.volumeSlider.type = 'range';
    this.volumeSlider.className = `volume-slider ${this.isMobile ? 'mobile-hidden' : ''}`;
    this.volumeSlider.min = '0';
    this.volumeSlider.max = '1';
    this.volumeSlider.step = '0.1';
    this.volumeSlider.value = this.video.volume;
    
    // Кнопка полноэкранного режима
    this.fullscreenBtn = document.createElement('button');
    this.fullscreenBtn.className = 'control-btn fullscreen-btn';
    this.fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
    
    // Добавляем все элементы в контролы
    this.controls.appendChild(this.playBtn);
    this.controls.appendChild(progressContainer);
    this.controls.appendChild(this.timeDisplay);
    this.controls.appendChild(this.volumeBtn);
    if (!this.isMobile) {
      this.controls.appendChild(this.volumeSlider);
    }
    this.controls.appendChild(this.fullscreenBtn);
    
    this.container.appendChild(this.controls);
    
    // Создаем секции после того, как видео загружено
    this.video.addEventListener('loadedmetadata', () => {
      this.createProgressSections();
    });
  }

  bindEvents() {
    // События для кнопки воспроизведения
    this.playBtn.addEventListener('click', () => this.togglePlay());
    
    // События клика по видео (с учетом мобильных устройств)
    if (this.isMobile) {
      // На мобильных обрабатываем touch события
      this.video.addEventListener('touchstart', (e) => this.handleVideoTouchStart(e));
      this.video.addEventListener('touchend', (e) => this.handleVideoTouchEnd(e));
    } else {
      this.video.addEventListener('click', () => this.togglePlay());
    }
    
    // События для прогресс бара
    if (this.isMobile) {
      this.progressBar.addEventListener('touchstart', (e) => this.startDrag(e.touches[0]));
      this.progressBar.addEventListener('touchmove', (e) => {
        e.preventDefault();
        this.onDrag(e.touches[0]);
      });
      this.progressBar.addEventListener('touchend', () => this.endDrag());
    } else {
      this.progressBar.addEventListener('mousedown', (e) => this.startDrag(e));
      this.progressBar.addEventListener('mousemove', (e) => this.onProgressMouseMove(e));
      this.progressBar.addEventListener('mouseleave', () => this.hideTooltip());
      document.addEventListener('mouseup', () => this.endDrag());
    }
    
    // Добавляем обработку движения мыши для десктопа
    if (!this.isMobile) {
      document.addEventListener('mousemove', (e) => this.onDrag(e));
    }
    
    // События для видео
    this.video.addEventListener('timeupdate', () => this.updateProgress());
    this.video.addEventListener('loadedmetadata', () => {
      this.updateTimeDisplay();
      this.createProgressSections();
    });
    this.video.addEventListener('loadeddata', () => {
      this.hideLoader();
      // Дополнительная попытка создать секции для Firefox
      if (this.progressSections.children.length === 0) {
        setTimeout(() => this.createProgressSections(), 100);
      }
    });
    this.video.addEventListener('canplaythrough', () => {
      this.hideLoader();
      // Еще одна попытка создать секции если они все еще не созданы
      if (this.progressSections.children.length === 0) {
        setTimeout(() => this.createProgressSections(), 200);
      }
    });
    // Дополнительные события для Firefox
    this.video.addEventListener('durationchange', () => {
      this.createProgressSections();
    });
    this.video.addEventListener('progress', () => {
      // Проверяем секции каждый раз при загрузке данных
      if (this.progressSections.children.length === 0) {
        this.createProgressSections();
      }
    });
    // Принудительная проверка через 2 секунды (для Firefox)
    setTimeout(() => {
      if (this.progressSections.children.length === 0) {
        this.createProgressSections();
      }
    }, 2000);
    
    // Дополнительная проверка каждые 2 секунды первые 10 секунд (для Firefox)
    let checkCount = 0;
    const durationChecker = setInterval(() => {
      checkCount++;
      if (this.progressSections.children.length === 0 && checkCount < 5) {
        this.createProgressSections();
      } else {
        clearInterval(durationChecker);
      }
    }, 2000);

    this.video.addEventListener('play', () => this.onPlay());
    this.video.addEventListener('pause', () => this.onPause());
    this.video.addEventListener('ended', () => this.onEnded());
    
    // События для громкости
    this.volumeBtn.addEventListener('click', () => this.toggleMute());
    if (!this.isMobile) {
      this.volumeSlider.addEventListener('input', (e) => this.changeVolume(e));
    }
    
    // События для полноэкранного режима
    this.fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
    
    // Скрытие/показ контролов с учетом мобильных устройств
    if (this.isMobile) {
      this.container.addEventListener('touchstart', () => this.toggleControlsVisibility());
    } else {
      this.container.addEventListener('mouseenter', () => this.showControls());
      this.container.addEventListener('mouseleave', () => this.hideControls());
      this.container.addEventListener('mousemove', () => this.showControls());
    }
    
    // Клавиатурные сокращения (только для десктопа)
    if (!this.isMobile) {
      document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }
    
    // Обработка поворота экрана на мобильных
    if (this.isMobile) {
      window.addEventListener('orientationchange', () => {
        setTimeout(() => this.handleOrientationChange(), 100);
      });
    }
  }

  // Обработка touch событий для видео
  handleVideoTouchStart(e) {
    const touch = e.touches[0];
    this.touchStartX = touch.clientX;
    this.touchStartY = touch.clientY;
    this.touchStartTime = Date.now();
  }

  handleVideoTouchEnd(e) {
    const touchEndTime = Date.now();
    const touchDuration = touchEndTime - this.touchStartTime;
    
    // Проверка на double tap (быстрое двойное касание)
    if (touchDuration < 300) {
      const timeSinceLastTouch = touchEndTime - this.lastTouchTime;
      if (timeSinceLastTouch < 300 && timeSinceLastTouch > 50) {
        // Double tap - переключаем полноэкранный режим
        this.toggleFullscreen();
      } else {
        // Single tap - переключаем воспроизведение
        this.togglePlay();
      }
      this.lastTouchTime = touchEndTime;
    }
  }

  // Переключение видимости контролов на мобильных
  toggleControlsVisibility() {
    if (this.controls.classList.contains('visible')) {
      this.hideControls();
    } else {
      this.showControls();
    }
  }

  // Обработка поворота экрана
  handleOrientationChange() {
    // Перезапускаем создание секций после поворота
    setTimeout(() => {
      this.createProgressSections();
    }, 200);
  }

  togglePlay() {
    if (this.video.paused) {
      this.video.play();
    } else {
      this.video.pause();
    }
  }

  onPlay() {
    this.isPlaying = true;
    this.updatePlayButton();
  }

  onPause() {
    this.isPlaying = false;
    this.updatePlayButton();
  }

  onEnded() {
    this.isPlaying = false;
    this.updatePlayButton();
    this.video.currentTime = 0;
  }

  updatePlayButton() {
    if (this.isPlaying) {
      this.playBtn.innerHTML = '<i class="fas fa-pause"></i>';
      this.playBtn.setAttribute('aria-label', 'Пауза');
    } else {
      this.playBtn.innerHTML = '<i class="fas fa-play"></i>';
      this.playBtn.setAttribute('aria-label', 'Воспроизвести');
    }
  }

  startDrag(e) {
    this.isDragging = true;
    this.updateProgressFromEvent(e);
  }

  onDrag(e) {
    if (this.isDragging) {
      this.updateProgressFromEvent(e);
    }
  }

  endDrag() {
    this.isDragging = false;
  }

  updateProgressFromEvent(e) {
    const rect = this.progressBar.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * this.video.duration;
    
    if (newTime >= 0 && newTime <= this.video.duration) {
      this.video.currentTime = newTime;
      this.updateProgress();
    }
  }

  updateProgress() {
    if (!this.isDragging) {
      const percent = (this.video.currentTime / this.video.duration) * 100;
      this.progressFill.style.width = percent + '%';
      this.updateTimeDisplay();
    }
  }

  updateTimeDisplay() {
    const current = this.formatTime(this.video.currentTime);
    const duration = this.formatTime(this.video.duration);
    this.timeDisplay.textContent = `${current} / ${duration}`;
  }

  formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }

  toggleMute() {
    if (this.video.muted) {
      this.video.muted = false;
      this.volumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
      this.volumeSlider.value = this.video.volume;
    } else {
      this.video.muted = true;
      this.volumeBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
    }
  }

  changeVolume(e) {
    this.video.volume = e.target.value;
    this.video.muted = false;
    
    if (this.video.volume === 0) {
      this.volumeBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
    } else if (this.video.volume < 0.5) {
      this.volumeBtn.innerHTML = '<i class="fas fa-volume-down"></i>';
    } else {
      this.volumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
    }
  }

  toggleFullscreen() {
    if (!document.fullscreenElement) {
      this.container.requestFullscreen().catch(err => {
        // Тихо обрабатываем ошибку
      });
      this.fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i>';
    } else {
      document.exitFullscreen();
      this.fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
    }
  }

  showControls() {
    this.controls.classList.add('visible');
    this.container.style.cursor = this.isMobile ? 'default' : 'default';
    
    // Автоматически скрыть через время (больше для мобильных)
    clearTimeout(this.controlsTimeout);
    const hideDelay = this.isMobile ? 5000 : 3000; // 5 сек для мобильных, 3 сек для десктопа
    
    this.controlsTimeout = setTimeout(() => {
      if (this.isPlaying && !this.isDragging) {
        this.hideControls();
      }
    }, hideDelay);
  }

  hideControls() {
    if (this.isMobile) {
      // На мобильных скрываем контролы только если видео воспроизводится
      if (this.isPlaying && !this.isDragging) {
        this.controls.classList.remove('visible');
      }
    } else {
      if (!this.container.matches(':hover')) {
        this.controls.classList.remove('visible');
        this.container.style.cursor = 'none';
      }
    }
  }

  handleKeyboard(e) {
    if (!this.container.matches(':hover')) return;
    
    switch(e.code) {
      case 'Space':
        e.preventDefault();
        this.togglePlay();
        break;
      case 'ArrowLeft':
        e.preventDefault();
        this.video.currentTime = Math.max(0, this.video.currentTime - 10);
        break;
      case 'ArrowRight':
        e.preventDefault();
        this.video.currentTime = Math.min(this.video.duration, this.video.currentTime + 10);
        break;
      case 'ArrowUp':
        e.preventDefault();
        this.video.volume = Math.min(1, this.video.volume + 0.1);
        this.volumeSlider.value = this.video.volume;
        this.changeVolume({target: this.volumeSlider});
        break;
      case 'ArrowDown':
        e.preventDefault();
        this.video.volume = Math.max(0, this.video.volume - 0.1);
        this.volumeSlider.value = this.video.volume;
        this.changeVolume({target: this.volumeSlider});
        break;
      case 'KeyM':
        e.preventDefault();
        this.toggleMute();
        break;
      case 'KeyF':
        e.preventDefault();
        this.toggleFullscreen();
        break;
    }
  }

  showLoader() {
    if (this.container) {
      this.container.classList.add('loading');
    }
  }

  hideLoader() {
    if (this.container) {
      this.container.classList.remove('loading');
    }
  }

  createProgressSections() {
    if (!this.video.duration || this.video.duration <= 0 || isNaN(this.video.duration)) {
      return;
    }
    
    // Проверяем, что получили правильную длительность видео (должно быть около 804 сек)
    const expectedDuration = 800; // ожидаем минимум 800 секунд
    if (this.video.duration < expectedDuration) {
      // Ждём получения полной длительности
      setTimeout(() => this.createProgressSections(), 500);
      return;
    }
    
    // Если секции уже созданы с правильной длительностью, не пересоздаём
    if (this.progressSections.children.length > 0 && this.lastKnownDuration >= expectedDuration) {
      return;
    }
    
    this.progressSections.innerHTML = '';
    const totalDuration = this.video.duration;
    this.lastKnownDuration = totalDuration;
    
    this.videoSections.forEach((section, index) => {
      const sectionDiv = document.createElement('div');
      sectionDiv.className = 'progress-section';
      
      // Вычисляем ширину секции в процентах с проверками
      const endTime = section.end === Infinity ? totalDuration : Math.min(section.end, totalDuration);
      let startPercent = (section.start / totalDuration) * 100;
      let widthPercent = ((endTime - section.start) / totalDuration) * 100;
      
      // Проверяем корректность значений и округляем до 2 знаков после запятой
      startPercent = isNaN(startPercent) ? 0 : Math.round(startPercent * 100) / 100;
      widthPercent = isNaN(widthPercent) || widthPercent <= 0 ? 0.01 : Math.round(widthPercent * 100) / 100;
      
      // Ограничиваем значения разумными пределами (БЕЗ неправильного ограничения по оставшемуся месту)
      startPercent = Math.max(0, Math.min(100, startPercent));
      widthPercent = Math.max(0.01, Math.min(100, widthPercent)); // Убираем ограничение (100 - startPercent)
      
      sectionDiv.style.left = startPercent + '%';
      sectionDiv.style.width = widthPercent + '%';
      sectionDiv.dataset.title = section.title;
      sectionDiv.dataset.start = section.start;
      sectionDiv.dataset.end = endTime;
      
      this.progressSections.appendChild(sectionDiv);
    });
  }

  onProgressMouseMove(e) {
    if (this.isDragging) {
      this.updateProgressFromEvent(e);
    } else {
      this.showTooltipForPosition(e);
    }
  }

  showTooltipForPosition(e) {
    const rect = this.progressBar.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = x / rect.width;
    const currentTime = percent * this.video.duration;
    
    // Находим соответствующую секцию
    const section = this.videoSections.find(s => 
      currentTime >= s.start && (s.end === Infinity ? true : currentTime < s.end)
    );
    
    if (section) {
      this.progressTooltip.textContent = section.title;
      this.progressTooltip.style.left = x + 'px';
      this.progressTooltip.style.display = 'block';
    }
  }

  hideTooltip() {
    this.progressTooltip.style.display = 'none';
  }

  // Метод для запуска видео с определенного времени
  playFromTime(sectionTitle) {
    console.log('=== PLAY FROM TIME CALLED ===');
    console.log('Section title:', sectionTitle);
    console.log('Available sections:', this.videoSections);
    
    // Находим секцию по названию
    const section = this.videoSections.find(s => s.title === sectionTitle);
    console.log('Found section:', section);
    
    if (section) {
      console.log('Section details:', {
        title: section.title,
        start: section.start,
        end: section.end
      });
      
      // Прокручиваем к видео с учетом фиксированного хедера
      const videoContainer = this.container.closest('.video-container') || this.container;
      console.log('Video container found:', !!videoContainer);
      console.log('Video container:', videoContainer);
      
      const headerHeight = document.querySelector('header').offsetHeight || 80;
      console.log('Header height:', headerHeight);
      
      const elementPosition = videoContainer.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
      console.log('Element position calculated:', elementPosition);
      console.log('Container offset top:', videoContainer.offsetTop);
      
      console.log('Starting smooth scroll to position:', elementPosition);
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
      
      // Устанавливаем время и запускаем видео
      setTimeout(() => {
        console.log('Setting video current time to:', section.start);
        console.log('Video current time before:', this.video.currentTime);
        
        this.video.currentTime = section.start;
        
        console.log('Video current time after:', this.video.currentTime);
        console.log('Attempting to play video...');
        
        this.video.play().catch(e => {
          console.error('Video play error:', e);
        });
        
        console.log('Showing controls...');
        this.showControls();
        
        console.log('Highlighting section:', sectionTitle);
        // Подсвечиваем соответствующую секцию в прогресс-баре
        this.highlightSection(sectionTitle);
        this.video.muted = false;
        
        console.log('=== PLAY FROM TIME COMPLETE ===');
      }, 800); // Увеличиваем задержку для завершения прокрутки
    } else {
      console.error('Section not found for title:', sectionTitle);
      console.log('Available section titles:', this.videoSections.map(s => s.title));
    }
  }

  // Метод для подсветки активной секции
  highlightSection(sectionTitle) {
    console.log('=== HIGHLIGHTING SECTION ===');
    console.log('Section to highlight:', sectionTitle);
    
    // Находим все секции прогресс-бара
    const sections = this.progressSections.querySelectorAll('.progress-section');
    console.log('Found progress sections:', sections.length);
    
    sections.forEach((sectionElement, index) => {
      console.log(`Checking section ${index}:`, sectionElement.dataset.title);
      
      if (sectionElement.dataset.title === sectionTitle) {
        console.log(`Match found! Highlighting section ${index}:`, sectionTitle);
        
        // Убираем предыдущую анимацию
        sectionElement.classList.remove('active-jump');
        
        // Добавляем анимацию с небольшой задержкой
        setTimeout(() => {
          console.log('Adding active-jump class');
          sectionElement.classList.add('active-jump');
        }, 10);
        
        // Убираем класс анимации через 1.5 секунды
        setTimeout(() => {
          console.log('Removing active-jump class');
          sectionElement.classList.remove('active-jump');
        }, 1500);
      }
    });
    
    console.log('=== SECTION HIGHLIGHTING COMPLETE ===');
  }

  // Статический метод для внешнего доступа к плееру
  static getInstance(videoElement) {
    return videoElement._customPlayer;
  }
}

// Инициализация плеера для всех видео с классом video-features
document.addEventListener('DOMContentLoaded', function() {
  const videos = document.querySelectorAll('.video-features');
  videos.forEach(video => {
    const player = new CustomVideoPlayer(video);
    // Сохраняем ссылку на плеер в элементе видео для внешнего доступа
    video._customPlayer = player;
  });

  // Добавляем обработчики для кнопок "More info in video"
  initializeVideoButtons();
});

// Функция для инициализации кнопок связи с видео
function initializeVideoButtons() {
  console.log('=== INITIALIZING VIDEO BUTTONS ===');
  
  // Маппинг заголовков секций с названиями в HTML
  const sectionMapping = {
    'Submitting maintenance requests': 'Submitting maintenance requests',
    'Maintenance Staff Portal': 'Maintenance Staff Portal', 
    'Event Portal': 'Event Portal',
    'Inspections & Checklist': 'Inspections & Checklist',
    'Corporate Chat': 'Corporate Chat'
  };

  console.log('Section mapping:', sectionMapping);

  // Находим все feature-block элементы
  const featureBlocks = document.querySelectorAll('.feature-block');
  console.log('Found feature blocks:', featureBlocks.length);
  
  featureBlocks.forEach((block, blockIndex) => {
    console.log(`--- Processing feature block ${blockIndex + 1} ---`);
    
    const h3Element = block.querySelector('.feature-content h3');
    const videoButton = block.querySelector('.feature-image button.btn-video');
    
    console.log('H3 element found:', !!h3Element);
    console.log('Video button found:', !!videoButton);
    
    if (h3Element) {
      console.log('H3 text content:', h3Element.textContent.trim());
    }
    
    if (h3Element && videoButton) {
      const sectionTitle = h3Element.textContent.trim();
      const mappedSection = sectionMapping[sectionTitle];
      
      console.log('Section title:', sectionTitle);
      console.log('Mapped section:', mappedSection);
      
      if (mappedSection) {
        console.log(`Setting up click handler for: "${mappedSection}"`);
        
        // Добавляем обработчик клика
        videoButton.addEventListener('click', function(e) {
          console.log('=== VIDEO BUTTON CLICKED ===');
          console.log('Button clicked for section:', mappedSection);
          console.log('Event:', e);
          
          e.preventDefault();
          
          // Находим видео элемент
          const videoElement = document.querySelector('.video-features');
          console.log('Video element found:', !!videoElement);
          console.log('Video element:', videoElement);
          
          if (videoElement && videoElement._customPlayer) {
            console.log('Custom player found:', !!videoElement._customPlayer);
            console.log('Calling playFromTime with section:', mappedSection);
            videoElement._customPlayer.playFromTime(mappedSection);
          } else {
            console.error('Video element or custom player not found!');
            console.log('videoElement:', videoElement);
            console.log('_customPlayer:', videoElement?._customPlayer);
          }
        });
        
        // Добавляем визуальную индикацию того, что кнопка интерактивна
        videoButton.style.cursor = 'pointer';
        videoButton.title = `Jump to: ${mappedSection}`;
        console.log(`Button configured for: "${mappedSection}"`);
      } else {
        console.warn('No mapping found for section:', sectionTitle);
      }
    } else {
      console.warn('Missing h3 or video button in block', blockIndex + 1);
    }
  });

  // Также обрабатываем кнопку "Watch Demo" в hero секции
  console.log('--- Processing hero demo button ---');
  const heroDemoButton = document.querySelector('.hero-cta button.btn-video');
  console.log('Hero demo button found:', !!heroDemoButton);
  
  if (heroDemoButton) {
    console.log('Setting up click handler for hero demo button');
    
    heroDemoButton.addEventListener('click', function(e) {
      console.log('=== HERO DEMO BUTTON CLICKED ===');
      console.log('Event:', e);
      
      e.preventDefault();
      
      // Прокручиваем к видео и начинаем воспроизведение
      const videoElement = document.querySelector('.video-features');
      console.log('Video element found:', !!videoElement);
      console.log('Video element:', videoElement);
      
      if (videoElement) {
        console.log('Scrolling to video...');
        
        // Плавная прокрутка к видео
        const videoPosition = videoElement.getBoundingClientRect().top + window.pageYOffset - 100;
        window.scrollTo({
          top: videoPosition,
          behavior: 'smooth'
        });
        
        // Начинаем воспроизведение через небольшую задержку
        setTimeout(() => {
          console.log('Attempting to toggle play...');
          if (videoElement._customPlayer) {
            console.log('Custom player found, calling togglePlay');
            videoElement._customPlayer.video.play();
            videoElement._customPlayer.video.muted = false;
          } else {
            console.error('Custom player not found!');
            console.log('_customPlayer:', videoElement._customPlayer);
          }
        }, 500);
      } else {
        console.error('Video element not found!');
      }
    });
    
    console.log('Hero demo button configured');
  } else {
    console.warn('Hero demo button not found');
  }
  
  console.log('=== VIDEO BUTTONS INITIALIZATION COMPLETE ===');
}

// Добавляем CSS стили для плеера
const playerStyles = `
<style>
.custom-video-player {
  position: relative;
  width: 100%;
  background: #000;
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow: var(--box-shadow);
  animation: fadeInPlayer 0.5s ease-out;
}

/* Мобильная версия плеера */
.custom-video-player.mobile {
  border-radius: 8px;
  max-height: 70vh; /* Ограничиваем высоту на мобильных */
}

.video-controls {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0,0,0,0.9));
  padding: 20px 15px 15px;
  display: flex;
  align-items: center;
  gap: 15px;
  opacity: 0;
  transform: translateY(100%);
  transition: all 0.3s ease;
  z-index: 10;
}

/* Мобильные контролы */
.video-controls.mobile {
  padding: 25px 15px 20px;
  gap: 12px;
  background: linear-gradient(transparent, rgba(0,0,0,0.95));
}

.video-controls.visible {
  opacity: 1;
  transform: translateY(0);
}

.control-btn {
  background: none;
  border: none;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: var(--transition);
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  height: 40px;
  touch-action: manipulation; /* Оптимизация для touch */
}

/* Увеличенные кнопки для мобильных */
.video-controls.mobile .control-btn {
  min-width: 48px;
  height: 48px;
  font-size: 1.4rem;
  padding: 12px;
}

.control-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  color: var(--accent-color);
}

/* Тактильная обратная связь для мобильных */
.video-controls.mobile .control-btn:active {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(0.95);
}

.play-btn {
  font-size: 1.4rem;
}

.video-controls.mobile .play-btn {
  font-size: 1.6rem;
}

.progress-container {
  flex: 1;
  position: relative;
  margin: 0 10px;
}

.video-controls.mobile .progress-container {
  margin: 0 8px;
}

.progress-bar {
  height: 6px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
  cursor: pointer;
  position: relative;
  overflow: visible;
  touch-action: none; /* Предотвращаем случайные жесты */
}

/* Увеличенный прогресс бар для мобильных */
.video-controls.mobile .progress-bar {
  height: 12px;
  border-radius: 6px;
  padding: 8px 0; /* Увеличиваем область касания */
  margin: -8px 0;
}

.progress-sections {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
  pointer-events: none;
}

.progress-section {
  position: absolute;
  top: 0;
  height: 100%;
  border-right: 2px solid rgba(255, 255, 255, 0.3);
  background: linear-gradient(to right, 
    rgba(67, 97, 238, 0.1) 0%, 
    rgba(76, 201, 240, 0.1) 100%);
}

/* Цветные секции для всех размеров экрана */
.progress-section:nth-child(2) {
  background-color: rgba(255, 171, 0, 0.7) !important;
}

.progress-section:nth-child(3) {
  background-color: rgba(255, 70, 76, 0.7) !important;
}

.progress-section:nth-child(4) {
  background-color: rgba(36, 181, 81, 0.7) !important;
}

.progress-section:nth-child(5) {
  background-color: rgba(178, 49, 186, 0.7) !important;
}

.progress-section:nth-child(6) {
  background-color: rgba(0, 177, 217, 0.7) !important;
}

.progress-section:last-child {
  border-right: none;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--primary-color), var(--accent-color));
  border-radius: 3px;
  width: 0%;
  transition: width 0.1s ease;
  position: relative;
  z-index: 2;
}

.video-controls.mobile .progress-fill {
  border-radius: 6px;
}

.progress-fill::after {
  content: '';
  position: absolute;
  right: -6px;
  top: 50%;
  transform: translateY(-50%);
  width: 12px;
  height: 12px;
  background: white;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0,0,0,0.3);
  opacity: 0;
  transition: opacity 0.2s ease;
}

/* Увеличенный индикатор для мобильных */
.video-controls.mobile .progress-fill::after {
  width: 16px;
  height: 16px;
  right: -8px;
  opacity: 1; /* Всегда видимый на мобильных */
}

.progress-bar:hover .progress-fill::after {
  opacity: 1;
}

.progress-tooltip {
  position: absolute;
  bottom: 45px;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.95);
  color: white;
  padding: 12px 18px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  white-space: nowrap;
  pointer-events: none;
  display: none;
  z-index: 15;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  letter-spacing: 0.5px;
}

.mobile-hidden {
  display: none !important;
}

.progress-tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 8px solid transparent;
  border-top-color: rgba(0, 0, 0, 0.95);
}

.time-display {
  color: white;
  font-size: 0.9rem;
  font-weight: 500;
  min-width: 90px;
  text-align: center;
}

.video-controls.mobile .time-display {
  font-size: 1rem;
  min-width: 100px;
  font-weight: 600;
}

.volume-slider {
  width: 60px;
  height: 4px;
  background: rgba(255, 255, 255, 0.3);
  outline: none;
  border-radius: 2px;
  cursor: pointer;
  -webkit-appearance: none;
  appearance: none;
}

.volume-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 12px;
  height: 12px;
  background: white;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0,0,0,0.3);
}

.volume-slider::-moz-range-thumb {
  width: 12px;
  height: 12px;
  background: white;
  border-radius: 50%;
  cursor: pointer;
  border: none;
  box-shadow: 0 2px 4px rgba(0,0,0,0.3);
}

/* Адаптивность для планшетов */
@media (max-width: 1024px) and (min-width: 769px) {
  .video-controls {
    padding: 18px 12px 12px;
    gap: 12px;
  }
  
  .control-btn {
    min-width: 44px;
    height: 44px;
    font-size: 1.3rem;
  }
}

/* Адаптивность для мобильных */
@media (max-width: 768px) {
  .custom-video-player {
    border-radius: 8px;
  }
  
  .video-controls {
    padding: 20px 12px 15px;
    gap: 10px;
  }
  
  .control-btn {
    font-size: 1.2rem;
    min-width: 44px;
    height: 44px;
    padding: 8px;
  }
  
  .play-btn {
    min-width: 48px;
    height: 48px;
    font-size: 1.5rem;
  }
  
  .time-display {
    font-size: 0.9rem;
    min-width: 85px;
  }
  
  .volume-slider {
    width: 50px;
  }
  
  .progress-bar {
    height: 8px;
    padding: 6px 0;
    margin: -6px 0;
  }
  
  .progress-fill::after {
    width: 14px;
    height: 14px;
    right: -7px;
    opacity: 1;
  }
}

/* Адаптивность для маленьких мобильных */
@media (max-width: 576px) {
  .volume-slider {
    display: none;
  }
  
  .video-controls {
    gap: 8px;
    padding: 18px 10px 12px;
  }
  
  .control-btn {
    min-width: 40px;
    height: 40px;
    font-size: 1.1rem;
  }
  
  .play-btn {
    min-width: 44px;
    height: 44px;
    font-size: 1.4rem;
  }
  
  .time-display {
    font-size: 0.8rem;
    min-width: 75px;
  }
  
  .progress-section {
    border-right: 1px solid rgba(255, 255, 255, 0.3);
  }
  
  .progress-container {
    margin: 0 6px;
  }
}

/* Очень маленькие экраны */
@media (max-width: 320px) {
  .video-controls {
    padding: 15px 8px 10px;
    gap: 6px;
  }
  
  .control-btn {
    min-width: 36px;
    height: 36px;
    font-size: 1rem;
  }
  
  .play-btn {
    min-width: 40px;
    height: 40px;
    font-size: 1.3rem;
  }
  
  .time-display {
    font-size: 0.75rem;
    min-width: 70px;
  }
}

/* Полноэкранный режим - улучшенный для мобильных */
.custom-video-player:fullscreen {
  width: 100vw;
  height: 100vh;
  border-radius: 0;
}

.custom-video-player:fullscreen .video-controls {
  padding: 25px 35px 35px;
}

@media (max-width: 768px) {
  .custom-video-player:fullscreen .video-controls {
    padding: 20px 20px 25px;
  }
}

/* Ландшафтная ориентация на мобильных */
@media (max-width: 768px) and (orientation: landscape) {
  .custom-video-player {
    max-height: 90vh;
  }
  
  .video-controls {
    padding: 15px 15px 15px;
  }
  
  .control-btn {
    min-width: 42px;
    height: 42px;
  }
  
  .play-btn {
    min-width: 46px;
    height: 46px;
  }
}

/* Стили для загрузки */
.custom-video-player::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255,255,255,0.3);
  border-top: 3px solid var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  z-index: 5;
  opacity: 0;
}

.custom-video-player.mobile::before {
  width: 50px;
  height: 50px;
  border-width: 4px;
}

.custom-video-player.loading::before {
  opacity: 1;
}

@keyframes spin {
  0% { transform: translate(-50%, -50%) rotate(0deg); }
  100% { transform: translate(-50%, -50%) rotate(360deg); }
}

/* Улучшенные hover эффекты для десктопа */
@media (hover: hover) {
  .custom-video-player:hover .video-controls {
    opacity: 1;
    transform: translateY(0);
  }

  .control-btn:active {
    transform: scale(0.95);
  }

  .progress-bar:hover {
    height: 8px;
    margin-top: -1px;
  }

  .progress-bar:hover .progress-section {
    border-right: 2px solid rgba(255, 255, 255, 0.8);
  }
}

/* Анимация появления плеера */
@keyframes fadeInPlayer {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Анимация подсветки активной секции */
@keyframes highlightSection {
  0% { background: linear-gradient(to right, rgba(67, 97, 238, 0.1) 0%, rgba(76, 201, 240, 0.1) 100%); }
  50% { background: linear-gradient(to right, rgba(67, 97, 238, 0.4) 0%, rgba(76, 201, 240, 0.4) 100%); }
  100% { background: linear-gradient(to right, rgba(67, 97, 238, 0.1) 0%, rgba(76, 201, 240, 0.1) 100%); }
}

.progress-section.active-jump {
  animation: highlightSection 1.5s ease-in-out;
}

/* Дополнительные улучшения для touch устройств */
@media (pointer: coarse) {
  .progress-bar {
    padding: 10px 0;
    margin: -10px 0;
  }
  
  .control-btn {
    min-width: 48px;
    height: 48px;
  }
  
  .video-controls {
    padding: 25px 15px 20px;
  }
}

/* Анимации для touch взаимодействий */
.control-btn {
  transition: all 0.15s ease;
}

.video-controls.mobile .control-btn:active {
  background: rgba(255, 255, 255, 0.25);
  transform: scale(0.9);
}

.progress-bar {
  transition: all 0.2s ease;
}

/* Улучшения для accessibility */
.control-btn:focus {
  outline: 2px solid var(--accent-color);
  outline-offset: 2px;
}

.progress-bar:focus {
  outline: 2px solid var(--accent-color);
  outline-offset: 2px;
}

/* Оптимизация производительности для мобильных */
.custom-video-player.mobile * {
  -webkit-transform: translateZ(0);
  transform: translateZ(0);
}
</style>
`;

// Добавляем стили в head
document.head.insertAdjacentHTML('beforeend', playerStyles); 