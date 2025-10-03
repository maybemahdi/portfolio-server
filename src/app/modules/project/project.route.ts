import { NextFunction, Request, Response, Router } from "express";
import { upload } from "../../utils/sendImageToCloudinary";
import { ProjectController } from "./project.controller";
import validateRequest from "../../middlewares/validateRequest";
import { CreateProjectValidationSchema } from "./project.validation";
import auth from "../../middlewares/auth";

const ProjectRoutes = Router();

ProjectRoutes.post(
  "/",
  auth(),
  upload.single("thumbnail"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(CreateProjectValidationSchema),
  ProjectController.createProject,
);

ProjectRoutes.patch(
  "/:id",
  auth(),
  upload.single("thumbnail"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(CreateProjectValidationSchema),
  ProjectController.updateProject,
);

ProjectRoutes.get("/", ProjectController.getAllProject);
ProjectRoutes.delete("/:id", auth(), ProjectController.deleteProject);

export default ProjectRoutes;
