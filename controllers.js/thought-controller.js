const { Thought, User } = require('../models');

const thoughtController = {
    //api/thoughts
    // GET all thoughts
    getAllThought(req,res) {
        Thought.find({})
        .then(dbThoughtData => res.json(dbThoughtData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err)
        })
    },

    // GET a single thought by its __id 
    getThoughtById({params},res) {
        Thought.findOne({ _id: params.thoughtId})
        .then(dbThoughtData => {
            if(!dbThoughtData) {
                res.status(404).json({ message: "No Thought found with this id!"})
                return;
            }
            res.json(dbThoughtData)
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err)
        })
    },


    // POST a new thought ( don't forget to push the created thought's __id to the associated user's thoughts array field)
    addThought({params, body}, res) {
        Thought.create(body)
        .then(({ _id}) => {
            console.log(_id)
            return User.findOneAndUpdate(
                { _id: params.userId},
                {$push: {thoughts: _id}},
                {new: true, runValidators: true}
            )
        })
        .then(dbThoughtData => {
            if (!dbThoughtData) {
                res.status(404).json({ message: "No user found with this id"})
                return;
            }
            res.json(dbThoughtData);
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        })
    },

    // PUT update a thought by its __id
    updateThought({params, body}, res) {
        Thought.findOneAndUpdate({ _id: params.thoughtId}, body, {new: true, runValidators: true})
        .then(dbThoughtData => {
            if(!dbThoughtData) {
                res.status(404).json({ message: "No thought found with this id"})
                return;
            }
            res.json(dbThoughtData);
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err)
        })
    },

    // DELETE a thought by its __id
    removeThought({ params }, res) {
        Thought.findOneAndDelete( { _id: params.thoughtId})
        .then(dbThoughtData => {
            if (!dbThoughtData) {
                res.status(404).json({ message: "No thought found with this id!"})
            }
            res.json(dbThoughtData);
        })
        .catch(err => res.status(400).json(err))
    },


    //api/thoughts/:thoughtId/reactions
    // POST create a reaction stored in a single thought's reactions array
    addReaction({params, body}, res) {
        Thought.findOneAndUpdate( 
            { _id: params.thoughtId},
            { $push: {reactions: body}},
            { new: true, runValidators: true}
        )
        .then(dbThoughtData => {
            if (!dbThoughtData) {
                res.status(404).json(err);
                return;
            }
            res.json(dbThoughtData);
        })
        .catch(err => res.status(400).json(err))
    },
        
    // DELETE to pull and remove a reaction by the reaction's reactionId value
    removeReaction({params}, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId},
            { $pull: { reactions: {reactionId: params.reactionId}}},
            { new: true}
        )
        .then(dbThoughtData => res.json(dbThoughtData))
        .catch(err => res.status(400).json(err))
    }
};

module.exports = thoughtController;