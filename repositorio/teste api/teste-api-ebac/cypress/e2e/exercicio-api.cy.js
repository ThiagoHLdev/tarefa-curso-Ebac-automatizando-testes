/// <reference types="cypress" />

const faker = require('faker');

describe('Funcionalidade: Usuários', () => {
  let email = faker.internet.email();

  it('Deve listar todos os usuários', () => {
    cy.request('GET', 'http://localhost:3000/usuarios')
      .should((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('usuarios');
      });
  });

  it('Deve cadastrar um novo usuário com sucesso', () => {
    cy.request('POST', 'http://localhost:3000/usuarios', {
      nome: 'Usuário EBAC',
      email: email,
      password: 'teste123',
      administrador: 'true'
    }).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body.message).to.eq('Cadastro realizado com sucesso');
    });
  });

  it('Não deve permitir cadastro com email já existente', () => {
    cy.request({
      method: 'POST',
      url: 'http://localhost:3000/usuarios',
      failOnStatusCode: false,
      body: {
        nome: 'Usuário Repetido',
        email: email,
        password: 'teste123',
        administrador: 'false'
      }
    }).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body.message).to.eq('Este email já está sendo usado');
    });
  });

  it('Deve editar um usuário já cadastrado', () => {
    cy.request('POST', 'http://localhost:3000/usuarios', {
      nome: 'Usuário para editar',
      email: faker.internet.email(),
      password: 'teste123',
      administrador: 'true'
    }).then((response) => {
      const id = response.body._id;

      cy.request('PUT', `http://localhost:3000/usuarios/${id}`, {
        nome: 'Usuário editado',
        email: faker.internet.email(),
        password: 'novaSenha123',
        administrador: 'false'
      }).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body.message).to.eq('Registro alterado com sucesso');
      });
    });
  });

  it('Deve deletar um usuário', () => {
    cy.request('POST', 'http://localhost:3000/usuarios', {
      nome: 'Usuário para deletar',
      email: faker.internet.email(),
      password: 'senha123',
      administrador: 'true'
    }).then((response) => {
      const id = response.body._id;

      cy.request('DELETE', `http://localhost:3000/usuarios/${id}`).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body.message).to.eq('Registro excluído com sucesso');
      });
    });
  });
});