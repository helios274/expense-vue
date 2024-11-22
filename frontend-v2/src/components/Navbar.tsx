import { Button } from "@/components/ui/button";
import { ModeToggle } from "./ThemeToggler";

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-background text-foreground shadow-md">
      {/* Logo */}
      <div className="text-2xl font-bold tracking-wide">
        <a href="/" className="hover:text-primary">
          ExpenseVue
        </a>
      </div>

      {/* Links */}
      <div className="hidden md:flex space-x-6">
        <a href="#features" className="hover:text-primary transition-colors">
          Features
        </a>
        <a href="#pricing" className="hover:text-primary transition-colors">
          Pricing
        </a>
        <a href="#about" className="hover:text-primary transition-colors">
          About
        </a>
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-4">
        <Button variant="outline" className="hidden md:inline-block">
          Sign In
        </Button>
        <Button
          variant="default"
          className="bg-primary text-primary-foreground"
        >
          Sign Up
        </Button>
        <ModeToggle />
      </div>
    </nav>
  );
};

export default Navbar;
