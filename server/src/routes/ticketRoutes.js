const express = require("express");

const router = express.Router();

const {
    createTicket,
    getTickets,
    updateTicket,
    getTicketDetails,
    addTicketActivity,
} = require("../controllers/ticketController");

router.post("/", createTicket);
router.get("/", getTickets);
router.patch("/:id", updateTicket);
router.get("/:id", getTicketDetails);
router.post(
    "/:id/activities",
    addTicketActivity
);

module.exports = router;