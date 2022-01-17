

import express from "express";
//import swaggerJsDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";
import routes from './routes/restapi.js';
import swaggerAutogen from 'swagger-autogen';
import jwt from 'jsonwebtoken';
import bp from 'body-parser';
import YAML from 'yamljs';
import bodyParser from "body-parser";


import retriveToken,{  verifyToken } from './middleware/auth.js';
const app = express();
const PORT = 5000;
app.use(bodyParser.json());


/*const swaggerOptions = {
    openapi: "3.0.0",
    swaggerDefinition: {
        info: {
            title: 'Rest- Ful WS',
            version: '1.0.0'
        }
    },
    // path to API docs
    apis: ['./routes/restapi.js']
};*/

//const swaggerSpec = swaggerJsDoc(swaggerOptions);

const swaggerJsDoc = YAML.load('./swagger.yaml');
/*const token = retriveToken('AsharNiazi').split();

console.log(`value of token ${token}`);

const verifyToken2 = verifyToken('', '', null, token);

console.log(`vrify ==== ${verifyToken2}`);
*/


app.use('/rest', routes);
app.use('/api-documentation', swaggerUI.serve, swaggerUI.setup(swaggerJsDoc));
app.listen(PORT, () => console.log(`listening on http://localhost:${PORT}`));