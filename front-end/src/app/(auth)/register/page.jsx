"use client"
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import InputField from "../components/InputField";
import Button from "../components/Button";
import { FaGoogle, FaFacebookF } from "react-icons/fa";
import Image from "next/image";

const RegisterSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
});

const RegisterPage = () => {
  const handleRegister = (values) => {
    console.log("Continue with email:", values.email);
  };

  const handleGoogleRegister = () => {
    console.log("Google register attempted");
  };

  const handleFacebookRegister = () => {
    console.log("Facebook register attempted");
  };

  return (
    <div className="h-full flex  justify-center p-4  font-sfpro">
      <div className="max-w-sm w-full  rounded-2xl p-8 ">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-[#C4CDCA] mb-2 ">
           Register
          </h1>
          
        </div>

        {/* Formik Form */}
        <Formik
          initialValues={{ email: "" }}
          validationSchema={RegisterSchema}
          onSubmit={handleRegister}
        >
          {({ values, handleChange }) => (
            <Form className="space-y-4">
              {/* Email Field */}
              <div>
                <InputField
                    label="Email Address"
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={values.email}
                  onChange={handleChange}
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-400 text-sm mt-1"
                />
              </div>

              {/* Continue with Email */}
              <Button
                type="submit"
                className="w-full font-semibold"
                variant="primary"
                size="md"
              >
                Continue with Email
              </Button>
              <div className="relative ">
                <hr />
                <p className="absolute -translate-y-1/2 top-1/2 -translate-x-1/2 left-1/2 bg-[#2B3D4C] text-[#91A19C] px-4 text-sm whitespace-nowrap">or use one of these options</p>
              </div>

              {/* Social Buttons */}
              <div className="flex space-x-3 mt-6">
                <button
                  type="button"
                   className="flex-1 bg-white rounded-full py-3  hover:bg-gray-50 text-gray-700 flex items-center justify-center gap-2 border-none"
                  onClick={handleGoogleRegister}
                >
                  <Image src={"/images/GoogleLogo.png"} alt="googlelogin" height={24} width={24} className="h-6 w-6"/>
                  
                </button>

                <button
                  type="button"
                  className="flex-1 bg-[#1877F2] hover:bg-blue-700 rounded-full py-3 text-white flex items-center justify-center gap-2 border-none"
                  onClick={handleFacebookRegister}
                >
                  <Image src={"/images/FacebookLogo.png"} alt="facebooklogin" height={24} width={24} className="h-6 w-6"/>
                  
                </button>
              </div>

              {/* Already have account */}
              <p className="text-center text-sm text-[#B3BEBA] mt-6">
                Already have an account?{" "}
                <button
                  type="button"
                  className="text-[#FFD700] hover:text-yellow-300 font-medium transition-colors"
                >
                  Sign in
                </button>
              </p>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default RegisterPage;
