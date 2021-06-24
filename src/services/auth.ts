import passport from 'passport';
import passportJwt from 'passport-jwt';
import jwt from 'jsonwebtoken';
import { fetchUser } from '../models';

const JwtStrategy = passportJwt.Strategy;
const tokenExpiration = '1h';
const secret = 'some-complex-secret';

const options = {
  secretOrKey: secret,
  jwtFromRequest: passportJwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
  algorithms: ['HS256']
}

// Once the token is verified to be valid
const onVerification = (decodedBody, done) => {
    // Fetches the user payload using the decoded body
    const userPayload = fetchUser(decodedBody.id);
  
    if(userPayload) {
      // Returns it back to the middleware to be put into 
      // the context for resolvers.
      done(null, userPayload);
    }else{
      done(null, false);
    }
}

passport.use(new JwtStrategy(options, onVerification));

// Generates and signs a JWT with a payload containing the userId
export const signToken = (userId: number) => jwt.sign({ id: userId }, secret, {
  expiresIn: tokenExpiration
});


// Authentication middleware
export const authenticate = (req, res, next) => {
  // Using `passport.authenticate` as usual, but with
  // a bit of currying since it's not inline
  return passport.authenticate('jwt', { session: false }, (_, userPayload) => {

    // If the token is verified and payload successfully parsed:
    if (userPayload) {
      // Update the user field in the request.
      // Usually used for sessions, but in this case 
      // it'll work for JWTs.
      req.user = userPayload;
    }

    // Proceed as usual.
    next();
  })(req, res, next);
}