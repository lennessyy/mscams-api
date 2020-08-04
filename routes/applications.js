/** Routes for companies. */

const express = require("express");
const router = new express.Router();

const { adminRequired, authRequired } = require("../middleware/auth");

const Application = require("../models/Application");
const { validate } = require("jsonschema");

const { applicationNewSchema, applicationUpdateSchema } = require("../schemas");


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
router.get('/:id', async function (req, res, next) {
    try {
        const application = await Application.findOne(req.params.id)
        return res.json({ application })
    } catch (err) {
        return next(err)
    }
})

// POST /:id/vote vote for an application
router.post('/:id/vote', adminRequired, async function (req, res, next) {
    try {
        const id = req.params.id
        const voter = req.username
        const vote = req.body.vote
        const voted = await Application.vote(id, voter, vote)
        return res.json({ voted })
    } catch (err) {
        return next(err)
    }
})

// POST / create application
router.post('/', authRequired, async function (req, res, next) {
    try {
        // ADD VALIDATION
        delete req.body._token;
        const validation = validate(req.body, applicationNewSchema);

        if (!validation.valid) {
            return next({
                status: 400,
                message: validation.errors.map(e => e.stack)
            });
        }

        const applicant = req.username
        const application = await Application.create(applicant, req.body);
        return res.status(201).json({ application })
    } catch (err) {
        next(err)
    }
})

/** PATCH /[id] {appData} => {app: updatedApplication}  */
router.patch('/:id', authRequired, async function (req, res, next) {
    try {
        // ADD VALIDATION
        delete req.body._token;
        const validation = validate(req.body, applicationUpdateSchema);

        if (!validation.valid) {
            return next({
                status: 400,
                message: validation.errors.map(e => e.stack)
            });
        }

        const application = await Application.update(req.params.id, req.body)

        if (application.applicant !== req.username) {
            throw new Error('Unauthorized')
        }

        return res.json({ application })
    } catch (err) {
        next(Err)
    }
})

router.delete('/:id', authRequired, async function (req, res, next) {
    try {
        await Application.remove(req.params.id)
        return res.json({ message: "Application deleted" })
    } catch (err) {
        return next(err)
    }
})

module.exports = router;