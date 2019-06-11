const listaOfrecida = document.getElementById('desplegable-productos');
const listaStock = document.getElementById('listado-productos');
const barraMensajes = document.getElementById('mensajero');
barraMensajes.style.display = 'none';

class Producto {
    constructor(nombre, descripcion, precio, stock) {
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.precio = precio;
        this.stock = stock;
    }

    verificarStockProducto(cant) {
        if (cant >= this.stock) {
            console.log ('pasooooooooooooooooo');
            barraMensajes.firstElementChild.remove();
            let mensaje = document.createElement('div');
            mensaje.innerHTML = `<div class="alert alert-danger">Stock insuficiente para realizar la venta.  solo hay `+  this.stock +` unidades disponibles</div>`;
            barraMensajes.appendChild(mensaje);
            barraMensajes.style.display = 'block';
            $('#mensajero').delay(3000).fadeOut(1000);          
        }
        return(cant<= this.stock);
    }

    venderProducto(cant) {
        this.cant = cant;
        this.stock = this.stock - this.cant;
        barraMensajes.firstElementChild.remove();
        let mensaje = document.createElement('div');
        mensaje.innerHTML = `<div class="alert alert-success">se vendieron `+ this.cant +` unidades de ` + this.nombre + ` unidades actualmente disponbibles: ` + this.stock +`</div>`;
        barraMensajes.appendChild(mensaje);
        barraMensajes.style.display = 'block';
        $('#mensajero').delay(3000).fadeOut(1000); 
    }
}

let Caja = {
    saldo: 0,

    actualizarSaldoCaja: function (montoNovedad) {
        this.saldo += montoNovedad;
    },

    actualizarSaldoCajaEnPantalla: function () {
        document.getElementById("saldo-caja").innerHTML = "SALDO: $" + this.saldo;
    }
}

function mostrarStockProductos(producto){ // funcion de UI
    //const listaStock = document.getElementById('listado-productos');
    const itemStock = document.createElement('div');
    itemStock.innerHTML = `
        <strong>Producto</strong>: ${producto.nombre} -
        <strong>Precio</strong>: $ ${producto.precio} -
        <strong>Stock</strong>: ${producto.stock} - 
        <strong>Desc.</strong>: ${producto.descripcion} <hr>
    `; 
    listaStock.appendChild(itemStock);
}

function generarListaDesplegableProductos(listaAOfrecer){ // funcion de UI
    //const listaOfrecida = document.getElementById('desplegable-productos');
    const opcionDeshabilitada = document.createElement("option"); 
    opcionDeshabilitada.innerHTML = `<option value="" disabled="" selected="">Selec Producto</option>`;
    listaOfrecida.appendChild(opcionDeshabilitada);

    for (let i=0; i < listaAOfrecer.length; i++) {
        let opcion = document.createElement ("option");
        opcion.value = i;
        opcion.text = listaAOfrecer[i].nombre + ' - $ ' + listaAOfrecer[i].precio + ' (cx: ' + listaAOfrecer[i].stock + ')';
        if ((listaAOfrecer[i].stock) > 0) { // chequeo y agrego al desplegable solo si hay stock
            listaOfrecida.appendChild(opcion);
        }
    };
}

function registrarVenta(producto, cantidad, formaPago){
    let precioProducto = productosDelLocal[producto].precio;
    let importeVenta = precioProducto * cantidad;
    let montoCuota;
    
    switch (formaPago) {
        case 'efectivo':
          console.log('Seleccionó pago en efectivo');
          montoCuota = importeVenta;
          break;
        case 'tarjeta3':
          console.log('Seleccionó pago con tarjeta en 3 cuotas');
          montoCuota = aDosDecimales(importeVenta / 3);
          break;
        case 'tarjeta':
          console.log('Seleccionó pago con tarjeta en 6 cuotas');
          montoCuota = aDosDecimales(importeVenta / 6);
          break;
    }
    
    console.log ('valor de cuota: '+ montoCuota);
    productosDelLocal[producto].venderProducto(cantidad);
    Caja.actualizarSaldoCaja(importeVenta);
    Caja.actualizarSaldoCajaEnPantalla();
    refrescarListaStockDeProductos();
    refrescarListaDesplegableProductos();

    barraMensajes.style.display = 'block';
    $('#mensajero').delay(3000).fadeOut(1000);
}

function refrescarListaStockDeProductos(){ // funcion de UI //
    let listadoStock = document.getElementById('listado-productos');
    while(listadoStock.firstChild) {
        listadoStock.removeChild(listadoStock.firstChild);
    }
    productosDelLocal.forEach(function(eseProducto) {
        mostrarStockProductos(eseProducto); 
    });
}

function refrescarListaDesplegableProductos(){ // funcion de UI
    let listadoStock = document.getElementById('desplegable-productos');
    while(listadoStock.firstChild) {
        listadoStock.removeChild(listadoStock.firstChild);
    }
    generarListaDesplegableProductos(productosDelLocal); 
}

function aDosDecimales(num){
    //var numero = 1.77777777;
    var numero = num;
    numero = Number(numero.toFixed(2));
    return (numero);
    //console.log(numero);
}

let productosDelLocal = [
    new Producto('arroz','descripcion arroz', 200, 5),
    new Producto('Fanta','descripcion fanta', 90, 5),
    new Producto('jabon','descripcion jabon', 75, 5),
    new Producto('vino','descripcion vino', 150, 5),
    new Producto('agua mineral','descripcion agua mineral', 110, 5)
  ];

productosDelLocal.forEach(function(eseProducto) {
    mostrarStockProductos(eseProducto); 
  });

generarListaDesplegableProductos(productosDelLocal); 

let miVenta = document.getElementById('laVenta');
miVenta.addEventListener('submit', function (e) {
    e.preventDefault();
    let producto = document.getElementById('desplegable-productos').value;
    let cantProducto = document.getElementById('cantidad-productos').value;
    let formaPago = document.getElementById("laVenta").elements["formapago"].value;
   
   
    //let formu = document.getElementById("laVenta");
    //alert(formu.elements["formapago"].value);
    //alert(document.getElementById("laVenta").elements["formapago"].value);

    if (productosDelLocal[producto].verificarStockProducto(cantProducto)) {
         registrarVenta(producto, cantProducto, formaPago);
    }
});

/*
FALTA: 
:: Verificar que la cantidad elegida no sobrepase el stock de ese producto.
:: personalizar el mensaje de feedback emitido.
:: hacer un new de un nuevo objeto de clase Venta ante cada venta concretada y push en un array de venas historicas.
:: calcular valor de cuota si no es contado efectivo la forma de pago

*/