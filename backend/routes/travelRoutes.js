const express = require("express");
const router = express.Router();
const travelController = require("../controllers/travelController");

router.post("/generate-destinations", travelController.generateDestinations);

router.get("/convert-currency", travelController.convertCurrency);

module.exports = router;
