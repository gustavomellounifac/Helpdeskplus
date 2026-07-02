const { Router } = require('express');
const commentController = require('../controllers/commentController');
const { authenticate } = require('../middleware/auth');

const router = Router();

router.use(authenticate);

router.put('/:id', commentController.update);
router.delete('/:id', commentController.remove);

module.exports = router;
