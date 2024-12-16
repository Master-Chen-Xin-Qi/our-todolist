const db = require('../persistence');
const {v4 : uuid} = require('uuid');

module.exports = async (req, res) => {
    const item = {
        id: uuid(),
        name: req.body.name,
        completed: false,
        reminderDate: req.body.reminderDate,
        user: req.body.user
    };
    console.log('Adding new item:', item);

    await db.storeItem(item);

    // console.log('Finish')
    res.send(item);
};
