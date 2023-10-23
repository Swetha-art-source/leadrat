import React, { useState } from 'react';
import './style.css'
import clsx from 'clsx';
import Axios from 'axios';

const seatsData = {
  Standard: Array.from({ length: 8 * 8 }, (_, i) => i),
  Premium: Array.from({ length: 8 * 2 }, (_, i) => i + 64), // Premium seats start at 64
}


const movies = [
  {
    id: 1,
    name: 'Avenger',
    price: {
      Standard: 100,
      Premium: 150,
    },
    occupied: {
      Standard: [20, 21, 30, 1, 2, 8],
      Premium: [65, 66, 67, 71, 72],
    },
  },
  {
    id: 2,
    name: 'Joker',
    price: {
      Standard: 120,
      Premium: 170,
    },
    occupied: {
      Standard: [9, 41, 35, 11, 65, 26],
      Premium: [65, 66, 67, 71, 72],
    },
  },
  {
    id: 3,
    name: 'Toy story',
    price: {
      Standard: 80,
      Premium: 130,
    },
    occupied: {
      Standard: [37, 25, 44, 13, 2, 3],
      Premium: [65, 66, 67, 71, 72],
    },
  },
  {
    id: 4,
    name: 'the lion king',
    price: {
      Standard: 90,
      Premium: 140,
    },
    occupied: {
      Standard: [10, 12, 50, 33, 28, 47],
      Premium: [65, 66, 67, 71, 72],
    },
  },
]

export default function App() {
  const [selectedMovie, setSelectedMovie] = useState(movies[0])
  const [selectedSeats, setSelectedSeats] = useState([])
  const [selectedSeatType, setSelectedSeatType] = useState('Standard')
  const [numSeats, setNumSeats] = useState(1)

  const handleSeatTypeChange = (type) => {
    setSelectedSeatType(type);
    setSelectedSeats([]);
  }

  const handleNumSeatsChange = (num) => {
    setNumSeats(num);
    setSelectedSeats([]);
  }

  const handleProceed = () => {
    const totalAmount = selectedSeats.length * selectedMovie.price[selectedSeatType];

  // Prepare data to be sent to the backend
  const data = {
    movieName: selectedMovie.name,
    seatType: selectedSeatType,
    selectedSeats,
    totalAmount,
  };

  // Make a POST request to store selected seats on the server
  Axios.post('http://localhost:5000/api/selected-seats', data)
    .then((response) => {
      console.log('Seats have been stored on the server.');
      // Clear selected seats and perform any other necessary actions
      setSelectedSeats([]);
    })
    .catch((error) => {
      console.error('Error storing seats on the server:', error);
    });
  }


  return (
    <div className="App">
      <Movies
        movie={selectedMovie}
        onChange={movie => {
          setSelectedSeats([])
          setSelectedMovie(movie);
          setSelectedSeatType('Standard');
        }}
      />
      <ShowCase />
      <SeatOptions
        selectedSeatType={selectedSeatType}
        onSeatTypeChange={handleSeatTypeChange}
        numSeats={numSeats}
        onNumSeatsChange={handleNumSeatsChange}
        selectedSeats={selectedSeats}
      />
      <Cinema
        movie={selectedMovie}
        selectedSeats={selectedSeats}
        onSelectedSeatsChange={selectedSeats => setSelectedSeats(selectedSeats)}
        selectedSeatType={selectedSeatType}
        numSeats={numSeats}
      />


      <p className="info">
        You have selected <span className="count">{selectedSeats.length}</span>{' '}
        seats for the price of{' '}
        <span className="total">
        {selectedSeats.length * selectedMovie.price[selectedSeatType]}₹
        </span>
      </p>

      <button onClick={handleProceed}>PROCEED</button>
    </div>
  )
}

function Movies({ movie, onChange }) {
  return (
    <div className="Movies">
      <label htmlFor="movie">Pick a movie</label>
      <select
        id="movie"
        value={movie.name}
        onChange={e => {
          onChange(movies.find(movie => movie.name === e.target.value))
        }}
      >
        {movies.map(movie => (
          <option key={movie.name} value={movie.name}>
            {movie.name} (₹{movie.price.Standard} Standard / ₹{movie.price.Premium} Premium)
          </option>
        ))}
      </select>
    </div>
  )
}

function ShowCase() {
  return (
    <ul className="ShowCase">
      <li>
        <span className="seat" /> <small>N/A</small>
      </li>
      <li>
        <span className="seat selected" /> <small>Selected</small>
      </li>
      <li>
        <span className="seat occupied" /> <small>Occupied</small>
      </li>
    </ul>
  )
}

function SeatOptions({ selectedSeatType, onSeatTypeChange, numSeats, onNumSeatsChange, selectedSeats }) {
  const selectedSeatsCount = selectedSeats.length;
  return (
    <div className="SeatOptions">
      <label htmlFor="seatType">Select Seat Type</label>
      <select
        id="seatType"
        value={selectedSeatType}
        onChange={e => onSeatTypeChange(e.target.value)}
      >
        <option value="Standard">Standard</option>
        <option value="Premium">Premium</option>
      </select>
      <label htmlFor="numSeats">Select Number of Seats</label>
      <input
        id="numSeats"
        type="number"
        value={selectedSeatsCount}
        onChange={e => onNumSeatsChange(parseInt(e.target.value, 10))}
        min="1"
      />
    </div>
  )
}

function Cinema({ movie, selectedSeats, onSelectedSeatsChange, selectedSeatType, numSeats }) {
  function handleSelectedState(seat) {
   // Check if the seat's type matches the selectedSeatType
   const isStandardSeat = seat < 64;
   if ((selectedSeatType === 'Standard' && isStandardSeat) || (selectedSeatType === 'Premium' && !isStandardSeat)) {
     const isSelected = selectedSeats.includes(seat);
     if (isSelected) {
       onSelectedSeatsChange(selectedSeats.filter(selectedSeat => selectedSeat !== seat));
     } else {
       onSelectedSeatsChange([...selectedSeats, seat]);
     }
   } else {
     alert("Seat type not applicable for your selection");
   }
  }

  const standardSeats = seatsData.Standard;
  const premiumSeats = seatsData.Premium;
  const occupiedStandardSeats = movie.occupied.Standard;
  const occupiedPremiumSeats = movie.occupied.Premium;

  return (
    <div className="Cinema">
      <div className="screen" />

      <div className="seats">
        {[...standardSeats, ...premiumSeats].map(seat => {
          const isSelected = selectedSeats.includes(seat);
          const isOccupied = (selectedSeatType === 'Standard' && occupiedStandardSeats.includes(seat)) ||
            (selectedSeatType === 'Premium' && occupiedPremiumSeats.includes(seat));
          const seatType = seat < 64 ? 'Standard' : 'Premium';

          return (
            <span
              tabIndex="0"
              key={seat}
              className={clsx(
                'seat',
                isSelected && 'selected',
                isOccupied && 'occupied',
                !isOccupied && isSelected && 'unavailable'
              )}
              onClick={isOccupied ? null : () => handleSelectedState(seat)}
              onKeyPress={
                isOccupied
                  ? null
                  : e => {
                    if (e.key === 'Enter') {
                      handleSelectedState(seat);
                    }
                  }
              }
            >
              {seatType === 'Standard' ? 'S' : 'P'}{seat}
            </span>
          );
        })}
      </div>
    </div>

  )
}
