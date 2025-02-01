import { Request, Response, Router } from "express";
import { CustomRequest } from "../types/token";
import { uploadImage } from "../func/uploadImage";
import { supabase } from "../service/supabase";

const router = Router();

router.post("/:id", async (req: Request, res: Response) => {
  const customRequest = req as CustomRequest;

  try {
    const { id } = req.params;

    const { data: noteData, error: noteError } = await supabase
      .from("notes")
      .select("id")
      .eq("id", id)
      .eq("user_id", customRequest.user.id);

    if (noteError) {
      res.status(500).json({
        status: "error",
        message: `Internal server error ${noteError.message}`,
      });
      return;
    }

    if (noteData.length === 0) {
      res.status(404).json({
        status: "error",
        message: "Note not found.",
      });
      return;
    }

    if (!req.files || !req.files.image) {
      res.status(400).json({
        status: "error",
        message: "No image file uploaded.",
      });
      return;
    }

    if (Array.isArray(req.files.image)) {
      res.status(400).json({
        status: "error",
        message: "Multiple files upload is not supported.",
      });
      return;
    }

    const { image } = req.files;

    if (!image.mimetype.startsWith("image")) {
      res.status(400).json({
        status: "error",
        message: "File uploaded is not an image.",
      });
      return;
    }

    const upImage = await uploadImage(image);

    res.json({
      status: "success",
      message: "Image uploaded successfully",
      data: { publicUrl: upImage },
    });
  } catch (error) {
    console.error("Error uploading image: ", error);
    res.status(500).json({
      status: "error",
      message: `Internal server error ${error}`,
    });
    return;
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { publicUrl } = req.body;

  const fileName = publicUrl.split("/").pop();

  const { data, error } = await supabase.storage
    .from("image_note")
    .remove([fileName]);

  if (error) {
    res.status(500).json({
      status: "error",
      message: `Internal server error ${error.message}`,
    });
    return;
  }

  res.json({
    status: "success",
    message: "Image deleted successfully",
  });
});

export default router;
