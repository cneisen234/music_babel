const express = require('express');
const router = express.Router();
const pool = require('../modules/pool');

//GET all feedback
router.get('/', (req, res) => {
    pool.query('SELECT * from "recommendation";').then((result) => {
        res.send(result.rows);
    }).catch((error) => {
        console.log('Error GET /feedback', error)
        res.sendStatus(500);
    });
}) //end GET

//POST the new feedback
router.post("/", (req, res) => {
    // HTTP REQUEST BODY
    // const feedback = req.body; // pull the object out out of the HTTP REQUEST
    // const { name, feeling, understanding, support, comments, flagged } = feedback
    // if (feedback === undefined) {
    //     // stop, dont touch the database
    //     res.sendStatus(400); // 400 BAD REQUEST
    //     return;
    // }

    // const queryText = `
    //     INSERT INTO feedback (name, feeling, understanding, support, comments, flagged) 
    //     VALUES ($1, $2, $3, $4, $5, $6);`; //grabs database
    // pool
    //     .query(queryText, [name, feeling, understanding, support, comments, false])
    //     .then(function (result) {
    //         // result.rows: 'INSERT 0 1';
    //         // it worked!
    //         res.sendStatus(200); // 200: OK
    //     })
    //     .catch(function (error) {
    //         console.log("Sorry, there was an error with your query: ", error);
    //         res.sendStatus(500); // HTTP SERVER ERROR
    //     });
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