import { Request, Response, Router } from "express";
import { supabase } from "../service/supabase";
import authMiddleware from "../middleware/authMiddleware";
// import pool from "../service/pool";
import { CustomRequest } from "../types/token";
import { stat } from "fs";

const router = Router();

// ? sub folder fungsi
// async function buildFolderHierarchy(parentId: number | null, userId: number) {
//   const { data: folders, error: folderError } = await supabase
//     .from("folders")
//     .select("id, name, created_at")
//     .eq("user_id", userId)
//     .eq("parent_id", parentId);

//   if (folderError) throw folderError;

//   const folderPromise = folders.map(async (folder) => {
//     const subfolders = await buildFolderHierarchy(folder.id, userId);
//     const { data: notes, error: notesError } = await supabase
//       .from("notes")
//       .select("id, title, content, created_at")
//       .eq("user_id", userId)
//       .eq("folder_id", folder.id);
//     if (notesError) throw notesError;
//     return {
//       ...folder,
//       notes,
//       subfolders,
//     };
//   });

//   return Promise.all(folderPromise);
// }

router.get("/", authMiddleware, async (req: Request, res: Response) => {
  const customRequest = req as CustomRequest;

  try {
    // ? sub folder
    // const folders = await buildFolderHierarchy(null, customRequest.user.id);

    // console.log("folders=>", folders);

    // const { data: standaloneNotes, error: notesError } = await supabase
    //   .from("notes")
    //   .select("id, title, content, created_at")
    //   .is("folder", null)
    //   .eq("user_id", customRequest.user.id);

    // if (notesError) throw notesError;

    // res.json({
    //   folders,
    //   standalone_notes: standaloneNotes,
    // });

    //  ? mengambil data dari folder
    const { data: folders, error: folderError } = await supabase
      .from("folders")
      .select("id, name, notes (id, title, content, created_at)")
      .eq("user_id", customRequest.user.id);

    if (folderError) throw folderError;

    // ? mengambil data dari notes
    const { data: standaloneNotes, error: notesError } = await supabase
      .from("notes")
      .select("id, title, content, created_at")
      .is("folder_id", null)
      .eq("user_id", customRequest.user.id);

    if (notesError) throw notesError;

    res.json({
      status: "success",
      message: "Data fetched successfully",
      folders,
      standalone_notes: standaloneNotes,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
});

router.get("/:id", authMiddleware, async (req: Request, res: Response) => {
  const customRequest = req as CustomRequest;

  const { id } = req.params;
  const { data, error } = await supabase
    .from("notes")
    .select("id, title, content, is_pinned, folders(id,name), created_at")
    .eq("user_id", customRequest.user.id)
    .eq("id", id);

  if (error) {
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
    return;
  }

  if (data.length === 0) {
    res.status(404).json({
      status: "error",
      message: "Note not found",
    });
  } else {
    res.json({
      status: "success",
      message: "Data fetched successfully",
      data: data[0],
    });
  }
});

router.post("/", authMiddleware, async (req: Request, res: Response) => {
  const customRequest = req as CustomRequest;

  try {
    const { title, content, folder_id, is_pinned } = req.body;

    console.log(req.body);

    const { data, error } = await supabase
      .from("notes")
      .insert({
        user_id: customRequest.user.id,
        title,
        content,
        is_pinned: is_pinned || false,
        folder_id: folder_id || null,
      })
      .select();

    if (error) {
      res.status(500).json({
        status: "error",
        message: "Internal server error",
      });
      return;
    }

    res.json({
      status: "success",
      message: "Data posted successfully",
      data: data[0],
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
});

//! put normal tapi ada error ketika beda user
router.put("/:id", authMiddleware, async (req: Request, res: Response) => {
  const customRequest = req as CustomRequest;

  const { id } = req.params;
  const { title, content, folder_id, is_pinned } = req.body;

  const { data: notes, error: notesError } = await supabase
    .from("notes")
    .select("*")
    .eq("user_id", customRequest.user.id)
    .eq("id", id);

  if (notes?.length === 0) {
    res.status(404).json({
      status: "error",
      message: "Note not found",
    });
    return;
  }

  if (notesError) {
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
    return;
  }

  const { data, error } = await supabase
    .from("notes")
    .update({
      title,
      content,
      is_pinned: is_pinned || notes[0].is_pinned,
      folder_id: folder_id || notes[0].folder_id,
      updated_at: new Date(),
    })
    .eq("id", id)
    .eq("user_id", customRequest.user.id)
    .select();

  if (error) {
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
    return;
  }

  res.json({
    status: "success",
    message: "Data updated successfully",
    data: data[0],
  });
});

export default router;
