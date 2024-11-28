import React, { useState, useEffect } from 'react';

const SeatSelection = ({ seatLayout, onSelectSeats }) => {
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);

  useEffect(() => {
    if (seatLayout && seatLayout.rows && seatLayout.columns) {
      initializeSeats(seatLayout);
    } else {
      console.error('Invalid seat layout received:', seatLayout);
    }
  }, [seatLayout]);

  // Initialize seats from the fetched layout
  const initializeSeats = (seatLayout) => {
    const rows = seatLayout.rows || 8; // Default to 8 rows if not provided
    const cols = seatLayout.columns || 8; // Default to 8 columns if not provided
    let seatArray = [];
    for (let row = 0; row < rows; row++) {
      let rowSeats = [];
      for (let col = 0; col < cols; col++) {
        rowSeats.push({
          seatId: `${String.fromCharCode(65 + row)}${col + 1}`, // Row A, B, C, ...
          isBooked: false, // Assume all seats are available initially
          isSelected: false,
          isAvailable: true, // can be controlled based on bookings
        });
      }
      seatArray.push(rowSeats);
    }
    setSeats(seatArray);
  };

  const handleSeatSelection = (rowIndex, colIndex) => {
    const newSeats = [...seats];
    const selectedSeat = newSeats[rowIndex][colIndex];
    if (selectedSeat.isAvailable && !selectedSeat.isBooked) {
      selectedSeat.isSelected = !selectedSeat.isSelected;
      setSelectedSeats(prevState => {
        if (selectedSeat.isSelected) {
          return [...prevState, selectedSeat.seatId];
        } else {
          return prevState.filter(seat => seat !== selectedSeat.seatId);
        }
      });
    }
    setSeats(newSeats);
    onSelectSeats(selectedSeats);
  };

  return (
    <div className="mb-6">
      <h3 className="text-2xl font-semibold text-gray-700">Select Seats</h3>
      <h5 className="text-center border bg-slate-200">Screen this way</h5>
      <div className="mt-12">
        {/* Dynamic Seat Layout */}
        {seats.length > 0 ? (
          seats.map((row, rowIndex) => (
            <div key={rowIndex} className="flex justify-center space-x-2 mb-4">
              {row.map((seat, colIndex) => (
                <button
                  key={seat.seatId}
                  onClick={() => handleSeatSelection(rowIndex, colIndex)}
                  className={`w-12 h-12 flex justify-center items-center rounded-md font-semibold transition duration-300
                    ${seat.isBooked
                      ? 'bg-gray-500 cursor-not-allowed'
                      : seat.isSelected
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-300 hover:bg-indigo-500 text-gray-800'}`}
                  disabled={seat.isBooked}
                >
                  {seat.seatId}
                </button>
              ))}
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500">No seats available</div>
        )}
      </div>
    </div>
  );
};

export default SeatSelection;
