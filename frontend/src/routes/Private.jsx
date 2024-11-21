import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import Spinner from "../components/Spinner";
import axios from ".././utils/axios";

const Private = () => {
  const { accessToken } = useSelector((state) => state.auth);
  const [isAuthenticated, setIsAuthenticated] = useState(
    accessToken ? true : false
  );

  const checkForAuthentication = async () => {
    try {
      const response = await axios.get("/api/auth/profile/");
      if (response.status === 200) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error(error);
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    if (accessToken) {
      checkForAuthentication();
    } else {
      setIsAuthenticated(false);
    }
  }, [accessToken]);

  return isAuthenticated ? <Outlet /> : <Spinner />;
};

export default Private;
