import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { CustomRequest, User } from "../types/token";

const JWT_SECRET = process.env.JWT_SECRET!;

// interface User {
//   id: number;
//   email: string;
//   name: string;
// }

// interface CustomRequest extends Request {

//   user: User;
// }

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const customRequest = req as CustomRequest;
  try {
    const token = customRequest.headers.authorization?.split(" ")[1];

    if (!token) {
      res.status(401).json({ 
        status: "error",
        message: "Unauthorized",
       });
      return;
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    customRequest.user = decoded as User;


  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
  next();

};

export default authMiddleware;
