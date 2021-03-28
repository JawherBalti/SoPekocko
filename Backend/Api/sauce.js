const Sauce = require('../DB/sauce')
const fs = require('fs'); //supprimer les images du serveur

const getAllSauces = (req, res) => {
    Sauce.find()
        .then(sauce => res.status(200).json(sauce))
        .catch(err => res.status(404).json({ err }))
}

const getSauce = (req, res) => {
    Sauce.findById(req.params.id)
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }))
};

const createSauce = (req, res) => {
    const sauceObj = JSON.parse(req.body.sauce)
    delete sauceObj._id
    const sauce = new Sauce({
        ...sauceObj,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0
    })
    sauce.save()
        .then(() => res.status(201).json({ message: 'Sauce enregistrée !' }))
        .catch(error => {
            res.status(400).json({ error })
        })
}

const updateSauce = (req, res, next) => {
    if (req.file) {
        // si l'image est modifiée, on supprime l'ancienne image dans le serveur
        Sauce.findOne({ id: req.params.id })
            .then(sauce => {
                const filename = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    //mettre à jour le reste des informations
                    const sauceObj = {
                        ...JSON.parse(req.body.sauce),
                        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
                    }
                    Sauce.updateOne({ id: req.params.id }, { ...sauceObj, id: req.params.id })
                        .then(() => res.status(200).json({ message: 'Sauce modifiée!' }))
                        .catch(error => res.status(400).json({ error }));
                })
            })
            .catch(error => res.status(500).json({ error }));
    } else {
        // si l'image n'est pas modifiée
        const sauceObj = { ...req.body };
        Sauce.updateOne({ _id: req.params.id }, { ...sauceObj, _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Sauce modifiée!' }))
            .catch(error => res.status(400).json({ error }));
    }
}

const deleteSauce = (req, res) => {
    Sauce.findOne({ id: req.params.id })
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1]
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Sauce supprimée !' }))
                    .catch(error => res.status(400).json({ error }))
            })
        })
        .catch(error => res.status(500).json({ error }))
}


const likeDislikeSauce = (req, res) => {
    const userId = req.body.userId;
    const like = req.body.like;
    Sauce.findById(req.params.id)
        .then(sauce => {
            const newValues = {
                usersLiked: sauce.usersLiked,
                usersDisliked: sauce.usersDisliked,
                likes: 0,
                dislikes: 0
            }
            //like
            if (like === 1) {
                newValues.usersLiked.push(userId);
            }
            //dislike
            else if (like === -1) {
                newValues.usersDisliked.push(userId);
            }
            //annuler like/dislike
            else if (like === 0) {
                if (newValues.usersLiked.includes(userId)) {
                    // si on annule le like
                    const index = newValues.usersLiked.indexOf(userId);
                    newValues.usersLiked.splice(index, 1);
                } else {
                    // si on annule le dislike
                    const index = newValues.usersDisliked.indexOf(userId);
                    newValues.usersDisliked.splice(index, 1);
                }
            }

            //nombre de like/dislike
            newValues.likes = newValues.usersLiked.length;
            newValues.dislikes = newValues.usersDisliked.length;

            // Mise à jour de la sauce avec les nouvelles valeurs
            Sauce.updateOne({ id: req.params.id }, newValues)
                .then(() => res.status(200).json({ message: 'Sauce notée !' }))
                .catch(error => res.status(400).json({ error }))
        })
        .catch(error => res.status(500).json({ error }))
}

module.exports = { getAllSauces, getSauce, createSauce, updateSauce, deleteSauce, likeDislikeSauce }