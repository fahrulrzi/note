import { Request } from "express";

interface User {
  id: number;
  email: string;
  name: string;
}

interface CustomRequest extends Request {
  user: User;
}

export { User, CustomRequest };
