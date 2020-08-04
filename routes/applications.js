/** Routes for companies. */

const express = require("express");
const router = new express.Router();

// const {adminRequired, authRequired} = require("../middleware/auth");

const Application = require("../models/Application");
// const {validate} = require("jsonschema");

// const {companyNewSchema, companyUpdateSchema} = require("../schemas");


// GET / return basic info of  all applications (query string to specify type)
router.get("/", async function (req, res, next) {
    try {
        const applications = await Application.findAll(req.query);
        return res.json({ applications });
    }

    catch (err) {
        return next(err);
    }
});

// GET /:id return single application 

// POST / create application

// 


module.exports = router;