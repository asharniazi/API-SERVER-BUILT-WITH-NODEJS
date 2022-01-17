import jwt from 'jsonwebtoken';


const secretKey = 'addjsonwebtokensecretherelikeQuiscustodietipsoscustodes';
function retriveToken(user_id) {
    console.log(`========= ${user_id}`);
    return jwt.sign(
        {
            user_id: user_id
        },
        secretKey,
        {
            expiresIn: "2h",
        }
    );
}



//const verifyToken = (req, res, next, t) => {
const verifyToken = (req, res, next) => {
    //console.log(t);
    const token = req.body.token || req.query.token || req.headers["x-access-token"];

    if (!token) {
        return res.status(403).send("A token is required for authentication");
    }
    try {
        console.log(`token Body req: ${token}`);
        
        const decoded = jwt.verify(token.toString(), secretKey);
        console.log(`Decoded JWT: \n ${decoded}`);
        //const decoded = jwt.verify(token, "addjsonwebtokensecretherelikeQuiscustodietipsoscustodes", options);
        //req.user = decoded;
    } catch (err) {
        console.log('Error in Token verification \n ' + err);
        return res.status(401).send("Invalid Token");
        //console.log(err);
        //console.log('401')
    }
    return next();
    //return 'abccc';
};



 export default retriveToken;
export  { verifyToken};
//export { verifyToken, retriveToken };