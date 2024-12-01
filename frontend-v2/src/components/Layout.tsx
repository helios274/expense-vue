import { Outlet } from "react-router-dom";
import "@/styles/index.css";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

const Layout: React.FC = () => {
  const theme = useSelector((state: RootState) => state.theme.theme);
  console.log(theme);
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="container mx-auto px-4 py-6">
        <Outlet />
        <Toaster
          toastOptions={{
            style: {
              background: theme === "light" ? "#333" : "#fff",
              color: theme === "light" ? "#fff" : "#333",
            },
          }}
        />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
