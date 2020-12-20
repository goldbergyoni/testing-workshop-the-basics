const express = require("express");
const util = require("util");
const bodyParser = require("body-parser");
const ProductsService = require("../business-logic/products-service");
const cors = require("cors");

let expressApp, serverConnection;

// 1. A typical Express setup
async function initializeServer() {
  return new Promise((resolve, reject) => {
    expressApp = express();
    const router = express.Router();
    expressApp.use(bodyParser.json());
    expressApp.options("*", cors({ origin: "*" }));
    expressApp.use(cors({ origin: "*" }));
    expressApp.use("/product", router);
    defineAllRoutes(router);
    const port = process.env.PORT || null;
    serverConnection = expressApp.listen(port, () => {
      console.log(`API is listening on port ${port}`);
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
      const newProductResponse = await new ProductsService().addProduct(req.body);
      res.json(newProductResponse).end();
    } catch (error) {
      console.log(error);
      res.status(error.status || 500).end();
    }
  });

  // Get product by name
  router.get("/:name", async (req, res, next) => {
    console.log(`Products API was called to get product by name ${req.params.name}`);
    const resultProduct = await new ProductsService().getProductsByName(req.params.name);
    console.log("🎊", resultProduct);
    res.json(resultProduct).end();
  });
}

module.exports = {
  initializeServer,
  stopServer,
};
