import { Router } from "express";
import AuthRoutes from "../modules/auth/auth.route";

const router = Router();
const routes = [
  {
    path: "/auth",
    destination: AuthRoutes,
  },
];

routes.forEach((route) => router.use(route.path, route.destination));
export default router;
