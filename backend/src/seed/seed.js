require('dotenv').config();
const bcrypt = require('bcryptjs');
const { sequelize, User, Category, Ticket, Comment } = require('../models');

async function seed() {
  await sequelize.sync({ force: true });

  const passwordHash = await bcrypt.hash('123456', 10);

  const admin = await User.create({ name: 'Admin Geral', email: 'admin@helpdesk.com', password: passwordHash, role: 'admin' });
  const tecnico = await User.create({ name: 'Carlos Técnico', email: 'tecnico@helpdesk.com', password: passwordHash, role: 'tecnico' });
  const cliente = await User.create({ name: 'Maria Cliente', email: 'cliente@helpdesk.com', password: passwordHash, role: 'cliente' });

  const catRede = await Category.create({ name: 'Rede', description: 'Problemas de conectividade e internet' });
  const catHardware = await Category.create({ name: 'Hardware', description: 'Problemas com equipamentos físicos' });
  const catSoftware = await Category.create({ name: 'Software', description: 'Problemas com sistemas e aplicativos' });

  const ticket = await Ticket.create({
    title: 'Impressora não imprime',
    description: 'A impressora do setor financeiro não está respondendo aos comandos de impressão.',
    status: 'aberto',
    priority: 'media',
    categoryId: catHardware.id,
    requesterId: cliente.id,
    assignedToId: tecnico.id,
  });

  await Comment.create({
    message: 'Já verificou se o cabo USB está bem conectado?',
    ticketId: ticket.id,
    authorId: tecnico.id,
  });

  console.log('Seed concluído com sucesso!');
  console.log('Usuários de teste (senha: 123456):');
  console.log(' - admin@helpdesk.com (admin)');
  console.log(' - tecnico@helpdesk.com (tecnico)');
  console.log(' - cliente@helpdesk.com (cliente)');

  process.exit(0);
}

seed().catch((err) => {
  console.error('Erro ao rodar o seed:', err);
  process.exit(1);
});
