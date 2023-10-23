const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

const URI = process.env.MONGOURI;

app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB (replace 'your-mongodb-uri' with your actual MongoDB URI)
mongoose.connect(URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

// Define Mongoose Schema for Movies and Seat

const bookingSchema = new mongoose.Schema({
  movieName: String,
  seatType: String,
  selectedSeats: [Number],
  totalAmount: Number,
});

const Booking = mongoose.model('Booking', bookingSchema);

// Define API Routes
const selectedSeatsData = [];

// API to store selected seats
app.post('/api/selected-seats', async (req, res) => {
  const { movieName, seatType, selectedSeats, totalAmount } = req.body;

  try {
    // Create a new booking document
    const booking = new Booking({
      movieName,
      seatType,
      selectedSeats,
      totalAmount,
    });

    // Save the booking to the database
    await booking.save();

    res.json({ message: 'Seats have been successfully stored.' });
  } catch (error) {
    console.error('Error storing seats on the server:', error);
    res.status(500).json({ error: 'Failed to store seats.' });
  }
});
// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
