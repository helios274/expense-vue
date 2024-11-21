import React from "react";
import { Link, NavLink } from "react-router-dom";
import ThemeToggler from "./ThemeToggler";
import { useSelector, useDispatch } from "react-redux";
import { logout } from ".././store/slices/authSlice";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const { accessToken, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = () => {
    dispatch(logout());
    return navigate("/");
  };
  return (
    <header className={`header`}>
      <div className="flex items-center">
        <Link
          to="/"
          className={`${
            user ? "" : "text-quaternary dark:text-quaternary"
          } nav-brand `}
        >
          ExpenseVue
        </Link>
        <div className="flex items-center ml-auto">
          {accessToken ? (
            <>
              <NavLink to="expenses" className="nav-link">
                Expense
              </NavLink>
              <button className="nav-link" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="login"
                className={`${
                  user ? "" : "bg-quaternary text-primary"
                } nav-link `}
              >
                Login
              </NavLink>
              <NavLink
                to="register"
                className={`${
                  user ? "" : "bg-quaternary text-primary"
                } nav-link `}
              >
                Register
              </NavLink>
            </>
          )}
          <ThemeToggler />
        </div>
      </div>
    </header>
  );
};

export default Header;
