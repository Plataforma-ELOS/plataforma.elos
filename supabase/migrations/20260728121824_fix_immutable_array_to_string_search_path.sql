-- Correção de Security Advisor: function_search_path_mutable em
-- immutable_array_to_string (migration anterior). Mesmo padrão já usado nas
-- outras funções do projeto (search_path fixo, sem depender do search_path
-- da sessão que a chama).
alter function public.immutable_array_to_string(text[]) set search_path = '';
