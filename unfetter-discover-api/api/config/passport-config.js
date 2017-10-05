const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/user');

const passportConfig = {};

passportConfig.secret = 'supersecretpw'

passportConfig.setStrategy = (passport) => {
    let opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    opts.secretOrKey = passportConfig.secret;
    passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
        return done(null, {'bob': 1233});
        // User.getUserById(jwt_payload._id, (err, user) => {
        //     if (err) {
        //         return done(err, false);
        //     }

        //     if (user) {
        //         return done(null, user);
        //     } else {
        //         return done(null, false);
        //     }
        // });
    }));
}

module.exports = passportConfig;