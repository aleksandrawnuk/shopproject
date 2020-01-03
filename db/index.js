var constants = require('../constatnts.js');

var _ = require('lodash');

var dotenv = require('dotenv').config();
const mysql = require('mysql');
let Validator = require('validatorjs');

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
            if (err) {
                return reject(err);
            }
            return resolve(results);
        });
    });
};

shopdb.oneProduct = (id) => {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT * FROM products where id = ?`, [id], (err, results) => {
            if (err) {
                return reject(err);
            }
            if (results.length <= 0) {
                return reject({
                    Errors: {id: ['Product id does not exist']},
                    "Correct format": constants.correctProductJSON
                });
            }
            return resolve(results[0]);
        });
    });
};

shopdb.addProduct = async (prod) => {
    return new Promise((resolve, reject) => {
        let rules = {
            prodID: 'required',
            prodName: 'required',
            prodDesc: 'required',
            prodPrice: 'min:0.01',
            prodWeight: 'min:0.01',
            catID: 'required'
        };

        let validation = new Validator(prod, rules);

        if (validation.fails()) {
            validation.errors.add("Correct format", constants.correctProductJSON);
            throw (validation.errors)
        }

        let sqlCategoryID = `SELECT * FROM categories WHERE id = ${prod.catID};`
        pool.query(sqlCategoryID, [], (err, results) => {
            // console.log(results);
            if (results[0] == null) {
                return reject({
                    Errors: {catID: ['Category does not exist']},
                    "Correct format": constants.correctProductJSON
                });
            }
            if (err) {
                return reject(err);
            }

            let sql = `CALL addOrUpdateProduct(${prod.prodID}, "${prod.prodName}", "${prod.prodDesc}", ${prod.prodPrice}, ${prod.prodWeight}, ${prod.catID});`
            pool.query(sql, [prod.prodID, prod.prodName, prod.prodDesc, prod.prodPrice, prod.prodWeight, prod.catID], (err, results) => {
                if (err) {
                    return reject(err);
                }
                return resolve(results);
            });
        });
    });

}

shopdb.updateProduct = (id, prod) => {
    return new Promise((resolve, reject) => {
        let rules = {
            prodName: 'required',
            prodDesc: 'required',
            prodPrice: 'min:0.01',
            prodWeight: 'min:0.01',
            catID: 'required'
        };

        let validation = new Validator(prod, rules);

        if (validation.fails()) {
            validation.errors.add("Correct format", constants.correctProductJSON);
            throw (validation.errors)
        }

        let sqlCategoryID = `SELECT * FROM categories WHERE id = ${prod.catID};`
        pool.query(sqlCategoryID, [], (err, results) => {
            // console.log(results);
            if (results[0] == null) {
                return reject({
                    Errors: {catID: ['Category does not exist']},
                    "Correct format": constants.correctProductJSON
                });
            }
            if (err) {
                return reject(err);
            }

            let sql = `CALL addOrUpdateProduct(${id}, "${prod.prodName}", "${prod.prodDesc}", ${prod.prodPrice}, ${prod.prodWeight}, ${prod.catID});`
            pool.query(sql, [id, prod.prodName, prod.prodDesc, prod.prodPrice, prod.prodWeight, prod.catID], (err, results) => {
                if (err) {
                    return reject(err);
                }
                return resolve(results);
            });
        });
    });
};

shopdb.allCategories = () => {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT * FROM categories`, (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        });
    });
};

shopdb.allOrders = () => {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT * FROM orders`, (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        });
    });
};

shopdb.oneOrderByStatus = (status_id) => {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT * FROM orders where status_id = ?`, [status_id], (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        });
    });
};

shopdb.addOrder = (order) => {
    let rules = {
        orderID: 'required',
        username: 'required',
        email: 'required|email',
        phonenumber: 'required|numeric',
        orderlines: 'required',
        'orderlines.productID': 'required|array',
        'orderlines.quantity': 'required|array'
    };

    let validation = new Validator(order, rules);

    if (validation.fails()) {
        validation.errors.add("Correct format", constants.correctOrderJSON);
        throw (validation.errors)
    }
    return new Promise((resolve, reject) => {
        let sqlProductsID = `SELECT products.id FROM products`;
        pool.query(sqlProductsID, [], (err, results) => {
            let sql;
            let sqlLines = '';
            let sqlOrder = `CALL addOrUpdateOrder(${order.orderID}, '${order.confirmDate}', ${order.statusID}, '${order.username}', '${order.email}', '${order.phonenumber}', @nextOrderID); `;

            let prodIDsFromDB = [];
            results.forEach(function (item) {
                prodIDsFromDB.push(item.id)
            });

            order.orderlines.productID.forEach(function (item) {
                if (!_.includes(prodIDsFromDB, item)) {
                    return reject({
                        Errors: {productID: [`productID ${item} does not exist`]},
                        "Correct format": constants.correctOrderJSON
                    });
                }
            });

            for (let i = 0; i < order.orderlines.productID.length; i++) {
                if (!Number.isInteger(order.orderlines.quantity[i]) || order.orderlines.quantity[i] <= 0) {
                    return reject({
                        Errors: {quantity: ['Quantity must be integer grater than 0']},
                        "Correct format": constants.correctOrderJSON
                    });
                }
                console.log(validation.passes());
                let sqlOrderline = `CALL addOrderline(@nextOrderID, ${order.orderlines.productID[i]}, ${order.orderlines.quantity[i]}); `;
                sqlLines += sqlOrderline;
            }


            sql = sqlOrder + sqlLines;
            pool.query(sql, [order.orderID, order.confirmDate, order.statusID, order.username, order.email, order.phonenumber, order.orderlines.productID, order.orderlines.quantity], (err, results) => {
                if (err) {
                    return reject(err);
                }
                return resolve(results);
            });
        });
    });
};

shopdb.updateOrderStatus = (orderID, statusID) => {
    return new Promise((resolve, reject) => {
        let sqlOrderID = `SELECT * FROM orders WHERE id = ${orderID};`
        pool.query(sqlOrderID, [orderID], (err, results) => {
            if (results[0] == null) {
                //return reject(err);
                return resolve("No order to update");
            }
            if (err) {
                return reject(err);
            }
            let sqlStatus = `SELECT status_id FROM orders WHERE id = ${orderID};`;
            pool.query(sqlStatus, [orderID], (err, results) => {
                // status can't be changed backwards, status can't be changed from cancelled
                if (results[0].status_id > statusID || results[0].status_id == 3) {
                    return reject(err);
                }
                if (err) {
                    return reject(err);
                }
                let sql = `UPDATE orders SET status_id = ${statusID} WHERE id = ${orderID};`;
                pool.query(sql, [orderID, statusID], (err, results) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(results);
                });
            });
        });

    });
};

shopdb.allStatus = () => {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT * FROM status`, (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        });
    });
};

module.exports = shopdb;