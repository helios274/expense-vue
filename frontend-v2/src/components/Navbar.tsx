import React from "react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "./ThemeToggler";
import { Link, NavLink, useLocation } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"; // shadcn components
import { AlignJustify } from "lucide-react";
import { useAppSelector } from "@/store/hooks";

interface MenuItem {
  title: string;
  to: string;
}

const menuItems: MenuItem[] = [
  { title: "Features", to: "/features" },
  { title: "About", to: "/about" },
  { title: "Sign Up", to: "/sign-up" },
  { title: "Sign In", to: "/sign-in" },
];

const privateMenuItems: MenuItem[] = [
  { title: "Expense", to: "/expense" },
  { title: "Income", to: "/income" },
];

const getActiveClass = ({ isActive }: { isActive: boolean }) =>
  isActive
    ? "text-primary font-bold" // Active styles
    : "hover:text-primary transition-colors"; // Default styles

const Navbar: React.FC = () => {
  const location = useLocation();
  const { accessToken } = useAppSelector((state) => state.auth);

  // Function to check if the current path matches the menu item's path
  const isActiveLink = (path: string) => {
    return location.pathname === path;
  };
  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-background text-foreground shadow-md">
      {/* Logo */}
      <div className="text-xl md:text-2xl font-bold tracking-wide">
        <Link to="/" className="text-primary">
          ExpenseVue
        </Link>
      </div>

      {!accessToken ? (
        <>
          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-6">
            {menuItems.slice(0, 2).map((menuItem) => (
              <NavLink
                key={menuItem.title}
                to={menuItem.to}
                className={getActiveClass}
              >
                {menuItem.title}
              </NavLink>
            ))}
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="outline" asChild>
              <Link to="/sign-in">Sign In</Link>
            </Button>
            <Button variant="default" asChild>
              <Link to="/sign-up">Sign Up</Link>
            </Button>
          </div>
        </>
      ) : (
        <div className="hidden md:flex items-center space-x-4">
          {privateMenuItems.map((items) => (
            <NavLink key={items.title} to={items.to} className={getActiveClass}>
              {items.title}
            </NavLink>
          ))}
        </div>
      )}
      <ModeToggle />
      {/* Mobile Menu */}
      <div className="md:hidden flex items-center space-x-2">
        <ModeToggle />
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" aria-label="Open Menu">
              <AlignJustify />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-40 border-0" align="end">
            {menuItems.map((menuItem) => (
              <DropdownMenuItem key={menuItem.title} asChild>
                <NavLink
                  to={menuItem.to}
                  className={`w-full ${
                    isActiveLink(menuItem.to)
                      ? "text-primary font-bold"
                      : "hover:text-primary transition-colors"
                  }`}
                >
                  {menuItem.title}
                </NavLink>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};

export default Navbar;
