const mysql = require( 'mysql' );
var dbConfig = require('../../db.json')
class Database {
    constructor( ) {
        this.connection = mysql.createConnection( dbConfig );
    }
    query( sql, args ) {
        return new Promise( ( resolve, reject ) => {
            this.connection.query( sql, args, ( err, rows ) => {
                if ( err )
                    return reject( {code: err.code,message: err.sqlMessage, sqlState : err.sqlState, sql: err.sql} );
                resolve( JSON.parse(JSON.stringify(rows)) );
            } );
        } );
    }
    close() {
        return new Promise( ( resolve, reject ) => {
            this.connection.end( err => {
                if ( err )
                    return reject( err );
                resolve();
            } );
        } );
    }
}

module.exports = new Database()