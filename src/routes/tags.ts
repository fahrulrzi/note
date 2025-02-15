import { Request, Response, Router } from "express";
import { CustomRequest } from "../types/token";
import { supabase } from "../service/supabase";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  const customRequest = req as CustomRequest;

  const { data, error } = await supabase
    .from("tags")
    .select("id, name")
    .eq("user_id", customRequest.user.id);

  if (error) {
    res.status(500).json({
      status: "Error",
      message: "Internal server error",
    });
    return;
  }

  if (data.length === 0) {
    res.json({
      status: "Success",
      message: "Data not found",
      data: [],
    });
  }

  res.json({
    status: "Success",
    message: "Data fetched successfully",
    data: data,
  });
});

router.post("/", async (req: Request, res: Response) => {
  const customRequest = req as CustomRequest;

  const { name } = req.body;

  const { data: tag, error: tagError } = await supabase
    .from("tags")
    .select("id, name")
    .eq("user_id", customRequest.user.id)
    .eq("name", name);

  if (tagError) {
    res.status(500).json({
      status: "Error",
      message: "Internal server error",
    });

    return;
  }

  if (tag.length > 0) {
    res.status(400).json({
      status: "Error",
      message: "Tag already exists",
    });

    return;
  }

  const { data, error } = await supabase
    .from("tags")
    .insert({
      user_id: customRequest.user.id,
      name: name,
    })
    .select();

  if (error) {
    res.status(500).json({
      status: "Error",
      message: "Internal server error",
    });
    return;
  }

  res.json({
    status: "Success",
    message: "Data posted successfully",
    data: data[0],
  });
});

router.get("/:id", async (req: Request, res: Response) => {
  const customRequest = req as CustomRequest;

  const { id } = req.params;

  // const { data, error } = await supabase
  //   .from("tags")
  //   .select("id, name")
  //   .eq("user_id", customRequest.user.id)
  //   .eq("id", id);

  const { data: noteTagsData, error: errorNoteTagsData } = await supabase
    .from("notes")
    .select("*")
    .eq("tag_id", id);

  if (errorNoteTagsData) {
    res.status(500).json({
      status: "Error",
      message: `Internal server error: ${errorNoteTagsData.message}`,
    });
    return;
  }

  if (noteTagsData.length === 0) {
    res.json({
      status: "Success",
      message: "Data not found",
      data: [],
    });
    return;
  }

  const { data: notesData, error: errorNotesData } = await supabase
    .from("notes")
    .select(
      `id, title, content, is_pinned, tags:note_tags(tags(id,name)),created_at, updated_at`
    )
    .eq("id", noteTagsData[0].note_id)
    .eq("user_id", customRequest.user.id);

  if (errorNotesData) {
    res.status(500).json({
      status: "Error",
      message: `Internal server error: ${errorNotesData.message}`,
    });
    return;
  }

  res.json({
    status: "Success",
    message: "Data fetched successfully",
    data: notesData,
  });
});

// router.get("/:name", async (req: Request, res: Response) => {
//   const customRequest = req as CustomRequest;

//   const { name } = req.params;

//   const { data, error } = await supabase
//     .from("tags")
//     .select("id, name")
//     .eq("user_id", customRequest.user.id)
//     .eq("name", name);

//   if (error) {
//     res.status(500).json({
//       status: "Error",
//       message: "Internal server error",
//     });
//     return;
//   }

//   if (data.length === 0) {
//     res.json({
//       status: "Success",
//       message: "Data not found",
//       data: [],
//     });

//     return;
//   }

//   res.json({
//     status: "Success",
//     message: "Data fetched successfully",
//     data: data[0],
//   });
// });

router.put("/:id", async (req: Request, res: Response) => {
  const customRequest = req as CustomRequest;

  const { id } = req.params;
  const { name } = req.body;

  const { data, error } = await supabase
    .from("tags")
    .update({ name: name })
    .eq("user_id", customRequest.user.id)
    .eq("id", id)
    .select();

  if (error) {
    res.status(500).json({
      status: "Error",
      message: "Internal server error",
    });
    return;
  }

  res.json({
    status: "Success",
    message: "Data updated successfully",
    data: data[0],
  });
});

router.delete("/:id", async (req: Request, res: Response) => {
  const customRequest = req as CustomRequest;

  const { id } = req.params;

  const { data, error } = await supabase
    .from("tags")
    .delete()
    .eq("user_id", customRequest.user.id)
    .eq("id", id)
    .select();

  if (error) {
    res.status(500).json({
      status: "Error",
      message: "Internal server error",
    });
    return;
  }

  res.json({
    status: "Success",
    message: "Data deleted successfully",
    data: data[0],
  });
});

export default router;
