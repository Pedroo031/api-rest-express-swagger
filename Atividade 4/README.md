# API de Alunos — Express + Swagger

API REST criada para gerenciar alunos, utilizando **Node.js**, **Express**, **Swagger UI** e **OpenAPI 3.0**.

## Funcionalidades

- Listar todos os alunos;
- Consultar um aluno pelo ID;
- Cadastrar um aluno;
- Atualizar um aluno;
- Excluir um aluno;
- Validar os dados recebidos;
- Testar os endpoints pela documentação Swagger.

## Tecnologias

- Node.js;
- Express;
- swagger-jsdoc;
- swagger-ui-express;
- OpenAPI 3.0.

## Como executar

É necessário ter o Node.js 18 ou superior instalado.

```bash
git clone URL_DO_SEU_REPOSITORIO
cd api-alunos-express-swagger
npm install
npm start
```

A API será iniciada em:

```text
http://localhost:3000
```

A documentação Swagger estará disponível em:

```text
http://localhost:3000/api-docs
```

## Endpoints

| Método | Endpoint | Função |
|---|---|---|
| GET | `/` | Verifica se a API está funcionando |
| GET | `/alunos` | Lista todos os alunos |
| GET | `/alunos/:id` | Consulta um aluno pelo ID |
| POST | `/alunos` | Cadastra um aluno |
| PUT | `/alunos/:id` | Atualiza um aluno |
| DELETE | `/alunos/:id` | Exclui um aluno |

## Exemplo de JSON para cadastro

```json
{
  "nome": "Pedro Henrique",
  "email": "pedro@email.com",
  "curso": "Sistemas de Informação",
  "periodo": 4
}
```

## Observação

Os dados são armazenados em memória. Portanto, os cadastros e alterações realizados durante os testes são apagados quando o servidor é reiniciado.

## Autor

Pedro Henrique
