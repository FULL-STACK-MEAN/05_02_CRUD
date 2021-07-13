// Operaciones de escritura en lote
// Método bulkWrite()
// Sintaxis

// db.<coleccion>.bulkWrite(
//      [<operacion1>, <operacion2>, ...],
//      {
//         ordered: true | false, mismo criterio que para insert  
//         writeConcern: <valor> para replSet
//      }
// )

// Las operaciones se describen en https://docs.mongodb.com/manual/core/bulk-write-operations/

use biblioteca

db.libros.bulkWrite(
    [
        {
            insertOne: {
                document: {titulo: 'El Señor de los Anillos', autor: 'J.R.R. Tolkien'}
            }
        },
        {
            updateOne: {
                filter: {titulo: 'La Historia Interminable'},
                update: {$set: {precio: 22}}
            }
        },
        {
            deleteOne: {
                filter: {autor: "William Shakespeare"}
            }
        }
    ]
)

{
    "acknowledged" : true,
    "deletedCount" : 1,
    "insertedCount" : 1,
    "matchedCount" : 1,
    "upsertedCount" : 0,
    "insertedIds" : {
            "0" : ObjectId("60eda52ce52e6eed520450df")
    },
    "upsertedIds" : {

    }
}

// Importante no es transacción