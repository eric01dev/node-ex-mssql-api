const express = require("express");

const router = express.Router();

const db_config = require("../config/db_config");
const db = require("../utils/db");

router.get("/", function (req, res, next) {

    db.selectAll('brands', function(err, result) {
        res.send('node-ex-mssql-api works!');
    })
});

module.exports = router;
