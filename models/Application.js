const db = require("../db");
const sqlForPartialUpdate = require("../helpers/partialUpdate");

class Application {

    /** Find all applications (can filter on terms in data) */

    static async findAll(data) {
        let baseQuery = `SELECT id, category, applicant, event, event_date, status, submitted_at FROM applications`
        let whereExpressions = []
        let queryValues = []

        if (data.category) {
            queryValues.push(data.category)
            whereExpressions.push(`category = $${queryValues.length}`)
        }

        if (data.status) {
            queryValues.push(data.status)
            whereExpressions.push(`status = $${queryValues.length}}`)
        }

        if (whereExpressions.length > 0) {
            baseQuery += " WHERE ";
        }

        let finalQuery = baseQuery + whereExpressions.join('AND') + ' ORDER BY submitted_at'
        console.log(finalQuery)
        const applicationsRes = await db.query(finalQuery, queryValues)
        return applicationsRes.rows
    }

    /** Given a id, return data about application. */
    static async findOne(id) {
        const applicationRes = await db.query(
            `SELECT * FROM applications WHERE id = $1`, [id]
        )

        const application = applicationRes.rows[0]
        if (!application) {
            const error = new Error(`There exists no application #'${id}'`);
            error.status = 404;   // 404 NOT FOUND
            throw error;
        }

        const votesRes = await db.query(`SELECT vote, voter FROM votes WHERE application_id = $1`, [id])

        application.votes = votesRes.rows

        return application
    }

    /** Create an application (from data), update db, return app info */
    static async create(applicant, data) {


        const result = await db.query(
            `INSERT INTO applications
            (category, event, event_date, amount, budget, applicant, description) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`
            , [data.category, data.event, data.event_date, data.amount, data.budget, applicant, data.description])

        return result.rows[0]
    }

    /** Update app with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain
   * all the fields; this only changes provided ones.
   *
   * Return data for changed app.
   *
   */

    static async update(id, data) {
        let { query, values } = sqlForPartialUpdate(
            "applications",
            data,
            "id",
            id
        );

        const result = await db.query(query, values);
        const application = result.rows[0];

        if (!application) {
            let notFound = new Error(`There exists no app '${id}`);
            notFound.status = 404;
            throw notFound;
        }

        return application;
    }

    /** Vote for an application */
    static async vote(id, username, vote) {
        const result = await db.query('INSERT INTO votes (application_id, voter, vote) VALUES ($1, $2, $3) RETURNING *', [id, username, vote])
        const updatedVote = result.rows[0]
        return updatedVote
    }

    /** Change vote */
    static async changeVote(id, username, vote) {
        const result = await db.query(`UPDATE votes SET vote = $1 WHERE application_id = $2 AND voter = $3 RETURNING *`, [vote, id, username])
        return result.rows[0]
    }

    /** Delete an application from database */
    static async remove(id) {
        const result = await db.query(
            `DELETE FROM applications WHERE id = $1 RETURNING id`, [id]
        )

        if (result.rows.length === 0) {
            let notFound = new Error(`There exists no application #'${id}`);
            notFound.status = 404;
            throw notFound;
        }

        return true
    }
}

module.exports = Application