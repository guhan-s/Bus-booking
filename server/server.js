// const express = require('express');
// const cors = require('cors');
// const mysql = require('mysql2');
// const path = require('path');
// require('dotenv').config();

// const app = express();
// app.use(cors());
// app.use(express.json());
// app.use(express.static('public')); // Serve static HTML/CSS/JS

// // Create MySQL connection
// const db = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: 'guhanmepco',
//   database: 'vehicle_booking'
// });

// // Connect to the database
// db.connect((err) => {
//   if (err) {
//     console.error('Error connecting to the database:', err);
//   } else {
//     console.log('Connected to the MySQL database');
//   }
// });

// // Register user API
// app.post('/api/register', (req, res) => {
//   const { email, password } = req.body;
  
//   // Check if the user already exists
//   db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
//     if (err) {
//       return res.json({ success: false, message: 'Database error' });
//     }
    
//     if (results.length > 0) {
//       return res.json({ success: false, message: 'User already exists' });
//     }

//     // Insert new user into the database
//     db.query('INSERT INTO users (email, password) VALUES (?, ?)', [email, password], (err) => {
//       if (err) {
//         console.error(err);
//         return res.json({ success: false, message: 'Registration failed' });
//       }
//       res.json({ success: true });
//     });
//   });
// });

// // Login API
// app.post('/api/login', (req, res) => {
//   const { email, password } = req.body;
  
//   db.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password], (err, results) => {
//     if (err) {
//       return res.json({ success: false, message: 'Database error' });
//     }
    
//     if (results.length > 0) {
//       res.json({ success: true, user: results[0] });
//     } else {
//       res.json({ success: false, message: 'Invalid email or password' });
//     }
//   });
// });

// // Get Available Vehicles
// app.get('/api/vehicles', (req, res) => {
//   db.query('SELECT * FROM vehicles WHERE available = 1', (err, results) => {
//     if (err) {
//       return res.json({ success: false, message: 'Database error' });
//     }
//     res.json(results);
//   });
// });

// // Get Booked Seats for a Vehicle and Date
// app.get('/api/booked-seats/:vehicleId/:date', (req, res) => {
//   const { vehicleId, date } = req.params;
//   const formattedDate = date.split('T')[0]; // Extract YYYY-MM-DD

//   db.query(
//     'SELECT seat_numbers FROM bookings WHERE vehicle_id = ? AND DATE(date) = ?',
//     [vehicleId, formattedDate],
//     (err, results) => {
//       if (err) {
//         return res.json({ success: false, message: 'Database error' });
//       }
      
//       const bookedSeats = [];
//       results.forEach(row => {
//         if (row.seat_numbers) {
//           bookedSeats.push(...row.seat_numbers.split(',').map(Number));
//         }
//       });
      
//       res.json({ success: true, bookedSeats });
//     }
//   );
// });

// // Check Existing Booking
// app.get('/api/booking/:userId', (req, res) => {
//   const userId = req.params.userId;
  
//   db.query(`
//     SELECT b.*, v.name AS vehicle_name 
//     FROM bookings b
//     JOIN vehicles v ON b.vehicle_id = v.id
//     WHERE b.user_id = ?
//   `, [userId], (err, results) => {
//     if (err) {
//       return res.json({ success: false, message: 'Database error' });
//     }
    
//     if (results.length > 0) {
//       // Include seat numbers in the response
//       results = results.map(booking => ({
//         ...booking,
//         seat_numbers: booking.seat_numbers ? booking.seat_numbers.split(',').map(Number) : []
//       }));
//       res.json({ success: true, booking: results[0] });
//     } else {
//       res.json({ success: true, booking: null });
//     }
//   });
// });

// // Book a Vehicle
// app.post('/api/booking', (req, res) => {
//   const { userId, vehicleId, date, name, age, noOfPassengers, selectedSeats, additionalDetails } = req.body;

//   // Validate input
//   if (!userId || !vehicleId || !date || !selectedSeats || selectedSeats.length === 0) {
//     return res.json({ success: false, meeting: 'Missing required fields' });
//   }

//   // Check if any selected seats are already booked for the same vehicle and date
//   const formattedDate = date.split(' ')[0]; // Extract YYYY-MM-DD
//   db.query(
//     'SELECT seat_numbers FROM bookings WHERE vehicle_id = ? AND DATE(date) = ?',
//     [vehicleId, formattedDate],
//     (err, results) => {
//       if (err) {
//         return res.json({ success: false, message: 'Database error' });
//       }

//       const bookedSeats = [];
//       results.forEach(row => {
//         if (row.seat_numbers) {
//           bookedSeats.push(...row.seat_numbers.split(',').map(Number));
//         }
//       });

//       const alreadyBooked = selectedSeats.filter(seat => bookedSeats.includes(seat));
//       if (alreadyBooked.length > 0) {
//         return res.json({
//           success: false,
//           message: `Seats ${alreadyBooked.join(', ')} are already booked for this date.`
//         });
//       }

//       // Insert booking into the bookings table
//       const seatNumbersString = selectedSeats.join(',');
//       db.query(
//         'INSERT INTO bookings (user_id, vehicle_id, date, seat_numbers, name, age, no_of_passengers, additional_details) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
//         [userId, vehicleId, date, seatNumbersString, name, age, noOfPassengers, additionalDetails],
//         (err) => {
//           if (err) {
//             console.error(err);
//             return res.json({ success: false, message: 'Booking failed' });
//           }

//           // Mark vehicle as unavailable (optional, depending on requirements)
//           db.query('UPDATE vehicles SET available = 0 WHERE id = ?', [vehicleId], (err) => {
//             if (err) {
//               return res.json({ success: false, message: 'Unable to update vehicle availability' });
//             }
//             res.json({ success: true });
//           });
//         }
//       );
//     }
//   );
// });

// // Start the server
// app.listen(5000, () => {
//   console.log('Server running on http://localhost:5000/login.html');
// });

const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public')); 


const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'guhanmepco',
  database: 'vehicle_booking'
});


db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
  } else {
    console.log('Connected to the MySQL database');
  }
});

app.post('/api/register', (req, res) => {
  const { email, password } = req.body;
  

  db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (err) {
      return res.json({ success: false, message: 'Database error' });
    }
    
    if (results.length > 0) {
      return res.json({ success: false, message: 'User already exists' });
    }

    // Insert new user into the database
    db.query('INSERT INTO users (email, password) VALUES (?, ?)', [email, password], (err) => {
      if (err) {
        console.error(err);
        return res.json({ success: false, message: 'Registration failed' });
      }
      res.json({ success: true });
    });
  });
});

// Login API
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  
  db.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password], (err, results) => {
    if (err) {
      return res.json({ success: false, message: 'Database error' });
    }
    
    if (results.length > 0) {
      res.json({ success: true, user: results[0] });
    } else {
      res.json({ success: false, message: 'Invalid email or password' });
    }
  });
});

// Get Available Vehicles
app.get('/api/vehicles', (req, res) => {
  db.query('SELECT * FROM vehicles WHERE available = 1', (err, results) => {
    if (err) {
      return res.json({ success: false, message: 'Database error' });
    }
    res.json(results);
  });
});

// Get Booked Seats for a Vehicle, Date, and Time
app.get('/api/booked-seats/:vehicleId/:date/:time', (req, res) => {
  const { vehicleId, date, time } = req.params;
  const dateTime = `${date} ${time}`; // Combine date and time

  db.query(
    'SELECT seat_numbers FROM bookings WHERE vehicle_id = ? AND date = ?',
    [vehicleId, dateTime],
    (err, results) => {
      if (err) {
        return res.json({ success: false, message: 'Database error' });
      }
      
      const bookedSeats = [];
      results.forEach(row => {
        if (row.seat_numbers) {
          bookedSeats.push(...row.seat_numbers.split(',').map(Number));
        }
      });
      
      res.json({ success: true, bookedSeats });
    }
  );
});

// Check Existing Booking
app.get('/api/booking/:userId', (req, res) => {
  const userId = req.params.userId;
  
  db.query(`
    SELECT b.*, v.name AS vehicle_name 
    FROM bookings b
    JOIN vehicles v ON b.vehicle_id = v.id
    WHERE b.user_id = ?
  `, [userId], (err, results) => {
    if (err) {
      return res.json({ success: false, message: 'Database error' });
    }
    
    if (results.length > 0) {
      // Include seat numbers in the response
      results = results.map(booking => ({
        ...booking,
        seat_numbers: booking.seat_numbers ? booking.seat_numbers.split(',').map(Number) : []
      }));
      res.json({ success: true, booking: results[0] });
    } else {
      res.json({ success: true, booking: null });
    }
  });
});

// Book a Vehicle
app.post('/api/booking', (req, res) => {
  const { userId, vehicleId, date, name, age, noOfPassengers, selectedSeats, additionalDetails } = req.body;

  // Validate input
  if (!userId || !vehicleId || !date || !selectedSeats || selectedSeats.length === 0) {
    return res.json({ success: false, message: 'Missing required fields' });
  }

  // Check if any selected seats are already booked for the same vehicle, date, and time
  db.query(
    'SELECT seat_numbers FROM bookings WHERE vehicle_id = ? AND date = ?',
    [vehicleId, date],
    (err, results) => {
      if (err) {
        return res.json({ success: false, message: 'Database error' });
      }

      const bookedSeats = [];
      results.forEach(row => {
        if (row.seat_numbers) {
          bookedSeats.push(...row.seat_numbers.split(',').map(Number));
        }
      });

      const alreadyBooked = selectedSeats.filter(seat => bookedSeats.includes(seat));
      if (alreadyBooked.length > 0) {
        return res.json({
          success: false,
          message: `Seats ${alreadyBooked.join(', ')} are already booked for this date and time.`
        });
      }

      // Insert booking into the bookings table
      const seatNumbersString = selectedSeats.join(',');
      db.query(
        'INSERT INTO bookings (user_id, vehicle_id, date, seat_numbers, name, age, no_of_passengers, additional_details) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [userId, vehicleId, date, seatNumbersString, name, age, noOfPassengers, additionalDetails],
        (err) => {
          if (err) {
            console.error(err);
            return res.json({ success: false, message: 'Booking failed' });
          }

          // Mark vehicle as unavailable (optional, depending on requirements)
          db.query('UPDATE vehicles SET available = 0 WHERE id = ?', [vehicleId], (err) => {
            if (err) {
              return res.json({ success: false, message: 'Unable to update vehicle availability' });
            }
            res.json({ success: true });
          });
        }
      );
    }
  );
});

// Start the server
app.listen(5000, () => {
  console.log('Server running on http://localhost:5000/login.html');
});