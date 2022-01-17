//const mysql = require('mysql');
import mysql from 'mysql';

const mysqlConnection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'password',
    port: '3306',
    database: 'node_db',
    multipleStatements: true
});


mysqlConnection.connect((err) => {
    if(err){
        console.log('Error connecting to Db');
        console.log(`${err}`);
        return;
    }
    console.log('Connection established');
});

/*mysqlConnection.end((err) => {
    // The connection is terminated gracefully
    // Ensures all remaining queries are executed
    // Then sends a quit packet to the MySQL server.
});*/

export default  mysqlConnection;