"use client"
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import InputField from "../components/InputField";
import Button from "../components/Button";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useRegister } from "../hooks";

const PasswordSchema = Yup.object().shape({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  phone: Yup.string().required("Phone is required"),
  password: Yup.string()
    .min(10, "Use at least 10 characters")
    .matches(/^(?=.*[A-Za-z])(?=.*\d).+$/, "Include letters and numbers")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm your password"),
  agreeToTerms: Yup.boolean().oneOf([true], "You must agree to continue"),
});

const CreatePasswordPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("pendingEmail");
    if (!stored) {
      router.replace("/register");
      return;
    }
    setEmail(stored);
  }, [router]);

  const { mutateAsync: registerMutate } = useRegister();

  const handleSubmit = async (values, { setSubmitting, setStatus }) => {
    try {
      const payload = {
        firstName: values.firstName,
        lastName: values.lastName,
        phone: values.phone,
        email,
        password: values.password,
        agreeToTerms: values.agreeToTerms,
      };
      const res = await registerMutate(payload);
      // Persist token if returned and redirect
      if (res?.data?.token) {
        localStorage.setItem("authToken", res.data.token);
      }
      localStorage.removeItem("pendingEmail");
      router.replace("/");
    } catch (error) {
      setStatus(error?.message || error?.error || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="h-full flex justify-center p-4">
      <div className="max-w-3xl w-full rounded-2xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-[#C4CDCA] mb-2">Create password</h1>
          <p className="text-sm text-[#B3BEBA]">
          Use a minimum of 10 characters, including letters, lowercase letters, and numbers.
          </p>
        </div>

        {/* Form */}
        <Formik
          initialValues={{ firstName: "", lastName: "", phone: "", password: "", confirmPassword: "", agreeToTerms: false }}
          validationSchema={PasswordSchema}
          onSubmit={handleSubmit}
        >
          {({ values, handleChange, isSubmitting, status }) => (
            <Form className="space-y-4">
              {/* Personal Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <InputField
                    label="First Name"
                    type="text"
                    name="firstName"
                    placeholder="Enter first name"
                    value={values.firstName}
                    onChange={handleChange}
                  />
                  <ErrorMessage
                    name="firstName"
                    component="div"
                    className="text-red-400 text-sm mt-1"
                  />
                </div>
                <div>
                  <InputField
                    label="Last Name"
                    type="text"
                    name="lastName"
                    placeholder="Enter last name"
                    value={values.lastName}
                    onChange={handleChange}
                  />
                  <ErrorMessage
                    name="lastName"
                    component="div"
                    className="text-red-400 text-sm mt-1"
                  />
                </div>
                <div>
    
                <InputField
                  label="Phone"
                  type="text"
                  name="phone"
                  placeholder="Enter phone number"
                  value={values.phone}
                  onChange={handleChange}
                />
                <ErrorMessage
                  name="phone"
                  component="div"
                  className="text-red-400 text-sm mt-1"
                />
            
              </div>
              </div>
            
              {/* Passwords */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              </div>

              {/* CTA */}
              {status && (
                <div className="text-red-400 text-sm">{status}</div>
              )}
              <div className="flex items-center gap-2 text-sm text-[#B3BEBA]">
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={values.agreeToTerms}
                  onChange={handleChange}
                />
                <span>
                  I agree to the <a href="#" className="text-[#FFD700] hover:text-yellow-300">Terms and Conditions</a> and <a href="#" className="text-[#FFD700] hover:text-yellow-300">Privacy Statement</a>.
                </span>
              </div>
              <Button disabled={isSubmitting} type="submit" className="w-full font-semibold" variant="primary" size="md">
                Create account
              </Button>

              {/* Terms */}
              <p className="text-center text-sm text[#B3BEBA]">
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





