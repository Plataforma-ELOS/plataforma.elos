// src/app/noticias-gamificadas/trilhas/[id]/page.tsx
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { mapKnowledgeTrailStep } from '@/lib/data/knowledge';
import TrailDetailClient from './client-page';

export default async function TrailDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createClient(await cookies());

  const { data: trail } = await supabase
    .from('knowledge_trails')
    .select('id, title, description')
    .eq('id', id)
    .maybeSingle();

  if (!trail) notFound();

  const { data: { user } } = await supabase.auth.getUser();

  const [{ data: stepRows }, { data: completionRows }] = await Promise.all([
    supabase
      .from('knowledge_trail_steps')
      .select('id, trail_id, title, content, sort_order')
      .eq('trail_id', id)
      .order('sort_order'),
    user
      ? supabase.from('trail_step_completions').select('step_id').eq('trail_id', id).eq('profile_id', user.id)
      : Promise.resolve({ data: [] as { step_id: string }[] }),
  ]);

  const passosConcluidos = new Set((completionRows ?? []).map((c) => c.step_id));
  const steps = (stepRows ?? []).map((row) => mapKnowledgeTrailStep(row, passosConcluidos));

  return (
    <TrailDetailClient
      trail={{ id: trail.id, title: trail.title, description: trail.description ?? '' }}
      stepsIniciais={steps}
    />
  );
}
