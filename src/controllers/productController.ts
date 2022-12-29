import { Request, Response, NextFunction } from "express";
import multer from "multer";
import upload from "../utils/fileService/upload";
import ProductSchema from "../models/products";

class ProductController {

  async addProduct(req: Request, res: Response, next: NextFunction) {
    upload.single("banner")(req, res, (err) => {
      const { name, desc, unit, price } = req.body;
      const banner = {
        data: req?.file?.filename,
        contentType: req?.file?.mimetype,
      };
      ProductSchema.find({ name: name })
        .exec()
        .then(async (existingProduct) => {
          if (existingProduct.length >= 1) {
            return res
              .status(500)
              .json({ Error: "Product with given name already exists" });
          } else {
              if (err instanceof multer.MulterError) {
                // A Multer error occurred when uploading.
                console.error("Multer error occurred", err);
                return res.status(500).json({ message: "multer err occured", err });
              } else if (err) {
                // An unknown error occurred when uploading.
                console.error("unknown err occurred", err);
                return res.status(500).json({ message: "unknown err occurred", err });
              }
            // Everything went fine.
            const Product = new ProductSchema({
              name,
              desc,
              unit,
              banner,
              price,
            });
            Product.save()
              .then((success) => {
                res.status(200).json({ success });
              })
              .catch((error) => res.status(500).json({ Error: error }));
          }
        });
    });
  }

  async getProductById(req: Request, res: Response, next: NextFunction){
    const { id } = req.params;
    try{
      const product = await ProductSchema.findById({_id:id});
      if(product) { 
        return res.status(200).json(product);
      } 
      return res.status(404).json({message:"product not found!!!"});
   } catch(error:unknown | Error | any) {
      return res.status(500).json({error:error.message});
   }
  }

  async getAllProducts(req: Request, res: Response, next: NextFunction) {
    const { limit, prop, order  }:any = req.query;
    ProductSchema.find().limit(limit * 1).sort({[prop]:order}).exec().then(async (allProducts) => {
      if(allProducts.length > 0) {
        return res.status(200).json(allProducts);
      } else {
        return res.status(200).json({message:"There are no products in Database"});
      }
    }).catch(err => {
      return res.status(500).json(err);
    })
  }


  deleteProductById(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    ProductSchema.deleteOne({_id:id}).exec().then(success => {
      return res.status(200).json({message:"product deleted successfully"});
    }).catch(err => {
      return res.status(500).json({ error: "something went wrong"});
    })
  }
  
   updateProduct(req: Request, res: Response, next: NextFunction){
    const { id } = req.params;
    const {name, desc, unit, price, available, supplier} = req.body;
    ProductSchema.updateOne(
      {_id:id},
      {
        $set : {
          name,
          desc,
          unit,
          price,
          available,
          supplier
        }
      }).exec().then(savedProduct => {
        res.status(201).json(savedProduct)
      }).catch(err => {
        res.status(500).json(err);
      });
  }

  async updateProductImage(req: Request, res: Response, next: NextFunction){
    const { id } = req.params;
    const banner = {
      data: req?.file?.filename,
      contentType: req?.file?.mimetype,
    };
    upload.single("banner")(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading.
        console.error("Multer error occurred", err);
        return res.status(500).json({ message: "multer err occured", err });
      } else if (err) {
        // An unknown error occurred when uploading.
        console.error("unknown err occurred", err);
        return res.status(500).json({ message: "unknown err occurred", err });
      } else {
        ProductSchema.updateOne(
          {_id:id},
          {
            $set:{
              banner: banner
            }
          }).then(savedProduct => {
            res.status(200).json(savedProduct);
          }).catch(err =>{
            res.status(500).json(err);
          })
      }
    })
  }
}

export default new ProductController();
