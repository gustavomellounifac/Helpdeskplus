const sequelize = require('../config/db');
const User = require('./User');
const Category = require('./Category');
const Ticket = require('./Ticket');
const Comment = require('./Comment');

// Um chamado pertence a uma categoria; uma categoria tem vários chamados
Category.hasMany(Ticket, { foreignKey: 'categoryId', as: 'tickets' });
Ticket.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

// Um chamado é aberto por um solicitante (cliente) e pode ser atribuído a um técnico
User.hasMany(Ticket, { foreignKey: 'requesterId', as: 'requestedTickets' });
Ticket.belongsTo(User, { foreignKey: 'requesterId', as: 'requester' });

User.hasMany(Ticket, { foreignKey: 'assignedToId', as: 'assignedTickets' });
Ticket.belongsTo(User, { foreignKey: 'assignedToId', as: 'assignedTo' });

// Um chamado tem vários comentários; um comentário pertence a um chamado e a um autor
Ticket.hasMany(Comment, { foreignKey: 'ticketId', as: 'comments', onDelete: 'CASCADE' });
Comment.belongsTo(Ticket, { foreignKey: 'ticketId', as: 'ticket' });

User.hasMany(Comment, { foreignKey: 'authorId', as: 'comments' });
Comment.belongsTo(User, { foreignKey: 'authorId', as: 'author' });

module.exports = {
  sequelize,
  User,
  Category,
  Ticket,
  Comment,
};
