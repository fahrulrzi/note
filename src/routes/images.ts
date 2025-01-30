import { Request, Response, Router } from "express";
import { CustomRequest } from "../types/token";
import { uploadImage } from "../func/uploadImage";
import { supabase } from "../service/supabase";

const router = Router();

router.post("/:id", async (req: Request, res: Response) => {
  const customRequest = req as CustomRequest;

  try {
    const { id } = req.params;

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

    const upImage = await uploadImage(image, parseInt(id));

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
  const { imageUrl } = req.body;

  const fileName = imageUrl.split("/").pop();

  const { data: imageData, error: imageError } = await supabase
    .from("note_images")
    .delete()
    .eq("note_id", id)
    .eq("image_name", fileName);

  if (imageError) {
    res.status(500).json({
      status: "error",
      message: `Internal server error ${imageError.message}`,
    });
    return;
  }

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
