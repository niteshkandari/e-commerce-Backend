import express,{ Request, Response } from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoutes';
import productRoutes from './routes/productsRoutes';
import orderRoutes from './routes/orderRoutes';
import HandleErrors from './utils/error-handler';

export default async (app:any) => {

  app.use(express.json({ limit: '1mb'}));
  app.use(express.urlencoded({ extended: false, limit: '1mb'}));
  app.use(cors());
  app.set('view engine', 'ejs');    
  app.set('views', __dirname + '/views');
  app.use("/api/user", userRoutes);
  app.use("/api/products",productRoutes);
  app.use("/api/order", orderRoutes);

  app.use((req, res, next) => {
    const error:any = new Error("Not found");
    error.status = 404;
    next(error);
  });
  
  // app.use(HandleErrors);
  app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
      error: {
        message: error.message,
      },
    });
  });

}

