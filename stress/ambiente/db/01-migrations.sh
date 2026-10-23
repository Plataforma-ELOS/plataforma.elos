#!/bin/sh
# Aplica, em ordem, exatamente as migrations versionadas do projeto
# (montadas em /migrations). Para no primeiro erro: se uma migration não
# roda aqui, o ambiente de estresse não representa o banco real.
set -eu
for arquivo in /migrations/*.sql; do
  echo "migration: $(basename "$arquivo")"
  psql -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" -d "$POSTGRES_DB" -q -f "$arquivo"
done
