const path = require("path");
const swaggerUi = require("swagger-ui-express");
const yaml = require("yamljs");
const express = require("express");
const router = express.Router();
const swaggerDocument = yaml.load(
  path.join(__dirname, "../docs/components.yaml")
);

router.use("/", swaggerUi.serve);

router.get("/", swaggerUi.setup(swaggerDocument));

module.exports = router;
