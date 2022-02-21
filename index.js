const express = require('express');
const bodyParser = require('body-parser');
const middlewares = require('./middlewares');

const app = express();

app.use(bodyParser.json());

app.use('/user', require('./controllers/UserController'));

app.use(middlewares.joiError);
app.use(middlewares.domainError);
app.use(middlewares.serverError);

app.listen(3000, () => console.log('ouvindo porta 3000!'));

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (request, response) => {
  response.send();
});
