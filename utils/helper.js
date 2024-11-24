exports.calculateStayDuration = (checkInDate, checkOutDate) => {
  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);
  const differenceInTime = checkOut - checkIn;
  const differenceInDays = differenceInTime / (1000 * 60 * 60 * 24);
  return differenceInDays;
};
exports.recommendRoomBasedOnDuration = (stay_duration) => {
  if (stay_duration >= 7) {
    return 'suite';
  } else if (stay_duration >= 4) {
    return 'double';
  } else {
    return 'single';
  }
};


