import { Router } from "express";
import AuthRoutes from "../modules/auth/auth.route";
import BlogRoutes from "../modules/blog/blog.route";

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
];

routes.forEach((route) => router.use(route.path, route.destination));
export default router;
