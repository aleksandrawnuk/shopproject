const mysql = require('mysql');

const pool = mysql.createPool({
    connectionLimit: 10,
    password: '',
    user: 'root',
    database: 'shopdb',
    host: 'localhost',
    port: '3306'
})

let shopdb = {};

shopdb.all = () => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM status', (err, results) => {
            if(err) {
                return reject(err);
            }
            return resolve(results);
        });
    });
};

module.exports = shopdb;