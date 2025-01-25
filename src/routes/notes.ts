import { NextFunction, Request, Response, Router } from "express";
import { supabase } from "../service/supabase";
import authMiddleware from "../middleware/authMiddleware";
// import pool from "../service/pool";
import { CustomRequest } from "../types/token";
// import { stat } from "fs";

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
      .select(
        `id, 
        folder_name:name, 
        notes (id, title, 
        content, is_pinned, 
        tags:note_tags(tags(id, name)), 
        created_at
        )`
      )
      .eq("user_id", customRequest.user.id);

    if (folderError) throw folderError;

    // ? mengambil data dari notes
    const { data: standaloneNotes, error: notesError } = await supabase
      .from("notes")
      .select(
        `id, title, 
        content, 
        is_pinned, 
        tags:note_tags(tags(id, name)), 
        created_at
        `
      )
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

router.get(
  "/:id",
  authMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    const customRequest = req as CustomRequest;

    const { id } = req.params;

    if (id === "shared") {
      return next();
    }
    const { data, error } = await supabase
      .from("notes")
      .select("id, title, content, is_pinned, folders(id,name), tags:note_tags(tags(id, name)), created_at")
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
  }
);

router.post("/", authMiddleware, async (req: Request, res: Response) => {
  const customRequest = req as CustomRequest;

  try {
    const { title, content, folder_id, is_pinned } = req.body;

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
      title: title || notes[0].title,
      content: content || notes[0].content,
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

router.delete("/:id", authMiddleware, async (req: Request, res: Response) => {
  const customRequest = req as CustomRequest;

  const { id } = req.params;

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
    .delete()
    .eq("user_id", customRequest.user.id)
    .eq("id", id)
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
    message: "Data deleted successfully",
    data: data[0],
  });
});

// ! shared
router.post(
  "/:id/share",
  authMiddleware,
  async (req: Request, res: Response) => {
    const customRequest = req as CustomRequest;

    const { id } = req.params;

    const { email, permision_level } = req.body;

    const { data, error } = await supabase
      .from("shared_notes")
      .insert({
        note_id: id,
        shared_by_user_id: customRequest.user.id,
        shared_with_email: email,
        permision_level: permision_level,
      })
      .select(
        `
        permision_level, 
        shared_with_user:users!shared_notes_shared_with_email_fkey(id, name, email), 
        note:notes(id, title, content)
        `
      );

    if (error) {
      res.status(500).json({
        status: "error",
        message: "Internal server error",
      });

      return;
    }

    res.json({
      status: "success",
      message: "Data shared successfully",
      data: data[0],
    });
  }
);

router.get("/shared", authMiddleware, async (req: Request, res: Response) => {
  const customRequest = req as CustomRequest;

  const { data, error } = await supabase
    .from("shared_notes")
    .select(
      `
      permision_level, 
      shared_with_user:users!shared_notes_shared_with_email_fkey(id, name, email), 
      shared_by_user:users!shared_notes_shared_by_user_id_fkey(id, name, email),
      note:notes(id, title, content)
      `
    )
    .eq("shared_by_user_id", customRequest.user.id);

  if (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
    return;
  }

  res.json({
    status: "success",
    message: "Data fetched successfully",
    data: data,
  });
});

router.delete(
  "/share/:shared_id",
  authMiddleware,
  async (req: Request, res: Response) => {
    const customRequest = req as CustomRequest;

    const { shared_id } = req.params;

    const { data, error } = await supabase
      .from("shared_notes")
      .delete()
      .eq("shared_by_user_id", customRequest.user.id)
      .eq("id", shared_id)
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
      message: "Data deleted successfully",
      data: data[0],
    });
  }
);

export default router;
