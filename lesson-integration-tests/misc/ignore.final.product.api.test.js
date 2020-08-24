const request = require("supertest");
const express = require("express");
const axios = require("axios");
const yaml = require("js-yaml");
const fs = require("fs");
const path = require("path");
const productsApi = require("../products-api");
const jestOpenAPI = require("jest-openapi");
const { dirname } = require("path");

let expressApp;

beforeAll(async (done) => {
  expressApp = productsApi;
  const openAPIFilePath = path.join(__dirname , "api-docs.yml");
  console.log(openAPIFilePath);
  const openAPI = yaml.safeLoad(fs.readFileSync(openAPIFilePath, "utf8"));
  await jestOpenAPI(openAPI);
  done();
});

afterAll(() => {});

/*eslint-disable */
describe("/api", () => {
  describe("POST /products", () => {
    test.todo("When adding order without product, return 400");

    test("When adding a new valid product, then should get back successful response", async () => {
      //Arrange
      const productToAdd = {
        name: `Moby Dick ${Math.random()}`,
        price: 59,
        category: "Books",
      };

      //Act
      const receivedAPIResponse = await request(expressApp).post("/product").send(productToAdd);

      //Assert
      expect(receivedAPIResponse).toMatchObject({
        status: 200,
        body: {
          status: "succeeded",
        },
      });
      expect(receivedAPIResponse).toSatisfyApiSpec();
    });

    test("When adding a new valid product, then it should be retrievable", async () => {
      //Arrange
      const bookName = `Dracula ${Math.random()}`;
      const productToAdd = {
        name: bookName,
        price: 59,
        category: "Books",
      };

      //Act
      await request(expressApp).post("/product").send(productToAdd);

      //Assert
      const existingProduct = await request(expressApp).get(`/product/${bookName}`);
      expect(existingProduct.body).toContainEqual(productToAdd);
    });
  });
});

//const receivedAPIResponse = await axios.post("http://localhost:3000/product", productToAdd);
