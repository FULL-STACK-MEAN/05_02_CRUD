// Operaciones o métodos de cursor

// Método count() Devuelve un entero con el número de documentos devuelto por la consulta
// db.<coleccion>.find(<consulta>).count()

use gimnasio

db.clientes.find({nombre: "Juan"}).count() 

// Método limit() limita el cursor al entero especificado
// db.<coleccion>.find(<consulta>).limit(<entero>)

db.clientes.find().limit(10) 

// Método skip() omite los primeros documentos especificados en el entero
// db.<coleccion>.find(<consulta>).skip(<entero>)

db.clientes.find().skip(2) 

// Método sort()
// db.<coleccion>.find(<consulta>).sort({<campo>: 1 ó -1, <campo>: 1 ó -1}) 1 ascendente -1 descendente

db.clientes.find().sort({apellidos: -1})

db.clientes.find().sort({apellidos: -1, nombre: 1})

// Método distinct Devuelve en un array los distintos valores de un campo
// db.<coleccion>.distinct(<campo>)

db.clientes.distinct("nombre")
