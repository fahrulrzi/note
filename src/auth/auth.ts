import { Request, Response, Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { supabase } from "../service/supabase";

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET!;
const SALT_ROUNDS = 10;

const generateToken = (user: any) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
    },
    JWT_SECRET,
    {
      expiresIn: "2d",
    }
  );
};

router.post("/register", async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Cek apakah email sudah terdaftar
    const { data: existingUser, error: existingError } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (existingUser) {
      return res.status(400).json({
        status: "error",
        message: "Email already exists",
      });
    }

    if (existingError && existingError.code !== "PGRST116") {
      return res.status(500).json({ message: "Error checking existing user" });
    }

    // Register di auth.users //bauheiuguaeogfeaa
    // const { data: authData, error: authError } = await supabase.auth.signUp({
    //   email,
    //   password,
    // });

    // if (authError) {
    //   return res.status(400).json({ message: authError });
    // }

    // if (!authData.user) {
    //   return res.status(400).json({ message: "Failed to create user" });
    // }

    // hash password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // menyimpan user ke database
    const { data: userData, error: userError } = await supabase
      .from("users")
      .insert({
        name,
        email,
        password_hash: hashedPassword,
        // auth_id: authData.user.id,
      })
      .select()
      .single();

    if (userError) {
      return res.status(500).json({ message: userError.message });
    }

    // generate JWT token
    const token = generateToken(userData);

    res.status(201).json({
      message: "Registration successful",
      user: {
        id: userData.id,
        name: userData.name,
        email: userData.email,
      },
      token,
    });
  } catch (error) {
    console.error("Register error: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/login", async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password } = req.body;

    // mencari user berdasarkan email
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .limit(1);

    if (userError) {
      return res.status(500).json({
        status: "error",
        message: "Internal server error",
      });
    }

    // cek user ditemukan atau tidak
    if (userData.length === 0) {
      return res.status(401).json({
        status: "error",
        message: "Invalid email or password",
      });
    }

    const user = userData[0];

    // cek password
    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      return res.status(401).json({
        status: "error",
        message: "Invalid email or password",
      });
    }

    // generate JWT token
    const token = generateToken(user);

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
});

export default router;
