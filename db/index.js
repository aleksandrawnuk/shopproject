var dotenv = require('dotenv').config();
const mysql = require('mysql');

if (dotenv.error) {
    throw dotenv.error
}

const pool = mysql.createPool({
    connectionLimit: 10,
    password: process.env.DB_PASSWORD,
    user: process.env.DB_USER,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    multipleStatements: true
});

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

shopdb.addProduct = (prod) => {
    return new Promise((resolve, reject) => {
        let sql = `CALL addOrUpdateProduct(${prod.prodID}, "${prod.prodName}", "${prod.prodDesc}", ${prod.prodPrice}, ${prod.prodWeight}, ${prod.catID});`
        pool.query(sql, [prod.prodID, prod.prodName, prod.prodDesc, prod.prodPrice, prod.prodWeight, prod.catID], (err, results) => {
            if(err) {
                return reject(err);
            }
            return resolve(results);
        });
    });
};

shopdb.updateProduct = (id, prod) => {
    return new Promise((resolve, reject) => {
        let sql = `CALL addOrUpdateProduct(${id}, "${prod.prodName}", "${prod.prodDesc}", ${prod.prodPrice}, ${prod.prodWeight}, ${prod.catID});`
        pool.query(sql, [id, prod.prodName, prod.prodDesc, prod.prodPrice, prod.prodWeight, prod.catID], (err, results) => {
            if(err) {
                return reject(err);
            }
            return resolve(results);
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