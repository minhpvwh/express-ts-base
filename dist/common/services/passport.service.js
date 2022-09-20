"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_facebook_1 = __importDefault(require("passport-facebook"));
const passport_google_oauth2_1 = __importDefault(require("passport-google-oauth2"));
const configs_1 = require("../../configs");
// passport.serializeUser(function(user, done) {
//     /*
//     From the user take just the id (to minimize the cookie size) and just pass the id of the user
//     to the done callback
//     PS: You dont have to do it like this its just usually done like this
//     */
//     done(null, user);
// });
//
// passport.deserializeUser(function(user, done) {
//     /*
//     Instead of user this function usually recives the id
//     then you use the id to select the user from the db and pass the user obj to the done callback
//     PS: You can later access this data in any routes in: req.user
//     */
//     done(null, user);
// });
passport_1.default.use(new passport_google_oauth2_1.default.Strategy({
    clientID: configs_1.auth.GOOGLE_CLIENT_ID,
    clientSecret: configs_1.auth.GOOGLE_CLIENT_SECRET,
    callbackURL: `${configs_1.serverConfigs.API_VERSION}/auth/google/callback`,
    passReqToCallback: true
}, (request, accessToken, refreshToken, profile, done) => {
    done(null, profile);
}));
// passport.use(new facebookStrategy({
//
//         // pull in our app id and secret from our auth.js file
//         clientID        : 709671490255201,
//         clientSecret    : 'f18f6acd511242da9d8d5b696b7d565e',
//         callbackURL     : "http://localhost:3000/facebook/callback",
//         profileFields: ['id', 'displayName', 'name', 'gender', 'picture.type(large)','email']
//
//     },// facebook will send back the token and profile
//     function(token, refreshToken, profile, done) {
//
//         console.log(profile)
//         return done(null,profile)
//     }));
passport_1.default.use(new passport_facebook_1.default.Strategy({
    clientID: configs_1.auth.FACEBOOK_CLIENT_ID,
    clientSecret: configs_1.auth.FACEBOOK_CLIENT_SECRET,
    callbackURL: `${configs_1.serverConfigs.API_VERSION}/auth/facebook/callback`,
    profileFields: ['id', 'displayName', 'email', 'picture', 'name', 'gender'],
    passReqToCallback: true
}, (req, _accessToken, _refreshToken, profile, done) => {
    // In this example, the user's Facebook profile is supplied as the user
    // record.  In a production-quality application, the Facebook profile should
    // be associated with a user record in the application's database, which
    // allows for account linking and authentication with other identity
    // providers.
    done(undefined, profile);
}));
// passport.use(new LinkedinStrategy({
//     clientID: process.env.LINKEDIN_CLIENT_ID,
//     clientSecret: process.env.LINKEDIN_SECRET_ID,
//     callbackURL: "http://localhost:3000/linkedin/callback",
//     passReqToCallback: true
// }, (request, accessToken, refreshToken, profile, done) => {
//     console.log(profile)
//     done(null, profile)
// }));
// passport.use(new twitterStrategy({
//     clientID: process.env.TWITTER_CLIENT_ID,
//     clientSecret: process.env.TWITTER_SECRET_ID,
//     callbackURL: "http://localhost:3000/twitter/callback",
//     passReqToCallback: true
// }, (request, accessToken, refreshToken, profile, done) => {
//     console.log(profile)
//     done(null, profile)
// }));
// Configure Passport authenticated session persistence.
passport_1.default.serializeUser((user, done) => {
    done(null, user);
});
passport_1.default.deserializeUser((obj, done) => {
    done(null, obj);
});
