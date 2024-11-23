import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button"; // ShadCN Button
import NotFoundIcon from "@/assets/not-found.svg";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center bg-background text-foreground text-center">
      {/* Illustration or Icon */}
      <img src={NotFoundIcon} alt="404 Not Found" className="w-64 h-64 mb-3" />

      {/* Title and Message */}
      <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
      <p className="text-lg text-muted-foreground mb-6">
        Oops! The page you're looking for doesn't exist or has been moved.
      </p>

      {/* Back to Home Button */}
      <Link to="/">
        <Button
          variant="default"
          className="bg-primary text-primary-foreground px-6 py-3"
        >
          Go to Homepage
        </Button>
      </Link>
    </div>
  );
};

export default NotFound;
