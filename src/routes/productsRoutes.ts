import { Router } from "express";
import ProductController from "../controllers/productController";
import { checkAuthentication } from "../middleware/auth";

const router = Router();

router.post("/add", checkAuthentication, ProductController.addProduct);

router.get("/all", checkAuthentication, ProductController.getAllProducts);

router.delete("/:id", checkAuthentication, ProductController.deleteProductById);

router.get("/:id", checkAuthentication, ProductController.getProductById);

router.put("/:id", checkAuthentication, ProductController.updateProduct);

router.put("/update/image/:id", checkAuthentication, ProductController.updateProductImage);


export default router;
