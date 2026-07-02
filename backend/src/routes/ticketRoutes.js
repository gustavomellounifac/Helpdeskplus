const { Router } = require('express');
const ticketController = require('../controllers/ticketController');
const commentController = require('../controllers/commentController');
const { authenticate } = require('../middleware/auth');

const router = Router();

router.use(authenticate);

router.get('/', ticketController.list);
router.get('/:id', ticketController.getOne);
router.post('/', ticketController.create);
router.put('/:id', ticketController.update);
router.delete('/:id', ticketController.remove);

router.get('/:ticketId/comments', commentController.list);
router.post('/:ticketId/comments', commentController.create);

module.exports = router;
