import React from 'react'

const Features = () => {
  return (
    <section className="py-20 bg-white text-center text-black">
        <h2 className="text-4xl font-bold text-black mb-6">Key Features</h2>
        <p className="text-lg text-gray-600 mb-12">Easily track your finances while on an adventure</p>
        <div className="grid md:grid-cols-3 gap-12 px-6">
          <div className="p-6 bg-gray-100 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold mb-4">Budget Tracking</h3>
            <p className="text-gray-600">Set up a budget for your trip, categorize your expenses, and stay on track.</p>
          </div>
          <div className="p-6 bg-gray-100 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold mb-4">Expense Categorization</h3>
            <p className="text-gray-600">Easily categorize your expenses (e.g., food, transport, accommodation) to track where your money goes.</p>
          </div>
          <div className="p-6 bg-gray-100 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold mb-4">Financial Insights</h3>
            <p className="text-gray-600">Receive insights and tips on how to save money during your travels while enjoying your experience.</p>
          </div>
        </div>
      </section>
  )
}

export default Features