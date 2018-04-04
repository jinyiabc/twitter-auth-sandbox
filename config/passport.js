const passport = require('passport');
const TwitterStrategy = require('passport-twitter').Strategy;
const User = require('../models/users');
const twitterAuth = {
		consumerKey: process.env.consumerKey,
		consumerSecret: process.env.consumerSecret,
		callbackURL: process.env.APP_URL+'auth/twitter/callback'
	};

console.log(process.env.consumerKey);
console.log(process.env.consumerSecret);
console.log(process.env.APP_URL);

passport.use(new TwitterStrategy(twitterAuth,
	function (token, refreshToken, profile, done) {
		console.log('Profile:',profile);
		process.nextTick(function () {
			User.findOne({ 'twitterId': profile.id }, function (err, user) {
				if (err) {
					return done(err);
				}

				if (user) {
					return done(null, user);
				} else {
					var newUser = new User();

					newUser.twitterId = profile.id;
					newUser.username = profile.username;
					newUser.displayName = profile.displayName;
					newUser.imageUrl = profile.photos[0].value;

					newUser.save(function (err) {
						if (err) {
							throw err;
						}

						return done(null, newUser);
					});
				}
			});
		});
		// return done(null, profile);

	}));

// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  In a
// production-quality application, this would typically be as simple as
// supplying the user ID when serializing, and querying the user record by ID
// from the database when deserializing.  However, due to the fact that this
// example does not have a database, the complete Facebook profile is serialized
// and deserialized.

passport.serializeUser(function (user, done) {
	console.log(user);
	done(null, user);
});

passport.deserializeUser(function (id, done) {
	// User.findById(id, function (err, user) {
		done(null, id);
	// });
});

// The fetched object is attached to the request object as req.user ater desrialization.

module.exports  = passport;
