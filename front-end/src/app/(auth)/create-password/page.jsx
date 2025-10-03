"use client"
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import InputField from "../components/InputField";
import Button from "../components/Button";

const PasswordSchema = Yup.object().shape({
  password: Yup.string()
    .min(10, "Use at least 10 characters")
    .matches(/^(?=.*[A-Za-z])(?=.*\d).+$/, "Include letters and numbers")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm your password"),
});

const CreatePasswordPage = () => {
  const handleSubmit = (values) => {
    // TODO: integrate with API to finalize account creation
    console.log("Create account with password:", values.password);
  };

  return (
    <div className="h-full flex justify-center p-4">
      <div className="max-w-sm w-full rounded-2xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-[#C4CDCA] mb-2">Create password</h1>
          <p className="text-sm text-[#B3BEBA]">
          Use a minimum of 10 characters, including letters, lowercase letters, and numbers.
          </p>
        </div>

        {/* Form */}
        <Formik
          initialValues={{ password: "", confirmPassword: "" }}
          validationSchema={PasswordSchema}
          onSubmit={handleSubmit}
        >
          {({ values, handleChange }) => (
            <Form className="space-y-4">
              {/* Create Password */}
              <div>
                <InputField
                  label="Create Password"
                  type="password"
                  name="password"
                  placeholder="Enter password"
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

              {/* Confirm Password */}
              <div>
                <InputField
                  label="Confirm Password"
                  type="password"
                  name="confirmPassword"
                  placeholder="Re-enter password"
                  value={values.confirmPassword}
                  onChange={handleChange}
                  showPasswordToggle={true}
                />
                <ErrorMessage
                  name="confirmPassword"
                  component="div"
                  className="text-red-400 text-sm mt-1"
                />
              </div>

              {/* CTA */}
              <Button type="submit" className="w-full font-semibold" variant="primary" size="md">
                Create account
              </Button>

              {/* Terms */}
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

export default CreatePasswordPage;



