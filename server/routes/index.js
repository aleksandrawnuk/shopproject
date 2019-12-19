const express = require('express');
const db = require('../db');

const router = express.Router();

router.get('/products', async (req, res, next) => {
    try {
        let results = await db.allProducts();
        res.json(results);
    } catch(e) {
        console.log(e);
        res.sendStatus(500);
    }
});

router.get('/products/:id', async (req, res, next) => {
    try {
        let results = await db.oneProduct(req.params.id);
        res.json(results);
    } catch(e) {
        console.log(e);
        res.sendStatus(500);
    }
});

router.get('/categories', async (req, res, next) => {
    try {
        let results = await db.allCategories();
        res.json(results);
    } catch(e) {
        console.log(e);
        res.sendStatus(500);
    }
});

router.get('/orders', async (req, res, next) => {
    try {
        let results = await db.allOrders();
        res.json(results);
    } catch(e) {
        console.log(e);
        res.sendStatus(500);
    }
});

router.get('/orders/status/:id', async (req, res, next) => {
    try {
        let results = await db.oneOrderByStatus(req.params.id);
        res.json(results);
    } catch(e) {
        console.log(e);
        res.sendStatus(500);
    }
});

router.get('/status', async (req, res, next) => {
    try {
        let results = await db.allStatus();
        res.json(results);
    } catch(e) {
        console.log(e);
        res.sendStatus(500);
    }
});

module.exports = router;