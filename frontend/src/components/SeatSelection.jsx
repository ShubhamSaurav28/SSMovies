import React, { useState } from 'react';
import axios from 'axios';

const SeatSelection = ({ movieId }) => {
  const [selectedSeats, setSelectedSeats] = useState([]);

  const handleSeatClick = (seat) => {
    setSelectedSeats((prev) =>
      prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat]
    );
  };

  // Payment function to initiate Razorpay payment
  const handlePayment = async () => {
    const { data: order } = await axios.post('http://localhost:5000/api/movies/payment', {
      amount: 500, // Example amount
    });

    const options = {
      key: process.env.REACT_APP_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      order_id: order.id,
      handler: (response) => {
        alert('Payment successful!');
      },
      prefill: {
        name: 'John Doe',
        email: 'johndoe@example.com',
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h1 className="text-3xl font-semibold text-center text-indigo-600 mb-6">Select Seats</h1>

        <div className="mb-6">
          <p className="text-lg text-gray-700">Choose your preferred seats:</p>
        </div>

        <div className="grid grid-cols-5 gap-4 mb-6">
          {/* Render seat options here */}
          {['A1', 'A2', 'A3', 'B1', 'B2', 'C1', 'C2', 'C3', 'D1', 'D2'].map((seat) => (
            <div
              key={seat}
              onClick={() => handleSeatClick(seat)}
              className={`p-4 text-center rounded-md cursor-pointer border-2 ${selectedSeats.includes(seat)
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 hover:bg-gray-300'
                }`}
            >
              {seat}
            </div>
          ))}
        </div>

        <button
          onClick={handlePayment}
          className="w-full py-3 bg-indigo-600 text-white text-lg font-semibold rounded-md hover:bg-indigo-700 transition duration-200"
        >
          Proceed to Payment
        </button>
      </div>
    </div>
  );
};

export default SeatSelection;
