const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const helmet = require("helmet");

const { logger } = require("./common/functions/logger");

const { cleaner } = require("./common/middlewares/cleaner");
// const { requestLogger } = require("./common/middlewares/requestLogger");
// const { initializeMessageHandler } = require("./common/messageBus/handler");
const auth = require("./routes/api/auth");
const user = require("./routes/api/user");
const business = require("./routes/api/business");
const role = require("./routes/api/role");
const staff = require("./routes/api/staff");
const zone = require("./routes/api/zone");
const station = require("./routes/api/station");
const table = require("./routes/api/table");
const category = require("./routes/api/category");
const item = require("./routes/api/item");
const addon = require("./routes/api/addon");
const pos = require("./routes/api/pos");
const tax = require("./routes/api/taxCategory");
const errorMiddleware = require("./common/middlewares/error");
// initialize the env configuration
dotenv.config();

const port = process.env.SERVER_PORT || process.env.PORT || 5001;
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
app.use("/api/business", business);
app.use("/api/role", role);
app.use("/api/staff", staff);
app.use("/api/zone", zone);
app.use("/api/station", station);
app.use("/api/table", table);
app.use("/api/category", category);
app.use("/api/tax", tax);
app.use("/api/item", item);
app.use("/api/addon", addon);
app.use("/api/pos", pos);
app.use(errorMiddleware);

// initializeMessageHandler();

app.listen(port, () => {
  logger.info(`server started at http://localhost:${port}`);
});
