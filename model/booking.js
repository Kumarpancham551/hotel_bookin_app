const db = require('../config/db.config');

exports.createBooking = async (booking) => {
    const { room_id, guest_name, guest_email, guest_contact, check_in_date, check_out_date } = booking;
    const [result] = await db.query(
        'INSERT INTO Bookings (room_id, guest_name, guest_email, contact_number, check_in_date, check_out_date) VALUES (?, ?, ?, ?, ?, ?)',
        [room_id, guest_name, guest_email, guest_contact, check_in_date, check_out_date]
    );
    return result.insertId;
};

exports.getBookingByEmail = async (email) => {
    const [rows] = await db.query('SELECT * FROM Bookings WHERE guest_email = ?', [email]);
    return rows[0];
};

exports.getAllGuests = async () => {
    const [rows] = await db.query('SELECT guest_name, room_id as room_numer FROM Bookings');
    return rows;
};

exports.deleteBooking = async (email) => {
    await db.query('DELETE FROM Bookings WHERE guest_email = ?', [email]);
};
exports.getBookingByIdAndEmail = async (booking_id, email) => {
    const [rows] = await db.query(
        'SELECT * FROM Bookings WHERE booking_id = ? AND guest_email = ?',
        [booking_id, email]
    );
    return rows;
};

exports.updateBookingDates = async (booking_id, { check_in_date, check_out_date }) => {
    const [result] = await db.query(
        'UPDATE Bookings SET check_in_date = ?, check_out_date = ? WHERE booking_id = ?',
        [check_in_date, check_out_date, booking_id]
    );

    return result.affectedRows > 0;
};

