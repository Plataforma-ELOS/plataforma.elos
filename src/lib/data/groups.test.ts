import { describe, expect, it } from 'vitest';
import { mapGroupCard, mapGroupMember } from './groups';

describe('mapGroupCard', () => {
  it('mapeia contagem de membros, description e tags com fallback', () => {
    const card = mapGroupCard(
      { id: 'g1', name: 'Grupo', description: null, tags: null, group_members: [{ count: 5 }] },
      false
    );
    expect(card).toEqual({ id: 'g1', name: 'Grupo', description: '', members: 5, isMember: false, tags: [] });
  });

  it('usa 0 membros quando group_members vem vazio/null', () => {
    const card = mapGroupCard({ id: 'g2', name: 'Grupo 2', description: 'Desc', tags: ['a'], group_members: null }, true);
    expect(card.members).toBe(0);
    expect(card.isMember).toBe(true);
    expect(card.tags).toEqual(['a']);
  });
});

describe('mapGroupMember', () => {
  it('usa fallback de nome e avatar quando profile é null', () => {
    const member = mapGroupMember({ profile_id: 'u1', profile: null });
    expect(member).toEqual({ profileId: 'u1', name: 'Membro', avatarUrl: 'https://placehold.co/40x40.png' });
  });

  it('usa os dados do profile quando presentes', () => {
    const member = mapGroupMember({ profile_id: 'u2', profile: { full_name: 'Ana', avatar_url: 'https://x.png' } });
    expect(member).toEqual({ profileId: 'u2', name: 'Ana', avatarUrl: 'https://x.png' });
  });
});
