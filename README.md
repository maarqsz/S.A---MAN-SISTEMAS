# HelpDesk+ - Diagnóstico e Correção de Problemas

Este repositório contém o código do sistema HelpDesk+ após uma série de correções focadas em segurança, disponibilidade e desempenho.

## Problemas Identificados

* **Lentidão e alto uso de CPU:** Causado por um laço de processamento pesado no endpoint `/tickets`.
* **Vulnerabilidade de segurança:** O uso da função `eval()` permitia injeção de código.
* **I/O Bloqueante:** As operações de leitura e escrita do banco de dados travavam o servidor.
* **Vazamento de Memória:** Um `setInterval` acumulava objetos em um array sem limpá-lo.
* **IDs duplicados e dados perdidos:** A geração de IDs sequenciais `(db.length + 1)` não era segura para concorrência.
* **Exposição de dados sensíveis:** O token de segurança era exibido nos logs de inicialização.
* **Inconsistência de dados:** O endpoint de criação de tickets usava nomes de campos diferentes (`titulo` e `title`).

## Correções Implementadas

Foram aplicadas as seguintes melhorias, com foco em otimizar o código e resolver as vulnerabilidades:

1.  **Processamento Assíncrono:** As operações de leitura e escrita do banco de dados (`tickets.json`) foram convertidas de síncronas para assíncronas (`fs.promises`).
2.  **Otimização de Desempenho:** O laço de processamento artificial foi removido do endpoint `/tickets`, eliminando a causa da lentidão.
3.  **Refatoração do Filtro:** A função `eval()` foi removida e substituída por uma lógica de filtragem segura.
4.  **Geração de IDs Únicos:** A biblioteca `uuid` foi implementada para garantir que cada novo ticket receba um ID único e seguro, evitando duplicação.
5.  **Ajustes de Segurança:**
    * O limite de tamanho do corpo da requisição foi reduzido.
    * O token de acesso foi removido da mensagem de log.
    * Validações de input foram adicionadas para garantir que dados essenciais não estejam ausentes.
6.  **Gerenciamento de Memória:** O `setInterval` que causava o vazamento de memória foi removido.
7.  **Consistência de Dados:** O endpoint `POST /tickets` foi padronizado para usar apenas o campo `title`.

Essas correções melhoram significativamente a **segurança**, a **disponibilidade** e o **desempenho** do sistema, preparando-o para a próxima etapa de validação.
