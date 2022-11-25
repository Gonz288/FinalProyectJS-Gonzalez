class Producto {
    constructor(id, nombre, precio, img){
        this.id = id,
        this.nombre = nombre,
        this.precio = precio,
        this.img = img;
    }
}

let productos = [];

const cargarProductos = async()=>{
    const response = await fetch("productos.json");
    const data = await response.json();
    for(let producto of data){
        let productoNuevo = new Producto(producto.id, producto.nombre, producto.precio, producto.img);
        productos.push(productoNuevo);
    }
    localStorage.setItem("stock", JSON.stringify(productos));
}
localStorage.getItem("stock") ? productos = JSON.parse(localStorage.getItem("stock")) : (cargarProductos());
