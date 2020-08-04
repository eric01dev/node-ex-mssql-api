const mssql = require("mssql");
const util = require("util");
const conf = require("../config/db_config");

let restoreDefaults = function() {
    conf;
};

const con = new mssql.ConnectionPool(conf);

con.on('error', err => {
    if (err) {
        throw err;
    }
});

con.connect(err => {
    if (err) {
        console.error(err);
    }
});

let querySql = async function(sql, params, callBack) {
    try {
        let ps = new mssql.PreparedStatement(con);
        if (params != "") {
            for (var index in params) {
                if (typeof params[index] == "number") {
                    ps.input(index, mssql.Int);
                } else if (typeof params[index] == "string") {
                    ps.input(index, mssql.NVarChar);
                }
            }
        }
        ps.prepare(sql, err => {
            if (err) {
                console.log(err);
            }
            ps.execute(params, (err, result) => {
                callBack(err, result);
                ps.unprepare(err => {
                    if (err) { 
                        console.log(err);
                    }
                });
            });
        });
    } catch (err) {
        console.error('SQL error', err);
    }
    restoreDefaults();
};

var select = async function(tableName, topNumber, whereSql, params, orderSql, callBack) {
    try {
        var ps = new mssql.PreparedStatement(con);
        var sql = "select * from " + tableName + " ";
        if (topNumber != "") {
            sql = "select top(" + topNumber + ") * from " + tableName + " ";
        }
        sql += whereSql + " ";
        if (params != "") {
            for (var index in params) {
                if (typeof params[index] == "number") {
                    ps.input(index, mssql.Int);
                } else if (typeof params[index] == "string") {
                    ps.input(index, mssql.NVarChar);
                }
            }
        }
        sql += orderSql;
        console.log(sql);
        ps.prepare(sql, err => {
            if (err) {
                console.log(err);
            }
            ps.execute(params, (err, result) => {
                callBack(err, result);
                ps.unprepare(err => {
                    if (err) {
                        console.log(err);
                    }
                });
            });
        });
    } catch (err) {
        console.error('SQL error', err);
    }
    restoreDefaults();
};

var selectAll = async function(tableName, callBack) {
    try {
        var ps = new mssql.PreparedStatement(con);
        var sql = "select * from " + tableName + " ";
        ps.prepare(sql, err => {
            if (err) {
                console.log(err);
            }
            ps.execute("", (err, result) => {
                callBack(err, result);
                ps.unprepare(err => {
                    if (err) {
                        console.log(err);
                    }
                });
            });
        });
    } catch (err) {
        console.error('SQL error', err);
    }
    restoreDefaults();
};

var add = async function(addObj, tableName, callBack) {
    try {
        var ps = new mssql.PreparedStatement(con);
        var sql = "insert into " + tableName + "(";
        if (addObj != "") {
            for (var index in addObj) {
                if (typeof addObj[index] == "number") {
                    ps.input(index, mssql.Int);
                } else if (typeof addObj[index] == "string") {
                    ps.input(index, mssql.NVarChar);
                }
                sql += index + ",";
            }
            sql = sql.substring(0, sql.length - 1) + ") values(";
            for (var index in addObj) {
                if (typeof addObj[index] == "number") {
                    sql += addObj[index] + ",";
                } else if (typeof addObj[index] == "string") {
                    sql += "'" + addObj[index] + "'" + ",";
                }
            }
        }
        sql = sql.substring(0, sql.length - 1) + ")";
        sql += " SELECT SCOPE_IDENTITY() as id"
        console.log(sql);
        ps.prepare(sql, err => {
            if (err) {
                console.log(err);
            }
            ps.execute(addObj, (err, result) => {
                callBack(err, result);
                ps.unprepare(err => {
                    if (err) {
                        console.log(err);
                    }
                });
            });
        });
    } catch (err) {
        console.error('SQL error', err);
    }
    restoreDefaults();
};

var update = async function(updateObj, whereObj, tableName, callBack) {
    try {
        var ps = new mssql.PreparedStatement(con);
        var sql = "update " + tableName + " set ";
        if (updateObj != "") {
            for (var index in updateObj) {
                if (typeof updateObj[index] == "number") {
                    ps.input(index, mssql.Int);
                    sql += index + "=" + updateObj[index] + ",";
                } else if (typeof updateObj[index] == "string") {
                    ps.input(index, mssql.NVarChar);
                    sql += index + "=" + "'" + updateObj[index] + "'" + ",";
                }
            }
        }
        sql = sql.substring(0, sql.length - 1) + " where ";
        if (whereObj != "") {
            for (var index in whereObj) {
                if (typeof whereObj[index] == "number") {
                    ps.input(index, mssql.Int);
                    sql += index + "=" + whereObj[index] + " and ";
                } else if (typeof whereObj[index] == "string") {
                    ps.input(index, mssql.NVarChar);
                    sql += index + "=" + "'" + whereObj[index] + "'" + " and ";
                }
            }
        }
        sql = sql.substring(0, sql.length - 5);
        ps.prepare(sql, err => {
            if (err) {
                console.log(err);
            }
            ps.execute(updateObj, (err, result) => {
                callBack(err, result);
                ps.unprepare(err => {
                    if (err) {
                        console.log(err);
                    }
                });
            });
        });
    } catch (err) {
        console.error('SQL error', err);
    }
    restoreDefaults();
};

var del = async function(whereSql, params, tableName, callBack) {
    try {
        var ps = new mssql.PreparedStatement(con);
        var sql = "delete from " + tableName + " ";
        if (params != "") {
            for (var index in params) {
                if (typeof params[index] == "number") {
                    ps.input(index, mssql.Int);
                } else if (typeof params[index] == "string") {
                    ps.input(index, mssql.NVarChar);
                }
            }
        }
        sql += whereSql;
        ps.prepare(sql, err => {
            if (err) {
                console.log(err);
            }
            ps.execute(params, (err, result) => {
                callBack(err, result);
                ps.unprepare(err => {
                    if (err) {
                        console.log(err);
                    }
                });
            });
        });
    } catch (err) {
        console.error('SQL error', err);
    }
    restoreDefaults();
};

var sp = async function(params, procedure_name, callBack) {
    try {

        mssql.connect(conf, err => {

            // Stored procedure
            var req = new mssql.Request();
            for (var index in params) {
                if (typeof params[index] == "number") {
                    req.input(index, mssql.Int, params[index]);
                } else if (typeof params[index] == "string") {
                    req.input(index, mssql.NVarChar, params[index]);
                }
            }
            //req.output('output_parameter', mssql.VarChar(50));
            req.execute(procedure_name, (err, result) => {
                if (err) {
                    console.log(err);
                }

                //console.log(result.recordsets.length) // count of recordsets returned by the procedure
                //console.log(result.recordsets[0].length) // count of rows contained in first recordset
                //console.log(result.recordset) // first recordset from result.recordsets
                //console.log(result.returnValue) // procedure return value
                //console.log(result.output) // key/value collection of output values
                //console.log(result.rowsAffected) // array of numbers, each number represents the number of rows affected by executed statemens
                callBack(err, result);
            });
        });
    } catch(err) {
        console.error('SQL error', err);
    }
    restoreDefaults();
}

exports.config = conf;
exports.del = del;
exports.select = select;
exports.update = update;
exports.querySql = querySql;
exports.selectAll = selectAll;
exports.restoreDefaults = restoreDefaults;
exports.add = add;
exports.sp = sp;