// Resumen de operadores de lectura por tipos

// Operadores de comparación

// $gte $gt $lte $lt

// Type bracketing (cuando usa en una consulta operadores de comparación, solo devuelve los
// valores que cumplan el criterio de la consulta y tengan el mismo tipo de dato)

db.foo.insert([
    {a: 'a'},
    {a: 'A'},
    {a: 'C'},
    {a: 2},
    {a: 1},
    {a: -1},
    {a: 11},
    {a: '2'},
    {a: '1'},
    {a: '-1'},
    {a: '11'},
    {a: '*'}
])

// si usamos operadores de comparación solo tiene en cuenta los que tienen el mismo tipo del
// valor usado en la expresión de la consulta

db.foo.find({a: {$gte: 2}}) // Para la consulta solo tiene en cuanta los de tipo numérico

db.foo.find({a: {$gte: 'A'}})  // De nuevo solo tiene en cuenta los de tipo string y usa ordenación lexicográfica (ASCII)

// $eq idem al operador de asignacion JavaScript (:)

db.clientes.findOne({dni: {$eq: '887654321S'}}) // Se usa en AGGREGATION

// $in proporciona un array de valores y funciona como un OR inclusivo
// $in: [<valor>, <valor>, ...]

db.clientes3.find({nombre: {$in: ["Juan","Sara","John"]}})

// Funciona también en arrays

db.clientes3.find({clases: {$in: ["esgrima","pesas"]}})

// Se pueden pasar en las consultas expresiones regulares

db.clientes3.find({nombre: /^S/})

// Precisamente en $in se usan expresiones regulares (si fuera necesario) porque este operador
// es incompatible con $regex

db.clientes3.find({clases: {$in: ["futbol", /^p/]}})

// $ne

db.clientes.find({apellidos: {$ne: "Pérez"}}) // Devuelve todos los documentos que en su
// campo apellidos no contengan el valor "Peŕez" o lo que no tengan el campo apellidos

// $ne con $exists

db.clientes.find({apellidos: {$ne: "Pérez", $exists: true}}) // Devuelve estrictamente todos los documentos que en su
// campo apellidos no contengan el valor "Peŕez" 

// Operadores lógicos

// $and y $or vistos anteriormente

// $not Devuelve los docs que no cumplen la expresión que se le pasa al campo o bien
// no contienen el campo

db.clientes.find({edad: {$not: {$gte: 18}}}) // Esta devuelve los docs que no tengan el campo edad

// Equivalente sin $not

db.clientes.find({edad: {$lt: 18}}) // Esta no devuelve los docs que no tengan el campo edad

// $nor Recibe un array de expresiones seleccionando los documentos que no clumpen
// alguna de las expresiones
// $nor: [{expresion}, {expresion}, ...]

db.clientes.find({$nor: [
    {edad: {$lt: 18}},
    {nombre: "María"}   
]})

// Se puede utilizar para encontrar documentos que no contengan un conjunto un valores

db.clientes.find({$nor: [
    {nombre: "Pilar"},
    {nombre: "Jesus"}
]})

// Operadores de elementos

// $exists y $type (ver ejemplos anteriores)

// Operadores de Evaluación

// $regex

// Set datos

db.clientes6.insert([
    {nombre: 'Luis', apellidos: 'García Pérez'},
    {nombre: 'Pedro', apellidos: 'Gutiérrez López'},
    {nombre: 'Sara', apellidos: 'López Gómez'},
    {nombre: 'María', apellidos: 'Pérez Góngora'},
    {nombre: 'Juan', apellidos: 'Pérez \nGóngora'},
])

// Sintaxis
// {<campo>: {$regex: <expresión-regular>, $options: <opciones>}}

db.clientes6.find({apellidos: {$regex: /G/}}) // Expresión regular contenga una G Mayúscula

db.clientes6.find({apellidos: {$regex: 'G'}}) // Idem anterior pero la expresión regular se pasa como string

db.clientes6.find({apellidos: {$regex: '^G'}}) // Todos los doc que el valor de apellidos comience por G

db.clientes6.find({apellidos: {$regex: 'ez$'}})  // Todos los doc que el valor de apellidos finaliza en ez

db.clientes6.find({apellidos: {$regex: 'Gón'}})  // Todos los doc que el valor de apellidos contenga el fragmento Gón

db.clientes6.find({apellidos: {$regex: '^gu', $options: 'i'}}) // Opción para case insensitive

db.clientes6.find({apellidos: {$regex: /^gu/i}})  // Idem en expresión regular

db.clientes6.find({apellidos: {$regex: '^G', $options: 'm'}})  // Reconoce los saltos de línea

db.clientes6.find({apellidos: {$regex: 'Gó m', $options: 'x'}}) // Omite los espacios en blanco

db.clientes6.find({apellidos: {$regex: 'gó m', $options: 'ix'}}) // se pueden combinar las opciones 

// $comment

// db.<coleccion>.find({<expresión consulta>, $comment: <comentarios>)

db.clientes6.find({apellidos: {$regex: 'gó m', $options: 'ix'}, $comment: 'Devuelve los que contengan gom sin distinguir mayúsculas'})