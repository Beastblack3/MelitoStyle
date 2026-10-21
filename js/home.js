/* Funcionalidades de la página de inicio: menú, carrusel y entradas suaves. */
document.documentElement.classList.add('js-ready');

document.addEventListener('DOMContentLoaded', () => {
    // Menú móvil
    const menuButton = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    const closeMenu = () => {
        if (!menuButton || !navLinks) return;
        navLinks.classList.remove('is-open');
        menuButton.setAttribute('aria-expanded', 'false');
        menuButton.setAttribute('aria-label', 'Abrir menú');
        const icon = menuButton.querySelector('i');
        if (icon) icon.className = 'fa-solid fa-bars';
    };

    if (menuButton && navLinks) {
        menuButton.addEventListener('click', () => {
            const opening = !navLinks.classList.contains('is-open');
            navLinks.classList.toggle('is-open', opening);
            menuButton.setAttribute('aria-expanded', String(opening));
            menuButton.setAttribute('aria-label', opening ? 'Cerrar menú' : 'Abrir menú');
            const icon = menuButton.querySelector('i');
            if (icon) icon.className = opening ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
        });

        navLinks.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', closeMenu);
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') closeMenu();
        });

        document.addEventListener('click', (event) => {
            if (!navLinks.classList.contains('is-open')) return;
            if (!navLinks.contains(event.target) && !menuButton.contains(event.target)) closeMenu();
        });

        window.addEventListener('resize', () => {
            if (window.matchMedia('(min-width: 851px)').matches) closeMenu();
        });
    }

    // Año automático en el pie de página
    const year = document.querySelector('#year');
    if (year) year.textContent = String(new Date().getFullYear());

    // Carrusel: siempre una tarjeta completa visible, con botones, puntos y autoplay.
    const carousel = document.querySelector('.carousel');
    if (carousel) {
        const track = carousel.querySelector('.carousel-inner');
        const slides = Array.from(carousel.querySelectorAll('.carousel-item'));
        const viewport = carousel.querySelector('.carousel-viewport');
        const previousButton = carousel.querySelector('.carousel-prev');
        const nextButton = carousel.querySelector('.carousel-next');
        const dotsContainer = document.querySelector('.carousel-dots');
        const currentCount = document.querySelector('.current-slide');
        let currentIndex = 0;
        let autoPlayId = null;
        let touchStartX = null;
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (track && viewport && slides.length) {
            const dots = slides.map((slide, index) => {
                slide.setAttribute('aria-roledescription', 'diapositiva');
                const dot = document.createElement('button');
                dot.type = 'button';
                dot.className = 'carousel-dot';
                dot.setAttribute('aria-label', `Mostrar producto ${index + 1}`);
                dot.addEventListener('click', () => showSlide(index));
                dotsContainer?.appendChild(dot);
                return dot;
            });

            // Imágenes de ejemplo: si los enlaces siguen siendo placeholders, se muestra
            // una ilustración con icono hasta que se agreguen las imágenes reales.
            slides.forEach((slide) => {
                const media = slide.querySelector('.product-media');
                const image = media?.querySelector('img');
                if (!media || !image) return;
                const source = image.getAttribute('src') || '';
                if (!source || source.startsWith('URL_PRODUCTO_')) {
                    media.classList.add('is-fallback');
                    image.setAttribute('aria-hidden', 'true');
                    return;
                }
                image.addEventListener('error', () => {
                    media.classList.add('is-fallback');
                    image.setAttribute('aria-hidden', 'true');
                });
            });

            function showSlide(index) {
                currentIndex = (index + slides.length) % slides.length;
                track.style.transform = `translateX(-${currentIndex * 100}%)`;
                slides.forEach((slide, slideIndex) => {
                    const isActive = slideIndex === currentIndex;
                    slide.classList.toggle('active', isActive);
                    slide.setAttribute('aria-hidden', String(!isActive));
                    if ('inert' in slide) slide.inert = !isActive;
                });
                dots.forEach((dot, dotIndex) => {
                    if (dotIndex === currentIndex) dot.setAttribute('aria-current', 'true');
                    else dot.removeAttribute('aria-current');
                });
                if (currentCount) currentCount.textContent = String(currentIndex + 1).padStart(2, '0');
            }

            function stopAutoPlay() {
                if (autoPlayId !== null) window.clearInterval(autoPlayId);
                autoPlayId = null;
            }

            function startAutoPlay() {
                stopAutoPlay();
                if (!reducedMotion && slides.length > 1 && !document.hidden) {
                    autoPlayId = window.setInterval(() => showSlide(currentIndex + 1), 5000);
                }
            }

            previousButton?.addEventListener('click', () => {
                showSlide(currentIndex - 1);
                startAutoPlay();
            });
            nextButton?.addEventListener('click', () => {
                showSlide(currentIndex + 1);
                startAutoPlay();
            });

            carousel.addEventListener('mouseenter', stopAutoPlay);
            carousel.addEventListener('mouseleave', startAutoPlay);
            carousel.addEventListener('focusin', stopAutoPlay);
            carousel.addEventListener('focusout', (event) => {
                if (!carousel.contains(event.relatedTarget)) startAutoPlay();
            });
            document.addEventListener('visibilitychange', () => {
                if (document.hidden) stopAutoPlay();
                else startAutoPlay();
            });
            viewport.addEventListener('touchstart', (event) => {
                touchStartX = event.changedTouches[0]?.clientX ?? null;
                stopAutoPlay();
            }, { passive: true });
            viewport.addEventListener('touchend', (event) => {
                if (touchStartX === null) return;
                const deltaX = (event.changedTouches[0]?.clientX ?? touchStartX) - touchStartX;
                if (Math.abs(deltaX) > 45) showSlide(currentIndex + (deltaX < 0 ? 1 : -1));
                touchStartX = null;
                startAutoPlay();
            }, { passive: true });

            showSlide(0);
            startAutoPlay();
        }
    }

    // Aparición progresiva al entrar en pantalla. Sin IntersectionObserver no se oculta nada.
    const revealElements = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const observer = new IntersectionObserver((entries, currentObserver) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    currentObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });
        revealElements.forEach((element) => observer.observe(element));
    } else {
        revealElements.forEach((element) => element.classList.add('is-visible'));
    }
});
