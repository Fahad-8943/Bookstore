import React, { useContext, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as Yup from "yup";
import { useFormik } from "formik";
import { googleLoginAPI, loginAPI, registerAPI } from "../services/allApi";
import { faUser, faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { routerContext } from "../context/RouterGuardContext";

const getApiErrorMessage = (result, fallback) => {
  const data = result.response?.data;
  if (typeof data === "string") return data;
  if (typeof data?.message === "string") return data.message;
  return result.message || fallback;
};

function Auth({ register }) {
  const { setAuthorizedUser, setRole } = useContext(routerContext);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      username: "demo",
      email: "",
      password: "",
    },

    validationSchema: Yup.object({
      username: Yup.string()
        .min(3, "Must be at least 3 characters")
        .required("Required"),

      email: Yup.string().email("Invalid email address").required("Required"),

      password: Yup.string()
        .min(3, "Must be at least 3 characters")
        .required("Required"),
    }),

    onSubmit: (values, { resetForm }) => {
      if (register) {
        console.log("register api");

        handleRegister(values);
      } else {
        console.log("login api call");
        handleLogin(values);
      }
      resetForm();
    },
  });

  const handleRegister = async (userData) => {
    const result = await registerAPI(userData);
    if (result.status === 200) {
      toast.success("Registration successful. Please log in.");
      navigate("/login");
    } else {
      toast.error(
        getApiErrorMessage(result, "Registration failed. Please try again."),
      );
    }
  };
  const handleLogin = async (userData) => {
    const result = await loginAPI(userData);
    if (result.status === 200) {
      toast.success("Login successful.");
      sessionStorage.setItem("user", JSON.stringify(result.data.user));
      sessionStorage.setItem("token", result.data.token);
      setAuthorizedUser(true);

      window.dispatchEvent(new Event("auth-change"));
      if (result.data.user.role === "admin") {
        navigate("/admin-dashboard");
        setRole("admin");
      } else {
        navigate("/");
        setRole("user");
      }
    } else {
      toast.error(
        getApiErrorMessage(result, "Login failed. Please try again."),
      );
    }
  };
  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const { name, email, picture } = jwtDecode(credentialResponse.credential);
      const result = await googleLoginAPI({
        username: name,
        email,
        password: "googlepassword",
        picture,
      });

      if (result.status !== 200 || !result.data?.user || !result.data?.token) {
        toast.error(
          getApiErrorMessage(result, "Google login failed. Please try again."),
        );
        return;
      }

      toast.success("Login successful.");
      sessionStorage.setItem("user", JSON.stringify(result.data.user));
      sessionStorage.setItem("token", result.data.token);
      setAuthorizedUser(true);
      setRole(result.data.user.role);

      window.dispatchEvent(new Event("auth-change"));
      navigate(result.data.user.role === "admin" ? "/admin-dashboard" : "/");
    } catch {
      toast.error("Google login failed. Please try again.");
    }
  };

  return (
    <>
      <div className="min-h-screen w-full bg-cover bg-center bg-[url('./assets/background.jpg')]">
        <div className="p-10">
          {/* Logo / Title */}
          <h1 className="text-center text-4xl font-bold text-white">
            Book Store
          </h1>

          {/* Auth Card */}
          <div className="mx-auto mt-10 w-full max-w-md rounded-lg bg-black/80 p-8 text-white">
            {/* User Icon */}
            <div className="flex justify-center">
              <FontAwesomeIcon
                icon={faUser}
                className="rounded-full border-2 border-white p-4 text-4xl"
              />
            </div>
            {/* Heading */}
            <h2 className="mt-6 text-center text-3xl font-bold">
              {register ? "Create Account" : "Welcome Back"}
            </h2>
            <p className="mt-2 text-center text-gray-300">
              {register ? "Register to continue" : "Login to your account"}
            </p>
            {/* Form */}
            <form className="mt-8" onSubmit={formik.handleSubmit}>
              {/* Name - Register Only */}
              {register && (
                <div className="mb-4">
                  <label className="mb-2 block">User Name</label>

                  <input
                    type="text"
                    placeholder="Enter your name"
                    className="w-full rounded-md border border-gray-500 bg-white p-3 text-black outline-none focus:border-blue-500"
                    onChange={formik.handleChange}
                    value={formik.values.username}
                    name="username"
                  />
                  <div className="text-yellow-400">
                    {formik.errors.username}
                  </div>
                </div>
              )}

              {/* Email */}
              <div className="mb-4">
                <label className="mb-2 block">Email</label>

                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full rounded-md border border-gray-500 bg-white p-3 text-black outline-none focus:border-blue-500"
                  onChange={formik.handleChange}
                  value={formik.values.email}
                  name="email"
                />
                <div className="text-yellow-400">{formik.errors.email}</div>
              </div>

              {/* Password */}
              <div className="mb-4">
                <label className="mb-2 block">Password</label>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="w-full rounded-md border border-gray-500 bg-white p-3 pr-12 text-black outline-none focus:border-blue-500"
                    onChange={formik.handleChange}
                    value={formik.values.password}
                    name="password"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
                  >
                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                  </button>
                </div>
                <div className="text-yellow-400">{formik.errors.password}</div>
              </div>

              {/* Confirm Password - Register Only */}
              {register && (
                <div className="mb-4">
                  <label className="mb-2 block">Confirm Password</label>

                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      className="w-full rounded-md border border-gray-500 bg-white p-3 pr-12 text-black outline-none focus:border-blue-500"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
                    >
                      <FontAwesomeIcon
                        icon={showConfirmPassword ? faEyeSlash : faEye}
                      />
                    </button>
                  </div>
                </div>
              )}

              {/* Warning - Register Only */}
              {register && (
                <p className="mt-2 text-center text-yellow-500">
                  * Never share your password with others
                </p>
              )}

              {/* Forgot Password - Login Only */}
              {!register && (
                <div className="mb-4 text-right">
                  <a href="#" className="text-sm text-blue-400 hover:underline">
                    Forgot Password?
                  </a>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="mt-4 w-full rounded-md bg-blue-700 p-3 font-semibold hover:bg-blue-800"
              >
                {register ? "Register" : "Login"}
              </button>
            </form>
            {/* OR Divider */}{" "}
            <div className="my-6 flex items-center">
              {" "}
              <div className="h-px flex-1 bg-gray-500"></div>{" "}
              <span className="px-4 text-sm text-gray-400"> OR </span>{" "}
              <div className="h-px flex-1 bg-gray-500"></div>{" "}
            </div>{" "}
            {/* Google Button */}{" "}
            <div className="flex w-full justify-center [&>div]:w-full [&_iframe]:max-w-full">
              <GoogleLogin
                onSuccess={(credentialResponse) => {
                  console.log(credentialResponse);
                  handleGoogleLogin(credentialResponse);
                }}
                onError={() => {
                  console.log("Login Failed");
                }}
                useOneTap
                theme="filled_black"
                shape="rectangular"
                size="large"
                text="continue_with"
                width="320"
              />
            </div>
            {/* Switch Login / Register */}
            <p className="mt-6 text-center text-gray-300">
              {register ? (
                <>
                  Already have an account?{" "}
                  <a href="/login" className="text-blue-400 hover:underline">
                    Login
                  </a>
                </>
              ) : (
                <>
                  Don't have an account?{" "}
                  <a href="/signup" className="text-blue-400 hover:underline">
                    Register
                  </a>
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Auth;
