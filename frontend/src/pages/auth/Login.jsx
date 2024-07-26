import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../store/slices/authSlice";
import { toast } from "react-toastify";
import axios from "../../utils/axios";
import handleErrors from "../../utils/errors";

import Button from "../../components/Button";
import InputBox from "../../components/InputBox";
import AuthCard from "../../components/cards/AuthCard";
import PasswordBox from "../../components/PasswordBox";

const Login = () => {
  const { accessToken } = useSelector((state) => state.auth);
  const [btnText, setBtnTxt] = useState("Login");
  const [spinner, setSpinner] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const loginHandler = async (data) => {
    setBtnTxt("Logging in");
    setSpinner(true);

    try {
      const response = await axios.post("/api/auth/login/", data);
      dispatch(
        login({
          user: response.data.user,
          accessToken: response.data.tokens.access,
          refreshToken: response.data.tokens.refresh,
        })
      );
      toast.success("User logged in successfully");
      navigate("/dashboard");
    } catch (error) {
      handleErrors(error);
    } finally {
      setBtnTxt("Login");
      setSpinner(false);
    }
  };

  if (accessToken) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex justify-center">
      <AuthCard title="Login" cardClass="shadow-lg">
        <div className="dark:text-primary">
          <div>Test credentials:</div>
          <div>
            email: <span className="font-medium">test1@mail.com</span>
          </div>
          <div>
            password: <span className="font-medium">test123</span>
          </div>
        </div>
        <form onSubmit={handleSubmit(loginHandler)} className="flex flex-col">
          <InputBox
            label="Email"
            type="email"
            {...register("email", { required: true })}
          />
          {errors.email && (
            <p className="field-error-msg">This field is required</p>
          )}
          <PasswordBox
            label="Password"
            {...register("password", { required: true })}
          />
          {errors.password && (
            <p className="field-error-msg">This field is required</p>
          )}
          <Button
            children={btnText}
            type="submit"
            className="btn-primary-outline mt-4"
            spin={spinner}
          />
        </form>
      </AuthCard>
    </div>
  );
};

export default Login;
