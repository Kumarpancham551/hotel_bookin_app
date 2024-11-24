const bookingController = require('../controller/booking');

module.exports = (app) => {
    app.post("/hotel/booking", bookingController.bookRoom)
    app.get('/hotel/view/:email', bookingController.viewBooking);
    app.get('/hotel/guests', bookingController.viewAllGuests);
    app.delete('/hotel/cancel', bookingController.cancelBooking);
    app.patch('/hotel/modifyBooking', bookingController.modifyBooking);
}
