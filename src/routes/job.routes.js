import {Router} from "express";
import { addJobPost, editJobPost, getAllJobPost, getJobPost } from "../controllers/job.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", getAllJobPost);
router.get("/:jobId", getJobPost);

//Protected/Secured Routes
router.post("/", verifyJWT, addJobPost);
router.put("/:jobId", verifyJWT, editJobPost)

export default router;