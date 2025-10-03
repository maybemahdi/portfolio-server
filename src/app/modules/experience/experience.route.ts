import { Router } from "express";
import { ExperienceController } from "./experience.conroller";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { CreateExperienceValidationSchema } from "./experience.validation";

const ExperienceRoutes = Router();

ExperienceRoutes.post(
  "/",
  auth(),
  validateRequest(CreateExperienceValidationSchema),
  ExperienceController.createExperience,
);

ExperienceRoutes.patch(
  "/:id",
  auth(),
  validateRequest(CreateExperienceValidationSchema),
  ExperienceController.updateExperience,
);

ExperienceRoutes.delete("/:id", auth(), ExperienceController.deleteExperience);
ExperienceRoutes.get("/", ExperienceController.getAllExperiences);

export default ExperienceRoutes;
