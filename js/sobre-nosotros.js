
// ===== ANIMACIÓN DE LAS TARJETAS DEL EQUIPO =====

const teamCards = document.querySelectorAll('.team-card');

const observer = new IntersectionObserver(
    (entries) => {

        entries.forEach((entry) => {

            if (entry.isIntersecting) {
                entry.target.classList.add('show');

                // Dejamos de observar la tarjeta
                // una vez que ya apareció.
                observer.unobserve(entry.target);
            }

        });

    },
    {
        threshold: 0.15
    }
);


// Observamos cada tarjeta

teamCards.forEach((card) => {
    observer.observe(card);
});
