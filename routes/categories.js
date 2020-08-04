const express = require("express");

const router = express.Router();

const db_config = require("../config/db_config");
const db = require("../utils/db");

// CREATE
router.post("/", function (req, res) {
  var category_name = req.body.category_name;
  db.add({ category_name: category_name }, "categories", function (err,result) {
    res.status(201).json(result.recordsets[0]);
  });
});
/*
* Request Sample:
* POST http://localhost:3000/categories
* Body {"category_name": "New Category"}
*/

// READ
// SELECT ALL
router.get("/", function (req, res, next) {
  db.selectAll("categories", function (err, result) {
    res.status(200).json(result.recordsets);
  });
});
/*
* Request Sample:
* GET http://localhost:3000/categories
*/

// READ
// SELECT
router.get("/selectNameLike/:name", function (req, res, next) {
  var name = req.params.name;
  db.select("categories", 2,"where category_name like '%" + name + "%'", "", "ORDER BY category_id DESC", function (err, result) {
      res.status(200).json(result.recordsets);
    }
  );
});
/*
* Request Sample:
* GET http://localhost:3000/categories/selectNameLike/Bicycles
*/

// READ
// QUERY
router.get("/queryName/:id", function (req, res, next) {
  var id = req.params.id;
  db.querySql("select category_name from categories where category_id = @category_id", { category_id: id }, function (err, result) {
      res.status(200).json(result.recordsets);
    }
  );
});
/*
* Request Sample:
* GET http://localhost:3000/categories/queryName/5
*/

// UPDATE
router.put("/:id", function (req, res) {
  var id = req.params.id;
  var category_name = req.body.category_name;
  db.update({ category_name: category_name }, { category_id: id }, "categories", function (err, result) {
      // return with status 204
      // success status response code 204 indicates
      // that the request has succeeded
      //res.sendStatus(204);

      // check rowAffected
      if(result.rowsAffected[0] == 0) {
        // no row match
        res.sendStatus(404);
      } else {
        // row match and updated
        res.sendStatus(200);
      }
    }
  );
});
/*
* Request Sample:
* PUT http://localhost:3000/categories/5
* Body {"category_name": "New Category"}
*/

// DELETE
router.delete("/:id", function (req, res) {
  var id = req.params.id;
  db.del("where category_id = @id", { id: id }, "categories", function (err,result) {
    // return with status 204
    // success status response code 204 indicates
    // that the request has succeeded
    res.sendStatus(204);
  });
});
/*
* Request Sample:
* DELETE http://localhost:3000/categories/7
*/

// READ
// SP
router.post("/runSP", function (req, res) {
  var procedure_name = req.body.procedure_name;
  var category_name = req.body.category_name;
  db.sp({ NAME: category_name }, procedure_name, function (err, result) {
    res.status(200).json(result.recordsets);
  });
});
/*
 * Request Sample
 * POST http://localhost:3000/categories/runSP
 * Body {"procedure_name": "SelectCategories", "category_name": "New Category"}
 */

module.exports = router;
