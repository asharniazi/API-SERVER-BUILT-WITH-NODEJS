
import mysqlConnection from "../utils/db_connection.js";
import express, { response } from "express";
import { v4 as uuidv4 } from 'uuid';
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";
import jwt from 'jsonwebtoken';
import retriveToken, { verifyToken } from '../middleware/auth.js';
import mysql from 'mysql';
import util from 'util';
import { resolve } from "dns";


const app = express.Router();



// GET ALL LIST OF USERS
app.get('/users', verifyToken, (req, res) => {
    mysqlConnection.query("SELECT * FROM user", (err, result) => {
        if (!err){
            res.send(result);
        }else{
            console.error('There is some error in the db');
            console.error(err);
            res.send('Please contact with administrator');
        }
    });
});

/**
 * Create a Token with user Ashar
 */
app.get('/createToken/:loginId', (req, res) => {
    const token = retriveToken(req.params.login_id);
    res.send(`Your x-access-token is: ${token}`);
});


// CREATE USER
app.post('/user/create', (req,res) => {
    console.log(`request body ${req.body}`);
    console.log('=================');
    console.log(JSON.stringify(req.body));
    var datetime = new Date();
    console.log(datetime);

    const userId =uuidv4();
    const user = req.body;
    console.log(`helllloo    ${JSON.stringify(user)}`);
    //console.log(JSON.stringify(req.body));
    //console.log(JSON.parse(req.body));
    //console.log(JSON.stringify(user));
    console.log('=================');
    console.log(user.USER_ID);
    console.log('=================');
    console.log(user.FIRST_NAME);
    console.log('=================');
    console.log(user.LAST_NAME);
    console.log('=================');
    console.log(user.DOB);
    console.log('=================');
    console.log(user.STATUS);
    console.log('=================');

    /*const userWithUserId = {...user, USER_ID:userId};
    userWithUserId.CREATION_DATE = datetime;
    userWithUserId.DOB = datetime;
    console.log(userWithUserId);*/
    //console.log(userWithUserId.FIRST_NAME);

    //console.log(JSON.stringify(userWithUserId)); convert javascript object to json
    
    var sql = "INSERT INTO user (USER_ID,LOGIN_ID, FIRST_NAME, LAST_NAME, DOB, STATUS, CREATION_DATE) VALUES ?";
    var values = [
        [userId, user.LOGIN_ID , user.FIRST_NAME, user.LAST_NAME,datetime,1,datetime]
    ];

    mysqlConnection.query(sql, [values], (err, result) => {
        if (err){
            console.log(`Error in creating a record \n ${err}`);
            res.send('Error');
        } else {
            var userToken = retriveToken(userId);
            const userWithUserToken = { ...user, USER_TOKEN: userToken };
            
            console.log(`Number of records inserted: ${result.affectedRows}`);
            res.send(`user has been created ${user.LOGIN_ID}, with the token value \n ${userWithUserToken.USER_TOKEN}`);
            //res.send("Number of records inserted: " + result.affectedRows);
        }
    })
   // res.send('Sennd');
});


// UPDATE USER BY LOGIN_ID
app.put('/user/update/:login_id', verifyToken, (req, res) => {
    var loginId = req.params.login_id;
    let isExistRecord = false;

    console.log(`Request Login Id: ${loginId}`);

    findUser(loginId).then((message) => {
        console.log('Message ' + message);
        //isExistRecord = message;
        console.log('JSON Body: \n ' + JSON.stringify(req.body));
        const user = req.body;
        console.log('=================');
        console.log(user.FIRST_NAME);
        console.log('=================');
        console.log(user.LAST_NAME);
        console.log('=================');
        updateUserDetail(loginId, user.FIRST_NAME, user.LAST_NAME).then((message) => {
            console.log('Record has been update: ' + message);
            res.send('Record has been updated for LOGIN_ID ' + loginId);
        }).catch((error) => {
            console.log('Error: ' + error);
            res.send(error);
        });
    }).catch((error) => {
        console.log('Error: ' + error);
    });
});



// Delete USER BY LOGIN_ID
app.delete('/user/delete/:login_id', verifyToken, (req, res) => {
    var loginId = req.params.login_id;
    let isExistRecord = false;

    console.log(`Requested Login Id: ${loginId}`);

    findUser(loginId).then((message) => {
        console.log('User has exist ' + message);
        //isExistRecord = message;
        console.log('JSON Body: \n ' + JSON.stringify(req.body));

        deleteUserById(loginId).then((message) => {
            console.log('Record has been deleted: ' + message);
            res.send('Record has been deleted for LOGIN_ID ' + loginId);
        }).catch((error) => {
            console.log('Error: ' + error);
            res.send(error);
        });
    }).catch((error) => {
        console.log('User Not found: ' + error);
        res.send('User has not found.');
    });
});






function updateUserDetail(loginId, firstName, lastName) {
    return new Promise((resolve, reject) => {
        var sql = 'UPDATE node_db.user set FIRST_NAME = ? , LAST_NAME = ? WHERE LOGIN_ID = ?';
        var values = [
            [firstName, lastName]
        ];
        
        console.log(`Query : \n ${sql}`);
        mysqlConnection.query(sql, [firstName, lastName, loginId], (err, result) => {
            if (err) {
                console.log(`Error in updating a record \n ${err}`);
                reject(err);

            } else {
                if (result.affectedRows > 0) {
                    console.log('Result Updated Rows Length: ' + result.affectedRows);
                    resolve(true);
                } else {
                    console.log('else Result Rows Length: ' + result.affectedRows);
                    reject(false);
                }
            }
        })
    });
}


function deleteUserById(loginId) {
    return new Promise((resolve, reject) => {
        var sql = 'DELETE FROM node_db.user WHERE LOGIN_ID = ? ';
        
        console.log(`Query : \n ${sql}`);
        mysqlConnection.query(sql, [loginId], (err, result) => {
            if (err) {
                console.log(`Error in deleting a record \n ${err}`);
                reject(err);

            } else {
                console.log(`Verifying the json object in the result \n ${result}`);

                if (result.affectedRows > 0) {
                    console.log('Result Updated Rows Length: ' + result.affectedRows);
                    resolve(true);
                } else {
                    console.log('else Result Rows Length: ' + result.affectedRows);
                    reject(false);
                }
            }
        })
    });
}



function findUser(loginId) {
    return new Promise((resolve, reject) => {
        var sql = 'SELECT LOGIN_ID, USER_ID FROM node_db.user WHERE LOGIN_ID =' + mysql.escape(loginId);
        console.log(`Query : \n ${sql}`);
        mysqlConnection.query(sql, (err, result) => {
            if (err) {
                console.log(`Error in creating a record \n ${err}`);
                reject(err);
                
            } else {
                if (result && result.length > 0) {
                    console.log('Resilt Length: '+ result.length);
                    resolve(true);
                } else {
                    console.log('else Resilt Length: ' + result.length);
                    reject(false);
                }           
            }
        })

    });
};

export default app;
