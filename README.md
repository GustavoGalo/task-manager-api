# Requisitos

- [ ] O usuário deve ser capaz de criar projetos
- [ ] O usuário deve ser capaz de criar tarefas
- [ ] O usuário deve ser capaz de convidar contribuidores para o projeto
- [ ] O usuário deve ser capaz de criar colunas para o projeto e mover as tarefas entre estas colunas

## Diagrama do Banco de Dados

```txt
+----------------+       +----------------+       +----------------+
|    Usuário     |       |    Projeto     |       |    Tarefa      |
|----------------|       |----------------|       |----------------|
| id (PK)        |<------| id_usuario (FK)|       | id (PK)        |
| nome           |       | id (PK)        |<------| id_projeto (FK)|
| email          |       | nome           |       | titulo         |
| senha          |       | descricao      |       | descricao      |
+----------------+       | data_criacao   |       | data_criacao   |
                         +----------------+       | data_conclusao |
                                                  | id_coluna (FK) |
                                                  +----------------+
                         +----------------+       +----------------+
                         |    Coluna      |       | Contribuidor   |
                         |----------------|       |----------------|
                         | id (PK)        |<------| id (PK)        |
                         | nome           |       | id_usuario (FK)|
                         | id_projeto (FK)|       | id_projeto (FK)|
                         +----------------+       +----------------+
```
