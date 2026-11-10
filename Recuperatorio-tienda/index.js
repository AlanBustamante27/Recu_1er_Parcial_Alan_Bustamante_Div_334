
/* ---- DATOS INICIALES DE LOS PRODUCTOS ---- */

// JSON con la información de las hamburguesas
const productosJSON = `[
  { "id": 1, "nombre": "Cheeseburger", "descripcion": "Medallón de carne, cheddar, pepinos y ketchup", "categoria": "Clásicas", "precio": 7500, "stock": 10, "imagen": "img/1.jpg" },
  { "id": 2, "nombre": "Clásica Completa", "descripcion": "Carne, lechuga, tomate y cebolla", "categoria": "Clásicas", "precio": 8200, "stock": 8, "imagen": "img/2.jpg" },
  { "id": 3, "nombre": "Cuarto de Libra", "descripcion": "Carne de 200 g, cheddar, cebolla y tomate", "categoria": "Clásicas", "precio": 9900, "stock": 0, "imagen": "img/3.jpg" },
  { "id": 4, "nombre": "Bacon BBQ", "descripcion": "Carne, panceta crocante, cheddar y salsa barbacoa", "categoria": "Especiales", "precio": 12500, "stock": 5, "imagen": "img/4.jpg" },
  { "id": 5, "nombre": "Provoleta", "descripcion": "Carne, provoleta fundida y cebolla caramelizada", "categoria": "Especiales", "precio": 13200, "stock": 4, "imagen": "img/5.jpg" },
  { "id": 6, "nombre": "Doble Cheddar", "descripcion": "Doble carne, doble cheddar, cebolla y lechuga", "categoria": "Especiales", "precio": 14000, "stock": 3, "imagen": "img/6.jpg" },
  { "id": 7, "nombre": "Combo Clásico", "descripcion": "Hamburguesa completa con papas fritas", "categoria": "Combos", "precio": 15900, "stock": 6, "imagen": "img/7.jpg" },
  { "id": 8, "nombre": "Combo Crispy", "descripcion": "Pollo crispy, coleslaw y papas fritas", "categoria": "Combos", "precio": 16500, "stock": 2, "imagen": "img/8.jpg" },
  { "id": 9, "nombre": "Combo Onion", "descripcion": "Carne, aros de cebolla, cheddar y papas fritas", "categoria": "Combos", "precio": 17800, "stock": 1, "imagen": "img/9.jpg" }
]`;

// ---- TRANSFORMAR JSON Y GUARDAR PRODUCTOS ----

// Comprueba si ya existen productos guardados en localStorage
if (localStorage.getItem("productos") === null) {

    // Convierte el JSON en un array de objetos
    let productosIniciales = JSON.parse(productosJSON);

    // Guarda los productos en localStorage
    localStorage.setItem("productos", JSON.stringify(productosIniciales));

}

// Recupera los productos directamente desde localStorage
let productos = JSON.parse(localStorage.getItem("productos"));

// Muestra los productos en una tabla por consola
console.table(productos);

// -------------------------------------------------------------------------------


/* ---- ELEMENTOS DEL DOM ---- */

// Obtiene el título de la tienda y el contenedor de productos
let tituloTienda = document.getElementById("titulo-tienda");
let contenedorProductos = document.getElementById("products-container");

// -------------------------------------------------------------------------------


/* ---- VARIABLES DE LOS FILTROS ---- */

// Almacenan los valores seleccionados por el usuario
let categoriaSeleccionada = "Todas";
let textoBusqueda = "";
let ordenSeleccionado = "";

// Indica si el catálogo ya fue activado mediante el título
let catalogoActivado = false;

// -------------------------------------------------------------------------------


/* ---- FUNCION MOSTRAR PRODUCTOS ---- */

// Crea y muestra las tarjetas de productos dentro del catálogo
function mostrarProductos(listaProductos) {

    // Limpia el contenedor antes de mostrar los productos
    contenedorProductos.innerHTML = "";

    // Recorre todos los productos recibidos
    listaProductos.forEach(producto => {

        // Crea una tarjeta para cada producto
        let tarjeta = document.createElement("div");

        // Asigna la clase CSS correspondiente
        tarjeta.classList.add("producto");

        // Inserta la información del producto dentro de la tarjeta
        tarjeta.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}">

            <h3>${producto.nombre}</h3>

            <p>${producto.descripcion}</p>

            <p class="precio">$${producto.precio}</p>

            <button
                class="btn-agregar"
                data-id="${producto.id}"
                ${producto.stock === 0 ? "disabled" : ""}
            >
                ${producto.stock === 0 ? "Sin stock" : "Agregar al carrito"}
            </button>
        `;

        // Agrega la tarjeta al contenedor de productos
        contenedorProductos.appendChild(tarjeta);

    });

}

// -------------------------------------------------------------------------------


/* ---- FILTROS DE PRODUCTOS ---- */

// Aplica los filtros de categoría, búsqueda y ordenamiento
function aplicarFiltros() {

    // Crea una copia del array original de productos
    let productosFiltrados = [...productos];

    // ---- FILTRO POR CATEGORIA ----

    // Comprueba si se seleccionó una categoría específica
    if (categoriaSeleccionada !== "Todas") {

        // Conserva solamente los productos de esa categoría
        productosFiltrados = productosFiltrados.filter(producto =>
            producto.categoria === categoriaSeleccionada
        );

    }

    // ---- FILTRO POR BUSQUEDA ----

    // Busca coincidencias en el nombre o la descripción
    productosFiltrados = productosFiltrados.filter(producto => {

        // Convierte los textos a minúsculas para comparar
        let nombre = producto.nombre.toLowerCase();
        let descripcion = producto.descripcion.toLowerCase();
        let texto = textoBusqueda.toLowerCase();

        // Comprueba si el texto ingresado aparece en alguno de los campos
        return nombre.includes(texto) || descripcion.includes(texto);

    });

    // ---- ORDENAMIENTO POR PRECIO ----

    // Ordena los productos de menor a mayor precio
    if (ordenSeleccionado === "menor") {

        productosFiltrados.sort((a, b) => a.precio - b.precio);

    // Ordena los productos de mayor a menor precio
    } else if (ordenSeleccionado === "mayor") {

        productosFiltrados.sort((a, b) => b.precio - a.precio);

    }

    // ---- MOSTRAR RESULTADOS ----

    // Comprueba si existen productos que coincidan con los filtros
    if (productosFiltrados.length === 0) {

        contenedorProductos.innerHTML = "<p>No se encontraron productos</p>";

    } else {

        // Muestra los productos filtrados
        mostrarProductos(productosFiltrados);

    }

}

// -------------------------------------------------------------------------------


/* ---- EVENTO DEL TITULO BURGER HOUSE ---- */

// Al hacer clic en el título, activa el catálogo y muestra los productos
tituloTienda.addEventListener("click", () => {

    catalogoActivado = true;

    aplicarFiltros();

});

// -------------------------------------------------------------------------------


/* ---- BUSCADOR DE PRODUCTOS ---- */

// Obtiene el input de búsqueda
let buscador = document.querySelector(".barra-busqueda");

// Detecta cuando el usuario escribe o modifica el texto
buscador.addEventListener("keyup", () => {

    // Guarda el texto ingresado
    textoBusqueda = buscador.value;

    // Actualiza los productos si el catálogo está activado
    if (catalogoActivado) {
        aplicarFiltros();
    }

});

// -------------------------------------------------------------------------------


/* ---- FILTRO POR CATEGORIAS ---- */

// Obtiene todos los botones que tienen el atributo data-categoria
let botonesCategorias = document.querySelectorAll("[data-categoria]");

// Recorre los botones para asignarles un evento
botonesCategorias.forEach(boton => {

    boton.addEventListener("click", () => {

        // Guarda la categoría seleccionada
        categoriaSeleccionada = boton.dataset.categoria;

        // Actualiza el catálogo si está activado
        if (catalogoActivado) {
            aplicarFiltros();
        }

    });

});

// -------------------------------------------------------------------------------


/* ---- ORDENAMIENTO POR PRECIO ---- */

// Obtiene el selector de ordenamiento
let selectOrden = document.getElementById("ordenar-precio");

// Detecta cuando cambia la opción seleccionada
selectOrden.addEventListener("change", () => {

    // Guarda el orden seleccionado
    ordenSeleccionado = selectOrden.value;

    // Actualiza el catálogo si está activado
    if (catalogoActivado) {
        aplicarFiltros();
    }

});

// -------------------------------------------------------------------------------


/* ---- CARRITO DE COMPRAS ---- */

// Recupera el carrito guardado en localStorage
// Si no existe, inicializa un array vacío
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// -------------------------------------------------------------------------------


/* ---- AGREGAR PRODUCTOS AL CARRITO ---- */

// Recibe el ID del producto que se desea agregar
function agregarAlCarrito(id) {

    // Busca el producto correspondiente en el array
    let producto = productos.find(producto => producto.id === id);

    // Comprueba si el producto ya está en el carrito
    let productoEnCarrito = carrito.find(item => item.id === id);

    // Comprueba que el producto exista
    if (!producto) {
        return;
    }

    // Si el producto ya está en el carrito
    if (productoEnCarrito) {

        // Comprueba que no se supere el stock disponible
        if (productoEnCarrito.cantidad >= producto.stock) {

            alert("No hay más stock disponible");
            return;

        }

        // Aumenta la cantidad del producto
        productoEnCarrito.cantidad++;

    } else {

        // Comprueba que el producto tenga stock disponible
        if (producto.stock === 0) {
            return;
        }

        // Agrega el producto al carrito con cantidad inicial 1
        carrito.push({
            id: id,
            cantidad: 1
        });

    }

    // Actualiza los datos y la visualización del carrito
    actualizarCarrito();

}

// -------------------------------------------------------------------------------


/* ---- QUITAR PRODUCTOS DEL CARRITO ---- */

// Recibe el ID del producto que se desea quitar
function quitarDelCarrito(id) {

    // Busca el producto dentro del carrito
    let productoEnCarrito = carrito.find(item => item.id === id);

    if (productoEnCarrito) {

        // Resta una unidad a la cantidad
        productoEnCarrito.cantidad--;

        // Si la cantidad llega a cero, elimina el producto
        if (productoEnCarrito.cantidad === 0) {

            carrito = carrito.filter(item => item.id !== id);

        }

    }

    // Actualiza los datos y la visualización del carrito
    actualizarCarrito();

}

// -------------------------------------------------------------------------------


/* ---- EVENTO DEL BOTON QUITAR ---- */

// Obtiene la lista del carrito
let listaCarrito = document.getElementById("cart-list");

// Detecta los clics sobre los botones Quitar
listaCarrito.addEventListener("click", evento => {

    if (evento.target.classList.contains("btn-quitar")) {

        // Obtiene el ID del producto seleccionado
        let id = Number(evento.target.dataset.id);

        // Ejecuta la función para quitar una unidad
        quitarDelCarrito(id);

    }

});

// -------------------------------------------------------------------------------


/* ---- VACIAR CARRITO ---- */

// Obtiene el botón para vaciar el carrito
let botonVaciar = document.getElementById("vaciar-carrito");

// Detecta el clic sobre el botón
botonVaciar.addEventListener("click", () => {

    // Reemplaza el carrito por un array vacío
    carrito = [];

    // Actualiza los datos y la visualización del carrito
    actualizarCarrito();

});

// -------------------------------------------------------------------------------


/* ---- MOSTRAR CARRITO ---- */

// Muestra los productos agregados al carrito
function mostrarCarrito() {

    // Obtiene la lista donde se mostrarán los productos
    let listaCarrito = document.getElementById("cart-list");

    // Limpia la lista antes de volver a mostrarla
    listaCarrito.innerHTML = "";

    // Comprueba si el carrito está vacío
    if (carrito.length === 0) {

        listaCarrito.innerHTML = "<li>Tu carrito está vacío</li>";

        return;

    }

    // Recorre los productos que están en el carrito
    carrito.forEach(item => {

        // Busca la información del producto
        let producto = productos.find(producto => producto.id === item.id);

        // Calcula el subtotal según la cantidad
        let subtotal = producto.precio * item.cantidad;

        // Crea un elemento de lista para el producto
        let elemento = document.createElement("li");

        // Inserta el nombre, cantidad, subtotal y botón para quitar
        elemento.innerHTML = `
            ${producto.nombre} -
            Cantidad: ${item.cantidad} -
            Subtotal: $${subtotal}

            <button class="btn-quitar" data-id="${producto.id}">
                Quitar
            </button>
        `;

        // Agrega el elemento a la lista del carrito
        listaCarrito.appendChild(elemento);

    });

}

// -------------------------------------------------------------------------------


/* ---- ACTUALIZAR CARRITO ---- */

// Actualiza el total, el contador y guarda los cambios
function actualizarCarrito() {

    // Inicializa el total y la cantidad de productos
    let total = 0;
    let cantidadProductos = 0;

    // Recorre todos los productos del carrito
    carrito.forEach(item => {

        // Busca la información de cada producto
        let producto = productos.find(producto => producto.id === item.id);

        // Calcula el importe total
        total += producto.precio * item.cantidad;

        // Suma las unidades del carrito
        cantidadProductos += item.cantidad;

    });

    // Actualiza el importe total de la compra
    document.getElementById("cart-total").textContent =
        "Total: $" + total;

    // Actualiza el contador de productos del encabezado
    document.getElementById("contador-carrito").textContent =
        "Carrito (" + cantidadProductos + ")";

    // Guarda el carrito actualizado en localStorage
    localStorage.setItem("carrito", JSON.stringify(carrito));

    // Vuelve a mostrar los productos del carrito
    mostrarCarrito();

}

// -------------------------------------------------------------------------------


/* ---- EVENTO DEL BOTON AGREGAR AL CARRITO ---- */

// Detecta los clics sobre los botones Agregar
contenedorProductos.addEventListener("click", evento => {

    if (evento.target.classList.contains("btn-agregar")) {

        // Obtiene el ID del producto seleccionado
        let id = Number(evento.target.dataset.id);

        // Ejecuta la función para agregarlo al carrito
        agregarAlCarrito(id);

    }

});

// -------------------------------------------------------------------------------


/* ---- INICIALIZACION DEL CARRITO ---- */

// Muestra los datos del carrito al cargar la página
// También recupera y visualiza los productos guardados anteriormente
actualizarCarrito();

// -------------------------------------------------------------------------------
