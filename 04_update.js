// Métodos de actualización de documentos en MongoDB

// Método update
// https://docs.mongodb.com/manual/reference/method/db.collection.update/

// Sintaxis

// db.<colección>.update(
//    {<documento-consulta}, // Utiliza la misma sintaxis y operadores que en las operaciones de lectura
//    {<documento-actualización}, // Definen los cambios en los documentos
//    {<documento-opciones} // multi: boolean 
// )

// Set datos

use biblioteca

db.libros.insert([
    {title: 'Cien Años de Soledad', autor: 'Gabriel García Márquez', stock: 10},
    {title: 'La Ciudad y Los Perros', autor: 'Mario Vargas LLosa', stock: 10, prestados: 2},
    {title: 'El Otoño del Patriarca', autor: 'Gabriel García Márquez', stock: 10, prestados: 0},
])

// Actualización del documento completo (excepto el _id porque es inmutable)

db.libros.update(
    {title: 'Cien Años de Soledad'},
    {title: 'Cien Años de Soledad', autor: 'Gabriel García Márquez', stock: 12},
)
WriteResult({ "nMatched" : 1, "nUpserted" : 0, "nModified" : 1 })

// Si en actualización del documento completo lleva _id

db.libros.update(
    {title: 'Cien Años de Soledad'},
    {"_id" : ObjectId("60e89ae9eed0b9a654b3f1dc"), title: 'Cien Años de Soledad', autor: 'Gabriel García Márquez', stock: 12},
)
WriteResult({ "nMatched" : 1, "nUpserted" : 0, "nModified" : 0 }) // Sin problema si el _id no se modifica


db.libros.update(
    {title: 'Cien Años de Soledad'},
    {"_id" : 100, title: 'Cien Años de Soledad', autor: 'Gabriel García Márquez', stock: 12},
)

WriteResult({
    "nMatched" : 0,
    "nUpserted" : 0,
    "nModified" : 0,
    "writeError" : {
            "code" : 66,
            "errmsg" : "After applying the update, the (immutable) field '_id' was found to have been altered to _id: 100.0"
    }
}) 

db.libros.update(
    {_id: ObjectId("60e89ae9eed0b9a654b3f1dc")},
    {title: 'Cien Años de Soledad', autor: 'Gabriel García Márquez', stock: 14},
)
WriteResult({ "nMatched" : 1, "nUpserted" : 0, "nModified" : 1 })

// Opción upsert (update and insert) Crea un documento con los datos del documento de 
// actualización si no encuentra ninguna coincidencia con el documento de consulta

db.libros.update(
    {title: 'El Coronel no tiene quien le escriba'},
    {title: 'El Coronel no tiene quien le escriba', autor: 'Gabriel García Márquez', stock: 6},
    {upsert: true}
)
WriteResult({
    "nMatched" : 0,
    "nUpserted" : 1,
    "nModified" : 0,
    "_id" : ObjectId("60ec528a2fb014fb12937e90")
})
// Está operación es idempotente (una vez que se ejecuta la primera vez, las siguientes veces no realiza
// ninguna acción)

// Operaciones de actualización parcial del/los documentos (utilizando operadores)

// $set
// {$set: {<campo>: <valor>, <campo>:<valor>, ...}}

db.libros.update(
    {"_id" : ObjectId("60ec528a2fb014fb12937e90")},
    {$set: {stock: 20, prestados: 5}} // Si el documento no contiene el campo $set lo crea por defecto
)

// Sobre campos en subdocumentos

db.libros.insert({
    title: 'El Quijote',
    autor: {
        nombre: 'Miguel',
        apellidos: 'Cervantes Saavedra',
        pais: 'España'
    } 
})

db.libros.update(
    {title: 'El Quijote'},
    {$set: {"autor.apellidos": "De Cervantes Saavedra"}} // idem pero con notación del punto
)

// Sobre arrays

db.libros.update(
    {title: 'El Otoño del Patriarca'},
    {$set: {categorias: ['novela','españa','best-seller']}}
)

db.libros.update(
    {title: 'El Otoño del Patriarca'},
    {$set: {"categorias.1": "colombia"}}
)

// $setOnInsert Establece el valor de uno o varios campos solo si la operación
// resulta ser de inserción (en caso de actualización no hace nada)

db.libros.update(
    {title: 'La Historia Interminable'},
    {$set: {precio: 20}, $setOnInsert: {autor: 'Michael Ende'}},
    {upsert: true}
) // La primera vez se ejecuta porque no existe ningun documento con ese titulo por
// tanto la operación es de inserción

// Si ejecutamos de nuevo con otros valores de actualización, por ejemplo:

db.libros.update(
    {title: 'La Historia Interminable'},
    {$set: {precio: 18}, $setOnInsert: {autor: 'M. Ende'}},
    {upsert: true}
) // Solo se ejecutará la acción de $set u $setOnInsert no hará nada porque la
// operación es de actualización al existir un doc con ese titulo

// Posibles respuestas a la ejecución de las dos anteriores operaciones seguidas

// a) {_id: ..., title: 'La Historia Interminable', precio: 18, autor: 'M. Ende'}
// b) {_id: ..., title: 'La Historia Interminable', precio: 18, autor: 'Michael Ende'} ok
// c) {_id: ..., precio: 18, autor: 'Michael Ende'}
// d) {title: 'La Historia Interminable', precio: 18, autor: 'Michael Ende'}
// e) {_id: ..., title: 'La Historia Interminable', precio: 20, autor: 'Michael Ende'} 
// f) {_id: ..., title: 'La Historia Interminable', precio: 20, autor: 'M. Ende'} 

// $unset Eliminar uno o varios campos (y sus valores)
// {$unset: {<campo>: ''}} se le pasa string vacío

db.libros.update(
    {title: 'La Historia Interminable'},
    {$unset: {precio: ''}} // Se le pasa string vacio con independencia del tipo de dato que almacene
)