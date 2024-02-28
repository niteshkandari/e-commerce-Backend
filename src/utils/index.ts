import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { APP_SECRET } from "../config";

export const GenerateSalt = async () => {
  return await bcrypt.genSalt();
};

export const GeneratePassword = async (password: string, salt: string) => {
  return await bcrypt.hash(password, salt);
};

export const ValidatePassword = async (
   {
    email:savedEmail,
    password:savedPassword,
    _id
   },
  enteredPassword: string,
) => {
  return new Promise<string | Error>((resolve, reject) => {
  bcrypt.compare(enteredPassword, savedPassword, (err, result) => {
      if(err) return reject(err);
      if(result) {
        const token = GenerateSignature({
          email:savedEmail,
          _id
        })
        resolve(token);
      }
      reject(err);
    })
  })
};

export const GenerateSignature = async (payload) => {
  return jwt.sign(payload, APP_SECRET, { expiresIn: "1day" });
};

export const ValidateSignature = async (req) => {
// try{
//   const token = req.headers.authorization.split(' ')[1];
//   const decoded = jwt.verify(token,process.env.JWT_KEY);
//   req.userData = decoded;
//   next();
// }catch (error) {
//   return res.status(401).json({
//       message:'Auth failed, token not valid'
//   })
// }
const signature = req.get("Authorization");
if (signature) {
    try {
    const payload = jwt.verify(signature.split(" ")[1], APP_SECRET);
    req.user = payload;
    return true;
    } catch(err) {
      console.log({err:err});
      return false;
    }
  }
  return false;
};

export const FormateData = (data: unknown) => {
  if (data) {
    return { data };
  } else {
    throw new Error("Data Not found!");
  }
};
