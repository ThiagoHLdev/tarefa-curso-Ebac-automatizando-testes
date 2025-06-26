const express = require('express');
const app = express();
app.use(express.json());

let usuarios = [];
let idCounter = 1;

app.get('/usuarios', (req, res) => {
  res.json({ usuarios });
});

app.post('/usuarios', (req, res) => {
  const { email } = req.body;
  const existente = usuarios.find(u => u.email === email);
  if (existente) {
    return res.status(400).json({ message: 'Este email já está sendo usado' });
  }
  const usuario = { _id: idCounter++, ...req.body };
  usuarios.push(usuario);
  res.status(201).json({ message: 'Cadastro realizado com sucesso', ...usuario });
});

app.put('/usuarios/:id', (req, res) => {
  const { id } = req.params;
  const index = usuarios.findIndex(u => u._id == id);
  if (index >= 0) {
    usuarios[index] = { _id: parseInt(id), ...req.body };
    return res.json({ message: 'Registro alterado com sucesso' });
  }
  res.status(404).json({ message: 'Usuário não encontrado' });
});

app.delete('/usuarios/:id', (req, res) => {
  const { id } = req.params;
  usuarios = usuarios.filter(u => u._id != id);
  res.json({ message: 'Registro excluído com sucesso' });
});

app.listen(3000, () => console.log('ServeRest localhost rodando na porta 3000'));