const { Comment, Ticket, User } = require('../models');

async function checkTicketAccess(req, ticketId) {
  const ticket = await Ticket.findByPk(ticketId);
  if (!ticket) return { error: 404, message: 'Chamado não encontrado.' };
  if (req.user.role === 'cliente' && ticket.requesterId !== req.user.id) {
    return { error: 403, message: 'Você não tem acesso a este chamado.' };
  }
  return { ticket };
}

async function list(req, res, next) {
  try {
    const access = await checkTicketAccess(req, req.params.ticketId);
    if (access.error) return res.status(access.error).json({ error: access.message });

    const comments = await Comment.findAll({
      where: { ticketId: req.params.ticketId },
      include: [{ model: User, as: 'author', attributes: { exclude: ['password'] } }],
      order: [['createdAt', 'ASC']],
    });
    return res.json(comments);
  } catch (err) {
    return next(err);
  }
}

async function create(req, res, next) {
  try {
    const access = await checkTicketAccess(req, req.params.ticketId);
    if (access.error) return res.status(access.error).json({ error: access.message });

    const { message } = req.body;
    if (!message) return res.status(400).json({ error: 'Mensagem é obrigatória.' });

    const comment = await Comment.create({
      message,
      ticketId: req.params.ticketId,
      authorId: req.user.id,
    });

    const full = await Comment.findByPk(comment.id, {
      include: [{ model: User, as: 'author', attributes: { exclude: ['password'] } }],
    });
    return res.status(201).json(full);
  } catch (err) {
    return next(err);
  }
}

async function update(req, res, next) {
  try {
    const comment = await Comment.findByPk(req.params.id);
    if (!comment) return res.status(404).json({ error: 'Comentário não encontrado.' });

    if (comment.authorId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Você só pode editar seus próprios comentários.' });
    }

    const { message } = req.body;
    if (message) comment.message = message;
    await comment.save();

    return res.json(comment);
  } catch (err) {
    return next(err);
  }
}

async function remove(req, res, next) {
  try {
    const comment = await Comment.findByPk(req.params.id);
    if (!comment) return res.status(404).json({ error: 'Comentário não encontrado.' });

    if (comment.authorId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Você só pode remover seus próprios comentários.' });
    }

    await comment.destroy();
    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
}

module.exports = { list, create, update, remove };
