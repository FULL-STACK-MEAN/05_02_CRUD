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

// $currentDate
// {$currentDate: {<campo>: true}}

db.libros.update(
    {title: 'El Quijote'},
    {$set: {stock: 10}, $currentDate: {actualizadoEl: true}}
)

// $inc
// {$inc: {<campo>: <entero>, ...}}

db.libros.update(
    {title: 'El Quijote'},
    {$inc: {stock: 5}}
)

// $min Solo actualiza si el valor a actualizar es menor que el actual


db.libros.update(
    {title: 'El Quijote'},
    {$min: {stock: 20}} // si el valor actual del doc es menor o igual al que se le pasa no hace nada
)


db.libros.update(
    {title: 'El Quijote'},
    {$min: {stock: 10}} // si el valor actual es mayor de 10 si que actualiza
)
WriteResult({ "nMatched" : 1, "nUpserted" : 0, "nModified" : 1 })

// idem $max solo actualiza si el valor a actualizar es mayor que el actual

db.libros.update(
    {title: 'El Quijote'},
    {$max: {stock: 50}} // si el valor actual es menor de 50 si que actualiza
)

// $mul
// {$mul: {<campo>:<entero>, ...}} multiplica el valor del campo por esa cantidad

// $rename renombra los campos
// {$rename: {<campo>:<nuevo-nombre>, ...}}
// Si como nuevo nombre usamos un campo que ya existe borraría ese campo


db.libros.update(
    {title: 'El Quijote'},
    {$rename: {title: 'titulo'}}
)

// Opción multi en operaciones con update()
// {multi: true}

db.libros.update(
    {},
    {$set: {editorial: 'pendiente'}},
    {multi: true} // actualiza todos los elementos encontrados por la consulta
)
WriteResult({ "nMatched" : 6, "nUpserted" : 0, "nModified" : 5 })

// otro ejemplo con rename

db.libros.update(
    {},
    {$rename: {title: 'titulo'}},
    {multi: true}
)

// Operadores de actualización en arrays

// $ (operador posicional) para actualización
// {"<array>.$": valor}

db.libros.insert(
    {titulo: 'Mas Ruido que Nueces', categorias: ["inglés","medieval","novela"]}
)

db.libros.update(
    {categorias: 'novela'},
    {$set: {"categorias.$": "clásicos"}},
    {multi: true}
)

// Solo actualiza la primera coincidencia

db.libros.insert([
    {titulo: "Otelo", autor: "William Shakespeare", valoraciones: ["bien","regular","bien","mal","muy bien"]},
    {titulo: "Momo", autor: "Michael Ende", valoraciones: ["muy bien","regular","bien","bien","muy bien"]},
])

db.libros.update(
    {valoraciones: 'bien'},
    {$set: {"valoraciones.$": 'correcto'}}, // Si quisieramos cambiarlo en todo no vale esta operación
    {multi: true}
)

// Alternativa $[] // Cambia todos los valores

db.libros.insert(
    {titulo: "The Firm", autor: 'John Grisham', opiniones: [3,2,8,9,10,4]}
)

db.libros.update(
    {opiniones: 10}, // Realmente la consulta no influye en la actualización
    {$set: {"opiniones.$[]": 5}},
    {multi: true}
)

// Alternativa $[<identificador>]
// {arraFilters: [{<identificador>: <condicion>}]}

db.libros.insert(
    {titulo: "Crimen Imperfectio", autor: 'John Grisham', precios: [22, 21, 13, 18, 21, 14]}
)

db.libros.update(
    {titulo: "Crimen Imperfectio"},
    {$set: {"precios.$[elem]": 15}},
    {arrayFilters: [{"elem": {$lt: 15}}], multi: true}
)


db.libros.update(
    {titulo: "Crimen Imperfectio"},
    {$set: {"precios.$[elem]": 20}},
    {arrayFilters: [{"elem": 21}], multi: true} // Se puede hacer con una expresión de igualdad
)

// Posible pregunta

{
    "_id" : ObjectId("60ec6d9f02d29ea11c1a84bf"),
    "titulo" : "Crimen Imperfectio",
    "autor" : "John Grisham",
    "precios" : [
            22,
            20,
            15,
            18,
            20,
            15
    ]
}

db.libros.update(
    {precios: 20},
    {$set: {"precios.$[]": 18}},
    {multi: true}
)

// Respuestas

// a) "titulo" : "Crimen Imperfectio", "autor" : "John Grisham", "precios" : [22,20,15,18,20,15]
// b) "titulo" : "Crimen Imperfectio", "autor" : "John Grisham", "precios" : [22,18,15,18,18,15]
// c) "titulo" : "Crimen Imperfectio", "autor" : "John Grisham", "precios" : [18,18,18,18,18,18] Ok
// d) "titulo" : "Crimen Imperfectio", "autor" : "John Grisham", "precios" : [22,20,15,20,20,15]

// $addToSet Añade un valor a un campo array salvo que ya exista (en ese caso no hace nada)
// {$addToSet: {<array>: valor}}

db.libros.update(
    {categorias: {$exists: true}},
    {$addToSet: {categorias: "best-seller"}},
    {multi: true}
)

// $pop elimina el primer (-1) o último (1) de un array
// {$pop: {<array>: -1 | 1 }} 

db.libros.update(
    {titulo: "The Firm"},
    {$pop: {opiniones: -1}}
)

// $pull eliminar los elementos que cumplan una condición
// {$pull: {<array>: <valor> | <condicion> }}

db.libros.update(
    {titulo: "The Firm"},
    {$set: {categorias: ["USA", "castellano", "drama", "clásico", "suspense"]}}
)

db.libros.update(
    {titulo: "The Firm"},
    {$pull: {categorias: "drama"}} // Eliminar el elemento que tenga ese valor en el array
)


db.libros.update(
    {titulo: "The Firm"},
    {$pull: {categorias: {$in: ["USA","clásico"]}}} // Eliminar los elementos contenidos en la expresion
)

// $push Añade elementos al final del array
// {$push: {<array>: <expresion}} // valor o varios ($each: <array de valores>)

db.libros.insert({titulo: "El Caso Fitgerald", autor: "John Grisham", categorias: ["novela","drama"]})

db.libros.update(
    {titulo: "El Caso Fitgerald"},
    {$push: {categorias: {$each: ['USA','abogados']}}}
)

// $push con $position para añadir desde una determinada posición


db.libros.update(
    {titulo: "El Caso Fitgerald"},
    {$push: {categorias: {$each: ['best-seller','2017'], $position: 1}}} // Desde la posición 1 y desplaza el resto a la derecha
)

// Métodos adicionales para actualizar

// updateOne() idem para un solo documento
// updateMany() idem para muchos documentos (igual que un update() con multi: true)
