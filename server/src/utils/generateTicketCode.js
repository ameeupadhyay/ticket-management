const generateTicketCode = (lastTicketId = 0) => {
  const nextId = lastTicketId + 1;

  return `TKT-${String(nextId).padStart(4, "0")}`;
};

module.exports = generateTicketCode;