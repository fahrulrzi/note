import e, { Request, Response, Router } from "express";
import { CustomRequest } from "../types/token";
import { supabase } from "../service/supabase";

const router = Router();

router.get("/:id", async (req: Request, res: Response) => {
  const customRequest = req as CustomRequest;

  const { id } = req.params;

  const { data, error } = await supabase
    .from("shared_notes")
    .select("*")
    .eq("shared_with_email", customRequest.user.email)
    .eq("note_id", id);

  if (error) {
    res.status(500).json({
      status: "Error",
      message: `Internal server error: ${error.message}`,
    });
    return;
  }

  if (data.length === 0) {
    res.status(404).json({
      status: "Error",
      message: "Data not found",
    });
    return;
  }

  res.json({
    status: "Successss",
    message: `Data fetched successfully`,
    data: data,
  });
});

export default router;
