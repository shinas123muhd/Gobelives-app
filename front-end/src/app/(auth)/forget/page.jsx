"use client"
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import InputField from "../components/InputField";
import Button from "../components/Button";

const ForgotSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email address").required("Email is required"),
});

const ForgotPasswordPage = () => {
  const handleSubmit = (values) => {
    // TODO: integrate with API to send reset link
    console.log("Send reset link to:", values.email);
  };

  return (
    <div className="h-full  bg-[#2E4346] flex justify-center p-4">
      <div className="max-w-sm w-full rounded-2xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-[#C4CDCA] mb-2">Forgot your password?</h1>
          <p className="text-sm text-[#B3BEBA]">
            We’ll send you a link to reset it. Enter your email address.
          </p>
        </div>

        {/* Form */}
        <Formik initialValues={{ email: "" }} validationSchema={ForgotSchema} onSubmit={handleSubmit}>
          {({ values, handleChange }) => (
            <Form className="space-y-4">
              {/* Email */}
              <div>
                <InputField
                  label="Email"
                  type="email"
                  name="email"
                  placeholder="user1234@gmail.com"
                  value={values.email}
                  onChange={handleChange}
                />
                <ErrorMessage name="email" component="div" className="text-red-400 text-sm mt-1" />
              </div>

              <Button type="submit" className="w-full font-semibold" variant="primary" size="md">
                Send reset Link
              </Button>

              <p className="text-center text-sm text-[#B3BEBA]">
                By creating an account, you agree with our {" "}
                <a href="#" className="text-[#FFD700] hover:text-yellow-300">Terms and Conditions</a>
                {" "} and {" "}
                <a href="#" className="text-[#FFD700] hover:text-yellow-300">Privacy Statement</a>.
              </p>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;


