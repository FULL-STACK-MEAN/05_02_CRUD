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

// $eq

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

