import jwt from 'jsonwebtoken'; // Importing jsonwebtoken for authentication
import 'dotenv/config'; // Importing dotenv for environment variables

/** Authentication Middleware */
export default async function Auth(req, res, next){
    try{
      const token = req.headers.authorization.split(" ")[1]; // Extracting token from Authorization header
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET); // Verifying the token using JWT_SECRET from environment variables
      req.user = decodedToken; // Adding decoded user information to request object
      next(); // Proceed to the next middleware or route handler
    } catch (error){
       res.status(401).json({error: "Authentication Failed"}); // Sending authentication failure response
    }
}

/** Middleware for Setting Local Variables */
export function localVariables(req, res, next){
    req.app.locals = { // Setting local variables accessible across the application
        OTP: null, // Initializing OTP as null
        resetSession: false // Initializing resetSession flag as false
    }
    res.setHeader('Content-Type', 'text/plain'); // Setting response content type as text/plain
    next(); // Proceed to the next middleware or route handler
};


/** This code includes two middleware functions:

1) Auth: This middleware is used for authentication. It verifies the JWT token 
from the Authorization header using the JWT_SECRET from environment variables. 
If the token is valid, it adds the decoded user information to the request
 object (req.user) and allows the request to proceed. If authentication fails, 
 it sends a 401 response with an error message.

2)localVariables: This middleware is used for setting local variables that are 
accessible across the application. It initializes OTP as null and resetSession flag 
as false in the req.app.locals object. It also sets the response content type
 as text/plain before proceeding to the next middleware or route handler. */






