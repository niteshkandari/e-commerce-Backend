import { Request, Response, NextFunction } from "express";
import {
  GeneratePassword,
  GenerateSalt,
  ValidatePassword,
} from "../utils";
import jwt from "jsonwebtoken";
import { APP_SECRET } from "../config";
import ejs from "ejs";
import path from "path";
import { sendMail } from "../utils/mailService";
import { BadRequestException } from "../exceptions/bad-request";
import { ErrorCodes } from "../exceptions/root";
import prismaClient from "../prismaClient";
class UserController {
  async userSignUp(req: Request, res: Response, next: NextFunction){
    const {
      email,
      password: userPassword,
      phoneno,
      firstName,
      lastName,
      address,
    } = req.body;

    try {
      const existingUser = await prismaClient.user.findUnique({
        where: { email: email },
      });
      if (existingUser) {
        next(new BadRequestException('user already exists', ErrorCodes.USER_ALREADY_EXIST))
        // return res
        //   .status(401)
        //   .json({ message: "User already exists with given email id" });
      }

      const salt = await GenerateSalt();
      const password = await GeneratePassword(userPassword, salt);
      
      await prismaClient.user.create({
        data: {
          email,
          password,
          phoneno,
          firstName,
          lastName,
          address,
        },
      });

      res.status(200).json("User Created");
    } catch (err: any) {
      console.log(err.message);
      res.status(500).json({ Error: (err.message) });
      // throw new ApiError('API Error', STATUS_CODES.INTERNAL_ERROR, 'Unable to Create Customer')
    }
  }

  userSignin(req: Request, res: Response) {
    const { email, password: enteredPassword } = req.body;
    prismaClient.user
      .findUnique({ where: { email } })
      .then(async (user: any) => {
        if (!user) {
          return res
            .status(404)
            .json({ message: "There is no user with that email" });
        } else {
          ValidatePassword(
            {
              email: user.email,
              password: user.password,
              _id: user.id,
            },
            enteredPassword
          )
            .then((success) => {
              const { password, ...rest } = user;
              if (success) {
                res.status(200).json({ ...rest, token: success });
              }
            })
            .catch((err) => {
              return res.status(401).json({ message: "something went wrong" });
            });
        }
      })
      .catch((error) => {
        return res.status(500).json({ message: "Internal server error" });
      });
  }
  async forgotPassword(req:Request, res:Response, _next:NextFunction) {
    const { email } = req.body;
    try {
      const existingUser: any = await prismaClient.user.findUnique({
        where: { email: email },
      });
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
      const link = `http://localhost:5050/api/user/reset-password/${existingUser._id}/${token}`;
      const templatePath = path.join(__dirname, "/views/forgot-password.ejs");
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
      console.log(err);
      res.status(500).json({ message: err });
    }
  }
}

export default new UserController();
