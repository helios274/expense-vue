import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "./AppSidebar";
import { Toaster } from "react-hot-toast";
import { RootState } from "@/store";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { ModeToggle } from "./ThemeToggler";
// import { refreshAccessToken } from "@/store/slices/authSlice";

const Layout: React.FC = () => {
  const theme = useAppSelector((state: RootState) => state.theme.theme);
  const { accessToken } = useAppSelector((state) => state.auth);
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
      <Toaster
        toastOptions={{
          style: {
            background: theme === "light" ? "#333" : "#fff",
            color: theme === "light" ? "#fff" : "#333",
          },
        }}
      />

      {accessToken ? (
        <SidebarProvider>
          <AppSidebar />
          <main className="container mx-auto px-4 py-2">
            <div className="flex">
              <SidebarTrigger />
              <ModeToggle btnClass="ml-auto" />
            </div>
            <Outlet />
          </main>
        </SidebarProvider>
      ) : (
        <>
          <Navbar />
          <main className="container mx-auto px-4 py-6">
            <Outlet />
          </main>
          <Footer />
        </>
      )}
    </div>
  );
};

export default Layout;
