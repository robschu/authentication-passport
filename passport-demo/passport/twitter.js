var TwitterStrategy  = require('passport-twitter').Strategy;
var User = require('../models/user');
var twitterConfig = require('../twitter.js');

module.exports = function(passport) {

    passport.use('twitter', new TwitterStrategy({
        consumerKey     : twitterConfig.apikey,
        consumerSecret  : twitterConfig.apisecret,
        callbackURL     : twitterConfig.callbackURL

    },
    function(token, tokenSecret, profile, cb) {
console.log(token);
console.log(tokenSecret);
        // make the code asynchronous
	// User.findOne won't fire until we have all our data back from Twitter
    	process.nextTick(function() {

	        User.findOne({ 'twitter.id' : profile.id }, function(err, user) {

	       	 	// if there is an error, stop everything and return that
		        // ie an error connecting to the database
	            if (err)
	                return cb(err);

				// if the user is found then log them in
	            if (user) {
	                return cb(null, user); // user found, return that user
	            } else {
	                // if there is no user, create them
			console.log(profile);

	                var newUser                 = new User();

					// set all of the user data that we need
	                newUser.twitter.id          = profile.id;
	                newUser.twitter.token       = token;
	                newUser.twitter.username = profile.username;
	                newUser.twitter.displayName = profile.displayName;
	                newUser.twitter.lastStatus = profile._json.profile_image_url;

					// save our user into the database
	                newUser.save(function(err) {
	                    if (err)
	                        throw err;
	                    return cb(null, newUser);
	                });
	            }
	        });

		});

    }));

};
