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

// Nuevo set de datos

db.clientes2.insert([
    {
        nombre: 'Celia',
        apellidos: 'Sánchez',
        domicilio: {
            calle: 'Gran Vía, 90',
            cp: '28003',
            localidad: 'Madrid'
        }
    },
    {
        nombre: 'Carlos',
        apellidos: 'Pérez',
        domicilio: {
            calle: 'Alcalá, 200',
            cp: '28010',
            localidad: 'Madrid'
        }
    },
    {
        nombre: 'Inés',
        apellidos: 'Pérez',
        domicilio: {
            calle: 'Burgos, 10',
            cp: '28900',
            localidad: 'Alcorcón'
        }
    },
])

// Consulta de igualdad exacta en campo con documento embebido

db.clientes2.find({domicilio: {calle: 'Burgos, 10', cp: '28900', localidad: 'Alcorcón'}}) // El
// valor del campo tiene que ser exactamente igual

db.clientes2.find({domicilio: {cp: '28900', calle: 'Burgos, 10', localidad: 'Alcorcón'}}) // No
// se pueden alterar el orden de los campos

// Consulta de igualdad en cambos de documentos embebidos
// Se emplea la notación del punto igual que en los objetos JavaScript

db.clientes2.find({"domicilio.localidad": "Madrid"})

db.clientes2.find({"domicilio.localidad": "Madrid", "domicilio.cp": "28010"})

// Set de datos

db.clientes3.insert([
    {nombre: 'Juan', apellidos: 'Pérez', clases: ['padel','esgrima','pesas']},
    {nombre: 'Sara', apellidos: 'Fernández', clases: ['padel','esgrima']},
    {nombre: 'Carlos', apellidos: 'Pérez', clases: ['esgrima','padel']},
])

// Consulta de igualdad exacta en campo con array

db.clientes3.find({clases: ['padel','esgrima']}) // Si pasamos un array a un campo de tipo array
// devolverá la igualdad exacta (puesto que considera que estamos evaluando ese valor)

// Consulta de un elemento en campo con array

db.clientes3.find({clases: 'esgrima'}) // Si pasamos un primario a un campo de tipo array devuelve
// todos los documentos que en alguno de los elementos del array tenga ese valor

// Consulta de múltiples elementos en campo con array
// Operador $all: [<elemento>, <elemento>, ...]

db.clientes3.find({clases: {$all: ['esgrima','padel']}}) // devolverá los documentos que
// en su campo de tipo array clases contengan al menos todos los elementos pasados al operador $all

// set de datos

db.clientes4.insert([
    {nombre: 'Carlos', apellidos: 'Pérez', puntuaciones: [100, 120, 44]},
    {nombre: 'Sara', apellidos: 'López', puntuaciones: [60, 90, 70]},
])

// Consulta simple con operadores de comparación en campo con array

db.clientes4.find({puntuaciones: {$lte: 50}}) // Todos los documentos que en alguno de sus
// elementos del array puntuaciones cumplan la expresión

// Consulta múltiple con operadores de comparación en campo con array

db.clientes4.find({puntuaciones: {$gte: 50, $lt: 75}}) // Todos los documentos que en alguno
// de sus elementos del array puntuaciones cumplan la expresión o una combinación de elementos
// cumplan la expresión

// La misma consulta con $elemMatch 
db.clientes4.find({puntuaciones: {$elemMatch: {$gte: 50, $lt: 75}}}) // Todos los documentos
// que alguno de sus elementos del array puntuaciones cumplan todas condiciones pasadas a
// $elemMatch

// Consulta de elementos en posiciones de campos con array (Utiliza la notación del punto)
// Sintaxis {"<campo-array>.<posicion>": <valor>}

db.clientes3.find({"clases.0": "padel"})

// set de datos

db.clientes5.insert([
    {
        nombre: "Juan",
        apellidos: "García",
        direcciones: [
            {calle: "Alcalá 40", cp: "28001", localidad: "Vigo"},
            {calle: "Zamora, 13", cp: "34005", localidad: "Madrid"}
        ]
    },
    {
        nombre: "Lucía",
        apellidos: "Gómez",
        direcciones: [
            {calle: "Alcalá 60", cp: "28001", localidad: "Madrid"},
            {calle: "Fuencarral, 13", cp: "28002", localidad: "Madrid"}
        ]
    }
])

// Consulta de igualdad exacta en campos de arrays de documentos

db.clientes5.find({direcciones: [
    {calle: "Alcalá 60", cp: "28001", localidad: "Madrid"},
    {calle: "Fuencarral, 13", cp: "28002", localidad: "Madrid"}
]}) // El valor exacto del array

// Consulta de igualdad en campos contenidos en subdocumentos de un array
// Notación del punto

db.clientes5.find({"direcciones.localidad": "Madrid"}) // Todos los documentos que en su
// campo direcciones en al menos uno de sus subdocumentos tenga ese valor en el campo localidad

// Consulta de igualdad en campos contenidos en subdocumentos en una posición
// concreta de un array

db.clientes5.find({"direcciones.0.localidad": "Madrid"}) // Todos los documentos que en su
// campo direcciones ek primer subdocumento tenga ese valor en el campo localidad

// set de datos

db.monitores.insert([
    {
        nombre: "Luis",
        apellidos: "López",
        actividades: [
            {clase: "aerobic", turno: "mañana", homologado: false},
            {clase: "aerobic", turno: "tarde", homologado: false},
            {clase: "zumba", turno: "mañana", homologado: true},
        ]
    },
    {
        nombre: "María",
        apellidos: "Pérez",
        actividades: [
            {clase: "aerobic", turno: "tarde", homologado: true},
            {clase: "zumba", turno: "tarde", homologado: false},
        ]
    },
    {
        nombre: "Carlos",
        apellidos: "Gónzalez",
        actividades: [
            {clase: "acquagym", turno: "tarde", homologado: true},
            {clase: "zumba", turno: "tarde", homologado: true},
        ]
    },
])

// Consulta de múltiples condiciones en arrays de documentos que los elementos
// pueden en combinación cumplir todas las condiciones

db.monitores.find({"actividades.clase":"aerobic", "actividades.homologado": true}) 

// Consulta de múltiples condiciones en arrays de documentos en los que al menos un solo elemento
// debe cumplir todas las condiciones

db.monitores.find({actividades: {$elemMatch: {clase: "aerobic", homologado: true}}})

// Proyección de documentos de salida
// db.<colección>.find(<doc-consulta>,<doc-proyeccion>)

// Se devuelven todos los campos de los documentos si no se pasa documento de proyección

// Devolución de los campos que se especifiquen y el campo _id
// a los campos se les pasa el valor 1 en ese documento de proyección

db.clientes.find({}, {nombre: 1}) // Devuelve todos los documentos de la colección
// con el campo nombre y el campo _id (ya que este se devuelve siempre por defecto)

db.clientes.find({edad: {$gte: 18}},{nombre: 1, apellidos: 1}) // Devolvera los documentos
// de la colección con valores de edad igual o mayor a 18 con los campos nombre y apellidos

// Proyecciones sin _id especificamos su valor como 0 en el doc de proyección

db.clientes.find({edad: {$gte: 18}},{nombre: 1, apellidos: 1, _id: 0}) // idem anterior sin _id

// Exclusión de los campos especificados en el doc de proyección
// se le pasa el valor 0 a esos campos

db.clientes.find({}, {nombre: 0, apellidos: 0}) // Devolver todos los documentos sin el campo nombre
// y sin el campo apellidos

// Combinación de inclusión y exclusión de campos en el doc de proyección: No se pueden
// incluir y excluir campos en el mismo doc salvo que se combinen con el campo _id

db.clientes.find({}, {nombre: 0, apellidos: 0, _id: 1}) // Aunque no haría falta porque _id
// se devuelve por defecto no genera error

db.clientes.find({}, {nombre: 1, apellidos: 1, _id: 0}) // Tampoco genera error

db.clientes.find({}, {nombre: 1, apellidos: 0}) // Error
Error: error: {
    "ok" : 0,
    "errmsg" : "Cannot do exclusion on field apellidos in inclusion projection",
    "code" : 31254,
    "codeName" : "Location31254"
}

// Proyección en documentos embebidos
// notación del punto para el acceso

db.clientes2.find({}, {nombre: 1, "domicilio.localidad": 1, _id: 0}) // Devuelve todos los
// documentos de la colección con el campo nombre y con el campo domicilio limitado a su campo localidad

// Proyección en arrays de documentos
// también notación del punto

db.clientes5.find({}, {nombre: 1, "direcciones.localidad": 1, _id: 0}) // Devuelve todos los
// documentos de la colección con el campo nombre y con los subdocumentos de direcciones limitados
// con el campo localidad



