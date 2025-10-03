"use client";

import Image from "next/image";
import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useAuth } from "../../../../contexts/AuthContext";
import { useLogin } from "../../../../hooks/useAuth";
import { useRouter } from "next/navigation";
import ClientOnly from "../../../../components/ClientOnly";
import bgTexture from "../../assets/images/loginTexture.png";
// Validation schema
const validationSchema = Yup.object({
  email: Yup.string()
    .required("Email is required")
    .email("Please enter a valid email address"),
  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters")
    .max(50, "Password must be less than 50 characters"),
  rememberMe: Yup.boolean(),
});

// Initial form values
const initialValues = {
  email: "",
  password: "",
  rememberMe: false,
};

const AdminLogin = () => {
  const { isAuthenticated, login } = useAuth();
  const loginMutation = useLogin();
  const router = useRouter();

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  // Handle form submission
  const handleSubmit = async (
    values,
    { setSubmitting, setFieldError, resetForm, setStatus }
  ) => {
    try {
      const result = await login(values);

      if (result.success) {
        // Login successful, redirect to dashboard
        router.push("/dashboard");
        resetForm();
      } else {
        // Login failed, show error
        const errorMessage = result.error || "Login failed";
        setFieldError("password", errorMessage);
        setStatus({ error: errorMessage });
      }
    } catch (error) {
      console.error("Login error:", error);

      // Handle different types of errors
      let errorMessage = "An unexpected error occurred";

      if (error.response?.data?.error) {
        // Backend error message
        errorMessage = error.response.data.error;
      } else if (error.error) {
        // Direct error property
        errorMessage = error.error;
      } else if (error.message) {
        // Network or other error
        errorMessage = error.message;
      }

      setFieldError("password", errorMessage);
      setStatus({ error: errorMessage });
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <main
      className="w-full h-screen flex relative
     items-center bg-[#F2F6F5] justify-center"
    >
      <div
        className="max-w-[485px] overflow-hidden w-full bg-[#162721] 
        flex flex-col relative z-20 h-fit rounded-4xl "
      >
        <div
          className="w-full h-[85px]  rounded-t-4xl
        bg-gradient-to-b from-[#A3C4C1]/50 flex items-end justify-center via-[#A3C4C1]/20
          to-[#162721]"
        >
          <span className="text-yellow-400 text-4xl font-medium">
            Gobelives
          </span>
        </div>
        <div className="py-8 px-12 flex flex-col items-center">
          <h4 className="font-raleway text-[#C4CDCA] text-2xl font-semibold mb-2">
            Welcome Back
          </h4>
          <p className="text-gray-300 text-sm text-center mb-8">
            Please enter your login details to access your dashboard.
          </p>

          <ClientOnly
            fallback={
              <div className="w-full space-y-3">
                <div className="space-y-2 flex flex-col">
                  <label className="text-[#C4CDCA] text-sm">
                    Email Address
                  </label>
                  <div className="w-full px-4 py-3 bg-white rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400">
                    Loading...
                  </div>
                </div>
                <div className="space-y-2 flex flex-col">
                  <label className="text-[#C4CDCA] text-sm">Password</label>
                  <div className="w-full px-4 py-3 bg-white rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400">
                    Loading...
                  </div>
                </div>
                <div className="w-full bg-yellow-400 text-[#162721] py-3 rounded-lg font-semibold text-center">
                  Loading...
                </div>
              </div>
            }
          >
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched, isSubmitting, status }) => (
                <Form className="w-full space-y-3">
                  {/* Email Field */}
                  <div className="space-y-2 flex flex-col">
                    <label className="text-[#C4CDCA] text-sm">
                      Email Address
                    </label>
                    <Field
                      name="email"
                      type="email"
                      placeholder="Enter Email Address"
                      className={`w-full px-4 py-3 bg-white rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 ${
                        errors.email && touched.email
                          ? "focus:ring-red-400 border-red-400"
                          : "focus:ring-yellow-400"
                      }`}
                    />
                    {errors.email && touched.email && (
                      <div className="text-red-400 text-xs ">
                        {errors.email}
                      </div>
                    )}
                  </div>

                  {/* Password Field */}
                  <div className="space-y-2 flex flex-col">
                    <label className="text-[#C4CDCA] text-sm">Password</label>
                    <Field
                      name="password"
                      type="password"
                      placeholder="Enter Password"
                      className={`w-full px-4 py-3 bg-white rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 ${
                        errors.password && touched.password
                          ? "focus:ring-red-400 border-red-400"
                          : "focus:ring-yellow-400"
                      }`}
                    />
                    {errors.password && touched.password && (
                      <div className="text-red-400 text-xs ">
                        {errors.password}
                      </div>
                    )}
                  </div>

                  {/* Log In Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting || loginMutation.isPending}
                    className="w-full bg-yellow-400 text-[#162721] py-3 rounded-lg font-semibold hover:bg-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting || loginMutation.isPending
                      ? "Logging In..."
                      : "Log In"}
                  </button>

                  {/* Remember Me Checkbox */}
                  <div className="flex items-center gap-2">
                    <Field
                      name="rememberMe"
                      type="checkbox"
                      id="remember"
                      className="w-4 h-4 text-yellow-400 bg-transparent border-gray-400 rounded focus:ring-yellow-400 focus:ring-2"
                    />
                    <label
                      htmlFor="remember"
                      className="text-[#C4CDCA] text-sm"
                    >
                      Remember me
                    </label>
                  </div>

                  {/* Sign In Button */}
                  <button
                    type="button"
                    className="w-full border-2 border-yellow-400 text-yellow-400 py-3 rounded-lg font-semibold hover:bg-yellow-400 hover:text-[#162721] transition-colors"
                  >
                    Sign In
                  </button>
                </Form>
              )}
            </Formik>
          </ClientOnly>
        </div>
      </div>
      <Image
        src={bgTexture}
        alt="logo"
        width={1800}
        height={1800}
        quality={100}
        className="absolute w-full h-full object-cover opacity-10"
      />
    </main>
  );
};

export default AdminLogin;
