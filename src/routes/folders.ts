import { NextFunction, Request, Response, Router } from "express";
import { CustomRequest } from "../types/token";
import { supabase } from "../service/supabase";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  const customRequest = req as CustomRequest;

  try {
    const { data, error } = await supabase
      .from("folders")
      .select("id, name, is_pinned,created_at, updated_at")
      .eq("user_id", customRequest.user.id);

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
      status: "Error",
      message: `Internal server error ${error}`,
    });
  }
});

router.post("/", async (req: Request, res: Response) => {
  const customRequest = req as CustomRequest;

  const { name, is_pinned } = req.body;

  try {
    const { data, error } = await supabase
      .from("folders")
      .insert({
        name: name,
        user_id: customRequest.user.id,
        is_pinned: is_pinned || false,
      })
      .select();

    if (error) {
      res.status(500).json({
        status: "Error",
        message: `Internal server error: ${error.message}`,
      });
      return;
    }

    res.json({
      status: "Success",
      message: `Data inserted successfully`,
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      status: "Error",
      message: `Internal server error ${error}`,
    });
  }
});

router.put("/:id", async (req: Request, res: Response) => {
  const customRequest = req as CustomRequest;

  const { name, is_pinned } = req.body;

  try {
    const { data: folderData, error: folderError } = await supabase
      .from("folders")
      .select("*")
      .eq("id", req.params.id)
      .eq("user_id", customRequest.user.id);

    if (folderError) {
      res.status(500).json({
        status: "Error",
        message: `Internal server error: ${folderError.message}`,
      });
      return;
    }

    if (folderData.length === 0) {
      res.status(404).json({
        status: "Error",
        message: `Folder not found`,
      });
      return;
    }

    const { data, error } = await supabase
      .from("folders")
      .update({ name: name, is_pinned: is_pinned || folderData[0].is_pinned })
      .eq("id", req.params.id)
      .eq("user_id", customRequest.user.id)
      .select();

    if (error) {
      res.status(500).json({
        status: "Error",
        message: `Internal server error: ${error.message}`,
      });
      return;
    }

    res.json({
      status: "Success",
      message: `Data updated successfully`,
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      status: "Error",
      message: `Internal server error ${error}`,
    });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  const customRequest = req as CustomRequest;

  try {
    const { data, error } = await supabase
      .from("folders")
      .delete()
      .eq("id", req.params.id)
      .eq("user_id", customRequest.user.id)
      .select();

    if (error) {
      res.status(500).json({
        status: "Error",
        message: `Internal server error: ${error.message}`,
      });
      return;
    }

    const { data: notesData, error: notesError } = await supabase
      .from("notes")
      .delete()
      .eq("folder_id", req.params.id)
      .eq("user_id", customRequest.user.id)
      .select();

    if (notesError) {
      res.status(500).json({
        status: "Error",
        message: `Internal server error: ${notesError.message}`,
      });
    }

    res.json({
      status: "Success",
      message: `Data deleted successfully`,
      data: { data, notesData },
    });
  } catch (error) {
    res.status(500).json({
      status: "Error",
      message: `Internal server error ${error}`,
    });
  }
});

router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  const customRequest = req as CustomRequest;

  const { id } = req.params;

  if (id === "sort-by-name" || id === "sort-by-update" || id === "pinned") {
    return next();
  }

  try {
    const { data: notesData, error: notesError } = await supabase
      .from("notes")
      .select("id, title, content, created_at, updated_at")
      .eq("folder_id", id)
      .eq("user_id", customRequest.user.id);

    if (notesError) {
      res.status(500).json({
        status: "Error",
        message: `Internal server error: ${notesError.message}`,
      });
      return;
    }

    res.json({
      status: "Success",
      message: `Data fetched successfully`,
      data: notesData,
    });
  } catch (error) {
    res.status(500).json({
      status: "Error",
      message: `Internal server error ${error}`,
    });
  }
});

router.get("/:sorting", async (req: Request, res: Response) => {
  const customRequest = req as CustomRequest;

  const { sorting } = req.params;

  try {
    if (sorting === "sort-by-name") {
      const { data, error } = await supabase
        .from("folders")
        .select("id, name, created_at, updated_at")
        .eq("user_id", customRequest.user.id)
        .order("name");

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
    } else if (sorting === "sort-by-update") {
      const { data, error } = await supabase
        .from("folders")
        .select("id, name, created_at, updated_at")
        .eq("user_id", customRequest.user.id)
        .order("updated_at", { ascending: false });

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
    } else if (sorting === "pinned") {
      const { data, error } = await supabase
        .from("folders")
        .select("id, name, is_pinned,created_at, updated_at")
        .eq("user_id", customRequest.user.id)
        .eq("is_pinned", true);

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
    } else {
      res.status(400).json({
        status: "Error",
        message: `Invalid sorting parameter`,
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "Error",
      message: `Internal server error ${error}`,
    });
  }
});

export default router;
