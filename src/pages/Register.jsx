import React, { useState } from "react";
import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "@layouts/AuthLayout";
import Logo from "@public/logo.png";
import { InputField, Button } from "@components";
import { registerValidationSchema, debounce } from "@utils";
import { registerUser, checkUsernameAvailable } from "@api/authService";

const Register = () => {
  const navigate = useNavigate();
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(null);

  const formik = useFormik({
    initialValues: {
      email: "",
      fullName: "",
      username: "",
      password: "",
    },
    validationSchema: registerValidationSchema,
    validateOnBlur: true,
    validateOnChange: false,

    onSubmit: async (values, { setSubmitting, setErrors }) => {
      if (isUsernameAvailable === false) return;

      setSubmitting(true);
      try {
        await registerUser(values);
        navigate("/verify-otp", { state: { email: values.email } });
      } catch (error) {
        setErrors({
          general: error.message || "Something went wrong. Please try again.",
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

  // ✅ Revalidate silently ONLY after blur
  const revalidateIfTouched = async (field) => {
    if (formik.touched[field]) {
      await formik.validateField(field);
    }
  };

  // ✅ Username blur logic (availability check)
  const handleUsernameBlur = async () => {
    const username = formik.values.username.trim();
    formik.setFieldValue("username", username);
    formik.setFieldTouched("username", true, false);

    if (!username || username.length < 3) return;

    debouncedCheck(username);
  };

  const debouncedCheck = debounce(async (username) => {
    try {
      const available = await checkUsernameAvailable(username);
      setIsUsernameAvailable(available);

      if (!available) {
        formik.setFieldError("username", "Username is not available");
      }
    } catch {
      setIsUsernameAvailable(null);
    }
  }, 500);

  return (
    <AuthLayout>
      <div className="w-full bg-white border border-gray-300 rounded-lg p-8">
        <div className="flex justify-center mb-6">
          <img src={Logo} alt="SocialMeet Logo" className="h-12" />
        </div>

        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-3">
          {/* Email */}
          <InputField
            name="email"
            placeholder="Email address"
            value={formik.values.email}
            onChange={async (e) => {
              formik.handleChange(e);
              await revalidateIfTouched("email");
            }}
            onBlur={formik.handleBlur}
            error={formik.touched.email && formik.errors.email}
          />

          {/* Full Name */}
          <InputField
            name="fullName"
            placeholder="Full Name"
            value={formik.values.fullName}
            onChange={async (e) => {
              formik.handleChange(e);
              await revalidateIfTouched("fullName");
            }}
            onBlur={formik.handleBlur}
            error={formik.touched.fullName && formik.errors.fullName}
          />

          {/* Username */}
          <InputField
            name="username"
            placeholder="Username"
            value={formik.values.username}
            onChange={async (e) => {
              setIsUsernameAvailable(null);
              formik.handleChange(e);
              await revalidateIfTouched("username");
            }}
            onBlur={handleUsernameBlur}
            error={
              (formik.touched.username && formik.errors.username) ||
              (isUsernameAvailable === false && "Username is not available")
            }
          />

          {/* Password */}
          <InputField
            name="password"
            type="password"
            placeholder="Password"
            value={formik.values.password}
            onChange={async (e) => {
              formik.handleChange(e);
              await revalidateIfTouched("password");
            }}
            onBlur={formik.handleBlur}
            error={formik.touched.password && formik.errors.password}
          />

          {formik.errors.general && (
            <p className="text-center text-red-500 text-sm">
              {formik.errors.general}
            </p>
          )}

          {/* Button */}
          <Button
            type="submit"
            disabled={
              formik.isSubmitting ||
              !formik.values.email ||
              !formik.values.fullName ||
              !formik.values.username ||
              formik.values.password.length < 6 ||
              isUsernameAvailable === false
            }
          >
            {formik.isSubmitting ? "Signing Up..." : "Sign Up"}
          </Button>
        </form>
      </div>

      <div className="w-full bg-white border border-gray-300 p-4 rounded-lg text-center mt-3">
        <p className="text-sm">
          Have an account?
          <Link to="/" className="text-blue-500 font-semibold ml-1">
            Log in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Register;
