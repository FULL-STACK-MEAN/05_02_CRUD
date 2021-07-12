// Métodos de eliminación de documentos en MongoDB

// Método remove()

// db.<coleccion>.remove(
//    {documento-consulta}, // con los documentos que borrará
//    justOne: true | false // borrar solamente la primera coincidencia si está marcado como true
//)

db.libros.remove({autor: /^John/}) // Borra todos los que comiencen por John en el campo autor
WriteResult({ "nRemoved" : 3 })

db.libros.remove({}) // Borra todos los documentos pero mantiene la colección

// Métodos adicionales

// deleteOne() idem a remove() cuando este tiene la opción justOne true
// deleteMany() idem a remove()

// Anexo 
// Hay otros métodos de borrado pero no son de colección si no de administración

// Eliminar la colección y todos sus documentos

// db.<coleccion>.drop()

// Eliminar la base de datos y todas sus colecciones y documentos

// db.dropDatabase()