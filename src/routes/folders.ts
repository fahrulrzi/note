import { Request, Response, Router } from "express";
import { CustomRequest } from "../types/token";
import { supabase } from "../service/supabase";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  const customRequest = req as CustomRequest;

  try {
    const { data, error } = await supabase
      .from("folders")
      .select("id, name, created_at, updated_at")
      .eq("id", customRequest.user.id);

    if (error) {
      res.status(500).json({
        status: "Error",
        message: `Internal server error: ${error.message}`,
      });
      return;
    }

    res.json({
      status: "Success",
      message: `Data fetched successfully`,
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: `Internal server error ${error}`,
    });
  }
});

export default router;
