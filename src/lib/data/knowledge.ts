// src/lib/data/knowledge.ts
// Mapeamento de pílulas de conhecimento e trilhas (noticias-gamificadas).
// Sem dependências de React/next — o ícone por categoria continua sendo
// resolvido no client (JSX não pertence a este arquivo), aqui só a `category`.

export type KnowledgePillRow = {
  title: string;
  content: string;
  category: string | null;
};

export type KnowledgePill = {
  title: string;
  content: string;
  category: string;
};

export function mapKnowledgePill(row: KnowledgePillRow): KnowledgePill {
  return {
    title: row.title,
    content: row.content,
    category: row.category ?? '',
  };
}

export type KnowledgeTrailRow = {
  id: string;
  title: string;
  description: string | null;
};

export type KnowledgeTrail = {
  id: string;
  title: string;
  description: string;
  progress: number;
};

export function mapKnowledgeTrail(row: KnowledgeTrailRow, progressoPorTrilha: Map<string, number>): KnowledgeTrail {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? '',
    progress: progressoPorTrilha.get(row.id) ?? 0,
  };
}

export type KnowledgeTrailStepRow = {
  id: string;
  trail_id: string;
  title: string;
  content: string;
  sort_order: number;
};

export type KnowledgeTrailStep = {
  id: string;
  title: string;
  content: string;
  completed: boolean;
};

export function mapKnowledgeTrailStep(row: KnowledgeTrailStepRow, passosConcluidos: Set<string>): KnowledgeTrailStep {
  return {
    id: row.id,
    title: row.title,
    content: row.content,
    completed: passosConcluidos.has(row.id),
  };
}
