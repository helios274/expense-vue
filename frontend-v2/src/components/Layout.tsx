import { Outlet } from "react-router-dom";
import "@/styles/index.css";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Toaster } from "react-hot-toast";
import { RootState } from "@/store";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
// import { refreshAccessToken } from "@/store/slices/authSlice";

const Layout: React.FC = () => {
  const theme = useAppSelector((state: RootState) => state.theme.theme);
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  // const { status } = useAppSelector((state) => state.auth);

  // useEffect(() => {
  //   const initializeAuth = async () => {
  //     await dispatch(refreshAccessToken());
  //     setLoading(false);
  //   };
  //   initializeAuth();
  // }, [dispatch]);

  // if (loading) {
  //   return <div>Loading...</div>; // Show a loading indicator while refreshing
  // }

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
