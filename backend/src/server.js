require('dotenv').config();
const express = require('express');
const cors = require('cors');

const { sequelize } = require('./models');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());

app.use('/api', routes);

app.use(errorHandler);

const PORT = process.env.PORT || 3333;

async function start() {
  try {
    await sequelize.authenticate();
    await sequelize.sync(); // MVP: sincroniza os models direto no banco (sem migrations)
    console.log('Conexão com o banco MySQL estabelecida.');

    app.listen(PORT, () => {
      console.log(`API HelpDesk+ rodando em http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Falha ao iniciar o servidor:', err);
    process.exit(1);
  }
}

start();
