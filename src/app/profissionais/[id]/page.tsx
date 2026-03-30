
// src/app/profissionais/[id]/page.tsx
import ProfessionalProfileClient from './client-page';
import { notFound } from 'next/navigation';

const professionalsData: { [key: string]: any } = {
  'dra-cristiane': {
    id: 'dra-cristiane',
    name: 'Dra. Cristiane',
    imageUrl: 'https://i.ibb.co/hJ2yByjq/ELOS-Dra-Cristiane.png',
    hint: 'woman doctor portrait',
    specialty: 'Psicóloga Especialista em TEA',
    crm: 'CRP 08/987654',
    description: 'Com mais de 10 anos de experiência, Dra. Cristiane é especializada em terapias comportamentais e no suporte a famílias, oferecendo uma abordagem acolhedora e baseada em evidências.',
    contact: {
      phone: '(11) 9 1234-5678',
      email: 'cristiane.psico@elos.com.br',
      instagram: '@dra.cristiane.tea',
    },
    experiences: [
      "Graduação em Psicologia na USP",
      "Pós-graduação em Análise do Comportamento Aplicada (ABA)",
      "10+ anos de prática clínica com foco em TEA",
      "Certificação em Terapia de Aceitação e Compromisso (ACT)",
      "Atendimento a todas as faixas etárias",
      "Idiomas: Português e Inglês",
    ],
    skills: [
      "Terapia ABA",
      "Regulação emocional",
      "Habilidades sociais",
      "Gestão de comportamento desafiador",
      "Orientação de pais",
      "Inclusão escolar",
    ],
  },
  'dr-fernando': {
    id: 'dr-fernando',
    name: 'Dr. Fernando',
    imageUrl: 'https://i.ibb.co/Y4JhVf04/ELOS-Dr-Fernando.png',
    hint: 'man doctor portrait',
    specialty: 'Neuropediatra',
    crm: 'CRM/RJ 543210',
    description: 'Dr. Fernando foca no diagnóstico precoce e acompanhamento do desenvolvimento neurológico de crianças com TEA, trabalhando em conjunto com uma equipe multidisciplinar.',
    contact: {
      phone: '(21) 9 9876-5432',
      email: 'dr.fernando.neuro@elos.com.br',
      instagram: '@drfernando.neurokids',
    },
    experiences: [
      "Residência em Neurologia Infantil na UFRJ",
      "Membro da Sociedade Brasileira de Neurologia Infantil",
      "8 anos de experiência em diagnóstico de TEA",
      "Foco em intervenção precoce",
      "Especialista em comorbidades associadas ao TEA",
      "Idiomas: Português",
    ],
    skills: [
      "Diagnóstico precoce",
      "Acompanhamento neurológico",
      "Manejo de medicação",
      "Tratamento de comorbidades (TDAH, ansiedade)",
      "Eletroencefalograma (EEG)",
      "Trabalho em equipe multidisciplinar",
    ],
  },
  'dra-beatriz': {
    id: 'dra-beatriz',
    name: 'Dra. Beatriz',
    imageUrl: 'https://i.ibb.co/sJKRH4y9/ELOS-Dra-Beatriz.png',
    hint: 'woman psychologist portrait',
    specialty: 'Fonoaudióloga',
    crm: 'CRFa 2-12345/SP',
    description: 'Dra. Beatriz é especialista em comunicação alternativa e aumentativa, ajudando crianças e adolescentes a desenvolverem suas habilidades de comunicação e interação social.',
    contact: {
      phone: '(31) 9 8765-4321',
      email: 'bia.fono@elos.com.br',
      instagram: '@beatriz.fono.tea',
    },
     experiences: [
      "Graduação em Fonoaudiologia pela UFMG",
      "Especialização em Linguagem com foco em TEA",
      "Certificação no método PECS",
      "5 anos de experiência com comunicação alternativa",
      "Atuação em clínicas e escolas",
      "Idiomas: Português",
    ],
    skills: [
      "Comunicação Alternativa (CAA)",
      "Método PECS",
      "Terapia de fala e linguagem",
      "Seletividade alimentar",
      "Habilidades de conversação",
      "Interação social",
    ],
  },
  'dr-ricardo': {
    id: 'dr-ricardo',
    name: 'Dr. Ricardo',
    imageUrl: 'https://i.ibb.co/RkPjKsV2/ELOS-Dr-Ricardo.png',
    hint: 'man therapist portrait',
    specialty: 'Terapeuta Ocupacional',
    crm: 'CREFITO-3/112233',
    description: 'Dr. Ricardo utiliza abordagens lúdicas e criativas para ajudar na integração sensorial e no desenvolvimento da autonomia nas atividades de vida diária.',
    contact: {
      phone: '(41) 9 7654-3210',
      email: 'ricardo.to@elos.com.br',
      instagram: '@ricardo.to.infantil',
    },
    experiences: [
      "Graduação em Terapia Ocupacional pela UFPR",
      "Certificação Internacional em Integração Sensorial de Ayres",
      "7 anos de experiência com crianças no espectro",
      "Especialista em desenvolvimento da autonomia",
      "Experiência com adaptação de ambientes",
      "Idiomas: Português",
    ],
    skills: [
      "Integração Sensorial",
      "Atividades de Vida Diária (AVDs)",
      "Coordenação motora fina",
      "Brincar terapêutico",
      "Adaptação de materiais",
      "Autonomia e independência",
    ],
  },
  'dra-ana': {
    id: 'dra-ana',
    name: 'Dra. Ana',
    imageUrl: 'https://placehold.co/128x128.png',
    hint: 'woman teacher portrait',
    specialty: 'Psicopedagoga',
    crm: 'ABPp 5678-RJ',
    description: 'Apoio no processo de aprendizagem e desenvolvimento de habilidades acadêmicas, criando estratégias personalizadas para cada aluno.',
     contact: {
      phone: '(51) 9 6543-2109',
      email: 'ana.psicopedagoga@elos.com.br',
      instagram: '@ana.aprendizagem.tea',
    },
     experiences: [
      "Graduação em Pedagogia e Psicopedagogia",
      "Especialização em Educação Inclusiva",
      "Foco em adaptação curricular (PEI)",
      "12 anos de experiência em ambiente escolar",
      "Mediação de conflitos e bullying",
      "Idiomas: Português e Libras",
    ],
    skills: [
      "Plano de Ensino Individualizado (PEI)",
      "Adaptação de atividades",
      "Alfabetização",
      "Funções executivas",
      "Dificuldades de aprendizagem",
      "Mediação escolar",
    ],
  },
   'clinica-superar': {
    id: 'clinica-superar',
    name: 'Clínica Superar',
    imageUrl: 'https://placehold.co/128x128.png',
    hint: 'clinic logo',
    specialty: 'Centro Multidisciplinar',
    crm: 'CNPJ: 12.345.678/0001-90',
    description: 'Com uma equipe completa e integrada, a Clínica Superar oferece um cuidado humanizado e multidisciplinar, focando no desenvolvimento global de cada paciente. Nosso ambiente é preparado para acolher famílias e promover o bem-estar.',
    contact: {
      phone: '(11) 9 8888-1111',
      email: 'contato@clinicasuperar.com.br',
      instagram: '@clinicasuperar',
    },
    experiences: [
      "Mais de 5 anos de atuação",
      "Equipe com Psicólogos, Fonoaudiólogos, T.O. e mais",
      "Estrutura com salas de integração sensorial",
      "Programas de intervenção precoce",
      "Grupos de habilidades sociais",
      "Parceria com escolas para inclusão",
    ],
    skills: [
      "Avaliação Multidisciplinar",
      "Terapia ABA",
      "Integração Sensorial",
      "Grupos Terapêuticos",
      "Orientação Familiar",
      "Fonoaudiologia",
      "Psicomotricidade",
    ],
  },
    'espaco-crescer': {
    id: 'espaco-crescer',
    name: 'Espaço Crescer',
    imageUrl: 'https://placehold.co/128x128.png',
    hint: 'child climbing logo',
    specialty: 'Terapia Infantil e Familiar',
    crm: 'CNPJ: 22.333.444/0001-55',
    description: 'Um lugar pensado para o desenvolvimento infantil, com foco na intervenção precoce e no apoio à família como um todo. Nossas terapias são baseadas no brincar.',
    contact: {
      phone: '(21) 9 7777-2222',
      email: 'contato@espacocrescer.com.br',
      instagram: '@espacocrescer.tea',
    },
    experiences: [
      "Foco em intervenção precoce (0 a 6 anos)",
      "Terapeutas especializados no modelo Denver",
      "Ambiente lúdico e acolhedor",
      "Sessões de terapia em grupo e individuais",
      "Workshops e palestras para pais",
      "Consultoria escolar",
    ],
    skills: [
      "Modelo Denver de Intervenção Precoce",
      "Terapia Ocupacional Pediátrica",
      "Psicologia Infantil",
      "Apoio e treinamento para pais",
      "Brincar terapêutico",
      "Desenvolvimento da comunicação",
    ],
  },
};

export default function ProfessionalProfilePage({ params }: { params: { id: string } }) {
  const professional = professionalsData[params.id];

  if (!professional) {
    notFound();
  }

  return <ProfessionalProfileClient professional={professional} />;
}
