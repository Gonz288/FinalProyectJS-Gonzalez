// DOM
let modalBody = document.getElementById("modal-carrito-body");
let btnCarrito = document.getElementById("btn-carrito");
let btnCrearProducto = document.getElementById("btn-crearProducto");
let divCompra = document.getElementById("precioTotal");
let divProductos = document.getElementById("div-productos");
let btnBuscarProducto = document.getElementById("btn-buscar");
let buscador = document.getElementById("Buscar");
let selectOrden = document.getElementById("selectOrden");
let loaderTexto = document.getElementById("loaderTexto");
let loader = document.getElementById("loader");
let btnFinalizarCompra = document.getElementById("btn-finalizarCompra");
let btnAgregarSaldo = document.getElementById("btn-agregarSaldo");
let textSaldo = document.getElementById("textSaldo");

//Productos Guardados en el Carrito Storage
let productosCarritoStorage = JSON.parse(localStorage.getItem("carrito")) || [];
let saldoStorage = JSON.parse(localStorage.getItem("saldo")) || 0;

textSaldo.innerHTML = `Saldo: $${saldoStorage}`;
let acumulador = 0;

//Funcion Crear Productos
function crearProducto(productos){
    let inputId = document.getElementById("id");
    let inputNombre = document.getElementById("nombre");
    let inputPrecio = document.getElementById("precio");

    //Compruebo que no hayan entrado datos vacios
    if(inputId.value.length >= 1 && inputNombre.value.length >= 1 && inputPrecio.value.length >= 1){
        //Compruebo si existe un producto con el mismo numero de ID
        const found = productos.find(producto => producto.id == inputId.value);
        if(found){
            Swal.fire({
                title: "Error, Ya existe ese producto con el mismo Numero de ID",
                icon: "error",
                confirmButtonText: "Ok",
                confirmButtonColor: "#0080FF"
            });
        }else{
            let nuevoProducto = new Producto(parseInt(inputId.value), inputNombre.value, parseInt(inputPrecio.value), "img/newProduct.png");

            productos.push(nuevoProducto);
            localStorage.setItem("stock", JSON.stringify(productos));
            mostrarProductos(productos);

            inputId.value = ""
            inputNombre.value = ""
            inputPrecio.value = ""

            Swal.fire({
                title: "Se ha creado el producto Exitosamente!",
                icon: "success",
                confirmButtonText: "OK",
                confirmButtonColor: "green"  
                });
        }
    }else{
        Swal.fire({
            title: "Por favor, complete todos los campos.",
            icon: "warning",
            confirmButtonText: "OK",
            confirmButtonColor: "#0080FF"
        });
    }
}

//Funcion Actualizar Productos
function actualizarProducto(productoActualizar, productos){
    let inputIdActualizar = document.getElementById("idActualizar");
    let inputNombreActualizar = document.getElementById("nombreActualizar");
    let inputPrecioActualizar = document.getElementById("precioActualizar");

    inputIdActualizar.value = parseInt(productoActualizar.id);
    inputNombreActualizar.value = productoActualizar.nombre;
    inputPrecioActualizar.value = parseInt(productoActualizar.precio);

    let btnFormActualizar = document.getElementById("btn-form-actualizar");
    btnFormActualizar.addEventListener("click", ()=>{

        //Guardo el ID original para que no haya conflictos
        idOriginal = parseInt(productoActualizar.id);

        //Compruebo que no hayan entrado datos vacios
        if(inputIdActualizar.value.length >= 1 && inputNombreActualizar.value.length >= 1 && inputPrecioActualizar.value.length >= 1){
            //Compruebo si existe un producto con el mismo numero de ID
            const found = productos.find(producto => producto.id == inputIdActualizar.value);
            if(found && inputIdActualizar.value != idOriginal){
                Swal.fire({
                    title: "Error, Ya existe ese producto con el mismo Numero de ID",
                    icon: "error",
                    confirmButtonText: "Ok",
                    confirmButtonColor: "#0080FF"
                });
            }else{
                //Actualizamos los datos del objeto
                productoActualizar.id = parseInt(inputIdActualizar.value);
                productoActualizar.nombre = inputNombreActualizar.value;
                productoActualizar.precio = parseInt(inputPrecioActualizar.value);

                //Actualizamos del stock
                localStorage.setItem("stock", JSON.stringify(productos));

                //Si estaba agregado al carrito tambien lo Actualizamos.
                let productoEnCarrito = productosCarritoStorage.find((elem) => (elem.id == idOriginal));
                if(productoEnCarrito != undefined){
                    productoEnCarrito.id = parseInt(productoActualizar.id);
                    productoEnCarrito.nombre = productoActualizar.nombre;
                    productoEnCarrito.precio = parseInt(productoActualizar.precio);

                    localStorage.setItem("carrito", JSON.stringify(productosCarritoStorage));
                    precioTotal(productos);
                }
                Swal.fire({
                    title: "Producto Actualizado Correctamente",
                    imageUrl: "img/refresh.png",
                    imageWidth: "150px",
                    imageHeight: "150px",
                    confirmButtonText: "Ok",
                    confirmButtonColor: "blue",
                    }).then((result) => {
                        location.reload();
                });
            }
        }else{
            //En caso que no haya llenado los campos
            Swal.fire({
                title: "Por favor, complete todos los campos.",
                icon: "warning",
                confirmButtonText: "OK",
                confirmButtonColor: "#0080FF"
            });
        }
    });
}

//Funcion Mostrar Productos
function mostrarProductos(productos){
    divProductos.innerHTML = "";
    for(let producto of productos){
        let nuevoProducto = document.createElement("div");
        nuevoProducto.classList.add("col");
        nuevoProducto.innerHTML =   `<div class="card" id="${producto.id}">
                                        <div class="buttons">
                                            <button id="btn-actualizar-${producto.id}" class="btnActualizar" data-bs-toggle="modal" data-bs-target="#modalActualizarProducto"><i class="fa-solid fa-arrows-rotate"></i></button>
                                            <button id="btn-eliminar-${producto.id}" class="btnEliminar"><i class="fa-solid fa-trash"></i></button>
                                        </div>
                                            <img src="${producto.img}" class="card-img-top imgProductos" alt="${producto.nombre}">
                                        <div class="card-body">
                                            <h2 class="card-title prenda">${producto.nombre}</h2>
                                            <h3 class="card-title precio">$${producto.precio}</h3>
                                            <button id="btn-${producto.id}" class="btn btn-success">Agregar al Carrito </button>
                                        </div>
                                    </div>`
        divProductos.appendChild(nuevoProducto);
        
        // Button Agregar al Carrito
        let btnAgregar = document.getElementById(`btn-${producto.id}`);
        btnAgregar.addEventListener("click", ()=>{agregarProductosAlCarrito(producto);});

        // Button Eliminar Producto
        let btnEliminar = document.getElementById(`btn-eliminar-${producto.id}`);
        btnEliminar.addEventListener("click", ()=>{eliminarProducto(producto,productos);});

        // Button Actualizar Producto
        let btnActualizar = document.getElementById(`btn-actualizar-${producto.id}`);
        btnActualizar.addEventListener("click", ()=>{actualizarProducto(producto,productos);});
    }
}

//Funcion Eliminar productos
function eliminarProducto(productoEliminar, productos){
    Swal.fire({
        title: '¿Está seguro que quiere eliminar el producto?',
        icon:'info',
        showCancelButton: true,
        confirmButtonText: 'Si',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: 'green',
        cancelButtonColor: 'red',
    }).then((result) => {
        if (result.isConfirmed){
            Swal.fire({
                title: "Producto Eliminado Correctamente",
                imageUrl: "img/borrar.png",
                imageWidth: "150px",
                imageHeight: "150px",
                confirmButtonText: "Ok",
                confirmButtonColor: "red",
            }).then((result)=>{
                const filterProductos = productos.filter((elemento) => elemento.id !== productoEliminar.id);

                //Eliminamos del Stock
                localStorage.setItem("stock", JSON.stringify(filterProductos));

                //Si estaba agregado al carrito tambien lo eliminamos.
                let productoEnCarrito = productosCarritoStorage.find((elem) => (elem.id == productoEliminar.id));
                if(productoEnCarrito != undefined){
                    productosCarritoStorage.splice(productoEliminar);
                    localStorage.setItem("carrito", JSON.stringify(productosCarritoStorage));
                }
                location.reload();
            });
        }
    });
}

//Funcion Agregar Productos Al Carrito
function agregarProductosAlCarrito(producto){
    let productoAgregado = productosCarritoStorage.find((elem) => (elem.id == producto.id))
    if(productoAgregado == undefined){
        productosCarritoStorage.push(producto);
        localStorage.setItem("carrito", JSON.stringify(productosCarritoStorage));
        Swal.fire({
            title: "Agregado al Carrito Correctamente",
            icon: "success",
            confirmButtonText: "Ok",
            confirmButtonColor: "green",
            timer: 3000
        });
    }else{
        Swal.fire({
            title: "Error, Este producto ya fue agregado al carrito",
            icon: "warning",
            confirmButtonText: "OK",
            confirmButtonColor: "blue",
            timer: 3000
        });
    }
}

//Funcion Mostrar Productos en el Carrito
function mostrarProductosCarrito(productos){
    modalBody.innerHTML = "";
    productos.forEach((productoDelCarrito)=>{
        modalBody.innerHTML += `
                <div class="card mb-3" style="max-width: 540px;" id="productoCarrito${productoDelCarrito.id}">
                    <div class="row g-0">
                        <div class="col-md-4">
                            <img src="${productoDelCarrito.img}" class="img-thumbnail rounded-start" alt="${productoDelCarrito.nombre}">
                        </div>
                        <div class="col-md-8">
                            <div class="card-body">
                                <h4 class="card-title">${productoDelCarrito.nombre}</h4>
                                <h5 class="card-text">$${productoDelCarrito.precio}</h5>
                                <button class="btn btn-danger" id="botonEliminar${productoDelCarrito.id}"><i class="fa-solid fa-trash"></i> Eliminar</button>
                            </div>
                        </div>
                    </div>
                </div>
        `
    });
    //Eliminar Productos del carrito
    productos.forEach((productoDelCarrito, indice)=>{
        document.getElementById(`botonEliminar${productoDelCarrito.id}`).addEventListener("click",()=>{
            let cardProducto = document.getElementById(`productoCarrito${productoDelCarrito.id}`);
            cardProducto.remove();
            
            let productoCarritoEliminar = productos.find(producto => producto.id == productoDelCarrito.id);
            let posicion = productos.indexOf(productoCarritoEliminar);
            productos.splice(posicion, 1);
            
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

//Funcion Mostrar Precio Total
function precioTotal(productos){
    acumulador = productos.reduce((acc, productoDelCarrito)=>acc + productoDelCarrito.precio,0);
    acumulador == 0 ? divCompra.innerHTML = `Precio Total: $0`: divCompra.innerHTML = `Precio Total: $${acumulador}`;
}

//Funcion Buscar Productos
function buscarProducto(productoBuscado, productos){
    let busqueda = productos.filter(
        (producto) => producto.nombre.toLowerCase().includes(productoBuscado.toLowerCase()) == productoBuscado.includes(productoBuscado.toLowerCase()));

    divProductos.innerHTML = "";
    let coincidencia = document.getElementById("coincidencia");

    busqueda.length == 0 ? coincidencia.innerHTML = `<p class="fs-4 text-center"> No se ha encontrado ninguna concidencia.</p>` : 
    (coincidencia.innerHTML = "",mostrarProductos(busqueda));
}

//Funcion Ordenar Productos
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

//Funcion Agregar Saldo
function agregarSaldo(){
    let inputDepositar = document.getElementById("depositar");
    depositarValue = parseInt(inputDepositar.value)
    if(depositarValue >= 500 && depositarValue <= 100000 ){
        saldoTotal = parseInt(saldoStorage) + depositarValue;
        textSaldo.innerHTML = `Saldo: $${saldoTotal}`;
        localStorage.setItem("saldo", JSON.stringify(saldoTotal));
        Swal.fire({
            title: "Saldo Agregado a su cuenta correctamente",
            icon: "success",
            text: `Usted ha agregado a su cuenta $${depositarValue}`,
            confirmButtonText: "Ok",
            confirmButtonColor: "green",
        }).then((result)=>{
            location.reload();
        })
    }
    else{
        Swal.fire({
            title: "Error, solo puede depositar entre $500 y $100000",
            icon: "error",
            confirmButtonText: "OK",
            confirmButtonColor: "#0080FF"
        });
        inputDepositar.value = "";
    }
}

//Funcion Finalizar Compra
function finalizarCompra(){
    //Chequeo que haya almenos un producto en el carrito
    if(modalBody.innerHTML != ""){
        //Si el saldo es mayor al gasto total
        if(saldoStorage >= acumulador){
            Swal.fire({
                title: '¿Está seguro que quiere finalizar la compra?',
                icon:'info',
                showCancelButton: true,
                confirmButtonText: 'Si',
                cancelButtonText: 'No',
                confirmButtonColor: 'green',
                cancelButtonColor: 'red',
            }).then((result) => {
                if(result.isConfirmed){
                    Swal.fire({
                        title: 'Compra realizada exitosamente',
                        icon: 'success',
                        confirmButtonColor: 'green',
                        text: `Se le han descontado $${acumulador} de su cuenta. Muchas gracias por comprar en nuesta tienda!`,
                    }).then((result)=>{
                        productosCarritoStorage = [];
                        localStorage.removeItem("carrito");
                        saldoStorage = saldoStorage - acumulador;
                        localStorage.setItem("saldo", JSON.stringify(saldoStorage));
                        location.reload();
                    });
                }else{
                    Swal.fire({
                        title: 'No se ha podido finalizar la compra',
                        icon: 'info',
                        text: 'La compra no ha podido ser finalizada, sus productos siguen en el carrito.',
                        confirmButtonColor: 'blue',
                        timer:3500
                    });
                }
            });
        }else{
            Swal.fire({
                title: 'Error al finalizar la compra, No posee el suficiente dinero, deposite y vuelva a intentarlo',
                icon:'error',
                confirmButtonColor: 'blue',
            });
        }
    }else{
        Swal.fire({
            title: 'No tiene ningun producto en su carrito',
            icon:'info',
            confirmButtonText: 'OK',
            timer: 3500
        })
    }
}

//Timeset
setTimeout(()=>{
    loaderTexto.innerHTML = "";
    loader.remove();
    mostrarProductos(productos);
}, 1500);

//Eventos
btnCarrito.addEventListener("click", ()=>{mostrarProductosCarrito(productosCarritoStorage);});
btnCrearProducto.addEventListener("click", ()=>{crearProducto(productos);});
buscador.addEventListener("input", ()=>{buscarProducto(buscador.value, productos);});
btnBuscarProducto.addEventListener("click", ()=>{buscarProducto(buscador.value,productos);});
selectOrden.addEventListener("change",()=>{ordenarProductos(selectOrden.value,productos);});
btnFinalizarCompra.addEventListener("click",()=>{finalizarCompra();});
btnAgregarSaldo.addEventListener("click",()=>{agregarSaldo();});