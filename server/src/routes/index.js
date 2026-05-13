const fs = require("fs");
const path = require("path");
const express = require("express");

const router = express.Router();

fs.readdirSync(__dirname)
    .filter((file) => {
        return (
            file !== "index.js" &&
            file.endsWith(".js")
        );
    })
    .forEach((file) => {
        /*
          ticketRoutes.js
          userRoutes.js
        */

        const route = require(path.join(__dirname, file));

        /*
          ticketRoutes
          userRoutes
        */

        const routeName = file.split(".")[0];

        /*
          ticket
          user
        */

        const baseRoute = routeName.replace("Routes", "");

        router.use(`/${baseRoute}`, route);
    });

module.exports = router;