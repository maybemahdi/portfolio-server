import { Router } from "express";
import AuthRoutes from "../modules/auth/auth.route";
import BlogRoutes from "../modules/blog/blog.route";
import SkillRoutes from "../modules/skill/skill.route";
import ProjectRoutes from "../modules/project/project.route";
import ExperienceRoutes from "../modules/experience/experience.route";

const router = Router();
const routes = [
  {
    path: "/auth",
    destination: AuthRoutes,
  },
  {
    path: "/blog",
    destination: BlogRoutes,
  },
  {
    path: "/skill",
    destination: SkillRoutes,
  },
  {
    path: "/project",
    destination: ProjectRoutes,
  },
  {
    path: "/experience",
    destination: ExperienceRoutes,
  },
];

routes.forEach((route) => router.use(route.path, route.destination));
export default router;
