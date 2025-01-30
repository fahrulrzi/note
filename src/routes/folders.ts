import { Request, Response, Router } from "express";
import { CustomRequest } from "../types/token";

const router = Router();

router.get("/", (req: Request, res: Response) => {
    const customRequest = req as CustomRequest;

    try {
        
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: `Internal server error ${error}`,
        })
    }
})

export default router;