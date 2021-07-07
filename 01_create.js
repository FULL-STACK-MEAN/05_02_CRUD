// Métodos de creación de documentos en MongoDB

// Método insert()
// https://docs.mongodb.com/manual/reference/method/db.collection.insert/#mongodb-method-db.collection.insert

// Sintaxis

// db.<collection>.insert(
//    <documento ó array de documentos>,
//    {
//        writeConcern: <valores>, // relativa a los replica set
//        ordered: <true o false>
//    }
//)

// documento son objetos JSON que se guardan internamente en formato BSON en MongoDB. El motivo de
// usar BSON es que permite crear tipos de datos que no existen en JSON.
// Como la shell de mongo interpreta JS, si utilizamos literales de objeto JS en los métodos de
// Mongo, la shell los parsea a JSON.

// Insertar un documento en una coleccion sin _id

use clinica

db.inventario.insert({articulo: 'Zuecos', cantidad: 100}) // No introducimos ni _id, ni objeto de opciones

// Devuelve objeto con el resultado WriteResult({ "nInserted" : 1 })

db.inventario.find() // Devuelve un JSON
{ "_id" : ObjectId("60e4993032fa3995fe9cc68b"), "articulo" : "Zuecos", "cantidad" : 100 }

// Asigna automáticamente un ObjectId porque el índice principal único y por defecto de todas las
// colecciones se crea por Mongo para el campo _id

// Insertar un documento en una coleccion con _id
// El valor debe ser único
// El valor de _id será inmutable
// Puede utilizar cualquier tipo de dato, incluso documento, excepto array

db.inventario.insert({articulo: 'Gasas', cantidad: 100, _id: 45}) // El orden de los campos da igual
WriteResult({ "nInserted" : 1 })
db.inventario.insert({articulo: 'Mascarillas', cantidad: 1000, _id: 45})
WriteResult({
    "nInserted" : 0,
    "writeError" : {
            "code" : 11000,
            "errmsg" : "E11000 duplicate key error collection: clinica.inventario index: _id_ dup key: { _id: 45.0 }"
    }
}) // Devuelve objeto de error porque el _id será siempre único

db.inventario.insert({articulo: 'Mascarillas', cantidad: 1000, _id: {old: 1234, new: 'A2376'}})
WriteResult({ "nInserted" : 1 }) 

db.inventario.insert({articulo: 'Mascarillas', tallas: ['s','l'], cantidad: 1000, _id: [3245, 'A8765']})
WriteResult({
    "nInserted" : 0,
    "writeError" : {
            "code" : 2,
            "errmsg" : "can't use an array for _id"
    }
}) // Devuelve objeto de error porque el _id no puede ser un array

// Inserción de múltiples documentos pasando al método insert un array de documentos

db.inventario.insert([  // La inserción es atómica a nivel de documento
    {articulo: 'Bisturí 12', cantidad: 30},
    {articulo: 'Bisturí 14', cantidad: 20},
    {articulo: 'Bisturí 16', cantidad: 12},
])
BulkWriteResult({
    "writeErrors" : [ ],
    "writeConcernErrors" : [ ],
    "nInserted" : 3,
    "nUpserted" : 0,
    "nMatched" : 0,
    "nModified" : 0,
    "nRemoved" : 0,
    "upserted" : [ ]
})

// Inserción de múltiples documentos con ordered true (opción por defecto)

db.empleados.insert([
    {_id: 10, nombre: 'Carlos', apellidos: 'López'},
    {_id: 11, nombre: 'Sara', apellidos: 'López'},
    {_id: 11, nombre: 'Juan', apellidos: 'López'}, // Con ordered true, a partir del error ya no se
    {_id: 13, nombre: 'Pilar', apellidos: 'López'}, // ejecutan mas inserciones
    {_id: 14, nombre: 'Alberto', apellidos: 'López'}
])

BulkWriteResult({
    "writeErrors" : [
            {
                    "index" : 2,
                    "code" : 11000,
                    "errmsg" : "E11000 duplicate key error collection: clinica.empleados index: _id_ dup key: { _id: 11.0 }",
                    "op" : {
                            "_id" : 11,
                            "nombre" : "Juan",
                            "apellidos" : "L├│pez"
                    }
            }
    ],
    "writeConcernErrors" : [ ],
    "nInserted" : 2,
    "nUpserted" : 0,
    "nMatched" : 0,
    "nModified" : 0,
    "nRemoved" : 0,
    "upserted" : [ ]
})


// Inserción de múltiples documentos con ordered true (opción por defecto)

db.empleados.insert([
    {_id: 20, nombre: 'Carlos', apellidos: 'López'},
    {_id: 21, nombre: 'Sara', apellidos: 'López'},
    {_id: 21, nombre: 'Juan', apellidos: 'López'}, // La inserción con error no se ejecuta
    {_id: 23, nombre: 'Pilar', apellidos: 'López'}, // pero el resto si no tiene error se
    {_id: 24, nombre: 'Alberto', apellidos: 'López'} // continua ejecutando
], {ordered: false})

BulkWriteResult({
    "writeErrors" : [
            {
                    "index" : 2,
                    "code" : 11000,
                    "errmsg" : "E11000 duplicate key error collection: clinica.empleados index: _id_ dup key: { _id: 21.0 }",
                    "op" : {
                            "_id" : 21,
                            "nombre" : "Juan",
                            "apellidos" : "L├│pez"
                    }
            }
    ],
    "writeConcernErrors" : [ ],
    "nInserted" : 4,
    "nUpserted" : 0,
    "nMatched" : 0,
    "nModified" : 0,
    "nRemoved" : 0,
    "upserted" : [ ]
})

// Los campos en mongodb pueden tener documentos como tipo de dato (documento embebido)
// pueden tener hasta 100 niveles de anidado

db.empleados.insert({
    nombre: 'Carlos',
    apellidos: 'Pérez',
    direcciones: [
        {
            calle: 'Principe de Vergara, 100', 
            ciudad: {
                cp: '28001',
                nombre: 'Madrid'
            }
        },
        {
            calle: 'Av Constitución, 20', 
            ciudad: {
                cp: '28300',
                nombre: 'Mostoles'
            }
        }
    ]
})

WriteResult({ "nInserted" : 1 })

// Método insertOne()
// https://docs.mongodb.com/manual/reference/method/db.collection.insertOne/

// Sintaxis

// db.<collection>.insertOne(
//    <documento>,
//    {
//        writeConcern: <valores>, // relativa a los replica set
//    }
//)

// Método insertMany()
// https://docs.mongodb.com/manual/reference/method/db.collection.insertMany/

// Sintaxis
// db.<collection>.insertMany(
//    <array de documentos>,
//    {
//        writeConcern: <valores>, // relativa a los replica set
//        ordered: <true o false>
//    }
//)

// En ambos casos idem a insert() con la pequeña diferencia que insertOne() e insertMany() no
// sopoeran el método explain para la comprobación de índices

// Método save (Operaciones de inserción o actualización si ya existe el _id)
// https://docs.mongodb.com/manual/reference/method/db.collection.save/

// Sintaxis

// db.<collection>.save(
//    <documento>,
//    {
//        writeConcern: <valores>, // relativa a los replica set
//    }
// )

db.empleados.save({_id: 200, nombre: 'Juan', apellidos: 'Pérez'})
WriteResult({ "nMatched" : 0, "nUpserted" : 1, "nModified" : 0, "_id" : 200 })
db.empleados.save({_id: 201, nombre: 'Sara', apellidos: 'López'})

db.empleados.save({_id: 200, nombre: 'Juan', apellidos: 'Pérez Gómez'}) // Actualización
// debido a que el valor de _id ya existe en la colección
WriteResult({ "nMatched" : 1, "nUpserted" : 0, "nModified" : 1 })

// Métodos adicionales para insertar (con la opción upsert)

// db.<collection>.update()
// db.<collection>.updateOne()
// db.<collection>.updateMany()
// db.<collection>.findAndModify()
// db.<collection>.findOneAndUpdate()
// db.<collection>.findOneAndReplace()

// db.<collection>.bulkWrite()