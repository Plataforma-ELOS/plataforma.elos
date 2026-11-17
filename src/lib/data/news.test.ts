import { describe, expect, it } from 'vitest';
import { CATEGORIA_LABEL, linkFonteSeguro } from './news';

describe('linkFonteSeguro', () => {
  it('aceita só https', () => {
    expect(linkFonteSeguro('https://pubmed.ncbi.nlm.nih.gov/41385127/')).toBe('https://pubmed.ncbi.nlm.nih.gov/41385127/');
    expect(linkFonteSeguro('http://example.org')).toBeNull();
    expect(linkFonteSeguro('javascript:alert(1)')).toBeNull();
    expect(linkFonteSeguro('não é url')).toBeNull();
    expect(linkFonteSeguro(null)).toBeNull();
  });
});

describe('CATEGORIA_LABEL', () => {
  it('tem rótulo para as categorias das notícias de pesquisa', () => {
    expect(CATEGORIA_LABEL.dados).toBe('Dados e pesquisas');
    expect(CATEGORIA_LABEL.educacao).toBe('Educação e inclusão');
    expect(CATEGORIA_LABEL.desenvolvimento).toBe('Desenvolvimento infantil');
  });
});
