import { NextFunction, Request, Response, Router } from "express";
import auth from "../../middlewares/auth";
import { SkillController } from "./skill.controller";
import validateRequest from "../../middlewares/validateRequest";
import {
  CreateSkillValidationSchema,
  UpdateSkillValidationSchema,
} from "./skill.validation";
import { upload } from "../../utils/sendImageToCloudinary";

const SkillRoutes = Router();

SkillRoutes.post(
  "/",
  auth(),
  upload.single("logo"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(CreateSkillValidationSchema),
  SkillController.createSkill,
);

SkillRoutes.patch(
  "/:id",
  auth(),
  upload.single("logo"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(UpdateSkillValidationSchema),
  SkillController.updateSkill,
);

SkillRoutes.get("/", SkillController.getAllSkills);
SkillRoutes.delete("/:id", SkillController.deleteSkill);

export default SkillRoutes;
