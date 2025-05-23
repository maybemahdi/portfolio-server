import { NextFunction, Request, Response, Router } from "express";
import auth from "../../middlewares/auth";
import { BlogController } from "./blog.controller";
import validateRequest from "../../middlewares/validateRequest";
import { CreateBlogValidation, UpdateBlogValidation } from "./blog.validation";
import { upload } from "../../utils/sendImageToCloudinary";

const BlogRoutes = Router();

BlogRoutes.post(
  "/",
  auth(),
  upload.single("thumbnail"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(CreateBlogValidation),
  BlogController.createBlog,
);

BlogRoutes.patch(
  "/:id",
  auth(),
  upload.single("thumbnail"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(UpdateBlogValidation),
  BlogController.updateBlog,

  BlogRoutes.get("/", BlogController.getAllBlogs),
  BlogRoutes.get("/:id", BlogController.getSingleBlog),
  BlogRoutes.delete("/:id", auth(), BlogController.deleteBlog),
);

export default BlogRoutes;
