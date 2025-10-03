"use client"
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import InputField from "../components/InputField";
import Button from "../components/Button";
import Image from "next/image";
import { FaGoogle, FaFacebookF } from "react-icons/fa";

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  rememberMe: Yup.boolean(),
});

const LoginPage = () => {
  const handleLogin = (values) => {
    console.log("Login attempted with:", values);
  };

  const handleGoogleLogin = () => {
    console.log("Google login attempted");
  };

  const handleFacebookLogin = () => {
    console.log("Facebook login attempted");
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
        <div className="absolute inset-0">
    <Image
      src="/images/LoginBg.png"
      alt="Background"
      fill
      className="object-cover"
    />
    {/* Overlay to darken / reduce brightness */}
    <div className="absolute inset-0 bg-black/80"></div> {/* Only this overlay affects the background */}
  </div>
      <div className="relative z-10 grid grid-cols-2 min-h-[600px] w-full gap-5">
        {/* Left Side - Luggage Illustration */}
        <div className="flex items-center justify-center p-8 relative">
          <div className="relative z-10 h-[90vh] w-[400px] overflow-hidden rounded-[50%/60%]">
            <Image
              src="/images/LoginBanner.png"
              alt="Login Banner"
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Plane icon */}
          
        </div>

        {/* Right Side - Login Form */}
        <div className="p-8 flex items-center justify-center">
          <div className="max-w-sm w-full">
          
            {/* Header */}
            <div className="text-center mb-8 w-full flex flex-col items-center">
            <div className="h-10 w-20 flex justify-center ">
          <Image
              src="/images/LogoSecond.png"
              alt="Secondary Logo"
              width={80} height={80} quality={100} 
              className="h-full w-full object-cover"
              priority
            />
          </div>
              <h1 className="text-4xl leading-12 font-light  text-[#C4CDCA] mb-2 ">
                Step into your dream <br /> getaway <br /> Make it a reality!
              </h1>
              <p className="text-teal-200"></p>
              <p className="text-base text-[#B3BEBA] mt-2">
                We'll help you plan your dream escape.
              </p>
            </div>

            {/* Formik Form */}
            <Formik
              initialValues= {{ email: "", password: "", rememberMe: false }}
              validationSchema={LoginSchema}
              onSubmit={handleLogin}
            >
              {({ values, handleChange }) => (
                <Form className="space-y-4">
                  {/* Email */}
                  <div>
                    <InputField
                      type="email"
                      name="email"
                      placeholder="user123@gmail.com"
                      value={values.email}
                      onChange={handleChange}
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-red-400 text-sm mt-1"
                    />
                  </div>

                  {/* Password */}
                  <div>
                    <InputField
                      type="password"
                      name="password"
                      placeholder="Password"
                      value={values.password}
                      onChange={handleChange}
                      showPasswordToggle={true}
                    />
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="text-red-400 text-sm mt-1"
                    />
                  </div>

                  {/* Remember me & Forgot password */}
                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center text-white cursor-pointer">
                      <Field
                        type="checkbox"
                        name="rememberMe"
                        className="mr-2 w-4 h-4 text-yellow-400 bg-white border-gray-300 rounded focus:ring-yellow-400"
                      />
                      Remember Me
                    </label>
                    <button
                      type="button"
                      className="text-[#C4CDCA] text-base"
                    >
                      Forgot Password?
                    </button>
                  </div>

                  {/* Login Button */}
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    className="w-full font-semibold"
                  >
                    Login
                  </Button>

                  {/* Sign up link */}
                  <p className="text-center text-sm text-[#C4CDCA]">
                    Don't have an account?{" "}
                    <button
                      type="button"
                      className="text-[#F2EEE2] font-medium "
                    >
                      Sign up!
                    </button>
                  </p>

                  {/* Social Login Buttons */}
                  <div className="flex space-x-3 mt-6">
  {/* Google button */}
  <button
    type="button"
    className="flex-1 bg-white rounded-full py-3  hover:bg-gray-50 text-gray-700 flex items-center justify-center gap-2 border-none"
    onClick={handleGoogleLogin}
  >
    <Image src={"/images/GoogleLogo.png"} alt="googlelogin" height={24} width={24} className="h-6 w-6"/>
  </button>

  {/* Facebook button */}
  <button
    type="button"
    className="flex-1 bg-[#1877F2] hover:bg-blue-700 rounded-full py-3 text-white flex items-center justify-center gap-2 border-none"
    onClick={handleFacebookLogin}
  >
    <Image src={"/images/FacebookLogo.png"} alt="facebooklogin" height={24} width={24} className="h-6 w-6"/>

  </button>
</div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
