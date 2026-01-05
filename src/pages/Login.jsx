import React from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthLayout from "@layouts/AuthLayout";
import { InputField, Button } from "@components";
import { loginUser } from "@api/auth";
import { useFormik } from "formik";
import { loginValidationSchema } from "@utils/validation";
import { useAuth } from "@context/AuthContext";
import logo from "../assets/logo.png";
import GoogleLoginButton from "@components/auth/GoogleLoginButton";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const formik = useFormik({
    initialValues: { username: "", password: "" },
    validationSchema: loginValidationSchema,
    validateOnBlur: true,
    validateOnChange: false,

    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        const { token } = await loginUser(values);
        login(token);
        navigate("/home");
      } catch (error) {
        if (error.response?.status === 401) {
          setErrors({ general: "Invalid username or password" });
        } else {
          setErrors({
            general: "Something went wrong. Please try again later.",
          });
        }
      } finally {
        setSubmitting(false);
      }
    },
  });

  const revalidateIfError = async (field) => {
    if (formik.touched[field] && formik.errors[field]) {
      await formik.validateField(field);
    }
  };

  return (
    <AuthLayout>
      <div className="w-full bg-white border border-gray-300 rounded-lg p-8">
        <div className="flex justify-center mb-6">
          <img src={logo} alt="SocialMeet Logo" className="h-12" />
        </div>

        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-3">
          <InputField
            name="username"
            placeholder="Username"
            value={formik.values.username}
            onChange={async (e) => {
              formik.handleChange(e);
              await revalidateIfError("username");
            }}
            onBlur={formik.handleBlur}
            error={formik.touched.username && formik.errors.username}
          />

          <InputField
            name="password"
            type="password"
            placeholder="Password"
            value={formik.values.password}
            onChange={async (e) => {
              formik.handleChange(e);
              await revalidateIfError("password");
            }}
            onBlur={formik.handleBlur}
            error={formik.touched.password && formik.errors.password}
          />

          {formik.errors.general && (
            <p className="text-center text-red-500 text-sm">
              {formik.errors.general}
            </p>
          )}

          <Button
            type="submit"
            disabled={
              formik.isSubmitting ||
              formik.values.username.trim().length === 0 ||
              formik.values.password.length < 6
            }
          >
            {formik.isSubmitting ? "Logging in..." : "Log In"}
          </Button>
        </form>

        <div className="flex items-center justify-center my-4">
          <div className="flex-grow border-t border-gray-300" />
          <span className="px-3 text-gray-500 text-xs font-semibold">OR</span>
          <div className="flex-grow border-t border-gray-300" />
        </div>
        
        <GoogleLoginButton />

      </div>

      <div className="w-full bg-white border border-gray-300 p-4 rounded-lg text-center mt-3">
        <p className="text-sm">
          Don’t have an account?
          <Link to="/register" className="text-blue-500 font-semibold ml-1">
            Sign up
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Login;
