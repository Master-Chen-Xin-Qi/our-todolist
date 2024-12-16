const db = require('../persistence');

module.exports = async (req, res) => {
    console.log('Get Updated item:', req.body);
    await db.updateItem(req.params.id, {
        name: req.body.name,
        completed: req.body.completed,
        reminderDate: req.body.reminderDate.split('T')[0],
        user: req.body.user
    });
    const item = await db.getItem(req.params.id);
    res.send(item);
};
