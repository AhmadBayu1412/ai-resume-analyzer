import { type RouteConfig, index, route } from "@react-router/dev/routes";

// rout auth agar ketika localhost:5173/auth bisa kebuka
export default [
    index("routes/home.tsx"),
    route('/auth', 'routes/auth.tsx')
    ] satisfies RouteConfig;
