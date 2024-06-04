// import express from "express";
const express = require("express");
// import cors from "cors";
const cors = require("cors");
// import bodyParser from "body-parser";
const bodyParser = require("body-parser");
// import ApiError from "./utils/ApiError";
const ApiError = require("./utils/ApiError");
const app = express();

const router = require("./router");
// import loggerMiddleware from "./middleware/loggerMiddleware";
const loggerMiddleware = require("./middleware/loggerMiddleware");
// import swaggerUi from "swagger-ui-express";
const swaggerUi = require("swagger-ui-express");
// import swaggerFile from "../swagger_output.json"; // Generated Swagger file
const swaggerFile = require("../swagger_output.json"); // Generated Swagger file
// import multer from "multer";
const multer = require("multer");

// Middlewares
app.use(express.json());
app.use(cors());

app.options("*", cors());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(loggerMiddleware);
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});
app.use(multer().array("file"));
// router index
app.use("/", router);
// api doc
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.get("/", (req, res) => {
  res.send("Social-app v1.3");
});

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(404, "Not found"));
});

module.exports = app;