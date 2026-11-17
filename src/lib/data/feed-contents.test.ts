import { describe, expect, it } from 'vitest';
import {
  gerarSlug,
  mapFeedContentRow,
  parseCorpo,
  parseFontes,
  validarSugestaoConteudo,
  type FeedContentRow,
  type SugestaoConteudo,
} from './feed-contents';

const baseRow: FeedContentRow = {
  id: '00000000-0000-0000-0000-000000000001',
  slug: 'rotina-visual',
  kind: 'clinica',
  title: 'Rotina visual',
  author_label: 'Clínica multidisciplinar — perfil demonstrativo',
  body: 'Primeiro parágrafo\ncontinua aqui.\n\n1. Um\n2. Dois\n\n- A\n- B',
  tip: 'Uma dica.',
  sources: [{ titulo: 'NICE', descricao: 'Diretriz.', url: 'https://www.nice.org.uk/guidance/cg170' }],
  image_url: '/comunidade/conteudos/x.jpg',
  image_alt: 'Descrição da imagem',
  is_demo: true,
  published_at: '2026-11-14T15:00:00Z',
};

describe('parseCorpo', () => {
  it('separa parágrafos por linha em branco e junta as quebras simples', () => {
    expect(parseCorpo('Linha 1\nlinha 2\n\nOutro')).toEqual([
      { tipo: 'paragrafo', texto: 'Linha 1 linha 2' },
      { tipo: 'paragrafo', texto: 'Outro' },
    ]);
  });

  it('reconhece listas ordenadas e não ordenadas', () => {
    expect(parseCorpo('1. Um\n2. Dois\n\n- A\n- B')).toEqual([
      { tipo: 'lista', ordenada: true, itens: ['Um', 'Dois'] },
      { tipo: 'lista', ordenada: false, itens: ['A', 'B'] },
    ]);
  });

  it('um bloco com só parte das linhas em lista continua parágrafo', () => {
    expect(parseCorpo('Itens:\n- A')).toEqual([{ tipo: 'paragrafo', texto: 'Itens: - A' }]);
  });

  it('ignora espaços sobrando e CRLF', () => {
    expect(parseCorpo('  A  \r\n\r\n\r\n  B ')).toEqual([
      { tipo: 'paragrafo', texto: 'A' },
      { tipo: 'paragrafo', texto: 'B' },
    ]);
  });
});

describe('parseFontes', () => {
  it('mantém só link https', () => {
    const fontes = parseFontes([
      { titulo: 'Ok', descricao: '', url: 'https://example.org' },
      { titulo: 'Http', descricao: '', url: 'http://example.org' },
      { titulo: 'Script', descricao: '', url: 'javascript:alert(1)' },
    ]);
    expect(fontes.map((f) => f.url)).toEqual(['https://example.org', null, null]);
  });

  it('tolera valor que não é lista e itens malformados', () => {
    expect(parseFontes(null)).toEqual([]);
    expect(parseFontes({ titulo: 'x' })).toEqual([]);
    expect(parseFontes([42, null, { titulo: '', descricao: '' }, { titulo: 'Válida' }])).toEqual([
      { titulo: 'Válida', descricao: '', url: null },
    ]);
  });
});

describe('mapFeedContentRow', () => {
  it('mapeia rótulo, resumo, blocos, fontes e data', () => {
    const c = mapFeedContentRow(baseRow)!;
    expect(c.id).toBe('00000000-0000-0000-0000-000000000001');
    expect(c.kindLabel).toBe('Clínica');
    expect(c.resumo).toBe('Primeiro parágrafo continua aqui.');
    expect(c.blocos).toHaveLength(3);
    expect(c.sources[0].url).toBe('https://www.nice.org.uk/guidance/cg170');
    expect(c.isDemo).toBe(true);
    expect(c.date).toBe('14 de Novembro de 2026');
  });

  it('descarta tipo desconhecido', () => {
    expect(mapFeedContentRow({ ...baseRow, kind: 'outro' })).toBeNull();
  });

  it('aceita imagem local ou https e recusa o resto', () => {
    expect(mapFeedContentRow({ ...baseRow, image_url: null })!.imageUrl).toBeNull();
    expect(mapFeedContentRow({ ...baseRow, image_url: 'https://x.org/a.jpg' })!.imageUrl).toBe('https://x.org/a.jpg');
    expect(mapFeedContentRow({ ...baseRow, image_url: 'javascript:alert(1)' })!.imageUrl).toBeNull();
  });
});

const sugestaoBase: SugestaoConteudo = {
  kind: 'cuidador',
  title: 'Como preparamos a ida ao dentista',
  authorLabel: 'Mãe da Lia',
  body: 'Antes da consulta mostramos fotos do consultório e contamos, com calma, cada etapa do que ia acontecer naquele dia.',
};

describe('validarSugestaoConteudo', () => {
  it('aceita uma sugestão mínima e normaliza os campos opcionais', () => {
    const r = validarSugestaoConteudo({ ...sugestaoBase, title: '  Como preparamos a ida ao dentista  ', tip: '  ' });
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.dados.title).toBe('Como preparamos a ida ao dentista');
    expect(r.dados.tip).toBeNull();
    expect(r.dados.sources).toEqual([]);
    expect(r.dados.image_url).toBeNull();
  });

  it('recusa tipo desconhecido, título curto e texto curto', () => {
    expect(validarSugestaoConteudo({ ...sugestaoBase, kind: 'video' })).toMatchObject({ ok: false });
    expect(validarSugestaoConteudo({ ...sugestaoBase, title: 'Oi' })).toMatchObject({ ok: false });
    expect(validarSugestaoConteudo({ ...sugestaoBase, body: 'curto' })).toMatchObject({ ok: false });
  });

  it('exige https nas fontes e ignora linhas de fonte vazias', () => {
    expect(
      validarSugestaoConteudo({ ...sugestaoBase, sources: [{ titulo: 'NICE', url: 'http://nice.org.uk' }] }),
    ).toMatchObject({ ok: false });
    const r = validarSugestaoConteudo({
      ...sugestaoBase,
      sources: [{ titulo: 'NICE', url: 'https://www.nice.org.uk' }, { titulo: '', url: '' }],
    });
    expect(r.ok && r.dados.sources).toEqual([{ titulo: 'NICE', descricao: '', url: 'https://www.nice.org.uk' }]);
  });

  it('recusa mais de 3 fontes e fonte sem nome', () => {
    const quatro = Array.from({ length: 4 }, (_, i) => ({ titulo: `F${i}`, url: '' }));
    expect(validarSugestaoConteudo({ ...sugestaoBase, sources: quatro })).toMatchObject({ ok: false });
    expect(
      validarSugestaoConteudo({ ...sugestaoBase, sources: [{ titulo: '', url: 'https://x.org' }] }),
    ).toMatchObject({ ok: false });
  });

  it('imagem exige descrição (acessibilidade)', () => {
    const semAlt = validarSugestaoConteudo({ ...sugestaoBase, imageUrl: 'https://x.supabase.co/a.jpg' });
    expect(semAlt).toMatchObject({ ok: false });
    const comAlt = validarSugestaoConteudo({ ...sugestaoBase, imageUrl: 'https://x.supabase.co/a.jpg', imageAlt: 'Consultório' });
    expect(comAlt.ok && comAlt.dados.image_alt).toBe('Consultório');
  });
});

describe('gerarSlug', () => {
  it('remove acentos e pontuação e acrescenta o sufixo', () => {
    expect(gerarSlug('Rotina visual: pequenas mudanças!', 'ab12')).toBe('rotina-visual-pequenas-mudancas-ab12');
  });
  it('usa um nome padrão quando o título não tem letras', () => {
    expect(gerarSlug('!!!', 'ab12')).toBe('conteudo-ab12');
  });
});
