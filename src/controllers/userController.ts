import { Request, Response, NextFunction } from "express";
import UserSchema from "../models/users";
import {
  FormateData,
  GeneratePassword,
  GenerateSalt,
  GenerateSignature,
  ValidatePassword,
} from "../utils";
import jwt from "jsonwebtoken";
import bycrypt from "bcrypt";
import { APP_SECRET } from "../config";
import ejs from "ejs";
import path from "path";
import { sendMail } from "../utils/mailService";

class UserController {
  userSignUp(req: Request, res: Response, _next: NextFunction) {
    const {
      email,
      password: userPassword,
      phone,
      firstName,
      lastName,
      address,
    } = req.body;
    UserSchema.find({ email: email })
      .exec()
      .then(async (user) => {
        if (user.length >= 1) {
          return res
            .status(401)
            .json({ message: "User already exists with given email id" });
        } else {
          let salt = await GenerateSalt();
          let password = await GeneratePassword(userPassword, salt);
          try {
            const user = new UserSchema({
              email,
              password,
              phone,
              firstName,
              lastName,
              address,
            });
            const existingUser = await user.save();
            const token = await GenerateSignature({
              email: email,
              _id: existingUser._id,
            });
            const data = FormateData({ id: existingUser._id, token });
            if (data) return res.status(200).json({ message: "Success" });
          } catch (err: any) {
            res.status(500).json({ Error: err.message });
            // throw new ApiError('API Error', STATUS_CODES.INTERNAL_ERROR, 'Unable to Create Customer')
          }
        }
      });
  }
  userSignin(req: Request, res: Response, next: NextFunction) {
    const { email, password: enteredPassword } = req.body;
    UserSchema.find({ email: email })
      .exec()
      .then(async (user: any) => {
        if (user.length < 1) {
          return res
            .status(404)
            .json({ message: "There is no user with that email" });
        } else {
          ValidatePassword(
            {
              email: user[0].email,
              password: user[0].password,
              _id: user[0]._id,
            },
            enteredPassword
          )
            .then((success) => {
              const { password, ...rest } = user[0]._doc;
              if (success) {
                res.status(200).json({ ...rest, token: success });
              }
            })
            .catch((err) => {
              return res.status(401).json({ message: "something went wrong" });
            });
        }
      });
  }
  async forgotPassword(req: Request, res: Response, _next: NextFunction) {
    const { email } = req.body;
    try {
      const existingUser = await UserSchema.findOne({ email: email });
      if (!existingUser) {
        return res
          .status(500)
          .json({ message: "User with given email does not exist" });
      }
      const jwtSecret = APP_SECRET + existingUser.password;
      const token = jwt.sign(
        { email: existingUser.email, id: existingUser._id },
        jwtSecret,
        { expiresIn: "5m" }
      );
      const link = `http://localhost:4040/api/user/reset-password/${existingUser._id}/${token}`;
      const templatePath = path.join(__dirname, "../views/forgot-password.ejs");
      const data = await ejs.renderFile(templatePath, { link: link });
      sendMail(data, "niteshskandari@gmail.com")
        .then((success) => {
          res.status(200).json({
            message:
              "email has been sent successfully to the your email address",
          });
          console.log(success);
        })
        .catch((err) => {
          res.status(500).json({ message: "some error occurred" });
          console.log(err);
        });
    } catch (err) {
      res.status(500).json({ message: err });
    }
  }
  async resetPassword(
    method: string,
    req: Request,
    res: Response,
    _next: NextFunction
  ) {
    const { id, token } = req.params;
    const { password } = req.body;
    const existingUser = await UserSchema.findOne({ _id: id });
    if (!existingUser) {
      return res.status(500).json({ message: "User does not exist" });
    }
    const jwtSecret = APP_SECRET + existingUser.password;
    try {
      const isVerified: any = jwt.verify(token, jwtSecret);
      if (isVerified) {
        if (method === "POST") {
          if (password[0] !== password[1]) {
            return res.status(403).json({ message: "Passwords dont match" });
          }
          const encryptedPassword = await bycrypt.hash(password[0], 10);
          const passwordChanged = await UserSchema.updateOne(
            { _id: id },
            { $set: { password: encryptedPassword } }
          );
          if (passwordChanged) {
            res.status(200);
            res.render("reset-password-success", { link: "www.example.com" });
          } else res.status(404).json({ message: "User password not updated" });
        } else if (method === "GET")
          res.render("reset-password", { email: isVerified.email });
      }
    } catch (err) {
      res.status(500).json({ message: "something went wrong" });
    }
  }

  async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await UserSchema.find();
      const updatedUsers = users.map((user: any) => {
        const { password, isAdmin, ...rest } = user._doc;
        return { ...rest };
      });
      return res.status(200).json(updatedUsers);
    } catch (err: any) {
      const error = new Error(err);
      next(error);
    }
  }

  async addProductToCart(
    req: Request | any,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { productId , quantity } = req.body;
      const { _id } = req.user;
      const success = await UserSchema.updateOne(
        { _id },
        {
          $push: {
            cart: { product: productId, unit: quantity},
          },
        }
      );
      res.status(201).json({ message: "Added to Cart!!!" });
    } catch (err: any) {
      console.log(err);
      const error = new Error(err);
      next(error);
    }
  }

  async getAllCartProducts(
    req: Request | any,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { _id } = req.user;
      const cart = await UserSchema.findById(_id)
        .select("cart")
        .populate("cart.product", "_id price name desc available banner");
      res.status(200).json(cart);
    } catch (err: any) {
      const error = new Error(err);
      next(error);
    }
  }

  removeProductsfromCart(
    req: Request | any,
    res: Response,
    next: NextFunction
  ) {
    const { id } = req.params;
    const { _id } = req.user;
    const {quantity } = req.query;
    // if(req.query) {
      // UserSchema.findOne({_id}).then(async (users:any) => {
      //   users.cart.forEach((props:any) => props._id === id && (props.unit = quantity));
      //   console.log(users.cart);
      //   const saved = await users.save();
      //   res.status(200).json({ message: users.cart, count:users.cart.length });
      // })
      // UserSchema.findByIdAndUpdate({ _id: _id, "cart.$.id":id} , 
      // { $set: {
      //   "cart.$.unit" : quantity
      //   }
      // }
      // ).then((user:any) => {
      //   res.status(200).json({ message: user.cart, count:user.cart.length });
      // }).catch(err => {
      //   console.log(err);
      // })
      // return;
    // }
    UserSchema.findByIdAndUpdate(
      { _id: _id },
      {
        $pull: {
          cart: { _id: id },
        },
      }
    )
      .then((user: any) => {
        res.status(200).json({ message: user.cart, count:user.cart.length });
      })
      .catch((err: any) => {
        console.log(err, "err occurred");
        const error = new Error(err);
        next(error);
      });
  }
  


}

export default new UserController();
