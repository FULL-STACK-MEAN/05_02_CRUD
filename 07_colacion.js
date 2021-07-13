// Colación en MongoDB
// Establece los criterios de clasificación de orden y selección en las consultas de
// campos de tipo string 

// En mongodb la colación se establece a tres niveles:

// - a nivel de colección
// - a nivel de índice
// - a nivel de consulta

// - a nivel de colección 
// ¿Cómo se define la colacción en las colecciones? En una opción => no podemos usar
// la creación implícita si no el método createCollection()

use tienda

db.createCollection("articulosConColaccion", {collation: {locale: "es"}})
db.createCollection("articulosSinColaccion")

db.articulosSinColaccion.insert([
    {_id: 1, nombre: 'cafe'},
    {_id: 2, nombre: 'café'},
    {_id: 3, nombre: 'cafE'},
    {_id: 4, nombre: 'cafÉ'},
])

db.articulosConColaccion.insert([
    {_id: 1, nombre: 'cafe'},
    {_id: 2, nombre: 'café'},
    {_id: 3, nombre: 'cafE'},
    {_id: 4, nombre: 'cafÉ'},
])

db.articulosConColaccion.find().sort({nombre: 1})
db.articulosSinColaccion.find().sort({nombre: 1}) // Cambia el orden en las búsquedas ordenadas

// - a nivel índice
// Lo veremos con los índices

// - a nivel de consulta se usa el método collation

db.articulosSinColaccion.find().sort({nombre: 1}).collation({locale: "es"})

// ¿Qué mas criterios además del lenguaje-pais se pueden establecer en la colacción?

// strength tres niveles de acuerdo a que las consultas distingan mayusculas/minúsculas y diacríticos
// strength 3 si distinque mayúsculas ni minúsculas ni diacríticos (valor por defecto)

db.articulosSinColaccion.find({nombre: "cafe"}).collation({locale: "es"}) // equivalente a strength 3
{ "_id" : 1, "nombre" : "cafe" }

// strength 2 no distingue mayúsculas de minúsculas
db.articulosSinColaccion.find({nombre: "cafe"}).collation({locale: "es", strength: 2})
{ "_id" : 1, "nombre" : "cafe" }
{ "_id" : 3, "nombre" : "cafE" }

// strength 1 no distingue mayúsculas de minúsculas ni diacríticos
db.articulosSinColaccion.find({nombre: "cafe"}).collation({locale: "es", strength: 1})
{ "_id" : 1, "nombre" : "cafe" }
{ "_id" : 2, "nombre" : "café" }
{ "_id" : 3, "nombre" : "cafE" }
{ "_id" : 4, "nombre" : "cafÉ" }

// caseLevel (boolean) que establece si distingue mayúsculas de minúsculas (usar con strength 1)
db.articulosSinColaccion.find({nombre: "cafe"}).collation({locale: "es", strength: 1, caseLevel: true})
{ "_id" : 1, "nombre" : "cafe" }
{ "_id" : 2, "nombre" : "café" }

// caseFirst "upper" | "lower", establece en búsquedas ordenadas la precedencia de mayúsculas sobre mínusculas o
// viceversa sobrescribiendo el criterio que imponga locale
db.articulosSinColaccion.find().collation({locale: "es", caseFirst: "upper"}).sort({nombre: 1})
{ "_id" : 3, "nombre" : "cafE" }
{ "_id" : 1, "nombre" : "cafe" }
{ "_id" : 4, "nombre" : "cafÉ" }
{ "_id" : 2, "nombre" : "café" }

// numericOrdering (boolean) para ordenar de manera numérica en campos string
// set de datos

db.articulosSinColaccion.insert([
    { "_id" : 10, "nombre" : "A1" },
    { "_id" : 11, "nombre" : "A11" },
    { "_id" : 12, "nombre" : "A2" },
    { "_id" : 13, "nombre" : "A21" },
    { "_id" : 14, "nombre" : "A3" }
])

// sin numericOrdering

db.articulosSinColaccion.find({_id: {$gte: 10}}).collation({locale: "es"}).sort({nombre: 1})
{ "_id" : 10, "nombre" : "A1" }
{ "_id" : 11, "nombre" : "A11" }
{ "_id" : 12, "nombre" : "A2" }
{ "_id" : 13, "nombre" : "A21" }
{ "_id" : 14, "nombre" : "A3" }

// con numericOrdering

db.articulosSinColaccion.find({_id: {$gte: 10}}).collation({locale: "es", numericOrdering: true}).sort({nombre: 1})
{ "_id" : 10, "nombre" : "A1" }
{ "_id" : 12, "nombre" : "A2" }
{ "_id" : 14, "nombre" : "A3" }
{ "_id" : 11, "nombre" : "A11" }
{ "_id" : 13, "nombre" : "A21" }