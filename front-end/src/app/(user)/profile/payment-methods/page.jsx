"use client"
import React, { useState } from 'react'
import Image from 'next/image'
import { Edit3, CreditCard, Lock } from 'lucide-react'

const PaymentMethodsPage = () => {
  const [activeTab, setActiveTab] = useState('card')

  const savedCards = [
    {
      id: 1,
      type: 'visa',
      number: '******96',
      status: 'Default',
      logo: '/images/Cards/Visa.png'
    },
    {
      id: 2,
      type: 'mastercard',
      number: '******96',
      status: 'Secondary',
      logo: '/images/Cards/MasterCard.png'
    }
  ]

  const paypalAccounts = [
    {
      id: 1,
      email: 'user@example.com',
      status: 'Default'
    }
  ]

  const upiAccounts = [
    {
      id: 1,
      upiId: 'user@paytm',
      status: 'Default'
    },
    {
      id: 2,
      upiId: 'user@phonepe',
      status: 'Secondary'
    }
  ]

  return (
    <div className="text-white bg-[#0B0B0B] min-h-screen rounded-2xl p-6 md:p-8 ">
      <div className="mb-6">
        <p className="text-white/70 mb-2">Paying should be a breeze!</p>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold">Payment Method</h1>
          <div className=" w-8 h-8 bg-[#FFDD1A] flex justify-center items-center rounded-full border-2 border-white">
            <Image src={"/svgs/edit.svg"} alt="edit" width={10} height={10} />
        </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/10 mb-6">
        {[
          { id: 'card', label: 'Card' },
          { id: 'paypal', label: 'PayPal' },
          { id: 'upi', label: 'UPI' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'text-white border-b-2 border-white'
                : 'text-white/60 hover:text-white/80'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Card Tab */}
      {activeTab === 'card' && (
        <div className="space-y-4">
          {savedCards.map((card) => (
            <div
              key={card.id}
              className="bg-[#F2F2F2] w-fit rounded-lg p-4 flex items-center justify-between shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-8 relative">
                  <Image
                    src={card.logo}
                    alt={`${card.type} card`}
                    fill
                    className="object-contain border border-gray-300"
                  />
                </div>
                <div>
                  <p className="text-gray-800 font-medium">{card.number}</p>
                  <p className="text-gray-500 text-sm">{card.status}</p>
                </div>
              </div>
            </div>
          ))}
          
          <button className=" bg-[#F2F2F2] w-fit rounded-lg p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
            <CreditCard className="w-6 h-6 text-gray-600" />
            <span className="text-gray-800 font-medium">Add new</span>
          </button>
        </div>
      )}

      {/* PayPal Tab */}
      {activeTab === 'paypal' && (
        <div className="space-y-4">
          {paypalAccounts.map((account) => (
            <div
              key={account.id}
              className="bg-white rounded-lg p-4 flex items-center justify-between shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center">
                  <span className="text-white font-bold text-xs">PP</span>
                </div>
                <div>
                  <p className="text-gray-800 font-medium">{account.email}</p>
                  <p className="text-gray-500 text-sm">{account.status}</p>
                </div>
              </div>
            </div>
          ))}
          
          <button className="w-full bg-white rounded-lg p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
            <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
              <span className="text-white font-bold text-xs">+</span>
            </div>
            <span className="text-gray-800 font-medium">Add PayPal Account</span>
          </button>
        </div>
      )}

      {/* UPI Tab */}
      {activeTab === 'upi' && (
        <div className="space-y-4">
          {upiAccounts.map((account) => (
            <div
              key={account.id}
              className="bg-white rounded-lg p-4 flex items-center justify-between shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-8 bg-purple-600 rounded flex items-center justify-center">
                  <span className="text-white font-bold text-xs">UPI</span>
                </div>
                <div>
                  <p className="text-gray-800 font-medium">{account.upiId}</p>
                  <p className="text-gray-500 text-sm">{account.status}</p>
                </div>
              </div>
            </div>
          ))}
          
          <button className="w-full bg-white rounded-lg p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
            <div className="w-6 h-6 bg-purple-600 rounded flex items-center justify-center">
              <span className="text-white font-bold text-xs">+</span>
            </div>
            <span className="text-gray-800 font-medium">Add UPI ID</span>
          </button>
        </div>
      )}

      {/* Security Message */}
      <div className="mt-8 flex items-center gap-2 text-white/70 text-sm">
        <Lock className="w-4 h-4" />
        <p>Your card is safe with us. We never store or share your details. All payments are securely encrypted.</p>
      </div>
    </div>
  )
}

export default PaymentMethodsPage


