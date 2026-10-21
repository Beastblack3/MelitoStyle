
document.addEventListener("DOMContentLoaded", () => {
    // Cambia este número si el negocio utiliza otro WhatsApp.
    const WHATSAPP = "573234838051";

    // Productos de prueba. Más adelante vendrán de Supabase.
    const productos = [
        {
            id: 1,
            nombre: "Cera mate",
            descripcion: "Acabado natural y textura.",
            precio: 22000,
            categoria: "ceras",
            imagen: "../../img/productos/cera-mate.jpg",
            stock: 8
        },
        {
            id: 2,
            nombre: "Gel fijación fuerte",
            descripcion: "Fijación duradera para tu estilo.",
            precio: 18000,
            categoria: "geles",
            imagen: "../../img/productos/gel-fijador.jpg",
            stock: 12
        },
        {
            id: 3,
            nombre: "Crema para peinar",
            descripcion: "Control y suavidad para el cabello.",
            precio: 26000,
            categoria: "cabello",
            imagen: "../../img/productos/crema-peinar.jpg",
            stock: 5
        },
        {
            id: 4,
            nombre: "Perfume masculino",
            descripcion: "Una fragancia para destacar.",
            precio: 95000,
            categoria: "fragancias",
            imagen: "../../img/productos/perfume.jpg",
            stock: 4
        },
        {
            id: 5,
            nombre: "Gorra clásica",
            descripcion: "Un accesorio para completar tu look.",
            precio: 35000,
            categoria: "accesorios",
            imagen: "../../img/productos/gorra.jpg",
            stock: 6
        },
        {
            id: 6,
            nombre: "Polvo texturizante",
            descripcion: "Volumen y textura para tu peinado.",
            precio: 28000,
            categoria: "cabello",
            imagen: "../../img/productos/polvo-texturizante.jpg",
            stock: 7
        },
        {
            id: 7,
            nombre: "Gel de efecto natural",
            descripcion: "Peinados definidos sin complicaciones.",
            precio: 20000,
            categoria: "geles",
            imagen: "../../img/productos/gel-natural.jpg",
            stock: 0
        },
        {
            id: 8,
            nombre: "Cera de fijación fuerte",
            descripcion: "Control y definición durante el día.",
            precio: 25000,
            categoria: "ceras",
            imagen: "../../img/productos/cera-fuerte.jpg",
            stock: 3
        }
    ];

    const grid = document.getElementById("product-grid");
    const searchInput = document.getElementById("search-product");
    const filters = document.getElementById("category-filters");
    const count = document.getElementById("product-count");
    const emptyState = document.getElementById("empty-state");

    const menuToggle = document.querySelector(".menu-toggle");
    const navMenu = document.getElementById("nav-menu");

    let categoriaActual = "todos";

    const nombresCategoria = {
        ceras: "Ceras",
        geles: "Geles",
        cabello: "Cabello",
        fragancias: "Fragancias",
        accesorios: "Accesorios"
    };

    const formatoCOP = new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        maximumFractionDigits: 0
    });

    // Menú hamburguesa
    menuToggle.addEventListener("click", () => {
        const abierto = navMenu.classList.toggle("open");

        menuToggle.setAttribute("aria-expanded", String(abierto));

        menuToggle.setAttribute(
            "aria-label",
            abierto ? "Cerrar menú" : "Abrir menú"
        );

        menuToggle.innerHTML = abierto
            ? '<i class="fa-solid fa-xmark" aria-hidden="true"></i>'
            : '<i class="fa-solid fa-bars" aria-hidden="true"></i>';
    });

    // Cerrar menú al elegir un enlace
    navMenu.querySelectorAll("a").forEach(enlace => {
        enlace.addEventListener("click", () => {
            navMenu.classList.remove("open");
            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.setAttribute("aria-label", "Abrir menú");
            menuToggle.innerHTML =
                '<i class="fa-solid fa-bars" aria-hidden="true"></i>';
        });
    });

    // Crear una tarjeta de producto
    function crearTarjeta(producto) {
        const tarjeta = document.createElement("article");
        tarjeta.className = "product-card";

        const imagen = document.createElement("img");
        imagen.src = producto.imagen;
        imagen.alt = producto.nombre;
        imagen.loading = "lazy";

        // Imagen alternativa si todavía no se ha añadido la fotografía.
        imagen.addEventListener("error", () => {
            imagen.removeAttribute("src");
            imagen.alt = `Imagen pendiente: ${producto.nombre}`;
            imagen.classList.add("image-missing");
        }, { once: true });

        const contenedorImagen = document.createElement("div");
        contenedorImagen.className = "product-image";
        contenedorImagen.appendChild(imagen);

        const informacion = document.createElement("div");
        informacion.className = "product-info";

        const categoria = document.createElement("span");
        categoria.className = "product-category";
        categoria.textContent = nombresCategoria[producto.categoria]
            || producto.categoria;

        const nombre = document.createElement("h3");
        nombre.textContent = producto.nombre;

        const descripcion = document.createElement("p");
        descripcion.className = "product-description";
        descripcion.textContent = producto.descripcion;

        const precio = document.createElement("p");
        precio.className = "product-price";
        precio.textContent = formatoCOP.format(producto.precio);

        const stock = document.createElement("p");
        stock.className = "product-stock";

        const boton = document.createElement("a");
        boton.className = "product-button";

        if (producto.stock > 0) {
            stock.textContent = "Disponible";
            boton.href = `https://wa.me/${WHATSAPP}?text=${
                encodeURIComponent(
                    `Hola, Melito Style. Me interesa el producto: ${producto.nombre}, precio ${formatoCOP.format(producto.precio)}. ¿Cómo puedo comprarlo?`
                )
            }`;

            boton.target = "_blank";
            boton.rel = "noopener noreferrer";
            boton.innerHTML =
                '<i class="fa-brands fa-whatsapp" aria-hidden="true"></i> Consultar por WhatsApp';
        } else {
            stock.textContent = "Agotado";
            stock.classList.add("unavailable");

            boton.href = "#";
            boton.classList.add("disabled");
            boton.setAttribute("aria-disabled", "true");
            boton.textContent = "Producto agotado";
            boton.addEventListener("click", event => {
                event.preventDefault();
            });
        }

        informacion.append(
            categoria,
            nombre,
            descripcion,
            precio,
            stock,
            boton
        );

        tarjeta.append(contenedorImagen, informacion);

        return tarjeta;
    }

    // Aplicar búsqueda y categoría seleccionada
    function filtrarProductos() {
        const busqueda = searchInput.value
            .trim()
            .toLocaleLowerCase("es");

        const resultado = productos.filter(producto => {
            const coincideCategoria =
                categoriaActual === "todos" ||
                producto.categoria === categoriaActual;

            const textoProducto =
                `${producto.nombre} ${producto.descripcion} ${producto.categoria}`
                    .toLocaleLowerCase("es");

            const coincideBusqueda = textoProducto.includes(busqueda);

            return coincideCategoria && coincideBusqueda;
        });

        grid.replaceChildren();

        resultado.forEach(producto => {
            grid.appendChild(crearTarjeta(producto));
        });

        count.textContent =
            `${resultado.length} ${resultado.length === 1 ? "producto encontrado" : "productos encontrados"}`;

        emptyState.hidden = resultado.length !== 0;
    }

    // Filtros de categoría
    filters.addEventListener("click", event => {
        const boton = event.target.closest("[data-category]");

        if (!boton) return;

        categoriaActual = boton.dataset.category;

        filters.querySelectorAll(".filter-button").forEach(filtro => {
            const seleccionado = filtro === boton;

            filtro.classList.toggle("active", seleccionado);
            filtro.setAttribute("aria-pressed", String(seleccionado));
        });

        filtrarProductos();
    });

    // Búsqueda en tiempo real
    searchInput.addEventListener("input", filtrarProductos);

    // Primera carga
    filtrarProductos();
});
