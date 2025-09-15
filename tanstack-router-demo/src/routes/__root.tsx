import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

export const Route = createRootRoute ({
    component : () => (
         <div className="p-2 flex gap-2 text-lg">
      <div className="flex gap-2 border-b">
        <Link to="/" className="[&.active]:font-bold">
          Home
        </Link>
        <Link to="/about" className="[&.active]:font-bold">
          About
        </Link>
        <Link to="/blog" className="[&.active]:font-bold">
          Blog
        </Link>
        <Link to="/settings" className="[&.active]:font-bold">
          Settings
        </Link>
        <Link to="/dashboard" className="[&.active]:font-bold">
          Dashboard
        </Link>
      </div>
      <hr />
      <Outlet />
      <TanStackRouterDevtools />
    </div>
    ),
})