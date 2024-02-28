import { Router } from 'express';
import PropertyController from '../controllers/propertyController';

const router:Router = Router();

router.post("/create", PropertyController.createProperty)
router.get("/allproperties", PropertyController.getAllProperties)
router.get("/:id", PropertyController.getProperty)

export default router;