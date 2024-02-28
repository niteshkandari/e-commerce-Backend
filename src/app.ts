<<<<<<< HEAD
import express from 'express';

const app = express();

app.use("/api/test",(req, res, next) => {
  res.status(200).json({message:"hello!"});
})
=======
import express,{ NextFunction, Request, Response , Express } from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoutes';
import propertyRoutes from './routes/propteryRoutes';
import { exec } from "child_process"
import { errorMiddleware } from './middleware/errors';
// import HandleErrors from './utils/error-handler';

export default async (app:Express) => {

  app.use(express.json({ limit: '1mb'}));
  app.use(express.urlencoded({ extended: false, limit: '1mb'}));
  app.use(cors());
  app.set('view engine', 'ejs');    
  app.set('views', __dirname + '/views');

//   exec("ping -c 10 google.com", (error, stdout, stderr) => {
//     if (error) {
//         console.log(`error: ${error.message}`);
//         return;
//     }
//     if (stderr) {
//         console.log(`stderr: ${stderr}`);
//         return;
//     }
//     console.log(`stdout: ${stdout}`);
// });

  app.use("/api/properties", propertyRoutes);
  app.use("/api/user", userRoutes);
  app.use(errorMiddleware) 

  // app.use((req:Request, res:Response, next:NextFunction) => {
  //   const error:Error = new Error("Not found");
  //   error.status = 404;
  //   next(error);
  // });
  
  // app.use(HandleErrors);
  // app.use((error, req:Request, res:Response, next:NextFunction) => {
  //   res.status(error.status || 500);
  //   res.json({
  //     error: {
  //       message: error.message,
  //     },
  //   });
  // });

}
>>>>>>> 4d3dfd45cbfe172eca91947e63101892ea4c57f7

export default app;
