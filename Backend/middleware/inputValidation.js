const Joi = require('joi');


// Valider les données d'entrée lors du signup ou login d'un utilisateur
 
const userSchema = Joi.object({
    email: Joi.string().trim().email().required(),
    password: Joi.string().trim().min(4).required()
});
const user = (req, res, next) => {
    const {error, value} = userSchema.validate(req.body);
    if (error) {
        res.status(422).json({ error: "email ou mot de passe invalide" });
    } else {
        next();
    }
};


// Valider les données d'entrée lors de l'ajout ou la modification d'une sauce

const sauceSchema = Joi.object({
    userId: Joi.string().trim().length(24).required(),
    name: Joi.string().trim().min(1).required(),
    manufacturer: Joi.string().trim().min(1).required(),
    description: Joi.string().trim().min(1).required(),
    mainPepper: Joi.string().trim().min(1).required(),
    heat: Joi.number().integer().min(1).max(10).required()
})
const sauce = (req, res, next) => {
    let sauce;
    if (req.file) {
        sauce = JSON.parse(req.body.sauce);
    } else {
        sauce = req.body;
    }
    
    const {error, value} = sauceSchema.validate(sauce);
    if (error) {
        res.status(422).json({ error: "Les données entrées sont invalides" });
    } else {
        next();
    }
}


//Valider l'id des sauces
 
const idSchema = Joi.string().trim().length(24).required();
const id = (req, res, next) => {
    const {error, value} = idSchema.validate(req.params.id);
    if (error) {
        res.status(422).json({ error: "id de la sauce invalide" });
    } else {
        next();
    }  
}

module.exports = { user, sauce, id  }