const express = require("express");
const {PlaceOrder, fetchOrder,fetchAllOrder, EditOrder,DeleteOrder, fetchFilteredOrders } = require("../controller/order");


const router = express.Router();

router.post("/placeOrder",PlaceOrder)
router.get("/fetchOrder/:orderId" , fetchOrder )
router.get("/fetchAllOrder" , fetchAllOrder )
router.put("/orders/:orderId" , EditOrder )
router.delete("/orders/:orderId" , DeleteOrder )
router.get("/ordersbydate" , fetchFilteredOrders )

module.exports = router;