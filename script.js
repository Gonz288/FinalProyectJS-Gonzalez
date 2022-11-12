// DOM
let modalBody = document.getElementById("modal-carrito-body");
let btnCarrito = document.getElementById("btn-carrito");
let btnCrearProducto = document.getElementById("btn-crearProducto");
let divCompra = document.getElementById("precioTotal");
let divProductos = document.getElementById("div-productos");
let btnBuscarProducto = document.getElementById("btn-buscar");
let buscador = document.getElementById("Buscar");
let selectOrden = document.getElementById("selectOrden")

//Productos Guardados en el Carrito Storage
let productosCarritoStorage = JSON.parse(localStorage.getItem("carrito")) || [];

//Crear Producto
function crearProducto(productos){
    let inputNroSerie = document.getElementById("nroSerie");
    let inputNombre = document.getElementById("nombre");
    let inputPrecio = document.getElementById("precio");


    //Compruebo si existe un producto con el mismo numero de Serie
    const found = productos.find(producto => producto.nroSerie == inputNroSerie.value);
    if(found){
        Swal.fire({
            title: "Error, Ya existe ese producto con el mismo Numero de Serie!",
            icon: "error",
            confirmButtonText: "Ok",
            confirmButtonColor: "#0080FF"
        });
    }else{
        let nuevoProducto = new Producto(parseInt(inputNroSerie.value), inputNombre.value, parseInt(inputPrecio.value), "img/newProduct.png");

        productos.push(nuevoProducto);
        localStorage.setItem("stock", JSON.stringify(productos));
        mostrarProductos(productos);

        inputNroSerie.value = ""
        inputNombre.value = ""
        inputPrecio.value = ""

        Swal.fire({
            title: "Se ha creado el producto Exitosamente!",
            icon: "success",
            confirmButtonText: "Ok",
            confirmButtonColor: "green"  
            }).then((result) => {
                location.reload();
            });
        }
}

//Mostrar Productos
function mostrarProductos(productos){
    divProductos.innerHTML = "";
    for(let producto of productos){
        let nuevoProducto = document.createElement("div");
        nuevoProducto.classList.add("col");
        nuevoProducto.innerHTML = `<div class="card" id="${producto.nroSerie}">
                                        <img src="${producto.img}" class="card-img-top imgProductos" alt="${producto.nombre}">
                                        <div class="card-body">
                                            <h2 class="card-title prenda">${producto.nombre}</h2>
                                            <h3 class="card-title precio">$${producto.precio}</h3>
                                            <button id="btn-${producto.nroSerie}" class="btn btn-success">Agregar al Carrito </button>
                                        </div>
                                    </div>`
        divProductos.appendChild(nuevoProducto);

        // Button Agregar al Carrito
        let btnAgregar = document.getElementById(`btn-${producto.nroSerie}`);
        btnAgregar.addEventListener("click", ()=>{agregarProductosAlCarrito(producto);});
    }
}

//Funcion Agregar Productos Al Carrito
function agregarProductosAlCarrito(producto){
    productosCarritoStorage.push(producto);
    localStorage.setItem("carrito", JSON.stringify(productosCarritoStorage));
    Swal.fire({
        title: "Agregado al Carrito Correctamente",
        icon: "success",
        confirmButtonText: "Ok",
        confirmButtonColor: "green",
        timer: 3000
    });
}

//Mostrar Productos en el Carrito
function mostrarProductosCarrito(productos){
    modalBody.innerHTML = "";
    productos.forEach((productoDelCarrito)=>{
        modalBody.innerHTML += `
                <div class="card mb-3" style="max-width: 540px;" id="productoCarrito${productoDelCarrito.nroSerie}">
                    <div class="row g-0">
                        <div class="col-md-4">
                            <img src="${productoDelCarrito.img}" class="img-thumbnail rounded-start" alt="${productoDelCarrito.nombre}">
                        </div>
                        <div class="col-md-8">
                            <div class="card-body">
                                <h4 class="card-title">${productoDelCarrito.nombre}</h4>
                                <h5 class="card-text">$${productoDelCarrito.precio}</h5>
                                <button class="btn btn-danger" id="botonEliminar${productoDelCarrito.nroSerie}"><i class="fa-solid fa-trash"></i> Eliminar</button>
                            </div>
                        </div>
                    </div>
                </div>
        `
    });
    //Eliminar Producto
    productos.forEach((productoDelCarrito, indice)=>{
        document.getElementById(`botonEliminar${productoDelCarrito.nroSerie}`).addEventListener("click",()=>{
            let cardProducto = document.getElementById(`productoCarrito${productoDelCarrito.nroSerie}`);
            cardProducto.remove();
            
            productosCarritoStorage.splice(indice, 1);
            productoDelCarrito.cantidad -= 1;
            localStorage.setItem('carrito', JSON.stringify(productosCarritoStorage));
            precioTotal(productos);

            const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal.stopTimer)
                    toast.addEventListener('mouseleave', Swal.resumeTimer)
                }
            });
            Toast.fire({
            icon: 'success',
            title: 'Producto Eliminado del Carrito'
            });
        })
    })
    precioTotal(productos);
}

//Mostrar Precio Total
function precioTotal(productos){
    let acumulador = 0;
    acumulador = productos.reduce((acc, productoDelCarrito)=>acc + productoDelCarrito.precio,0);
    acumulador == 0 ? divCompra.innerHTML = `Precio Total: $0`: divCompra.innerHTML = `Precio Total: $${acumulador}`;
}

//Buscar Producto
function buscarProducto(productoBuscado, productos){
    let busqueda = productos.filter(
        (producto) => producto.nombre.toLowerCase().includes(productoBuscado.toLowerCase()) == productoBuscado.includes(productoBuscado.toLowerCase()));

    divProductos.innerHTML = "";
    let coincidencia = document.getElementById("coincidencia");

    busqueda.length == 0 ? coincidencia.innerHTML = `<p class="fs-4 text-center"> No se ha encontrado ninguna concidencia.</p>` : 
    (coincidencia.innerHTML = "",mostrarProductos(busqueda));
}

//Ordenar Productos
function ordenarProductos(selectOrden, productos){
    if(selectOrden == "MenorPrecio"){
        let menorMayor = [].concat(productos);
        menorMayor.sort((a,b) => (a.precio - b.precio));
        mostrarProductos(menorMayor);
    }else if(selectOrden == "MayorPrecio"){
        let mayorMenor = [].concat(productos);
        mayorMenor.sort((a,b) => (b.precio - a.precio));
        mostrarProductos(mayorMenor)
    }else if(selectOrden == "Alfabeticamente"){
        let alfabeticamente = productos.slice();
        alfabeticamente.sort((a,b) => {
            if(a.nombre < b.nombre)return -1;
            if(a.nombre > b.nombre)return 1;
            return 0;
        })
        mostrarProductos(alfabeticamente);
    }else{
        mostrarProductos(productos);
    }
}

//Eventos
btnCarrito.addEventListener("click", ()=>{mostrarProductosCarrito(productosCarritoStorage);});
btnCrearProducto.addEventListener("click", ()=>{crearProducto(productos);});
buscador.addEventListener("input", ()=>{buscarProducto(buscador.value, productos);});
btnBuscarProducto.addEventListener("click", ()=>{buscarProducto(buscador.value,productos);});
selectOrden.addEventListener("change",()=>{ordenarProductos(selectOrden.value,productos);})

mostrarProductos(productos);