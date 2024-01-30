import {Router} from "express";
import {verifyJWT} from "../middlewares/auth.middleware.js"
import { getUser, loginUser, registerUser } from "../controllers/user.controller.js";

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/user', verifyJWT, getUser);

export default router;