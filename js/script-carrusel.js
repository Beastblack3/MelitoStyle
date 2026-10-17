document.addEventListener('DOMContentLoaded', function() {
    const carouselInner = document.querySelector('.carousel-inner');
    const items = document.querySelectorAll('.carousel-item');
    let currentIndex = 0;
    const itemsPerPage = 3; // Número de cajas visibles a la vez
    const totalItems = items.length;

    // Función para actualizar el carrusel
    function updateCarousel() {
        // Calcular el índice de la caja central
        currentIndex = (currentIndex + 1) % totalItems;

        // Actualizar clases para la caja activa
        items.forEach((item, index) => {
            if (index === currentIndex) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        // Mover el carrusel para centrar la caja activa
        const itemWidth = items[0].offsetWidth + 20; // Ancho de la caja + gap
        const offset = -currentIndex * itemWidth + (carouselInner.offsetWidth / 2) - (itemWidth / 2);
        carouselInner.style.transform = `translateX(${offset}px)`;
    }

    // Cambiar de caja automáticamente cada 4 segundos
    setInterval(updateCarousel, 4000);

    // Iniciar el carrusel
    updateCarousel();
});
