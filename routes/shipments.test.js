"use strict";

const request = require("supertest");
const app = require("../app");


describe("POST /", function () {
  test("valid", async function () {
    const resp = await request(app).post("/shipments").send({
      productId: 1000,
      name: "Test Tester",
      addr: "100 Test St",
      zip: "12345-6789",
    });

    expect(resp.body).toEqual({ shipped: expect.any(Number) });
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
  })
});
