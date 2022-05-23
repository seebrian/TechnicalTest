var bodyparser = require('body-parser');
var express = require('express');
const { ethers } = require("ethers")
const contract = require('./routes/api/contract');
require("dotenv").config();

const swaggerUi = require("swagger-ui-express"),
    swaggerDocument = require("./swagger.json");

var app = express();

const PORT = process.env.PORT || 8080

app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument)
);

app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

app.use('/api/contract', contract);

app.listen(PORT, function () {
    console.log('app listening on port ' + PORT + '!');
});