import { Router } from "express";
import AuthRoutes from "../modules/auth/auth.route";
import BlogRoutes from "../modules/blog/blog.route";
import SkillRoutes from "../modules/skill/skill.route";

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
];

routes.forEach((route) => router.use(route.path, route.destination));
export default router;
