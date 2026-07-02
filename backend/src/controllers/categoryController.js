const { Category } = require('../models');

async function list(req, res, next) {
  try {
    const categories = await Category.findAll({ order: [['name', 'ASC']] });
    return res.json(categories);
  } catch (err) {
    return next(err);
  }
}

async function getOne(req, res, next) {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ error: 'Categoria não encontrada.' });
    return res.json(category);
  } catch (err) {
    return next(err);
  }
}

async function create(req, res, next) {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ error: 'Nome é obrigatório.' });
    const category = await Category.create({ name, description });
    return res.status(201).json(category);
  } catch (err) {
    return next(err);
  }
}

async function update(req, res, next) {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ error: 'Categoria não encontrada.' });

    const { name, description } = req.body;
    if (name) category.name = name;
    if (description !== undefined) category.description = description;

    await category.save();
    return res.json(category);
  } catch (err) {
    return next(err);
  }
}

async function remove(req, res, next) {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ error: 'Categoria não encontrada.' });
    await category.destroy();
    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
}

module.exports = { list, getOne, create, update, remove };
