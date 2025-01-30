import { Request, Response, Router } from "express";
import { supabase } from "../service/supabase";
import authMiddleware from "../middleware/authMiddleware";
import { CustomRequest } from "../types/token";

const router = Router();

// interface User {
//   id: number;
//   email: string;
//   name: string;
// }

// interface CustomRequest extends Request {
//   user: User;
// }

// testing testing

// get all users
router.get("/", async (req, res) => {
  // const customRequest = req as CustomRequest;

  try {
    // console.log(
    //   "Database URL:",
    //   process.env.SUPABASE_URL?.substring(0, 20) + "..."
    // );

    // // 2. Cek schema dan tabel
    // const { data: tables, error: tableError } = await supabase
    //   .from("information_schema.tables")
    //   .select("table_schema,table_name")
    //   .eq("table_name", "users");

    // console.log("Available tables:", tables);

    // 3. Query data
    const { data, error } = await supabase.from("users").select();

    console.log("Query result:", { data, error });

    if (error) throw error;

    // console.log("user data: ", customRequest.user );

    res.json(data || []);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

router.get("/:name", async (req: Request, res: Response) => {
  try {
    const { name } = req.params;

    const { data, error } = await supabase
      .from("users")
      .select("id, name, email")
      .eq("name", name);

    if (error) {
      res.status(500).json({
        status: "error",
        message: `Internal server error ${error}`,
      });
    }

    res.json({
      status: "success",
      message: "User data retrieved successfully",
      data: data || [],
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: `Internal server error ${error}`,
    });
  }
});

export default router;
