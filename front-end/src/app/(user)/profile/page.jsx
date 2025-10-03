"use client"
import React from 'react'
import { Formik } from 'formik'
import * as Yup from 'yup'
import ProfileInput from '../components/ProfileInput'
import Button from '../../(auth)/components/Button'
import MainButton from '../components/MainButton'
import { Sparkles } from 'lucide-react'

const personalInfoSchema = Yup.object({
  name: Yup.string().trim().required('Name is required'),
  email: Yup.string().email('Enter a valid email').required('Email is required'),
  phone: Yup.string()
    .trim()
    .matches(/^[+]?\d[\d\s-]{7,}$/i, 'Enter a valid phone number')
    .required('Phone is required'),
  location: Yup.string().trim().required('Location is required')
})

const securitySchema = Yup.object({
  password: Yup.string()
    .min(8, 'Minimum 8 characters')
    .matches(/^(?=.*[A-Za-z])(?=.*\d).+$/, 'Include letters and numbers')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm your password')
})

const ProfileHomePage = () => {
  return (
    <div className="text-white">
      <div className="bg-[#0B0B0B] rounded-2xl p-6 md:p-8">
        <h2 className="text-xl md:text-2xl font-semibold mb-6">Personal Information</h2>

        <Formik
          initialValues={{ name: '', email: '', phone: '', location: '' }}
          validationSchema={personalInfoSchema}
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            try {
              // TODO: integrate save profile API
              console.log('Personal info submit', values)
              await new Promise(r => setTimeout(r, 600))
            } finally {
              setSubmitting(false)
            }
          }}
        >
          {({ values, errors, touched, handleChange, handleSubmit, isSubmitting }) => (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <ProfileInput
                  label="Name"
                  placeholder="Enter your full name"
                  value={values.name}
                  onChange={handleChange('name')}
                />
                {touched.name && errors.name && <p className="text-red-400 text-sm -mt-2 mb-2">{errors.name}</p>}
              </div>

              <div>
                <ProfileInput
                  label="Email Address"
                  type="email"
                  placeholder="you@example.com"
                  value={values.email}
                  onChange={handleChange('email')}
                />
                {touched.email && errors.email && <p className="text-red-400 text-sm -mt-2 mb-2">{errors.email}</p>}
              </div>

              <div>
                <ProfileInput
                  label="Phone"
                  placeholder="+91 9876543210"
                  value={values.phone}
                  onChange={handleChange('phone')}
                />
                {touched.phone && errors.phone && <p className="text-red-400 text-sm -mt-2 mb-2">{errors.phone}</p>}
              </div>

              <div>
                <ProfileInput
                  label="Location"
                  placeholder="Country / City"
                  value={values.location}
                  onChange={handleChange('location')}
                />
                {touched.location && errors.location && <p className="text-red-400 text-sm -mt-2 mb-2">{errors.location}</p>}
              </div>

              <button 
                type='submit'
                className="group bg-black hover:bg-[#FFD700] border border-[#FFD700] text-[#FFD700] hover:text-black font-semibold px-14 py-3 rounded-full transition-all duration-200 flex items-center gap-2 shadow-lg"
                >
                Save
                <Sparkles className="w-5 h-5 text-[#FFD700] group-hover:text-black transition-colors duration-200" />
                </button>
            </form>
          )}
        </Formik>

        <div className="my-8 h-px w-full bg-white/10" />

        <h2 className="text-xl md:text-2xl font-semibold mb-6">Security</h2>

        <Formik
          initialValues={{ password: '', confirmPassword: '' }}
          validationSchema={securitySchema}
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            try {
              // TODO: integrate change password API
              console.log('Security submit', values)
              await new Promise(r => setTimeout(r, 600))
              resetForm()
            } finally {
              setSubmitting(false)
            }
          }}
        >
          {({ values, errors, touched, handleChange, handleSubmit, isSubmitting }) => (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <ProfileInput
                  label="Password"
                  type="password"
                  placeholder="********"
                  value={values.password}
                  onChange={handleChange('password')}
                  showPasswordToggle
                />
                {touched.password && errors.password && <p className="text-red-400 text-sm -mt-2 mb-2">{errors.password}</p>}
              </div>

              <div>
                <ProfileInput
                  label="Confirm Password"
                  type="password"
                  placeholder="********"
                  value={values.confirmPassword}
                  onChange={handleChange('confirmPassword')}
                  showPasswordToggle
                />
                {touched.confirmPassword && errors.confirmPassword && <p className="text-red-400 text-sm -mt-2 mb-2">{errors.confirmPassword}</p>}
              </div>

              <div className="pt-2">
              <button className="relative bg-[#FFDD1A] whitespace-nowrap hover:bg-yellow-500 text-black font-semibold py-2 px-10 rounded-xl ring-2 ring-[#362B0040] ring-inset transition-colors duration-200 flex items-center gap-2 overflow-hidden">
                Next
                <Sparkles className="w-5 h-5 text-black  transition-colors duration-200" />
                </button>
              </div>
            </form>
          )}
        </Formik>
      </div>
    </div>
  )
}

export default ProfileHomePage
