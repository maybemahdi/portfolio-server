import { Router } from "express";
import auth from "../../middlewares/auth";

const SkillRoutes = Router();

SkillRoutes.post("/", auth(), )

export default SkillRoutes;
