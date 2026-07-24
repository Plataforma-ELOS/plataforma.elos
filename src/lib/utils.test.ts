import { describe, it, expect } from 'vitest';
import { cn } from '@/lib/utils';

describe('cn', () => {
  it('junta classes simples', () => {
    expect(cn('a', 'b')).toBe('a b');
  });

  it('ignora valores falsy (condicionais)', () => {
    expect(cn('a', false, null, undefined, '', 'b')).toBe('a b');
  });

  it('aplica classes condicionais via objeto', () => {
    expect(cn('base', { active: true, hidden: false })).toBe('base active');
  });

  it('resolve conflitos do tailwind mantendo a última (tailwind-merge)', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4');
    expect(cn('text-sm', 'text-lg')).toBe('text-lg');
  });

  it('lida com arrays de classes', () => {
    expect(cn(['a', 'b'], 'c')).toBe('a b c');
  });
});
