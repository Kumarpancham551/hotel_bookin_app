const db = require('../config/db.config');


exports.findAvailableRoom = async (room_type = 'single') => {
  const query = `SELECT * FROM Rooms WHERE is_available = TRUE AND room_type = ? LIMIT 1`;
  const [rooms] = await db.query(query, [room_type]);
  if (rooms.length > 0) {
    return rooms[0];
  }
  const [rows] = await db.query('SELECT * FROM Rooms WHERE is_available = TRUE LIMIT 1');
  return rows[0];
};



exports.updateRoomAvailability = async (roomId, availability) => {
  await db.query('UPDATE Rooms SET is_available = ? WHERE room_id = ?', [availability, roomId]);
};
