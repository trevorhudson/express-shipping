"use strict";
const shipItAPI = require("../shipItApi");
shipItAPI.shipProduct = jest.fn();

const request = require("supertest");
const app = require("../app");

// const AxiosMockAdapter = require(
//   "axios-mock-adapter");
const axios = require("axios");
// const axiosMock = new AxiosMockAdapter(axios);



describe("POST /", function () {


  test("valid", async function () {
    shipItAPI.shipProduct.mockReturnValue(1942);


    const resp = await request(app).post("/shipments").send({
      productId: 1000,
      name: "Test Tester",
      addr: "100 Test St",
      zip: "12345-6789",
    });

    expect(resp.body).toEqual({ shipped: 1942 });
  });

  test("throws error if empty request body", async function () {
    const resp = await request(app)
      .post("/shipments")
      .send();
    expect(resp.statusCode).toEqual(400);
  });

  test("returns specific error messages if invalid data given", async function () {
    const resp = await request(app)
      .post("/shipments")
      .send({
        "productId": 10,
        "name": "Tes",
        "addr": "501 Main Street",
        "zip": null
      });
    expect(resp.statusCode).toEqual(400);
    expect(resp.body).toEqual({
      "error": {
        "message": [
          "instance.productId must be greater than or equal to 1000",
          "instance.name does not meet minimum length of 5",
          "instance.zip is not of a type(s) string"
        ],
        "status": 400
      }
    });
  });
});
