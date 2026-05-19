import { type RouteConfig, index, route } from "@react-router/dev/routes";
// route digunakan untuk menghubungkan antar halaman web
// route auth agar ketika localhost:5173/auth bisa kebuka
// 'route' dipake selain halaman default index
export default [
    index("routes/home.tsx"),
    route('/auth', 'routes/auth.tsx'),
    route('/upload', 'routes/upload.tsx'),
    route('/resume/:id', 'routes/resume.tsx'),
    ] satisfies RouteConfig;
