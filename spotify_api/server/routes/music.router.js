const express = require('express');
const router = express.Router();
const pool = require('../modules/pool');
const {
    rejectUnauthenticated,
} = require("../modules/authentication-middleware");
const encryptLib = require("../modules/encryption");
const userStrategy = require("../strategies/user.strategy");

//GET all recommendations
router.get('/', (req, res) => {
    pool.query('SELECT array_agg(distinct recommendation.id) as id, array_agg(distinct username) as username, array_agg(distinct profile_pic) as profile_pic, array_agg(distinct song) as song, array_agg(distinct artist) as artist, array_agg(distinct album) as album, array_agg(distinct "comment") as "comment", array_agg(usercomment) as usercomment, AVG(rate) as rate from "recommendation" LEFT JOIN "rate" ON "recommendation"."id"="rate"."rate_id" LEFT JOIN "comment" ON "recommendation"."id"="comment"."comment_id"GROUP BY recommendation.id ORDER BY recommendation.id;').then((result) => {
        res.send(result.rows);
    }).catch((error) => {
        console.log('Error GET /recommendations', error)
        res.sendStatus(500);
    });
}) //end GET
//POST to search the query for artist, album, or song
router.post("/search", (req, res) => {
    const  { search } = req.body
    console.log("search", search)
    //ILIKE on song, artist, and album for search query, plugs in user input into ILIKE
    const queryText = ('SELECT array_agg(distinct recommendation.id) as id, array_agg(distinct username) as username, array_agg(distinct profile_pic) as profile_pic, array_agg(distinct song) as song, array_agg(distinct artist) as artist, array_agg(distinct album) as album, array_agg(distinct "comment") as "comment", array_agg(distinct usercomment) as usercomment, AVG(rate) as rate from "recommendation" LEFT JOIN "rate" ON "recommendation"."id"="rate"."rate_id" LEFT JOIN "comment" ON "recommendation"."id"="comment"."comment_id" WHERE song ILIKE $1 OR artist ILIKE $1 OR album ILIKE $1 GROUP BY recommendation.id;')
    pool
        .query(queryText, [`%${search}%`])
    .then((result) => {
        res.send(result.rows);
    }).catch((error) => {
        console.log('Error GET /recommendations', error)
        res.sendStatus(500);
    });
}); //end POST

//POST the new recommendation
router.post("/", rejectUnauthenticated, (req, res) => {
    // HTTP REQUEST BODY
    const music = req.body; // pull the object out out of the HTTP REQUEST
    const { username, profile_pic, song, artist, album } = music
    if (music === undefined) {
        // stop, dont touch the database
        res.sendStatus(400); // 400 BAD REQUEST
        return;
    }

    const queryText = `
        INSERT INTO recommendation (username, profile_pic, song, artist, album) 
        VALUES ($1, $2, $3, $4, $5);`; //grabs database
    pool
        .query(queryText, [username, profile_pic, song, artist, album])
        .then(function (result) {
            // result.rows: 'INSERT 0 1';
            // it worked!
            res.sendStatus(200); // 200: OK
        })
        .catch(function (error) {
            console.log("Sorry, there was an error with your query: ", error);
            res.sendStatus(500); // HTTP SERVER ERROR
        });
}); // end POST

//POST a new rating
router.post("/rate", rejectUnauthenticated, (req, res) => {
    // HTTP REQUEST BODY
    const music = req.body; // pull the object out out of the HTTP REQUEST
    const { id, rate } = music
    if (music === undefined) {
        // stop, dont touch the database
        res.sendStatus(400); // 400 BAD REQUEST
        return;
    }

    const queryText = `
        INSERT INTO rate (rate_id, rate) 
        VALUES ($1, $2);`; //grabs database
    pool
        .query(queryText, [id, rate])
        .then(function (result) {
            // result.rows: 'INSERT 0 1';
            // it worked!
            res.sendStatus(200); // 200: OK
        })
        .catch(function (error) {
            console.log("Sorry, there was an error with your query: ", error);
            res.sendStatus(500); // HTTP SERVER ERROR
        });
}); // end POST

//POST a new comment
router.post("/comment", rejectUnauthenticated, (req, res) => {
    // HTTP REQUEST BODY
    const music = req.body; // pull the object out out of the HTTP REQUEST
    const { id, comment, usercomment } = music
    if (music === undefined) {
        // stop, dont touch the database
        res.sendStatus(400); // 400 BAD REQUEST
        return;
    }

    const queryText = `
        INSERT INTO comment (comment_id, usercomment, comment) 
        VALUES ($1, $2, $3);`; //grabs database
    pool
        .query(queryText, [id, usercomment, comment])
        .then(function (result) {
            // result.rows: 'INSERT 0 1';
            // it worked!
            res.sendStatus(200); // 200: OK
        })
        .catch(function (error) {
            console.log("Sorry, there was an error with your query: ", error);
            res.sendStatus(500); // HTTP SERVER ERROR
        });
}); // end POST

//DELETES entry from admin page
router.delete('/:id', rejectUnauthenticated, (req, res) => {
    let id = req.params.id; // id of the thing to delete

    /* if (session.id !== database.id) {sendStatus(403) return;}*/
    let queryText = `SELECT * FROM recommendation WHERE id=$1`; //grabs specific item to grab the item user_id
    const queryValue = [id];
    pool
        .query(queryText, queryValue)
        .then((result) => {
            console.log("result.rows[0].username", result.rows[0].username)
            console.log("req.username", req.user.username)
            if (result.rows[0].username === req.user.username) {
                //checks to see if current user is the one who added the image
                queryText = `DELETE FROM recommendation WHERE id=$1;`; //deletes from database
                pool
                    .query(queryText, [id])
                    .then(function (result) {
                        res.sendStatus(201); //status 201
                    })
                    .catch(function (error) {
                        console.log("Sorry, there was an error with your query: ", error);
                        res.sendStatus(500); //HTTP SERVER ERROR
                    });
            } else {
                res.sendStatus(401); // user not authorized to delete item
            }
        })
        .catch((error) => {
            res.sendStatus(500);
        });
}); //end DELETE

//PUT to flag for review
router.put("/:id", rejectUnauthenticated, (req, res) => {
    let id = req.params.id; // grabs id and places it in path
    const music = req.body; // pull the object out out of the HTTP REQUEST
    const { username, song, artist, album } = music
    console.log("username", username)
    let queryText = `UPDATE recommendation SET song = $1, artist = $2, album = $3 WHERE  (username = $4 AND id = $5)`;
    pool
        .query(queryText, [song, artist, album, username, id])

        .then(function (result) {
            console.log("Update feedback item for id of", id);
            // it worked!
            res.send(result.rows);
        })
        .catch(function (error) {
            console.log("Sorry, there was an error with your query: ", error);
            res.sendStatus(500); // HTTP SERVER ERROR
        });
});//end PUT


module.exports = router;