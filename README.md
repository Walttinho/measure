<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  

# Projeto Measure

Este projeto é responsável por gerenciar a leitura individualizada de consumo de água e gás. O back-end é construído utilizando Node.js com TypeScript, Prisma, Docker e integra uma API de LLM (Google Gemini) para extração de valores a partir de imagens.

## Requisitos

- Node.js
- TypeScript
- Prisma
- Docker
- Git
- Chave de API do Google Gemini

## Tarefas

### 1. Configuração Inicial
- [x] Criar um novo projeto NestJS chamado `measure`.
- [x] Configurar o ambiente de desenvolvimento com Node.js e TypeScript.

### 2. Configuração do Banco de Dados
- [ ] Modelar o banco de dados para armazenar as leituras de água e gás.
- [ ] Configurar o TypeORM (ou outro ORM) para integração com o banco de dados.
- [ ] Implementar as migrations para criação das tabelas necessárias.

### 3. Implementação de Endpoints

#### 3.1. POST `/upload`
- [ ] Validar os dados recebidos no corpo da requisição:
  - [ ] Verificar se a imagem está em formato base64.
  - [ ] Verificar se os demais parâmetros estão no formato correto (`customer_code`, `measure_datetime`, `measure_type`).
- [ ] Verificar se já existe uma leitura para o tipo de medida no mês atual.
- [ ] Integrar com a API do Google Gemini para extrair o valor da imagem.
- [ ] Retornar a resposta correta com:
  - [ ] Link temporário da imagem.
  - [ ] GUID da medida.
  - [ ] Valor numérico reconhecido.

#### 3.2. PATCH `/confirm`
- [ ] Validar os dados recebidos no corpo da requisição:
  - [ ] Verificar se o UUID da medida existe.
  - [ ] Verificar se o valor já foi confirmado.
- [ ] Atualizar o valor da leitura no banco de dados.
- [ ] Retornar a resposta correta indicando o sucesso ou erro da operação.

#### 3.3. GET `/<customer_code>/list`
- [ ] Filtrar as leituras realizadas por um determinado cliente.
- [ ] Implementar a filtragem opcional por tipo de medida (`measure_type`).
- [ ] Retornar uma lista com todas as medidas realizadas ou uma mensagem de erro caso nenhuma leitura seja encontrada.


### 4. Integração com o Google Gemini
- [ ] Obter uma chave de API do Google Gemini.
- [ ] Configurar a API Key através de variáveis de ambiente (`.env`).
- [ ] Implementar a comunicação com a API de Vision do Google Gemini para extração dos valores.

### 5. Dockerização
- [ ] Criar um `Dockerfile` para a aplicação.
- [ ] Configurar o `docker-compose.yml` para subir a aplicação e seus serviços necessários com um único comando.
- [ ] Testar a execução da aplicação utilizando Docker.

### 6. Testes
- [ ] Escrever testes unitários para os endpoints criados.
- [ ] Garantir cobertura de testes para as principais funcionalidades.

### 7. Documentação
- [ ] Documentar a API utilizando ferramentas como Swagger.
- [ ] Atualizar este README com as instruções de como rodar o projeto localmente e via Docker.

### 8. Submissão
- [ ] Garantir que todos os requisitos foram cumpridos.
- [ ] Subir o projeto para um repositório Git.
- [ ] Preencher o formulário de submissão com o link do repositório.

## Como Executar o Projeto

1. Clone o repositório:
   ```bash
   git clone <link-do-repositorio>
   cd measure

