const roomModel = require('../model/room');
const bookingModel = require('../model/booking');
const { calculateStayDuration, recommendRoomBasedOnDuration } = require("../utils/helper")

exports.bookRoom = async (req, res) => {
  try {
    const { guest_name, guest_email, guest_contact, check_in_date, check_out_date } = req.body;
    if (!guest_name || !guest_email || !guest_contact || !check_in_date || !check_out_date) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    if (new Date(check_in_date) >= new Date(check_out_date)) {
      return res.status(400).json({ message: 'Invalid check-in or check-out date' });
    }
    const stay_duration = calculateStayDuration(check_in_date, check_out_date);
    const recommendedRoom = recommendRoomBasedOnDuration(stay_duration);
    const room = await roomModel.findAvailableRoom(recommendedRoom);
    if (!room) return res.status(400).json({ message: 'No rooms available' });

    const bookingId = await bookingModel.createBooking({
      room_id: room.room_id,
      guest_name,
      guest_email,
      guest_contact,
      check_in_date,
      check_out_date,
    });

    await roomModel.updateRoomAvailability(room.room_id, 0);
    res.status(201).json({
      message: 'Room booked successfully',
      bookingId: bookingId,
      guest_name: guest_name,
      room_number: room.room_number,
      stay_duration: stay_duration
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.viewBooking = async (req, res) => {
  try {
    const { email } = req.params;
    if (!email) {
      return res.status(400).json({ message: 'Invalid or missing email address' });
    }
    const booking = await bookingModel.getBookingByEmail(email);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.viewAllGuests = async (req, res) => {
  try {
    const guests = await bookingModel.getAllGuests();
    res.status(200).json(guests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const { email, room_id } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Invalid or missing email address' });
    }
    if (!room_id) {
      return res.status(400).json({ message: 'Room ID is required' });
    }
    const booking = await bookingModel.getBookingByEmail(email);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    if (booking.room_id != room_id) {
      return res.status(400).json({ message: 'Provided room ID does not match the booking' });
    }
    await bookingModel.deleteBooking(email);
    await roomModel.updateRoomAvailability(room_id, 1);

    res.status(200).json({
      message: 'Booking cancelled successfully',
      room_id,
      email
    });
  } catch (error) {
    res.status(500).json({
      message: 'An error occurred while cancelling the booking'
    });
  }
};
exports.modifyBooking = async (req, res) => {
  try {
    const { email, booking_id, new_check_in_date, new_check_out_date } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Invalid or missing email address' });
    }
    if (!booking_id) {
      return res.status(400).json({ message: 'Booking ID is required' });
    }
    if (!new_check_in_date && !new_check_out_date) {
      return res.status(400).json({ message: 'At least one of check-in or check-out dates must be provided' });
    }
    const booking = await bookingModel.getBookingByIdAndEmail(booking_id, email);
    if (booking.length == 0) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    const checkIn = new_check_in_date ? new Date(new_check_in_date) : new Date(booking.check_in_date);
    const checkOut = new_check_out_date ? new Date(new_check_out_date) : new Date(booking.check_out_date);

    if (checkOut <= checkIn) {
      return res.status(400).json({ message: 'Check-out date must be after check-in date' });
    }
    const updatedBooking = await bookingModel.updateBookingDates(booking_id, {
      check_in_date: checkIn,
      check_out_date: checkOut
    });
    res.status(200).json({
      message: 'Booking modified successfully',
      updatedBooking
    });
  } catch (error) {
    res.status(500).json({
      message: 'An error occurred while modifying the booking',
    });
  }
};



