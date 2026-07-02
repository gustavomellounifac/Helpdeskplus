const { Ticket, User, Category, Comment } = require('../models');

const includeRelations = [
  { model: Category, as: 'category' },
  { model: User, as: 'requester', attributes: { exclude: ['password'] } },
  { model: User, as: 'assignedTo', attributes: { exclude: ['password'] } },
];

// Clientes só veem os próprios chamados; técnicos e admins veem todos.
async function list(req, res, next) {
  try {
    const where = req.user.role === 'cliente' ? { requesterId: req.user.id } : {};
    const tickets = await Ticket.findAll({
      where,
      include: includeRelations,
      order: [['createdAt', 'DESC']],
    });
    return res.json(tickets);
  } catch (err) {
    return next(err);
  }
}

async function getOne(req, res, next) {
  try {
    const ticket = await Ticket.findByPk(req.params.id, {
      include: [
        ...includeRelations,
        {
          model: Comment,
          as: 'comments',
          include: [{ model: User, as: 'author', attributes: { exclude: ['password'] } }],
        },
      ],
    });
    if (!ticket) return res.status(404).json({ error: 'Chamado não encontrado.' });

    if (req.user.role === 'cliente' && ticket.requesterId !== req.user.id) {
      return res.status(403).json({ error: 'Você não tem acesso a este chamado.' });
    }

    return res.json(ticket);
  } catch (err) {
    return next(err);
  }
}

async function create(req, res, next) {
  try {
    const { title, description, priority, categoryId } = req.body;
    if (!title || !description) {
      return res.status(400).json({ error: 'Título e descrição são obrigatórios.' });
    }

    const ticket = await Ticket.create({
      title,
      description,
      priority: priority || 'media',
      categoryId: categoryId || null,
      requesterId: req.user.id,
    });

    const full = await Ticket.findByPk(ticket.id, { include: includeRelations });
    return res.status(201).json(full);
  } catch (err) {
    return next(err);
  }
}

async function update(req, res, next) {
  try {
    const ticket = await Ticket.findByPk(req.params.id);
    if (!ticket) return res.status(404).json({ error: 'Chamado não encontrado.' });

    if (req.user.role === 'cliente' && ticket.requesterId !== req.user.id) {
      return res.status(403).json({ error: 'Você não tem acesso a este chamado.' });
    }

    const { title, description, status, priority, categoryId, assignedToId } = req.body;

    // Clientes só podem editar título/descrição/categoria; status e atribuição são de técnico/admin.
    if (title) ticket.title = title;
    if (description) ticket.description = description;
    if (categoryId !== undefined) ticket.categoryId = categoryId;

    if (req.user.role !== 'cliente') {
      if (status) ticket.status = status;
      if (priority) ticket.priority = priority;
      if (assignedToId !== undefined) ticket.assignedToId = assignedToId;
    }

    await ticket.save();
    const full = await Ticket.findByPk(ticket.id, { include: includeRelations });
    return res.json(full);
  } catch (err) {
    return next(err);
  }
}

async function remove(req, res, next) {
  try {
    const ticket = await Ticket.findByPk(req.params.id);
    if (!ticket) return res.status(404).json({ error: 'Chamado não encontrado.' });

    if (req.user.role === 'cliente' && ticket.requesterId !== req.user.id) {
      return res.status(403).json({ error: 'Você não tem acesso a este chamado.' });
    }

    await ticket.destroy();
    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
}

module.exports = { list, getOne, create, update, remove };
