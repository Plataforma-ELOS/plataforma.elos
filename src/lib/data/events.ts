// src/lib/data/events.ts
import { formatarDataHoraPtBr } from '../format';

export type EventData = {
  id: string;
  title: string;
  description: string;
  date: string;
  startsAt: string;
  type: 'Online' | 'Presencial';
  location: string | null;
};

export type EventRow = {
  id: string;
  title: string;
  description: string | null;
  starts_at: string;
  type: string;
  location: string | null;
};

export function mapEventRow(row: EventRow): EventData {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? '',
    date: formatarDataHoraPtBr(row.starts_at),
    startsAt: row.starts_at,
    type: row.type === 'presencial' ? 'Presencial' : 'Online',
    location: row.location,
  };
}
