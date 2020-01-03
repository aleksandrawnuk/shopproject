const express = require('express');
const db = require('../db');

const router = express.Router();

router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

router.get('/products', async (req, res, next) => {
    try {
        let results = await db.allProducts();
        res.json(results);
    } catch(e) {
        console.log(e);
        res.status(500).send(e);
    }
});

router.get('/products/:id', async (req, res, next) => {
    try {
        let results = await db.oneProduct(req.params.id);
        res.json(results);
    } catch(e) {
        console.log(e);
        res.status(500).send(e);
    }
});

router.post('/products', async (req, res, next) => {
    try {
        await db.addProduct(req.body);
        res.send('Added successfully');
    } catch(e) {
        console.log(e);
        res.status(500).send(e);
    }
});

router.put('/products/:id', async (req, res, next) => {
    try {
        await db.updateProduct(req.params.id, req.body);
        res.send('Updated successfully');
    } catch(e) {
        console.log(e);
        res.status(500).send(e);
    }
});

router.get('/categories', async (req, res, next) => {
    try {
        let results = await db.allCategories();
        res.json(results);
    } catch(e) {
        console.log(e);
        res.status(500).send(e);
    }
});

router.get('/orders', async (req, res, next) => {
    try {
        let results = await db.allOrders();
        res.json(results);
    } catch(e) {
        console.log(e);
        res.status(500).send(e);
    }
});

router.get('/orders/status/:id', async (req, res, next) => {
    try {
        let results = await db.oneOrderByStatus(req.params.id);
        res.json(results);
    } catch(e) {
        console.log(e);
        res.status(500).send(e);
    }
});

router.post('/orders', async (req, res, next) => {
    try {
        let results = await db.addOrder(req.body);
        res.json(results[0][0].id);
       // res.send('Added successfully');
    } catch(e) {
        console.log(e);
        res.status(500).send(e);
    }
});

router.put('/orders/:orderID', async (req, res, next) => {
    try {
        let results = await db.updateOrderStatus(req.params.orderID, req.body.statusID);
        res.json(results);
        //res.send('Order status updated successfully');
    } catch (e) {
        console.log(e);
        res.send(e);
        //res.status(500).send(e);
    }
});

router.get('/status', async (req, res, next) => {
    try {
        let results = await db.allStatus();
        res.json(results);
    } catch(e) {
        console.log(e);
        res.status(500).send(e);
    }
});

module.exports = router;