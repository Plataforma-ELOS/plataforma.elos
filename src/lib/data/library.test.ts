import { describe, it, expect } from 'vitest';
import { mapLibraryRow, type LibraryRow } from './library';

const baseRow: LibraryRow = {
  id: '1',
  type: 'document',
  title: 'Guia de CAA',
  author_name: 'Equipe Elos',
  image_url: null,
  action_url: 'https://example.com/guia.pdf',
  downloadable: true,
  tags: ['CAA', 'guia'],
  created_at: '2024-08-01T12:00:00Z',
};

describe('mapLibraryRow', () => {
  it('mapeia um documento baixável', () => {
    const item = mapLibraryRow(baseRow);
    expect(item.type).toBe('document');
    expect(item.downloadable).toBe(true);
    expect(item.actionText).toBe('Fazer Download');
    expect(item.tags).toEqual(['CAA', 'guia']);
  });

  it('documento não baixável pede para acessar o material', () => {
    const item = mapLibraryRow({ ...baseRow, downloadable: false });
    expect(item.actionText).toBe('Acessar Material');
  });

  it('mapeia um vídeo com imagem', () => {
    const item = mapLibraryRow({ ...baseRow, type: 'video', image_url: 'https://example.com/thumb.png' });
    expect(item.type).toBe('video');
    expect(item.imageUrl).toBe('https://example.com/thumb.png');
    expect(item.actionText).toBe('Assistir Agora');
  });

  it('popula imageUrl também para documento/jogo com capa (não só vídeo)', () => {
    const item = mapLibraryRow({ ...baseRow, type: 'document', image_url: 'https://example.com/capa.png' });
    expect(item.type).toBe('document');
    expect(item.imageUrl).toBe('https://example.com/capa.png');
  });

  it('usa valores padrão quando campos são nulos', () => {
    const item = mapLibraryRow({ ...baseRow, author_name: null, action_url: null, downloadable: null, tags: null });
    expect(item.author).toBe('Equipe Elos');
    expect(item.actionUrl).toBe('#');
    expect(item.downloadable).toBe(false);
    expect(item.tags).toEqual([]);
  });
});
