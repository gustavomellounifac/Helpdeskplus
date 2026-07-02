const bcrypt = require('bcryptjs');
const { User } = require('../models');

async function list(req, res, next) {
  try {
    const users = await User.findAll({ order: [['name', 'ASC']] });
    return res.json(users);
  } catch (err) {
    return next(err);
  }
}

async function getOne(req, res, next) {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' });
    return res.json(user);
  } catch (err) {
    return next(err);
  }
}

async function create(req, res, next) {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Nome, e-mail e senha são obrigatórios.' });
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, role: role || 'cliente' });
    const { password: _pw, ...safeUser } = user.toJSON();
    return res.status(201).json(safeUser);
  } catch (err) {
    return next(err);
  }
}

async function update(req, res, next) {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' });

    const { name, email, role, password } = req.body;
    if (name) user.name = name;
    if (email) user.email = email;
    if (role) user.role = role;
    if (password) user.password = await bcrypt.hash(password, 10);

    await user.save();
    const { password: _pw, ...safeUser } = user.toJSON();
    return res.json(safeUser);
  } catch (err) {
    return next(err);
  }
}

async function remove(req, res, next) {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' });
    await user.destroy();
    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
}

module.exports = { list, getOne, create, update, remove };
