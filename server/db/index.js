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

shopdb.allProducts = () => {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT * FROM products`, (err, results) => {
            if(err) {
                return reject(err);
            }
            return resolve(results);
        });
    });
};

shopdb.oneProduct = (id) => {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT * FROM products where id = ?`, [id], (err, results) => {
            if(err) {
                return reject(err);
            }
            return resolve(results[0]);
        });
    });
};

shopdb.allCategories = () => {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT * FROM categories`, (err, results) => {
            if(err) {
                return reject(err);
            }
            return resolve(results);
        });
    });
};

shopdb.allOrders = () => {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT * FROM orders`, (err, results) => {
            if(err) {
                return reject(err);
            }
            return resolve(results);
        });
    });
};

shopdb.oneOrderByStatus = (status_id) => {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT * FROM orders where status_id = ?`, [status_id], (err, results) => {
            if(err) {
                return reject(err);
            }
            return resolve(results);
        });
    });
};

shopdb.allStatus = () => {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT * FROM status`, (err, results) => {
            if(err) {
                return reject(err);
            }
            return resolve(results);
        });
    });
};

module.exports = shopdb;