"use client";
import React from "react";
import { Formik, Field, ErrorMessage, Form } from "formik";
import * as Yup from "yup";
import Image from "next/image";

// Validation schema
const bookingSchema = Yup.object({
  firstName: Yup.string().required("First name is required"),
  secondName: Yup.string().required("Second name is required"),
  mobileNumber: Yup.string()
    .matches(/^[0-9]{10}$/, "Must be exactly 10 digits")
    .required("Mobile number is required"),
  countryCode: Yup.string().required("Country code is required"),
  saveDetails: Yup.boolean(),
});

export default function BookingForm({ onSubmit }) {
  return (
    <div className="rounded-2xl shadow-xl">
      <div className="flex items-center gap-3 bg-[#4D685F] rounded-t-2xl px-4 sm:px-6 lg:px-10 py-2 sm:py-3">
        <div className="bg-teal-700 rounded-lg p-1.5 sm:p-2">
          <div className="w-5 h-5 text-white flex items-center justify-center text-sm font-bold">
            1
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 text-[#DFDFDF]">
          <h2 className="font-semibold text-sm sm:text-base">Room 1</h2>
          <p className="text-xs sm:text-sm">
            2 adults, 1 double bed and 1 twin bed, Non smoking
          </p>
        </div>
      </div>

      <Formik
        initialValues={{
          firstName: "",
          secondName: "",
          mobileNumber: "",
          countryCode: "+91",
          saveDetails: false,
        }}
        validationSchema={bookingSchema}
        onSubmit={(values) => {
          onSubmit(values); // pass form data to parent
        }}
      >
        {() => (
          <Form className="bg-black bg-opacity-50 rounded-xl p-4 sm:p-6 space-y-4">
            {/* First & Second Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-300 text-xs sm:text-sm mb-1 sm:mb-2">
                  First name
                </label>
                <Field
                  name="firstName"
                  placeholder=""
                  className="w-full bg-white/24 text-white border border-white/32 rounded-lg px-3 sm:px-4 py-1.5 sm:py-2 focus:outline-none text-xs sm:text-sm"
                />
                <ErrorMessage
                  name="firstName"
                  component="div"
                  className="text-red-400 text-xs mt-1"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-xs sm:text-sm mb-1 sm:mb-2">
                  Last name
                </label>
                <Field
                  name="secondName"
                  placeholder=""
                  className="w-full bg-white/24 text-white border border-white/32 rounded-lg px-3 sm:px-4 py-1.5 sm:py-2 focus:outline-none text-xs sm:text-sm"
                />
                <ErrorMessage
                  name="secondName"
                  component="div"
                  className="text-red-400 text-xs mt-1"
                />
              </div>
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-gray-300 text-xs sm:text-sm mb-1 sm:mb-2">
                Mobile number
              </label>
              <div className="flex  gap-2">
                <Field
                  as="select"
                  name="countryCode"
                  className="bg-gray-800 text-white border border-white/32 rounded-lg px-3 py-1.5 sm:py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 text-xs sm:text-sm"
                >
                  <option value="+61">🇦🇺 +61</option>
                  <option value="+1">🇺🇸 +1</option>
                  <option value="+44">🇬🇧 +44</option>
                  <option value="+91">🇮🇳 +91</option>
                </Field>
                <Field
                  name="mobileNumber"
                  placeholder=""
                  className="w-full bg-white/24 text-white border border-white/32 rounded-lg px-3 sm:px-4 py-1.5 sm:py-2 focus:outline-none text-xs sm:text-sm"
                />
              </div>
              <ErrorMessage
                name="mobileNumber"
                component="div"
                className="text-red-400 text-xs mt-1"
              />
            </div>

            {/* Checkboxes and Submit Button */}
            <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <Field
                    type="checkbox"
                    name="saveDetails"
                    className="w-4 h-4 rounded-md bg-gray-400 border border-gray-600 checked:bg-[#FFDD1A] checked:border-[#FFDD1A] cursor-pointer"
                  />
                  <span className="text-gray-300 text-xs sm:text-sm">Save Details</span>
                </label>
              </div>

              <div className="pt-3 sm:pt-5 flex justify-end">
                <button
                  type="submit"
                  className="relative bg-[#FFDD1A] whitespace-nowrap hover:bg-yellow-500 text-black font-semibold py-1.5 sm:py-2 px-6 sm:px-10 rounded-2xl ring-2 ring-[#362B0040] ring-inset transition-colors duration-200 flex items-center gap-2 overflow-hidden"
                >
                  Next
                  <div>
                    <Image
                      src={"/svgs/ButtonStar.svg"}
                      alt="Star"
                      width={24}
                      height={24}
                      className="w-5 sm:w-6 h-5 sm:h-6"
                    />
                  </div>
                </button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}