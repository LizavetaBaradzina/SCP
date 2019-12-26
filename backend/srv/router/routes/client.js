/*eslint no-unused-vars: 0, no-shadow: 0, new-cap: 0*/
/*eslint-env node, es6 */
"use strict";

const express = require("express");

const dbClass = require(global.__base + "utils/dbClass");


function _prepareObject(oClient, req) {
		oClient.changedBy = "DebugClient";
    return oClient;
}


module.exports = () => {
    const app = express.Router();

    app.get("/", async (req, res, next) => {
        const logger = req.loggingContext.getLogger("/Application");
        logger.info('client get request');
        let tracer = req.loggingContext.getTracer(__filename);
        tracer.entering("/client", req, res);

        try {
            const db = new dbClass(req.db);
            const sSql = "SELECT * FROM \"CLIENT\"";
            const clnt = await db.executeUpdate(sSql, []);
            tracer.exiting("/client", "Client Get works");
            res.type("application/json").status(201).send(JSON.stringify(clnt));
        } catch (e) {
            tracer.catching("/client", e);
            next(e);
        }
    });

    app.post("/", async (req, res, next) => {
        try {
            const db = new dbClass(req.db);

            const oClient = _prepareObject(req.body, req);
				    oClient.clid = await db.getNextval("clid");

            const sSql = "INSERT INTO \"CLIENT\" VALUES(?,?)";
						const aValues = [ oClient.clid, oClient.name ];

						console.log(aValues);
						console.log(sSql);
            await db.executeUpdate(sSql, aValues);

            res.type("application/json").status(201).send(JSON.stringify(oClient));
        } catch (e) {
            next(e);
        }
    });

    app.put("/", async (req, res, next) => {
        try {
            const db = new dbClass(req.db);

            const oClient = _prepareObject(req.body, req);
            const sSql = "UPDATE \"CLIENT\" SET \"NAME\" = ? WHERE \"CLID\" = ?";
						const aValues = [ oClient.name, oClient.clid ];

            await db.executeUpdate(sSql, aValues);

            res.type("application/json").status(200).send(JSON.stringify(oClient));
        } catch (e) {
            next(e);
        }
    });

	app.delete("/:clid", async (req, res, next) => {
        try {
            const db = new dbClass(req.db);
            const clid = req.params.clid;
            console.log(req.params.clid)

            const sSql = "DELETE FROM \"CLIENT\" WHERE \"CLID\" = ?";
            const aValues = [ clid ];

            console.log(aValues);
            console.log(sSql);
            await db.executeUpdate(sSql, aValues);

            res.type("application/json").status(201).send("Success");
        } catch (e) {
            next(e);
        }
    });

    return app;
};
