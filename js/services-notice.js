/* Aviso temporal de Servicios: se puede reutilizar en otras páginas del sitio. */
document.addEventListener('DOMContentLoaded', () => {
    // Si alguna foto del equipo aún no está disponible, la tarjeta conserva su fondo decorativo.
    document.querySelectorAll('.team-card__portrait > img').forEach((image) => {
        image.addEventListener('error', () => { image.hidden = true; });
    });

    const dialog = document.getElementById('servicesNotice');
    if (!dialog) return;

    const closeMenuIfOpen = () => {
        const menuButton = document.querySelector('.hamburger');
        const navLinks = document.querySelector('.nav-links');
        if (!menuButton || !navLinks) return;
        navLinks.classList.remove('is-open');
        menuButton.setAttribute('aria-expanded', 'false');
        menuButton.setAttribute('aria-label', 'Abrir menú');
        const icon = menuButton.querySelector('i');
        if (icon) icon.className = 'fa-solid fa-bars';
    };

    document.querySelectorAll('[data-services-notice]').forEach((trigger) => {
        trigger.addEventListener('click', () => {
            closeMenuIfOpen();
            if (typeof dialog.showModal === 'function') dialog.showModal();
            else dialog.setAttribute('open', '');
        });
    });

    document.querySelectorAll('[data-close-services-notice]').forEach((button) => {
        button.addEventListener('click', () => {
            if (typeof dialog.close === 'function') dialog.close();
            else dialog.removeAttribute('open');
        });
    });

    // Cerrar al pulsar fuera del contenido, además de con Escape.
    dialog.addEventListener('click', (event) => {
        if (event.target === dialog) {
            if (typeof dialog.close === 'function') dialog.close();
            else dialog.removeAttribute('open');
        }
    });

    // Si la imagen aún no existe, el texto del aviso mantiene el mensaje visible.
    const noticeImage = dialog.querySelector('.services-notice__image');
    if (noticeImage) {
        noticeImage.addEventListener('error', () => {
            noticeImage.hidden = true;
        });
    }
});
