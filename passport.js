const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const passportJWT = require('passport-jwt');
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

const userModel = require('./models/userModel');


passport.use(new LocalStrategy(
    {
        usernameField: 'username',
        passwordField: 'password',        
    },
    function (username, password, cb) {
        console.log("local login authenticate");
        console.log(username);
        return userModel.getByEmail(username)
            .then((data) => {
                if (data.length > 0) { // đã tồn tại
                    if (password === data[0].password) {                        
                        return cb(null, { loginUser: data[0] }, { message: 'Logged in successfully', code: 3 });
                    }
                    else {
                        cb(null, false, { message: 'Wrong password', code: 1 });
                    }
                }
                else {
                    return cb(null, false, { message: 'Wrong email', code: 0 });
                }
            })
            .catch((error) => {                
                return cb(error)
            });
    }
));

passport.use(new JWTStrategy(
    {
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: '1612018_1612175',
    },
    function (jwtPayload, cb){              
        return userModel.getByID(jwtPayload.id)
            .then(user=>{                
                return cb(null, user,{message: 'Authorized', code: 1 });
            })
            .catch(err=>{                
                return cb(err, null,{ message: 'Can not authorized', code: 0 });
            });
    }
));
