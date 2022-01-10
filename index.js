const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const helmet = require("helmet");
const mongoose = require("mongoose");

const { logger } = require("./common/functions/logger");

const { cleaner } = require("./common/middlewares/cleaner");
// const { requestLogger } = require("./common/middlewares/requestLogger");
// const { initializeMessageHandler } = require("./common/messageBus/handler");
const auth = require("./routes/api/auth");
const user = require("./routes/api/user");
const errorMiddleware = require("./common/middlewares/error");
// initialize the env configuration
dotenv.config();

const port = process.env.SERVER_PORT || 5001;
const app = express();

// enable cors
app.use(cors());
// set http headers
app.use(helmet());

// enable req logging
app.use(morgan("common"));

// app.use(requestLogger);

// enable body parser
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set("etag", false);

// remove any null or undefined keys from the request body
app.use("/", cleaner);
// // heahth check route
app.get("/api/health-check", (req, res, next) => {
  res.status(200).json({ message: "Health check successful" });
});
app.use("/api/user/auth", auth);
app.use("/api/user", user);
app.use(errorMiddleware);

// initializeMessageHandler();

app.listen(port, () => {
  logger.info(`server started at http://localhost:${port}`);
});
