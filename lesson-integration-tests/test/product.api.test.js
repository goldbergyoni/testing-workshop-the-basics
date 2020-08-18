const request = require("supertest");
const express = require("express");
const sinon = require("sinon");
const faker = require("faker");
const {
    startAPI,
    stopAPI
} = require("../products-api");

let expressApp;

beforeAll(async (done) => {
    expressApp = await startAPI();
    done();
});

afterAll(() => {
    stopAPI();
});

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
        });

        test("When adding a new valid product, then it should be retrievable", async () => {
            //Arrange
            const bookName = `Dracula ${Math.random()}`
            const productToAdd = {
                name: bookName,
                price: 59,
                category: "Books",
            };
            await request(expressApp).post("/product").send(productToAdd);

            //Act
            const receivedAPIResponse = await request(expressApp).get(`/product/${bookName}`);

            //Assert
            expect(receivedAPIResponse.body).toContainEqual(productToAdd);
        });
    });
});