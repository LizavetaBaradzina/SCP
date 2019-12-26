"use strict";

module.exports = (app, server) => {
    app.use("/client", require("./routes/client")());
    app.use("/personaldata", require("./routes/personaldata")());
    app.use("/credits", require("./routes/credits")());
    app.use("/dest", require("./routes/dest")());
};
