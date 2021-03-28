const User = require('../DB/user')
const jwt = require('jsonwebtoken') //générer le token
const bcrypt = require('bcrypt') //pour crypter/decrypter le mot de passe
const cryptojs = require('crypto-js') //pour crypter/decrypter l'email
const dotenv = require('dotenv') //permet de récupérer les variables d'environnement (stockeées dans le fichier .env) en utilisant "process.env"

dotenv.config() //charger le fichier .env

const registerUser = async (req, res) => {
    const { email, password } = req.body
    let user = await User.findOne({ email })
    if (user) {
        return res.send({ message: "email existe" })
    }
    else {
        const user = new User({
            email: cryptojs.HmacSHA256(email, process.env.EMAIL_KEY).toString(),
            password
        });
        user.save()
            .then(() => res.status(200).json({ message: "user " + user + " added successfully!" }))
            .catch(error => res.status(400).json({ error }))
    }
}

const login = (req, res) => {
    const { password } = req.body
    const encryptedEmail = cryptojs.HmacSHA256(req.body.email, process.env.EMAIL_KEY).toString();
    User.findOne({ email: encryptedEmail })
        .then(user => {

            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if (isMatch) {
                        //generer token
                        const token = jwt.sign({
                                userId: user.userId,
                            }, process.env.JWT_SECRET,
                            {
                                expiresIn: "7d" //validité du token 7jours
                            })

                        return res.status(200).json({ userId: user.userId, token: token })
                    }
                    else {
                        return res.send("mot de passe incorrecte")
                    }
                })

        })
        .catch(error => res.status(500).json({ error }));
}

module.exports = { registerUser, login }