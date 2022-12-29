import { Router } from "express";
import UserController from "../controllers/userController";
import { checkAuthentication } from "../middleware/auth";

const router = Router();

router.post("/signup", UserController.userSignUp);

router.post("/signin", UserController.userSignin);

router.post("/forgot-password", UserController.forgotPassword);

router.get("/reset-password/:id/:token", (req, res, next) => UserController.resetPassword("GET",req, res, next));

router.post("/reset-password/:id/:token", (req, res, next) => UserController.resetPassword("POST",req, res, next));

router.get("/all", checkAuthentication, UserController.getAllUsers);

router.post("/add-product/cart", checkAuthentication, UserController.addProductToCart);

router.get("/cart", checkAuthentication, UserController.getAllCartProducts);

router.put("/cart/:id", checkAuthentication, UserController.removeProductsfromCart);

export default router;
