const express = require("express");

const router = express.Router();

const {
    createTicket,
    getTickets,
    updateTicket,
    getTicketDetails,
} = require("../controllers/ticketController");

router.post("/", createTicket);
router.get("/", getTickets);
router.patch("/:id", updateTicket);
router.get("/:id", getTicketDetails);

module.exports = router;