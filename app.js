const http = require("http");
const express = require("express");
var cors = require("cors");

const index = require("./routes/index");
const categories = require("./routes/categories");

const app = express();
app.use(express.json());

app.use(cors({ origin: "http://localhost:8100" }));

app.use("/", index);
app.use('/categories', categories);

const server = http.createServer(app);
const port = 3000;
server.listen(port);
console.debug("Server listening on port " + port);
