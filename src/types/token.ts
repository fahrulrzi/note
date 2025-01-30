import { Request } from "express";

interface User {
  id: number;
  email: string;
  name: string;
}

interface CustomRequest extends Request {
  user: User;
}

interface CustomRequestImage extends CustomRequest {}

export { CustomRequest, User };
