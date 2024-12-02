import { createRoot } from "react-dom/client";
import "@/styles/index.css";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import { Provider } from "react-redux";
import { store } from "@/store";
import SignUp from "./pages/auth/SignUp";
import NotFound from "./pages/NotFound";
import SignIn from "./pages/auth/SignIn";
import VerifyEmail from "./pages/auth/VerifyEmail";
import Profile from "./pages/auth/user/Profile";
import PrivateRoute from "./components/routes/Private";
import Dashboard from "./components/Dashboard";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Layout />}>
        <Route path="" element={<Home />} />
        <Route path="sign-up" element={<SignUp />} />
        <Route path="verify-email" element={<VerifyEmail />} />
        <Route path="sign-in" element={<SignIn />} />
        <Route element={<PrivateRoute />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Route>
    </>
  )
);

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
