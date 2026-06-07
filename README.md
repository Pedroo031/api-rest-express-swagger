# API REST com Express e Swagger

API REST simples para gerenciar produtos de uma loja de camisas de futebol.

## Tecnologias

- Node.js
- Express
- Swagger UI
- CORS

## Como executar

Instale as dependencias:

```bash
npm install
```

Inicie a API:

```bash
npm start
```

A API ficara disponivel em:

```text
http://localhost:3000
```

A documentacao Swagger ficara disponivel em:

```text
http://localhost:3000/api-docs
```

## Rotas

- `GET /` - mensagem inicial
- `GET /products` - lista todos os produtos
- `GET /products/:id` - busca um produto pelo ID
- `POST /products` - cria um produto
- `PUT /products/:id` - atualiza um produto
- `DELETE /products/:id` - remove um produto

## Exemplo de JSON para cadastro

```json
{
  "name": "Camisa Real Madrid Third 2025/26",
  "team": "Real Madrid",
  "category": "Europeus",
  "price": 209.9,
  "stock": 12
}
```

## Entrega

Depois de subir o projeto para o GitHub, envie no AVA somente o link do repositorio publico.
