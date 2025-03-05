import { Router } from "express";
import { uploadFiles } from "../controllers/usersController.js";
import { uploadDocuments } from "../config/multer.js";

const userRouter = Router(); 

userRouter.post('/:uid/documents', uploadDocuments.array("newDocs"), uploadFiles);

export default userRouter