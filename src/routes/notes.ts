import { NextFunction, Request, Response, Router } from "express";
import { supabase } from "../service/supabase";
// import pool from "../service/pool";
import { CustomRequest } from "../types/token";
import authMiddleware from "../middleware/authMiddleware";
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

router.get("/", async (req: Request, res: Response) => {
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

    // ? mengambil data dari notes
    const { data, error } = await supabase
      .from("notes")
      .select(
        `id, title, 
        content, 
        is_pinned,
        tags:note_tags(tags(id, name)),
        created_at,
        updated_at
        `
      )
      .eq("user_id", customRequest.user.id);

    if (error) throw error;

    res.json({
      status: "success",
      message: "Data fetched successfully",
      data,
    });




    //   //  ? mengambil data dari folder
    //   const { data: folders, error: folderError } = await supabase
    //     .from("folders")
    //     .select(
    //       `id,
    //       folder_name:name,
    //       notes (
    //       id,
    //       title,
    //       content,
    //       is_pinned,
    //       tags:note_tags(tags(id, name)),
    //       created_at
    //       )`
    //     )
    //     .eq("user_id", customRequest.user.id);

    //   if (folderError) throw folderError;

    //   // ? mengambil data dari notes
    //   const { data: standaloneNotes, error: notesError } = await supabase
    //     .from("notes")
    //     .select(
    //       `id, title,
    //       content,
    //       is_pinned,
    //       tags:note_tags(tags(id, name)),
    //       created_at
    //       `
    //     )
    //     .is("folder_id", null)
    //     .eq("user_id", customRequest.user.id);

    //   if (notesError) throw notesError;

    //   res.json({
    //     status: "success",
    //     message: "Data fetched successfully",
    //     folders,
    //     standalone_notes: standaloneNotes,
    //   });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
});

router.get(
  "/:id",

  async (req: Request, res: Response, next: NextFunction) => {
    const customRequest = req as CustomRequest;

    const { id } = req.params;

    if (
      id === "shared" ||
      id === "sort-by-name" ||
      id === "sort-by-update" ||
      id === "search" ||
      id === "pinned"
    ) {
      return next();
    }
    const { data, error } = await supabase
      .from("notes")
      .select(
        "id, title, content, is_pinned, folders(id,name), tags:note_tags(tags(id, name)), created_at"
      )
      .eq("user_id", customRequest.user.id)
      .eq("id", id);

    if (error) {
      res.status(500).json({
        status: "error",
        message: `Internal server error: ${error.message}`,
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

router.post("/", async (req: Request, res: Response) => {
  const customRequest = req as CustomRequest;

  try {
    const { title, content, folder_id, is_pinned } = req.body;
    console.log("content=>", content);

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
        message: `Internal server error: ${error.message}`,
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

router.put("/:id", async (req: Request, res: Response) => {
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

router.delete("/:id", async (req: Request, res: Response) => {
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

router.get("/search/:title", async (req: Request, res: Response) => {
  const customRequest = req as CustomRequest;

  const { title } = req.params;

  const { data, error } = await supabase
    .from("notes")
    .select("id, title, content, is_pinned, created_at, updated_at")
    .eq("user_id", customRequest.user.id)
    .ilike("title", `%${title}%`);

  if (error) {
    res.status(500).json({
      status: "error",
      message: `Internal server error: ${error.message}`,
    });
    return;
  }

  res.json({
    status: "success",
    message: "Data fetched successfully",
    data: data,
  });
});

router.get("/sort-by-title", async (req: Request, res: Response) => {
  const customRequest = req as CustomRequest;

  const { data, error } = await supabase
    .from("notes")
    .select("id, title, content, is_pinned, created_at, updated_at")
    .eq("user_id", customRequest.user.id)
    .order("title", { ascending: true });

  if (error) {
    res.status(500).json({
      status: "error",
      message: `Internal server error: ${error.message}`,
    });
    return;
  }

  res.json({
    status: "success",
    message: "Data fetched successfully",
    data: data,
  });
});

router.get("/sort-by-update", async (req: Request, res: Response) => {
  const customRequest = req as CustomRequest;

  const { data, error } = await supabase
    .from("notes")
    .select("id, title, content, is_pinned, created_at, updated_at")
    .eq("user_id", customRequest.user.id)
    .order("updated_at", { ascending: false });

  if (error) {
    res.status(500).json({
      status: "error",
      message: `Internal server error: ${error.message}`,
    });
    return;
  }

  res.json({
    status: "success",
    message: "Data fetched successfully",
    data: data,
  });
});

router.get("/pinned", async (req: Request, res: Response) => {
  const customRequest = req as CustomRequest;

  const { data, error } = await supabase
    .from("notes")
    .select("id, title, content, is_pinned, created_at, updated_at")
    .eq("user_id", customRequest.user.id)
    .eq("is_pinned", true);

  if (error) {
    res.status(500).json({
      status: "error",
      message: `Internal server error: ${error.message}`,
    });
    return;
  }

  res.json({
    status: "success",
    message: "Data fetched successfully",
    data: data,
  });
});

// ! shared
router.post(
  "/:id/share",

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

router.get("/shared", async (req: Request, res: Response) => {
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

router.put("/share/:id", async (req: Request, res: Response) => {
  const customRequest = req as CustomRequest;

  const { shared_id } = req.params;
  const { title, content } = req.body;

  const { data: notes, error: notesError } = await supabase
    .from("shared_notes")
    .select("shared_by_user_id, note_id, shared_with_email, permision_level")
    .eq("id", shared_id);

  if (notesError) {
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
    return;
  }

  if (notes[0].permision_level !== "edit") {
    res.status(400).json({
      status: "error",
      message: "You don't have permission to edit this note",
    });
    return;
  }

  if (customRequest.user.email !== notes[0].shared_with_email) {
    res.status(400).json({
      status: "error",
      message: "Not share with you",
    });
    return;
  }

  const { data: note, error: noteError } = await supabase
    .from("notes")
    .select("*")
    .eq("user_id", notes[0].shared_by_user_id)
    .eq("id", notes[0].note_id);

  if (noteError) {
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
    return;
  }

  if (note.length === 0) {
    res.status(400).json({
      status: "error",
      message: "Note not found",
    });
    return;
  }

  const { data, error } = await supabase
    .from("notes")
    .update({
      title: title || note[0].title,
      content: content || note[0].content,
      updated_at: new Date(),
    })
    .eq("id", notes[0].note_id)
    .eq("user_id", notes[0].shared_by_user_id)
    .select("title, content");

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

router.delete(
  "/share/:id",

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
