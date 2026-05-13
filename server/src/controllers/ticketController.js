const ticketService = require(
    "../services/ticketService"
);

const asyncHandler = require(
    "../middlewares/asyncHandler"
);

const createTicket = asyncHandler(
    async (req, res) => {
        const ticket =
            await ticketService.createTicket(
                req.body
            );

        res.status(200).json({
            success: true,
            message:
                "Ticket created successfully",
            data: ticket,
        });
    }
);

const getTickets = asyncHandler(
    async (req, res) => {

        const tickets =
            await ticketService.getTickets(
                req.query
            );

        res.status(200).json({
            success: true,
            message:
                "Tickets fetched successfully",
            data: tickets,
        });
    }
);

const updateTicket = asyncHandler(
    async (req, res) => {

        const ticket =
            await ticketService.updateTicket(
                req.params.id,
                req.body
            );

        res.status(200).json({
            success: true,
            message:
                "Ticket updated successfully",
            data: ticket,
        });
    }
);

const getTicketDetails = asyncHandler(
    async (req, res) => {
        const ticket =
            await ticketService.getTicketDetails(
                req.params.id
            );
        res.status(200).json({
            success: true,
            message:
                "Ticket details fetched successfully",
            data: ticket,
        });
    }
);

const addTicketActivity =
    asyncHandler(
        async (req, res) => {

            const activity =
                await ticketService.addTicketActivity(
                    req.params.id,
                    req.body
                );

            res.status(201).json({
                success: true,
                message:
                    "Activity added successfully",
                data: activity,
            });
        }
    );

module.exports = {
    createTicket,
    getTickets,
    updateTicket,
    getTicketDetails,
    addTicketActivity
};