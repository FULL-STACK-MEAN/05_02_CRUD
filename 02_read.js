// Métodos de lectura de documentos en MongoDB

// Método find()
// https://docs.mongodb.com/manual/reference/method/db.collection.find/#mongodb-method-db.collection.find

// Sintaxis
// db.<collection>.find(
//      <documento-de-consulta>,
//      <documento-de-proyeccion>   Opcional 
// )

// Consulta de todos los documentos de una colección 

db.empleados.find() // Todos los documentos en un cursor iterable cada 20 docs
db.empleados.find({}) // Este se usa cuando vayamos a usar proyecciones

// Set de datos en base de datos gimnasio

use gimnasio

db.clientes.insert([
    {nombre: 'Pilar', apellidos: 'Pérez', edad: 33, dni: '07456322S'},
    {nombre: 'José', apellidos: 'Gómez', edad: 17, dni: '887654321S'},
    {nombre: 'José', apellidos: 'López', edad: 22, dni: '44321567S'},
])

// Consulta de condición de igualdad simple
// {<campo>:<valor>}

db.clientes.find({nombre: "José"}) // Todos los documentos con ese valor en ese campo
db.clientes.find({nombre: "Jose"}) // No devolverá ninguno porque la condición para string es exacta

// En el caso de _id el valor se debe instanciar como ObjectId

db.clientes.find({_id: '60e5bb291d0369289d67516c'}) // No encontrará el registro
db.clientes.find({_id:  ObjectId("60e5bb291d0369289d67516c")}) // Si devolverá el registro

// Hay algunos drivers de MongoDB que lo hacen por nosotros (por ejemplo Mongoose)

// Consulta de condición de igualdad múltiple
// {<campo>:<valor>, <campo>:<valor>, ...} 
// La coma funciona como un operador de condición AND lógica

db.clientes.find({nombre: "José", apellidos: "Gómez"})
db.clientes.find({apellidos: "Gómez", nombre: "José"})

// Uso de operadores en consultas
// Sintaxis básica de operadores ($)
// { <campo>: {<$operador>: <valor>, ...}}

db.clientes.find({edad: {$gte: 18}})

db.clientes.find({nombre: "José", edad: {$gte: 18}})

db.clientes.find({edad: {$gte: 18, $lte: 30}})

// En consultas múltiples se puede repetir el campo, pero puede ocasionar resultados inesperados

db.clientes.find({edad:{$gte: 18}, edad: {$lte: 30}})

// Consulta de condiciones múltiples con operador lógico $and
// {$and: [ {consulta}, {consulta}, ...]}

db.clientes.find({
    $and: [
        {edad: {$gte: 18}},
        {apellidos: "López"}
    ]
})

// Consulta de condiciones múltiples con operador lógico $or
// {$or: [ {consulta}, {consulta}, ...]}

db.clientes.find({
    $or: [
        {edad: {$gte: 18}},  
        {apellidos: "Gómez"}
    ]
}) // Devuelve los que cumplan o edad mayor o igual a 18 ó apellidos igual a López

// Es posible combinar AND y OR

db.clientes.find({
    apellidos: "Gómez",
    $or: [
        {edad: {$gte: 18}},
        {nombre: "José"}
    ]
})
