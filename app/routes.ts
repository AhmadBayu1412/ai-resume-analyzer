import { type RouteConfig, index, route } from "@react-router/dev/routes";

/**
 * React Router configuration defining the application's navigation structure.
 * 
 * This file maps URL paths to their corresponding route components:
 * - index: The default root path ('/').
 * - route: Defines custom paths, supporting parameters (e.g., :id).
 */
export default [
    // Home/Dashboard page
    index("routes/home.tsx"),
    // Authentication page
    route('/auth', 'routes/auth.tsx'),
    // File/Resume upload page
    route('/upload', 'routes/upload.tsx'),
    // Detailed resume view with dynamic ID parameter
    route('/resume/:id', 'routes/resume.tsx'),
    // System utility/cleanup page
    route('/wipe', 'routes/wipe.tsx'),
] satisfies RouteConfig;
