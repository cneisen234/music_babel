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
    pool.query('SELECT * from "recommendation";').then((result) => {
        res.send(result.rows);
    }).catch((error) => {
        console.log('Error GET /recommendations', error)
        res.sendStatus(500);
    });
}) //end GET

//POST the new feedback
router.post("/", rejectUnauthenticated, (req, res) => {
    // HTTP REQUEST BODY
    const music = req.body; // pull the object out out of the HTTP REQUEST
    const { username, song, artist, album } = music
    if (music === undefined) {
        // stop, dont touch the database
        res.sendStatus(400); // 400 BAD REQUEST
        return;
    }

    const queryText = `
        INSERT INTO recommendation (username, song, artist, album) 
        VALUES ($1, $2, $3, $4);`; //grabs database
    pool
        .query(queryText, [username, song, artist, album])
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
router.delete('/:id', (req, res) => {
    // let id = req.params.id; // id of the thing to delete
    // console.log('Delete route called with id of', id);

    // const queryText = `
    // DELETE FROM feedback WHERE id=$1;` //deletes from database
    // pool.query(queryText, [id])
    //     .then(function (result) {
    //         res.sendStatus(201); //status 201
    //     }).catch(function (error) {
    //         console.log('Sorry, there was an error with your query: ', error);
    //         res.sendStatus(500); //HTTP SERVER ERROR

    //     });
}); //end DELETE

//PUT to flag for review
router.put("/:id", (req, res) => {
    // let id = req.params.id; // grabs id and places it in path
    // let queryText = `UPDATE feedback SET flagged = 'true' WHERE (flagged = 'false' AND id = $1)`;
    // //....and uopdates it with put to flagged
    // pool
    //     .query(queryText, [id])

    //     .then(function (result) {
    //         console.log("Update feedback item for id of", id);
    //         // it worked!
    //         res.send(result.rows);
    //     })
    //     .catch(function (error) {
    //         console.log("Sorry, there was an error with your query: ", error);
    //         res.sendStatus(500); // HTTP SERVER ERROR
    //     });
});


module.exports = router;