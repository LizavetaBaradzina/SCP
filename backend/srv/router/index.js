"use strict";

module.exports = (app, server) => {
    app.use("/client", require("./routes/client")());
//    app.use("/dest", require("./routes/dest")());
};
