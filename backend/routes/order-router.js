const express = require("express");
const {PlaceOrder, fetchOrder} = require("../controller/order");


const router = express.Router();

router.post("/placeOrder",PlaceOrder)
router.post("fetchOrder/:orderId" , fetchOrder )

module.exports = router;