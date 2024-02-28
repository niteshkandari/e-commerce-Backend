import { Request, Response, NextFunction } from "express";
import OrderSchema from "../models/orders";
import UserSchema from "../models/users";

class OrderController {

    async placeOrder(req:Request | any, res: Response, next: NextFunction) {
        const {_id} = req.user; 
        const user = await UserSchema.findById(_id).populate("cart.product");
        console.log(user,"********************************")
    }

}

export default new OrderController();