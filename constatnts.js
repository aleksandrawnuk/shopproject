module.exports = {
    correctProductJSON : {
        "prodID":"1",
        "prodName":"Product name",
        "prodDesc":"Product description",
        "prodPrice": 69,
        "prodWeight": 21.37,
        "catID": 1
    },
    correctOrderJSON : {
        "orderID":0,
        "confirmDate":"2019-12-28",
        "statusID":1,
        "username":"testuser4",
        "email":"user@test.com",
        "phonenumber":"1234234",
        "orderlines" : {
            "productID" : [1, 2, 3],
            "quantity" : [2, 5, 1]
        }
    }
};