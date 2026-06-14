const express = require('express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

let proximoId = 4;
let alunos = [
  {
    id: 1,
    nome: 'Ana Souza',
    email: 'ana.souza@email.com',
    curso: 'Sistemas de Informação',
    periodo: 4,
  },
  {
    id: 2,
    nome: 'Bruno Lima',
    email: 'bruno.lima@email.com',
    curso: 'Administração',
    periodo: 2,
  },
  {
    id: 3,
    nome: 'Carla Mendes',
    email: 'carla.mendes@email.com',
    curso: 'Engenharia de Produção',
    periodo: 6,
  },
];

const swaggerOptions = {
  definition: {
    openapi: '3.0.4',
    info: {
      title: 'API de Alunos',
      version: '1.0.0',
      description:
        'API REST para cadastro e gerenciamento de alunos, desenvolvida com Express e documentada com Swagger.',
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: 'Servidor local',
      },
    ],
    components: {
      schemas: {
        Aluno: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1,
            },
            nome: {
              type: 'string',
              example: 'Pedro Henrique',
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'pedro@email.com',
            },
            curso: {
              type: 'string',
              example: 'Sistemas de Informação',
            },
            periodo: {
              type: 'integer',
              minimum: 1,
              example: 4,
            },
          },
        },
        AlunoInput: {
          type: 'object',
          required: ['nome', 'email', 'curso', 'periodo'],
          properties: {
            nome: {
              type: 'string',
              example: 'Pedro Henrique',
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'pedro@email.com',
            },
            curso: {
              type: 'string',
              example: 'Sistemas de Informação',
            },
            periodo: {
              type: 'integer',
              minimum: 1,
              example: 4,
            },
          },
        },
        Erro: {
          type: 'object',
          properties: {
            mensagem: {
              type: 'string',
              example: 'Aluno não encontrado.',
            },
          },
        },
      },
    },
  },
  apis: ['./index.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

function validarAluno(dados) {
  const { nome, email, curso, periodo } = dados;

  if (!nome || !email || !curso || periodo === undefined) {
    return 'Os campos nome, email, curso e periodo são obrigatórios.';
  }

  if (typeof nome !== 'string' || nome.trim().length < 2) {
    return 'O nome deve conter pelo menos 2 caracteres.';
  }

  if (typeof email !== 'string' || !email.includes('@')) {
    return 'Informe um e-mail válido.';
  }

  if (typeof curso !== 'string' || curso.trim().length < 2) {
    return 'O curso deve conter pelo menos 2 caracteres.';
  }

  if (!Number.isInteger(periodo) || periodo < 1) {
    return 'O período deve ser um número inteiro maior ou igual a 1.';
  }

  return null;
}

/**
 * @openapi
 * /:
 *   get:
 *     summary: Verifica se a API está funcionando
 *     tags:
 *       - Sistema
 *     responses:
 *       200:
 *         description: API em funcionamento
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   example: API de Alunos em funcionamento!
 */
app.get('/', (req, res) => {
  res.status(200).json({
    mensagem: 'API de Alunos em funcionamento!',
    documentacao: '/api-docs',
  });
});

/**
 * @openapi
 * /alunos:
 *   get:
 *     summary: Lista todos os alunos
 *     tags:
 *       - Alunos
 *     responses:
 *       200:
 *         description: Lista de alunos retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Aluno'
 */
app.get('/alunos', (req, res) => {
  res.status(200).json(alunos);
});

/**
 * @openapi
 * /alunos/{id}:
 *   get:
 *     summary: Consulta um aluno pelo ID
 *     tags:
 *       - Alunos
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do aluno
 *     responses:
 *       200:
 *         description: Aluno encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Aluno'
 *       404:
 *         description: Aluno não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 */
app.get('/alunos/:id', (req, res) => {
  const id = Number(req.params.id);
  const aluno = alunos.find((item) => item.id === id);

  if (!aluno) {
    return res.status(404).json({ mensagem: 'Aluno não encontrado.' });
  }

  return res.status(200).json(aluno);
});

/**
 * @openapi
 * /alunos:
 *   post:
 *     summary: Cadastra um novo aluno
 *     tags:
 *       - Alunos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AlunoInput'
 *     responses:
 *       201:
 *         description: Aluno cadastrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Aluno'
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 *       409:
 *         description: E-mail já cadastrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 */
app.post('/alunos', (req, res) => {
  const erro = validarAluno(req.body);

  if (erro) {
    return res.status(400).json({ mensagem: erro });
  }

  const emailNormalizado = req.body.email.trim().toLowerCase();
  const emailJaCadastrado = alunos.some(
    (aluno) => aluno.email.toLowerCase() === emailNormalizado,
  );

  if (emailJaCadastrado) {
    return res.status(409).json({ mensagem: 'E-mail já cadastrado.' });
  }

  const novoAluno = {
    id: proximoId++,
    nome: req.body.nome.trim(),
    email: emailNormalizado,
    curso: req.body.curso.trim(),
    periodo: req.body.periodo,
  };

  alunos.push(novoAluno);
  return res.status(201).json(novoAluno);
});

/**
 * @openapi
 * /alunos/{id}:
 *   put:
 *     summary: Atualiza todos os dados de um aluno
 *     tags:
 *       - Alunos
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do aluno
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AlunoInput'
 *     responses:
 *       200:
 *         description: Aluno atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Aluno'
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 *       404:
 *         description: Aluno não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 *       409:
 *         description: E-mail já pertence a outro aluno
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 */
app.put('/alunos/:id', (req, res) => {
  const id = Number(req.params.id);
  const indice = alunos.findIndex((item) => item.id === id);

  if (indice === -1) {
    return res.status(404).json({ mensagem: 'Aluno não encontrado.' });
  }

  const erro = validarAluno(req.body);

  if (erro) {
    return res.status(400).json({ mensagem: erro });
  }

  const emailNormalizado = req.body.email.trim().toLowerCase();
  const emailPertenceAOutroAluno = alunos.some(
    (aluno) => aluno.id !== id && aluno.email.toLowerCase() === emailNormalizado,
  );

  if (emailPertenceAOutroAluno) {
    return res
      .status(409)
      .json({ mensagem: 'E-mail já pertence a outro aluno.' });
  }

  const alunoAtualizado = {
    id,
    nome: req.body.nome.trim(),
    email: emailNormalizado,
    curso: req.body.curso.trim(),
    periodo: req.body.periodo,
  };

  alunos[indice] = alunoAtualizado;
  return res.status(200).json(alunoAtualizado);
});

/**
 * @openapi
 * /alunos/{id}:
 *   delete:
 *     summary: Exclui um aluno
 *     tags:
 *       - Alunos
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do aluno
 *     responses:
 *       204:
 *         description: Aluno excluído com sucesso
 *       404:
 *         description: Aluno não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 */
app.delete('/alunos/:id', (req, res) => {
  const id = Number(req.params.id);
  const indice = alunos.findIndex((item) => item.id === id);

  if (indice === -1) {
    return res.status(404).json({ mensagem: 'Aluno não encontrado.' });
  }

  alunos.splice(indice, 1);
  return res.status(204).send();
});

app.use((req, res) => {
  res.status(404).json({ mensagem: 'Rota não encontrada.' });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Servidor executando em http://localhost:${PORT}`);
    console.log(`Swagger disponível em http://localhost:${PORT}/api-docs`);
  });
}

module.exports = app;
