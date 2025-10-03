"use client";
import React from "react";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Check, CreditCard } from "lucide-react";
import Image from "next/image";

// Validation schema
const paymentSchema = Yup.object({
  nameOnCard: Yup.string().required("Name on card is required"),
  cardNumber: Yup.string()
    .matches(/^[0-9]{16}$/, "Must be exactly 16 digits")
    .required("Card number is required"),
  expirationMonth: Yup.string().required("Expiration month is required"),
  expirationYear: Yup.string().required("Expiration year is required"),
  securityCode: Yup.string()
    .matches(/^[0-9]{3,4}$/, "Must be 3 or 4 digits")
    .required("Security code is required"),
  billingZipCode: Yup.string().required("Billing zip code is required"),
  saveCard: Yup.boolean(),
});



export default function PaymentForm({ onSubmit }) {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i);
  const cards = [
    
    {
      name:"MasterCard",
      img:"/images/Cards/MasterCard.png"
    },
    {
      name:"Visa",
      img:"/images/Cards/Visa.png"
    },
    {
      name:"AmericanExp",
      img:"/images/Cards/American.png"
    },
    {
      name:"Discover",
      img:"/images/Cards/Discover.png"
    },
    
  ]

  return (
    <div className="rounded-2xl  overflow-hidden py-5">
  {/* Header */}
  <div className="flex items-center gap-3 bg-[#4D685F] rounded-t-2xl px-6 py-3">
    <CreditCard className="text-white w-6 h-6" />
    <h2 className="text-white font-semibold text-lg">Payment options</h2>
  </div>

  <Formik
    initialValues={{
      paymentMethod: "debit",
      nameOnCard: "",
      cardNumber: "",
      expirationMonth: months[0],
      expirationYear: years[0],
      securityCode: "",
      billingZipCode: "",
      saveCard: false,
    }}
    validationSchema={paymentSchema}
    onSubmit={onSubmit}
  >
    {({ values, setFieldValue, handleSubmit }) => (
      <div className="bg-black bg-opacity-80 rounded-b-2xl p-6 space-y-6">
        {/* Tabs */}
        <div className="flex gap-6 border-b border-gray-700 pb-2">
          {[
            { key: "debit", label: "Debit/Credit Card" },
            { key: "paypal", label: "Paypal" },
            { key: "bank", label: "Bank transfer" },
          ].map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => setFieldValue("paymentMethod", key)}
              className={`pb-1 text-sm font-medium ${
                values.paymentMethod === key
                  ? "border-b-2 border-[#FFDD1A] text-white"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Card logos */}
        {values.paymentMethod === "debit" && (
          <div className="flex gap-2">
            {cards.map((card, index) => (
              <div
                key={index}
                className={`h-[40px] w-[60px] flex items-center justify-center rounded-md p-1 ${
                  card.name === "Visa"
                    ? "bg-[#1A1A1A]"
                    : card.name === "AmericanExp"
                    ? "bg-[#016FD0]"
                    : "bg-[#1A1A1A]"
                }`}
              >
                <Image
                  src={card.img}
                  alt={card.name}
                  height={30}
                  width={50}
                  className="object-contain"
                />
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-2 gap-6">
          {/* Name on Card */}
          <div className="col-span-2">
            <label className="block text-gray-300 text-sm mb-2">
              Name on the Card
            </label>
            <div className="relative">
              <Field
                name="nameOnCard"
                placeholder="Julis"
                className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <Check className="absolute right-3 top-3 text-teal-500 w-5 h-5" />
            </div>
            <ErrorMessage
              name="nameOnCard"
              component="div"
              className="text-red-400 text-xs mt-1"
            />
          </div>

          {/* Card Number */}
          <div className="col-span-2">
            <label className="block text-gray-300 text-sm mb-2">
              Debit/Credit card number
            </label>
            <div className="relative">
              <Field
                name="cardNumber"
                placeholder="9923464374822293"
                maxLength="16"
                className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <Check className="absolute right-3 top-3 text-teal-500 w-5 h-5" />
            </div>
            <ErrorMessage
              name="cardNumber"
              component="div"
              className="text-red-400 text-xs mt-1"
            />
          </div>

          {/* Expiration Date */}
          <div className="col-span-1">
            <label className="block text-gray-300 text-sm mb-2">
              Expiration Date
            </label>
            <div className="flex gap-2">
              <Field
                as="select"
                name="expirationMonth"
                className="flex-1 bg-gray-800 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                {months.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </Field>
              <Field
                as="select"
                name="expirationYear"
                className="flex-1 bg-gray-800 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </Field>
            </div>
          </div>

          {/* Security Code */}
          <div>
            <label className="block text-gray-300 text-sm mb-2">
              Security Code
            </label>
            <Field
              name="securityCode"
              placeholder="1214"
              maxLength="4"
              className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Billing Zip Code */}
          <div>
            <label className="block text-gray-300 text-sm mb-2">
              Billing Zip Code
            </label>
            <Field
              name="billingZipCode"
              placeholder="1214"
              className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>

        {/* Save card */}
        <label className="flex items-center gap-2 cursor-pointer">
          <Field
            type="checkbox"
            name="saveCard"
            className="w-5 h-5 rounded border-gray-600 text-[#FFDD1A] focus:ring-[#FFDD1A]"
          />
          <span className="text-gray-300 text-sm">Save Card</span>
        </label>
      </div>
    )}
  </Formik>
</div>

  );
}
