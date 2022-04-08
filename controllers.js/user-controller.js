const { User } = require('../models');

const userController = {
    ///api/users
    // GET all users
    getAllUsers(req,res) {
        User.find({})
        // .populate({
        //     path: 'thoughts',
        //     select: '-__v'
        // })
        // .select('-__v')
        .sort({ _id: -1})
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
    },
    
    // GET a single user by its __id and populated thought and friend data
    getUserById({params}, res) {
        User.findOne({ _id: params.userId })
        .populate({
            path: 'thoughts',
            select: '-__v'
        })
        .populate({
            path: 'friends',
            select: '-__v'        
        })
        .select('-__v')
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: "No user found with this id!" });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err)
        })
    },

    // POST a new user
    createUser({body}, res) {
        User.create(body)
        .then(dbUserData => res.json(dbUserData))
        .catch(err => console.log(err)) 
    },

    // PUT update a user by its __id
    updateUser({params, body}, res) {
        User.findOneAndUpdate({ _id: params.userId}, body, {new: true, runValidators: true})
        .then(dbUserData => {
            if(!dbUserData) {
                res.status(404).json({ message: "No user found with this id!" });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => res.status(400).json(err))
    },

    // DELETE a user by its __id
    deleteUser({params}, res) {
        User.findOneAndDelete({ _id: params.userId})
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No user found with this id!'});
                return;
            }
            res.json(dbUserData)
        })
        .catch(err => res.status(400).json(err))
    },

    //*BONUS* Remove a user's associated thoughts when deleted

    ///api/users/:userId/friends/:friendId
    // POST to add a new friend to a user's friend list
    addFriend({params}, res) {
        User.findOneAndUpdate(
            { _id: params.userId},
            { $push: { friends:  params.friendId}},
            { new: true, runValidators: true}
        )
        .then(dbUserData => {
            if(!dbUserData) {
                res.status(404).json({ message: 'no user found with this id!'});
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => res.status(400).json(err));
    },

    // DELETE to remove a friend from a user's friend list
    removeFriend({params}, res) {
        User.findOneAndUpdate(
            { _id: params.userId},
            { $pull: { friends: params.friendId}},
            { new: true, runValidators: true}
        )
        .then(dbUserData => {
            if(!dbUserData) {
                res.status(404).json({ message: 'no user found with this id!'});
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => res.status(400).json(err));
    }
};

module.exports = userController;