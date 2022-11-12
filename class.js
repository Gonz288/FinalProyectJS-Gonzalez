class Producto {
    constructor(nroSerie, nombre, precio, img){
        this.nroSerie = nroSerie,
        this.nombre = nombre,
        this.precio = precio,
        this.img = img;
    }
}

const producto1 = new Producto(1,"Pantalon", 1500, "img/pantalon.png");
const producto2 = new Producto(2,"Remera", 500, "img/remera.png");
const producto3 = new Producto(3,"Zapatillas", 3000, "img/zapatillas.png");
const producto4 = new Producto(4,"Camisa", 900, "img/camisa.png");
const producto5 = new Producto(5,"Buso", 500, "img/buso.png");
const producto6 = new Producto(6,"Short", 800, "img/short.png");
const producto7 = new Producto(7,"Tacones", 800, "img/tacones.png");
const producto8 = new Producto(8,"Vestido", 800, "img/vestido.png");
const producto9 = new Producto(9,"Zapatos", 800, "img/zapatos.png");

let productos = [];


localStorage.getItem("stock") ? productos = JSON.parse(localStorage.getItem("stock")) : (productos.push(producto1,producto2,producto3,producto4,producto5,producto6,producto7,producto8,producto9),localStorage.setItem("stock", JSON.stringify(productos)))
