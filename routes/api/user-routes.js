const router = require('express').Router();

const { 
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    addFriend,
    removeFriend,
    
} = require('../../controllers.js/user-controller');

// set up GET all and POST at /api/users
router
    .route('/')
    .get(getAllUsers)
    .post(createUser);


// set up GET, PUT, and DELETE at /api/users/:userId
router
    .route('/:userId')
    .get(getUserById)
    .put(updateUser)
    .delete(deleteUser);

// set up POST and DELETE at /api/users/:userId/friends/:friendId


router
    .route('/:userId/friends/:friendId')
    .post(addFriend)
    .delete(removeFriend);


module.exports = router;

