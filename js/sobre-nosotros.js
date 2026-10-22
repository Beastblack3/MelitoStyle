
/* ==================================================
   MELITO STYLE — FUNCIONALIDADES DE SOBRE NOSOTROS
   Menú móvil, animaciones y año del pie de página
   ================================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* ===== MENÚ DE NAVEGACIÓN MÓVIL ===== */

    const menuButton = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    const closeMenu = () => {
        if (!menuButton || !navLinks) return;

        navLinks.classList.remove('is-open');
        menuButton.setAttribute('aria-expanded', 'false');
        menuButton.setAttribute('aria-label', 'Abrir menú');

        const icon = menuButton.querySelector('i');

        if (icon) {
            icon.className = 'fa-solid fa-bars';
        }
    };

    if (menuButton && navLinks) {
        menuButton.addEventListener('click', () => {
            const isOpening = !navLinks.classList.contains('is-open');

            navLinks.classList.toggle('is-open', isOpening);
            menuButton.setAttribute('aria-expanded', String(isOpening));
            menuButton.setAttribute(
                'aria-label',
                isOpening ? 'Cerrar menú' : 'Abrir menú'
            );

            const icon = menuButton.querySelector('i');

            if (icon) {
                icon.className = isOpening
                    ? 'fa-solid fa-xmark'
                    : 'fa-solid fa-bars';
            }
        });

        // Cerrar el menú al seleccionar un enlace.
        navLinks.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', closeMenu);
        });

        // Cerrar con Escape.
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                closeMenu();
            }
        });

        // Cerrar al pulsar fuera del menú.
        document.addEventListener('click', (event) => {
            if (!navLinks.classList.contains('is-open')) return;

            if (
                !navLinks.contains(event.target) &&
                !menuButton.contains(event.target)
            ) {
                closeMenu();
            }
        });

        // Cerrar al volver a una pantalla de escritorio.
        window.addEventListener('resize', () => {
            if (window.matchMedia('(min-width: 851px)').matches) {
                closeMenu();
            }
        });
    }


    /* ===== AÑO AUTOMÁTICO DEL PIE DE PÁGINA ===== */

    const year = document.querySelector('#year');

    if (year) {
        year.textContent = String(new Date().getFullYear());
    }


    /* ===== ANIMACIONES DE ENTRADA ===== */

    const teamCards = document.querySelectorAll('.team-card');
    const revealElements = document.querySelectorAll('.reveal');

    const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
    ).matches;

    // Si se prefieren animaciones reducidas o el navegador
    // no admite IntersectionObserver, mostramos todo.
    if (
        prefersReducedMotion ||
        !('IntersectionObserver' in window)
    ) {
        teamCards.forEach((card) => {
            card.classList.add('show');
        });

        revealElements.forEach((element) => {
            element.classList.add('is-visible');
        });

    } else {

        // Animación de las tarjetas del equipo.
        const teamObserver = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('show');
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.05
            }
        );

        teamCards.forEach((card) => {
            teamObserver.observe(card);
        });


        // Animación del contenido con clase reveal.
        const revealObserver = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.12,
                rootMargin: '0px 0px -35px 0px'
            }
        );

        revealElements.forEach((element) => {
            revealObserver.observe(element);
        });
    }

    // Activamos los estilos animados después de preparar
    // los observadores y las clases necesarias.
    document.documentElement.classList.add('js-ready');

});
