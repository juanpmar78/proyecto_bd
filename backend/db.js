const mysql = require("mysql2");

//configuracion de la conexion a mysql
const conexion = mysql.createConnection({
    host: "localhost", // servidor local
    user: "root",      //usuario mysql (por defecto XAMPP)
    database: "tienda" //Nombre de nuestra BD
});

//comprobar si la conexion fue exitosa

conexion.connect((error)=>{
    if(error){
        console.error("❌ error al conectar con MySQL:", error);
        return;
    }
    console.log("Conexion exitosa con MySQL");
});

//exportar la conexion para reutilizarla en las rutas del servidor
module.exports = conexion;