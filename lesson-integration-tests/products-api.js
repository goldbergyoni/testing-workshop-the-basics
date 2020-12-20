const express = require("express");
const util = require("util");
const bodyParser = require("body-parser");
const ProductsService = require("./products-service");

let expressApp, serverConnection;

// 1. A typical Express setup
async function initializeServer() {
  return new Promise((resolve, reject) => {
    expressApp = express();
    const router = express.Router();
    expressApp.use(bodyParser.json());
    expressApp.use("/product", router);
    defineAllRoutes(router);
    serverConnection = expressApp.listen(() => {
      resolve(expressApp);
    });
  });
}

async function stopServer() {
  return new Promise((resolve, reject) => {
    serverConnection.close(() => {
      resolve();
    });
  });
}

// 2. Define the routes
function defineAllRoutes(router) {
  // Add new product
  router.post("/", async (req, res, next) => {
    try {
      console.log(`Products API was called to add new product ${util.inspect(req.body)}`);

      // save to DB (Caution: simplistic code without layers and validation)
      const newProductResponse = await new ProductsService().addProduct(req.body);

      res.json(newProductResponse).end();
    } catch (error) {
      if (error.name === "invalidInput") {
        res.status(400).end();
      } else if (error.name === "duplicated") {
        res.status(409).end();
      } else {
        res.status(500).end();
      }
    }
  });

  // Get product by name
  router.get("/:name", async (req, res, next) => {
    console.log(`Products API was called to get product by name ${req.params.name}`);
    const resultProduct = await new ProductsService().getProductsByName(req.params.name);
    res.json(resultProduct).end();
  });
}

module.exports = {
  initializeServer,
  stopServer,
};
