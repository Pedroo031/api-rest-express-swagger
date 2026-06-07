const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

let products = [
  {
    id: 1,
    name: "Camisa Flamengo Home 2026/27",
    team: "Flamengo",
    category: "Brasileirao",
    price: 219.9,
    stock: 20,
  },
  {
    id: 2,
    name: "Camisa Palmeiras Home 2026/27",
    team: "Palmeiras",
    category: "Brasileirao",
    price: 219.9,
    stock: 18,
  },
  {
    id: 3,
    name: "Camisa Brasil Home 2026/27",
    team: "Brasil",
    category: "Selecoes",
    price: 219.9,
    stock: 25,
  },
];

const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "API REST de Produtos",
    version: "1.0.0",
    description: "API criada com Express e Swagger para gerenciar produtos de uma loja.",
  },
  servers: [
    {
      url: `http://localhost:${PORT}`,
      description: "Servidor local",
    },
  ],
  tags: [
    {
      name: "Produtos",
      description: "Rotas para cadastro, listagem, atualizacao e remocao de produtos.",
    },
  ],
  paths: {
    "/": {
      get: {
        summary: "Mensagem inicial da API",
        responses: {
          200: {
            description: "API funcionando",
          },
        },
      },
    },
    "/products": {
      get: {
        tags: ["Produtos"],
        summary: "Lista todos os produtos",
        responses: {
          200: {
            description: "Lista de produtos retornada com sucesso",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/Product",
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Produtos"],
        summary: "Cria um novo produto",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ProductInput",
              },
              example: {
                name: "Camisa Real Madrid Third 2025/26",
                team: "Real Madrid",
                category: "Europeus",
                price: 209.9,
                stock: 12,
              },
            },
          },
        },
        responses: {
          201: {
            description: "Produto criado com sucesso",
          },
          400: {
            description: "Dados invalidos",
          },
        },
      },
    },
    "/products/{id}": {
      get: {
        tags: ["Produtos"],
        summary: "Busca um produto pelo ID",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "integer",
            },
          },
        ],
        responses: {
          200: {
            description: "Produto encontrado",
          },
          404: {
            description: "Produto nao encontrado",
          },
        },
      },
      put: {
        tags: ["Produtos"],
        summary: "Atualiza um produto pelo ID",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "integer",
            },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ProductInput",
              },
            },
          },
        },
        responses: {
          200: {
            description: "Produto atualizado com sucesso",
          },
          400: {
            description: "Dados invalidos",
          },
          404: {
            description: "Produto nao encontrado",
          },
        },
      },
      delete: {
        tags: ["Produtos"],
        summary: "Remove um produto pelo ID",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "integer",
            },
          },
        ],
        responses: {
          204: {
            description: "Produto removido com sucesso",
          },
          404: {
            description: "Produto nao encontrado",
          },
        },
      },
    },
  },
  components: {
    schemas: {
      Product: {
        type: "object",
        properties: {
          id: {
            type: "integer",
            example: 1,
          },
          name: {
            type: "string",
            example: "Camisa Flamengo Home 2026/27",
          },
          team: {
            type: "string",
            example: "Flamengo",
          },
          category: {
            type: "string",
            example: "Brasileirao",
          },
          price: {
            type: "number",
            example: 219.9,
          },
          stock: {
            type: "integer",
            example: 20,
          },
        },
      },
      ProductInput: {
        type: "object",
        required: ["name", "team", "category", "price", "stock"],
        properties: {
          name: {
            type: "string",
          },
          team: {
            type: "string",
          },
          category: {
            type: "string",
          },
          price: {
            type: "number",
          },
          stock: {
            type: "integer",
          },
        },
      },
    },
  },
};

function findProductById(id) {
  return products.find((product) => product.id === Number(id));
}

function isValidProduct(product) {
  return (
    product.name &&
    product.team &&
    product.category &&
    Number(product.price) > 0 &&
    Number.isInteger(Number(product.stock)) &&
    Number(product.stock) >= 0
  );
}

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/", (request, response) => {
  response.json({
    message: "API REST com Express e Swagger funcionando.",
    docs: `http://localhost:${PORT}/api-docs`,
  });
});

app.get("/products", (request, response) => {
  response.json(products);
});

app.get("/products/:id", (request, response) => {
  const product = findProductById(request.params.id);

  if (!product) {
    return response.status(404).json({ message: "Produto nao encontrado." });
  }

  return response.json(product);
});

app.post("/products", (request, response) => {
  const productData = request.body;

  if (!isValidProduct(productData)) {
    return response.status(400).json({
      message: "Informe name, team, category, price maior que zero e stock maior ou igual a zero.",
    });
  }

  const nextId =
    products.length > 0 ? Math.max(...products.map((product) => product.id)) + 1 : 1;
  const newProduct = {
    id: nextId,
    name: productData.name,
    team: productData.team,
    category: productData.category,
    price: Number(productData.price),
    stock: Number(productData.stock),
  };

  products.push(newProduct);

  return response.status(201).json(newProduct);
});

app.put("/products/:id", (request, response) => {
  const product = findProductById(request.params.id);

  if (!product) {
    return response.status(404).json({ message: "Produto nao encontrado." });
  }

  const productData = request.body;

  if (!isValidProduct(productData)) {
    return response.status(400).json({
      message: "Informe name, team, category, price maior que zero e stock maior ou igual a zero.",
    });
  }

  product.name = productData.name;
  product.team = productData.team;
  product.category = productData.category;
  product.price = Number(productData.price);
  product.stock = Number(productData.stock);

  return response.json(product);
});

app.delete("/products/:id", (request, response) => {
  const product = findProductById(request.params.id);

  if (!product) {
    return response.status(404).json({ message: "Produto nao encontrado." });
  }

  products = products.filter((item) => item.id !== product.id);

  return response.status(204).send();
});

app.listen(PORT, () => {
  console.log(`API rodando em http://localhost:${PORT}`);
  console.log(`Swagger disponivel em http://localhost:${PORT}/api-docs`);
});
