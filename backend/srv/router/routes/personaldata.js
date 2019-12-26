/*eslint no-unused-vars: 0, no-shadow: 0, new-cap: 0*/
/*eslint-env node, es6 */
"use strict";

const express = require("express");

const dbClass = require(global.__base + "utils/dbClass");


function _prepareObject(oPersonalData, req) {
    oPersonalData.changedBy = "DebugClient";
    return oPersonalData;
}


module.exports = () => {
    const app = express.Router();

    app.get("/", async (req, res, next) => {
        const logger = req.loggingContext.getLogger("/Application");
        logger.info('Personal data get request');
        let tracer = req.loggingContext.getTracer(__filename);
        tracer.entering("/personaldata", req, res);

        try {
            const db = new dbClass(req.db);
            const sSql = "SELECT * FROM \"PERSONALDATA\"";
            const persdata = await db.executeUpdate(sSql, []);
            tracer.exiting("/personaldata", "Personal data Get works");
            res.type("application/json").status(201).send(JSON.stringify(persdata));
        } catch (e) {
            tracer.catching("/personaldata", e);
            next(e);
        }
    });

    app.get("/:adid", async (req, res, next) => {
        try {
            const db = new dbClass(req.db);
            const adid = req.params.adid;

            const sSql = "SELECT * FROM \"PERSONALDATA\" WHERE \"ADID\" = ?";
            const aValues = [ adid ];

            console.log(aValues);
            console.log(sSql);
            const oPersonalData = await db.executeUpdate(sSql, aValues);

            res.type("application/json").status(201).send(JSON.stringify(oPersonalData));
        } catch (e) {
            next(e);
        }
    });

    app.post("/", async (req, res, next) => {
        try {
            const db = new dbClass(req.db);
            const oPersonalData = _prepareObject(req.body, req);
	    oPersonalData.adid = await db.getNextval("adid");
            const sSql = "INSERT INTO \"PERSONALDATA\" VALUES(?,?,?,?,?,?,?)";
            const aValues = [ oPersonalData.adid, oPersonalData.clid, oPersonalData.city, oPersonalData.strt, oPersonalData.hnum, oPersonalData.pass, oPersonalData.cshp ];

            console.log(aValues);
            console.log(sSql);
            await db.executeUpdate(sSql, aValues);

            res.type("application/json").status(201).send(JSON.stringify(oPersonalData));
        } catch (e) {
            next(e);
        }
    });

    app.put("/:adid", async (req, res, next) => {
        try {
            const db = new dbClass(req.db);
            const adid = req.params.adid;
            const oPersonalData = _prepareObject(req.body, req);
            console.log(req.body);
            const sSql = "UPDATE \"PERSONALDATA\" SET \"CLID\" = ?, \"CITY\" = ?, \"STRT\" = ?, \"HNUM\" = ?, \"PASS\" = ?, \"CSHP\" = ?   WHERE \"ADID\" = ?";
            const aValues = [ oPersonalData.clid, oPersonalData.city, oPersonalData.strt, oPersonalData.hnum, oPersonalData.pass, oPersonalData.cshp, oPersonalData.adid = adid ];

            await db.executeUpdate(sSql, aValues);

            res.type("application/json").status(200).send("Success");
        } catch (e) {
            next(e);
        }
    });

    app.delete("/:adid", async (req, res, next) => {
        try {
            const db = new dbClass(req.db);
            const adid = req.params.adid;
            console.log(req.params.adid)

            const sSql = "DELETE FROM \"PERSONALDATA\" WHERE \"ADID\" = ?";
            const aValues = [ adid ];

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
