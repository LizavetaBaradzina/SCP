/*eslint no-unused-vars: 0, no-shadow: 0, new-cap: 0*/
/*eslint-env node, es6 */
"use strict";

const express = require("express");

const dbClass = require(global.__base + "utils/dbClass");


function _prepareObject(oCredit, req) {
    oCredit.changedBy = "DebugClient";
    return oCredit;
}


module.exports = () => {
    const app = express.Router();

    app.get("/", async (req, res, next) => {
        const logger = req.loggingContext.getLogger("/Application");
        logger.info('Credits get request');
        let tracer = req.loggingContext.getTracer(__filename);
        tracer.entering("/credits", req, res);

        try {
            const db = new dbClass(req.db);
            const sSql = "SELECT * FROM \"CREDITS\"";
            const creds = await db.executeUpdate(sSql, []);
            tracer.exiting("/credits", "Credits Get works");
            res.type("application/json").status(201).send(JSON.stringify(creds));
        } catch (e) {
            tracer.catching("/credits", e);
            next(e);
        }
    });

    app.get("/:crid", async (req, res, next) => {
        try {
            const db = new dbClass(req.db);
            const crid = req.params.crid;

            const sSql = "SELECT * FROM \"CREDITS\" WHERE \"CRID\" = ?";
            const aValues = [ crid ];

            console.log(aValues);
            console.log(sSql);
            const oCredit = await db.executeUpdate(sSql, aValues);

            res.type("application/json").status(201).send(JSON.stringify(oCredit));
        } catch (e) {
            next(e);
        }
    });

   app.post("/", async (req, res, next) => {
        try {
            const db = new dbClass(req.db);
            const oCredit = _prepareObject(req.body, req);
	    oCredit.crid = await db.getNextval("crid");
            const sSql = "INSERT INTO \"CREDITS\" VALUES(?,?,?,?,?,?)";
            const aValues = [ oCredit.crid, oCredit.clid, oCredit.type, oCredit.summ, oCredit.proc, oCredit.curr ];

            console.log(aValues);
            console.log(sSql);
            await db.executeUpdate(sSql, aValues);

            res.type("application/json").status(201).send(JSON.stringify(oCredit));
        } catch (e) {
            next(e);
        }
    });

    app.put("/:crid", async (req, res, next) => {
        try {
            const db = new dbClass(req.db);
            const crid = req.params.crid;
            const oCredit = _prepareObject(req.body, req);
            const sSql = "UPDATE \"CREDITS\" SET \"CLID\" = ?, \"TYPE\" = ?, \"SUMM\" = ?, \"PROC\" = ?, \"CURR\" = ?  WHERE \"CRID\" = ?";

            console.log(oCredit);
            const aValues = [ oCredit.clid, oCredit.type, oCredit.summ, oCredit.proc, oCredit.curr, oCredit.crid = crid ];

            await db.executeUpdate(sSql, aValues);

            res.type("application/json").status(200).send(JSON.stringify("Success"));
        } catch (e) {
            next(e);
        }
    });

    app.delete("/:crid", async (req, res, next) => {
        try {
            const db = new dbClass(req.db);
            const crid = req.params.crid;
            console.log(req.params.crid)

            const sSql = "DELETE FROM \"CREDITS\" WHERE \"CRID\" = ?";
            const aValues = [ crid ];

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
