const { Router } = require('express');
const categoryController = require('../controllers/categoryController');
const { authenticate, authorize } = require('../middleware/auth');

const router = Router();

router.use(authenticate);

router.get('/', categoryController.list);
router.get('/:id', categoryController.getOne);
router.post('/', authorize('admin', 'tecnico'), categoryController.create);
router.put('/:id', authorize('admin', 'tecnico'), categoryController.update);
router.delete('/:id', authorize('admin'), categoryController.remove);

module.exports = router;
