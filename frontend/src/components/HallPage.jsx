import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const HallPage = () => {
  const { hallId } = useParams();
  const [hall, setHall] = useState(null);

  useEffect(() => {
    const fetchHallData = async () => {
      const response = await fetch(`http://localhost:5000/api/movies/halls/${hallId}`);
      const data = await response.json();
      setHall(data);
    };

    fetchHallData();
  }, [hallId]);

  if (!hall) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  const generateSeatLayout = () => {
    const seatLayout = [];
    let seatIndex = 0;

    // Create the layout for rows and columns
    for (let row = 0; row < hall.totalRows; row++) {
      const rowSeats = [];
      for (let col = 0; col < hall.totalColumns; col++) {
        rowSeats.push(hall.seats[seatIndex]);
        seatIndex++;
      }
      seatLayout.push(rowSeats);
    }

    return seatLayout;
  };

  const seatLayout = generateSeatLayout();

  const handleSeatSelection = (rowIndex, seatIndex) => {
    const selectedSeat = seatLayout[rowIndex][seatIndex];

    if (!selectedSeat.isAvailable) {
      // Seat is not available
      console.log(`Seat ${selectedSeat.seatId} is not available.`);
      return;
    }

    // If the seat is available, toggle its selection
    selectedSeat.isSelected = !selectedSeat.isSelected;

    // Log the selected seat details (or send them to the server for booking)
    console.log(`Selected seat: ${selectedSeat.seatId} at Row ${rowIndex + 1}, Seat ${seatIndex + 1}`);
  };

  return (
    <div className="hall-detail-container mx-auto p-6 bg-gray-900 rounded-lg shadow-xl pt-[85px]">
      <h1 className="text-4xl font-extrabold text-white text-center mb-4">{hall.movieHallName}</h1>
      <p className="text-xl text-gray-400 text-center mb-6">{hall.address}</p>

      <div className="seats-info bg-gray-800 p-5 rounded-lg shadow-md mb-6">
        <h2 className="text-3xl font-semibold text-gray-200 mb-3">Seats Information</h2>
        <p className="text-lg text-gray-300">Total Seats: <span className="text-yellow-400">{hall.seats.length}</span></p>
        <h5 className="text-white text-center p-1 mt-2 bg-indigo-800 rounded-lg">Screen This Way</h5>

        {/* Table for seat layout */}
        <div className="overflow-x-auto mt-6">
          <table className="min-w-full table-auto text-center text-gray-300">
            <thead>
              <tr className="bg-gray-700">
                <th className="px-4 py-2">Row</th>
                {Array.from({ length: hall.totalColumns }, (_, index) => (
                  <th key={index} className="px-4 py-2">Col {index + 1}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {seatLayout.map((row, rowIndex) => (
                <tr key={rowIndex} className="bg-gray-800">
                  <td className="px-4 py-2 font-semibold text-gray-400">Row {rowIndex + 1}</td>
                  {row.map((seat, seatIndex) => (
                    <td key={seatIndex} className="px-4 py-2">
                      <button
                        className={`px-4 py-2 rounded-md ${
                          seat.isBooked
                            ? 'bg-red-500 cursor-not-allowed'
                            : seat.isSelected
                            ? 'bg-blue-500 hover:bg-blue-600'
                            : seat.isAvailable
                            ? 'bg-green-500 hover:bg-green-600'
                            : 'bg-gray-500 cursor-not-allowed'
                        }`}
                        disabled={seat.isBooked}
                        onClick={() => handleSeatSelection(rowIndex, seatIndex)}
                      >
                        {seat.seatId}
                      </button>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="booking-section bg-gray-700 p-5 rounded-lg shadow-md">
        <h2 className="text-3xl font-semibold text-white mb-4">Book Your Seat</h2>
        <p className="text-gray-300 mb-4">Select your seats and proceed with booking.</p>
        <button className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg shadow-md">
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default HallPage;
