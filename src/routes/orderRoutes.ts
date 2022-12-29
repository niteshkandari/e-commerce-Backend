import { Router } from "express";
import OrderController from "../controllers/orderController";
import { checkAuthentication } from "../middleware/auth";

const router = Router();

router.post("/create", checkAuthentication ,OrderController.placeOrder);

export default router;