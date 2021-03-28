const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

SALT_WORK_FACTOR = 10;

const UserSchema = new mongoose.Schema({
    userId: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    }
})

//faire le cryptage du mot de passe avant de l'enregistrer dans la base de données
UserSchema.pre('save', function (next) {
    var user = this;
    user.userId = user._id;
    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();
    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) return next(err);
            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
    return user
});

module.exports = mongoose.model("User", UserSchema)