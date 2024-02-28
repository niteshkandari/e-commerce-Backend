import { Request, Response } from "express";
import prismaClient from "../prismaClient";
import { Prisma } from "@prisma/client";

class PropertyController {
  async createProperty(req: Request, res: Response) {
    const { title, description, price, address, city, facilities, userEmail } =
      req.body.data;
    try {
      const property = await prismaClient.properties.create({
        data: {
          title,
          description,
          price,
          address,
          city,
          facilities,
          owner: { connect: { email: userEmail } },
        },
      });
      res.send({ message: "Property created successfully", property });
    } catch (err: any) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2002") {
          throw new Error("A property with same address is already registered");
        }
      }
      throw new Error(err.message);
    }
  }

  async getAllProperties(req: Request, res: Response) {
    try {
      const properites = await prismaClient.properties.findMany({
        orderBy: {
          createdatdate: "desc",
        },
      });
      res.send(properites);
    } catch (err: any) {
      throw new Error(err.message);
    }
  }

  async getProperty(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const property = await prismaClient.properties.findUnique({
        where: { id },
      });
      res.send(property);
    } catch (err: any) {
      throw new Error(err.message);
    }
  }
}

export default new PropertyController();