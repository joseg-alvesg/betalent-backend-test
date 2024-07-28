:warning: Requisitos para executar a aplicação

- Node.js >= 20.6
- MySQL
- docker / docker-compose (opcional)

> altere a porta caso tenha problemas com a porta 3006 do mysql ao utilizar o docker no arquivo docker-compose.yml e no arquivo .env

### configuração inicial

clone o projeto

```bash
git clone https://github.com/joseg-alvesg/betalent-backend-test.git

# entrar na pasta do projeto
cd betalent-backend-test

# copie o arquivo .env.example para .env
cp .env.example .env
```

> :warning: altere o arquivo .env com as configurações do seu banco de dados

##### escolha uma das opções abaixo para configurar o banco de dados

<details>
  <summary>Com docker</summary>
-
```bash
docker-compose up -d
```
</details>

<details>
<summary>sem docker</summary>

garanta que o mysql esteja rodando e crie manualmente o database com o nome
que preferir mas que esteja de acordo com o arquivo .env

```bash
# acessar o mysql
mysql -u root -p

#caso queira criar um usuario para a aplicação (opcional)
CREATE USER 'nome_do_usuario' IDENTIFIED BY 'senha_do_usuario';

# criar o database
CREATE DATABASE nome_do_database;
```

</details>

##### próximos passos

na pasta raiz do projeto execute os comandos abaixo

```bash
# instalar as dependencias
npm install

# rodar as migrations e seeders
npm run db:fresh

# iniciar o servidor
npm run dev # utiliza a flag --hmr para hot reload
ou
npm run legacy # sem hot reload a flag --watch modelo antigo do adonis
```

> verifique os scripts em package.json

#### executando a aplicação

<details>
  <summary> Diagrama de relacionamentos entre as tabelas </summary>

![diagrama](./assets/betalentdb-diagram.png)

</details>

##### Rotas

são ao todo 11 rotas disponíveis estarão listadas abaixo com um breve resumo de
cada uma e como acessalas.
Além da validação via token utilizando JWT não há middlewares adicionais,
e as validações de entrada de dados estão sendo feitas dentro de cada método, com exceção de alguns metodos store e update que estão utilizando o vinejs.

é possivel visualizar as rotas através do comando:

```bash
node ace list:routes
```

output esperado:

```bash

METHOD ROUTE ........................ MIDDLEWARE
POST /signup ......................
POST /login .......................
GET /clients (clients.index) ..... auth
POST /clients (clients.store) ..... auth
GET /clients/:id (clients.show) .. auth
PUT /clients/:id ................. auth
DELETE /clients/:id ................. auth
GET /products (products.index) ... auth
POST /products (products.store) ... auth
GET /products/:id (products.show) auth
PUT /products/:id ................ auth
DELETE /products/:id ................ auth
POST /sales ....................... auth
```

> :warning: as rotas que necessitam de autenticação estão marcadas com o middleware auth lembresse de passar o token no header da requisição

<details>
  <summary>USUÁRIOS</summary>

- POST /signup

  cria um novo usuário, é necessário passar um email e senha

  input:

  ```json
  {
    "email": "email1@gmail.com",
    "password": "123456"
  }
  ```

  output:

  ```json
  {
    "email": "email1@gmail.com",
    "createdAt": "2024-07-24T18:59:44.504+00:00",
    "updatedAt": "2024-07-24T18:59:44.504+00:00",
    "id": 1
  }
  ```

- POST /login
  realiza o login do usuário, é necessário passar um email e senha

        input:

  ```json
  {
    "email": "user@gmail.com",
    "password": "123456"
  }
  ```

  output:

  ```json
  {
    "type": "bearer",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTcyMTg0NzcyMX0.sjtXsyGc-VeF2w-v5JZHg9c06_rjSTi3-8OboINhMWI"
  }
  ```

  </details>

<details>
  <summary>CLIENTES</summary>

- GET /clients (index)
  lista todos os clientes cadastrados
  output:

  ```json
      {
          "id": 1,
          "name": "Client 1",
          "phone": "123456789",
          "state": "Estado 1"
      },
      {
          "id": 2,
          "name": "Client 2",
          "phone": "987654321",
          "state": "Estado 2"
      }
  ```

- GET /clients/:id (show)
  mostra um cliente específico para buscar entre datas é necessário passar o mês, ano ou ambos
  /clients/:id?month=10&year=2024
  output:

  ```json
  {
    "id": 1,
    "name": "Client 1",
    "cpf": "123123123123",
    "createdAt": "2024-07-24T18:18:39.000+00:00",
    "updatedAt": "2024-07-24T18:18:39.000+00:00",
    "sales": [
      {
        "id": 1,
        "quantity": 3,
        "totalPrice": "30.00",
        "createdAt": "2024-07-24T18:18:39.000+00:00",
        "clientId": 1
      }
    ]
  }
  ```

- POST /clients (store)
  cria um novo cliente, é necessário passar todos os campos disponíveis com exceção do complement

  input:

  ```json
  {
    "name": "Client 1",
    "cpf": "123123123123",
    "phone": "999999999",
    "street": "Rua 1",
    "streetNumber": "12",
    "neighborhood": "Bairro 1",
    "city": "Cidade 1",
    "state": "Estado 1",
    "zipCode": "11111111"
  }
  ```

  output:

  ```json
  {
    "id": 1,
    "name": "Client 1",
    "cpf": "123123123123",
    "phone": "999999999",
    "street": "Rua 1",
    "streetNumber": "12",
    "neighborhood": "Bairro 1",
    "city": "Cidade 1",
    "state": "Estado 1",
    "zipCode": "11111111",
    "createdAt": "2024-07-24T18:18:39.000+00:00",
    "updatedAt": "2024-07-24T18:18:39.000+00:00"
  }
  ```

- PUT /clients/:id
  atualiza um cliente específico, é necessário passar pelo menos um dos campos disponiveis

  input:

  ```json
  {
    "name": "Client 1",
    "phone": "999999999",
    "complement": "complemento",
    "street": "Rua 1",
    "streetNumber": "12",
    "neighborhood": "Bairro 1",
    "city": "Cidade 1",
    "state": "Estado 1",
    "zipCode": "11111111"
  }
  ```

  ```json
  {
    "name": "Client 1",
    "complement": "complemento",
    "state": "Estado 1"
  }
  ```

  output:

  ```json
  {
    "message": "Client updated"
  }
  ```

- DELETE /clients/:id
  deleta um cliente específico

  output:

  ```json
  {
    "message": "Client deleted"
  }
  ```

</details>

<details>
  <summary>PRODUTOS</summary>

- GET /products (index)
  lista todos os produtos cadastrados com exceção dos produtos deletados
  output:

  ```json
    {
        "id": 1,
        "name": "Product 1",
        "price": "10.00",
    },
    {
        "id": 2,
        "name": "Product 2",
        "price": "20.00",
    }
  ```

- GET /products/:id (show)
  mostra um produto específico
  output:

  ```json
  {
    "id": 1,
    "name": "Product 1",
    "description": "Descrição do produto 1",
    "price": "10.00",
    "isDeleted": 0,
    "createdAt": "2024-07-24T18:18:39.000+00:00",
    "updatedAt": "2024-07-24T18:18:39.000+00:00"
  }
  ```

- POST /products (store)
  cria um novo produto, é necessário passar todos os campos disponíveis
  Não sera possível criar um produto com o mesmo nome de um produto existente
  input:

  ```json
  {
    "name": "Product 1",
    "description": "Descrição do produto 1",
    "price": "10.00"
  }
  ```

  output:

  ```json
  {
    "id": 1,
    "name": "Product 1",
    "description": "Descrição do produto 1",
    "price": "10.00",
    "isDeleted": 0,
    "createdAt": "2024-07-24T18:18:39.000+00:00",
    "updatedAt": "2024-07-24T18:18:39.000+00:00"
  }
  ```

- PUT /products/:id
  atualiza um produto específico, é necessário passar pelo menos um dos campos disponiveis
  input:

  ```json
  {
    "name": "Product 1",
    "description": "Descrição do produto 1",
    "price": "10.00"
  }
  ```

  output:

  ```json
  {
    "message": "Product updated"
  }
  ```

- DELETE /products/:id
  deleta um produto específico
  output:

  ```json
  {
    "message": "Product deleted"
  }
  ```

</details>

<details>
  <summary>VENDAS</summary>

- POST /sales

  cria uma nova venda, é necessário passar o id do cliente e um produto além da quantidade
  input:

  ```json
  {
    "clientId": 1,
    "productId": 1,
    "quantity": 3
  }
  ```

  output:

  ```json
  {
    "id": 1,
    "clientId": 1,
    "productId": 1,
    "quantity": 3,
    "unitPrice": "10.00",
    "totalPrice": "30.00",
    "createdAt": "2024-07-24T18:18:39.000+00:00",
    "updatedAt": "2024-07-24T18:18:39.000+00:00"
  }
  ```

  </details>
