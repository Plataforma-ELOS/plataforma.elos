-- Feed de conteúdos editoriais (Profissionais, Clínicas, Cuidadores) e as
-- 4 notícias de pesquisa, a partir do documento "E.L.O.S. — descrições".
--
-- Por que uma tabela e não "posts": posts.author_id exige um perfil real
-- (FK para auth.users). Estes conteúdos são de PERFIS DEMONSTRATIVOS — o
-- próprio documento pede que não apareçam como depoimentos autênticos —, então
-- ficam numa tabela editorial com is_demo, exibida com selo.

create type public.feed_content_kind as enum ('profissional', 'clinica', 'cuidador');

create table public.feed_contents (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  kind public.feed_content_kind not null,
  title text not null,
  author_label text not null,
  -- Texto simples: parágrafos separados por linha em branco; linhas
  -- iniciadas por "- " ou "1. " viram listas (src/lib/data/feed-contents.ts).
  body text not null,
  tip text,
  -- [{ "titulo": "...", "descricao": "...", "url": "https://..." }]
  sources jsonb not null default '[]'::jsonb,
  image_url text,
  image_alt text,
  is_demo boolean not null default true,
  published_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  constraint feed_contents_sources_array check (jsonb_typeof(sources) = 'array'),
  constraint feed_contents_image_alt check (image_url is null or image_alt is not null)
);

create index feed_contents_published_at_idx on public.feed_contents (published_at desc);

alter table public.feed_contents enable row level security;

-- Mesmo padrão de news_articles: leitura pública, escrita só admin.
create policy feed_contents_read on public.feed_contents
  for select using (true);
create policy feed_contents_admin_insert on public.feed_contents
  for insert with check ((select private.is_admin()));
create policy feed_contents_admin_update on public.feed_contents
  for update using ((select private.is_admin())) with check ((select private.is_admin()));
create policy feed_contents_admin_delete on public.feed_contents
  for delete using ((select private.is_admin()));

-- ------------------------------------------------------------------ feed
insert into public.feed_contents
  (slug, kind, title, author_label, body, tip, sources, image_url, image_alt, published_at)
values
(
  'nem-toda-comunicacao-acontece-pela-fala', 'profissional',
  'Nem toda comunicação acontece pela fala',
  'Fonoaudióloga — perfil demonstrativo',
  $t$Muitas vezes, esperamos que a criança expresse suas necessidades usando palavras, mas a comunicação vai muito além da fala. Gestos, expressões, apontar, imagens e movimentos corporais também podem transmitir mensagens.

Uma prática que pode ajudar é oferecer opções visuais. Por exemplo, se a criança quer beber alguma coisa, apresente imagens de água e suco para que ela possa apontar ou escolher.

Para crianças que precisam de apoio adicional, a Comunicação Aumentativa e Alternativa (CAA) pode ser uma grande aliada. Ela utiliza recursos como figuras, pranchas e dispositivos para facilitar a expressão.$t$,
  $t$Observe como a criança já tenta se comunicar e valorize essas tentativas. O objetivo é ajudá-la a ser compreendida, não obrigá-la a se comunicar de uma única maneira.$t$,
  $j$[
    {"titulo": "American Speech-Language-Hearing Association (ASHA)", "descricao": "Augmentative and Alternative Communication (AAC).", "url": "https://www.asha.org/practice-portal/professional-issues/augmentative-and-alternative-communication/"},
    {"titulo": "Laubscher et al. (2022)", "descricao": "Effect of Video Augmentative and Alternative Communication Technology on Communication During Play With Peers for Children With Autism Spectrum Disorder.", "url": "https://doi.org/10.1044/2022_LSHSS-21-00136"}
  ]$j$::jsonb,
  null, null, '2026-11-12 12:00:00-03'
),
(
  'antes-de-corrigir-um-comportamento', 'profissional',
  'Antes de corrigir um comportamento, tente entender o que está acontecendo',
  'Terapeuta ocupacional — perfil demonstrativo',
  $t$Quando uma criança apresenta irritação, choro ou tenta sair de determinado ambiente, é importante observar o que pode estar acontecendo ao redor dela.

Sons altos, luzes fortes, cheiros e ambientes movimentados podem causar desconforto sensorial. Cada criança possui sensibilidades diferentes.

Uma estratégia é identificar quais situações costumam gerar desconforto e adaptar o ambiente quando possível. Você pode diminuir o volume da televisão, procurar um local mais tranquilo ou permitir o uso de abafadores de ruído, caso sejam confortáveis para a criança.$t$,
  $t$O comportamento também pode ser uma forma de expressão. Em vez de pensar apenas em como interrompê-lo, procure compreender a necessidade que pode estar por trás dele.$t$,
  $j$[
    {"titulo": "NICE (2013, atualizado)", "descricao": "Autism spectrum disorder in under 19s: support and management. Recomenda adaptações ambientais considerando sensibilidades individuais.", "url": "https://www.nice.org.uk/guidance/cg170/chapter/recommendations"},
    {"titulo": "National Autistic Society", "descricao": "Sensory differences.", "url": "https://www.autism.org.uk/learn/knowledge-hub/professional-practice/sensory-differences"}
  ]$j$::jsonb,
  '/comunidade/conteudos/profissional-ambiente-sensorial.jpg',
  'Criança sentada num puff azul, de olhos fechados e com abafador de ruído, num cantinho de luz suave com uma rotina visual na parede.',
  '2026-11-13 12:00:00-03'
),
(
  'rotina-visual-pequenas-mudancas', 'clinica',
  'Rotina visual: pequenas mudanças que fazem diferença',
  'Clínica multidisciplinar — perfil demonstrativo',
  $t$Você já percebeu que algumas mudanças inesperadas podem deixar a criança mais ansiosa ou insegura?

Uma rotina visual é uma ferramenta que ajuda a criança a compreender o que vai acontecer durante o dia. Ela pode ser construída com fotografias, desenhos, símbolos ou palavras, dependendo da forma como a criança compreende melhor as informações.

Como colocar em prática?

1. Escolha atividades do cotidiano, como acordar, tomar café e ir à escola.
2. Organize imagens que representem cada atividade.
3. Coloque-as em uma sequência de fácil visualização.
4. Sempre que uma atividade terminar, mostre qual será a próxima.

Você também pode utilizar a estratégia "primeiro e depois", como: primeiro guardar os brinquedos, depois assistir ao desenho.

Essa ferramenta ajuda a tornar o cotidiano mais previsível e pode favorecer a autonomia da criança.$t$,
  $t$Não é necessário preencher cada minuto do dia. O importante é oferecer orientação e segurança.$t$,
  $j$[
    {"titulo": "American Speech-Language-Hearing Association (ASHA)", "descricao": "Augmentative and Alternative Communication. Orientações sobre agendas visuais e pistas visuais.", "url": "https://www.asha.org/practice-portal/professional-issues/augmentative-and-alternative-communication/"},
    {"titulo": "NICE", "descricao": "Autism spectrum disorder in under 19s. Recomenda o uso de palavras, imagens e símbolos como suportes visuais.", "url": "https://www.nice.org.uk/guidance/cg170/chapter/recommendations"}
  ]$j$::jsonb,
  null, null, '2026-11-14 12:00:00-03'
),
(
  'crises-nao-sao-birras', 'clinica',
  'Crises não são birras: como acolher momentos de desregulação?',
  'Clínica de desenvolvimento infantil — perfil demonstrativo',
  $t$Durante um momento de desregulação emocional, a criança pode chorar, gritar, apresentar movimentos repetitivos ou ter dificuldade para responder ao que é solicitado.

Nesses momentos, insistir em explicações longas ou exigir que ela se acalme imediatamente pode aumentar o desconforto.

Nossa orientação é priorizar a segurança e reduzir os estímulos do ambiente.

O que fazer?

- Mantenha a calma e utilize poucas palavras.
- Reduza barulhos, luzes e movimentações, se possível.
- Evite repreensões e cobranças durante a crise.
- Ofereça espaço e respeite a necessidade de pausa.
- Aguarde a recuperação antes de conversar sobre o ocorrido.

Depois, observe o que aconteceu antes do episódio: houve uma mudança na rotina? Algum desconforto? Cansaço ou dificuldade de comunicação?

Registrar essas situações pode ajudar a família e os profissionais a identificar padrões e construir estratégias de prevenção.$t$,
  $t$Acolher não significa ignorar as necessidades de apoio. Significa compreender antes de exigir.$t$,
  $j$[
    {"titulo": "National Autistic Society", "descricao": "Meltdowns – a guide for all audiences.", "url": "https://www.autism.org.uk/advice-and-guidance/behaviour/meltdowns/all-audiences"},
    {"titulo": "NICE", "descricao": "Autism spectrum disorder in under 19s. Recomenda investigar fatores ambientais, físicos e de comunicação associados aos comportamentos.", "url": "https://www.nice.org.uk/guidance/cg170/chapter/recommendations"}
  ]$j$::jsonb,
  '/comunidade/conteudos/clinica-espaco-calmo.jpg',
  'Cantinho calmo à meia-luz, com puff, almofadas, uma tenda de tecido com luzes pequenas e um cesto de brinquedos sensoriais.',
  '2026-11-15 12:00:00-03'
),
(
  'passeios-mais-tranquilos', 'cuidador',
  'Passeios mais tranquilos começam antes de sair de casa',
  'Mãe e cuidadora — perfil demonstrativo',
  $t$Uma coisa que pode ajudar bastante é preparar a criança antes de sair. Lugares novos, barulhos e mudanças na rotina podem gerar insegurança.

Uma prática simples é mostrar fotografias do lugar que vocês vão visitar e explicar, com palavras simples ou imagens, o que acontecerá.

Por exemplo, antes de ir ao médico, mostre uma foto da clínica, explique que vocês vão sair de casa, esperar um pouco e depois voltar.

Também pode ser interessante escolher horários com menos movimento, levar um brinquedo familiar e combinar uma forma de pedir uma pausa.

Não significa que todos os passeios serão tranquilos, mas a preparação pode diminuir as surpresas e facilitar a participação da criança.$t$,
  $t$Não espere chegar ao destino para explicar o que vai acontecer. Antecipar os acontecimentos pode fazer diferença!$t$,
  $j$[
    {"titulo": "NICE", "descricao": "Autism spectrum disorder in under 19s. Recomenda adaptações nos atendimentos, inclusive para reduzir períodos de espera.", "url": "https://www.nice.org.uk/guidance/cg170/chapter/recommendations"},
    {"titulo": "National Autistic Society", "descricao": "Distressed behaviour. Orientações sobre preparação para mudanças e uso de suportes visuais.", "url": "https://www.autism.org.uk/advice-and-guidance/behaviour/distressed-behaviour/all-audiences"}
  ]$j$::jsonb,
  null, null, '2026-11-09 12:00:00-03'
),
(
  'brincar-tambem-e-ensinar', 'cuidador',
  'Aprendi que brincar também é uma forma de ensinar',
  'Pai e cuidador — perfil demonstrativo',
  $t$Às vezes, queremos ensinar algo novo o tempo inteiro, mas esquecemos que muitas oportunidades de aprendizagem aparecem nas brincadeiras do dia a dia.

Uma estratégia interessante é acompanhar os interesses da criança. Se ela gosta de carrinhos, por exemplo, você pode aproveitar esse momento para estimular a comunicação, a interação e a troca de turnos.

Experimente brincar junto, imitar algumas ações da criança e criar pequenas oportunidades para ela participar. Você pode perguntar qual carrinho ela quer, esperar uma resposta e continuar a brincadeira a partir da escolha dela.

Não precisa transformar tudo em uma atividade estruturada. O mais importante é criar momentos de interação agradáveis, respeitando o ritmo e os interesses da criança.$t$,
  $t$Nem sempre precisamos ensinar algo novo. Às vezes, precisamos participar melhor do mundo que a criança já está construindo.$t$,
  $j$[
    {"titulo": "Organização Mundial da Saúde (OMS)", "descricao": "Caregiver Skills Training – Participants' Guide (2022). Material sobre brincadeiras, comunicação e aprendizagem nas atividades cotidianas.", "url": "https://www.who.int/europe/publications/i/item/9789240048911"},
    {"titulo": "NICE", "descricao": "Autism spectrum disorder in under 19s. Recomenda intervenções de comunicação e interação baseadas em brincadeiras, mediadas por adultos.", "url": "https://www.nice.org.uk/guidance/cg170/resources/autism-spectrum-disorder-in-under-19s-support-and-management-pdf-35109745515205"}
  ]$j$::jsonb,
  '/comunidade/conteudos/cuidador-brincar-no-chao.jpg',
  'Pai e criança deitados no tapete da sala, brincando juntos com carrinhos de brinquedo.',
  '2026-11-10 12:00:00-03'
),
(
  'kit-para-momentos-dificeis', 'cuidador',
  'Montamos um pequeno kit para momentos difíceis fora de casa',
  'Familiar e cuidador — perfil demonstrativo',
  $t$Uma prática que pode facilitar bastante os passeios é preparar uma pequena bolsa com objetos que ajudem a criança a lidar com situações desconfortáveis.

A ideia é incluir itens que façam sentido para as necessidades individuais dela, como:

- Abafador de ruído, para ambientes muito barulhentos.
- Brinquedo ou objeto familiar, que ofereça conforto.
- Livro ou atividade de interesse, para momentos de espera.
- Água e um pequeno lanche, quando necessário.
- Cartões com imagens para ajudar a expressar necessidades.

O segredo é observar quais objetos realmente ajudam a criança. Nem todo recurso funciona para todos, e alguns podem até causar desconforto.

Antes de sair, confira se tudo está na bolsa e permita que a criança tenha acesso aos itens quando precisar.$t$,
  $t$O kit não precisa ser caro ou elaborado. O mais importante é conhecer as necessidades da criança e estar preparado.$t$,
  $j$[
    {"titulo": "National Autistic Society", "descricao": "Sensory differences. Recomenda identificar sensibilidades e considerar recursos sensoriais individuais.", "url": "https://www.autism.org.uk/learn/knowledge-hub/professional-practice/sensory-differences"},
    {"titulo": "NICE", "descricao": "Autism spectrum disorder in under 19s. Orientações sobre adaptações ambientais e sensibilidades sensoriais.", "url": "https://www.nice.org.uk/guidance/cg170/chapter/recommendations"}
  ]$j$::jsonb,
  '/comunidade/conteudos/cuidador-kit-passeio.jpg',
  'Itens de um kit de passeio sobre uma toalha: abafador de ruído, brinquedo sensorial colorido, boné, óculos escuros, garrafa de água, lanches e um cartão com a sequência visual do dia.',
  '2026-11-11 12:00:00-03'
),
(
  'cuidar-tambem-e-reconhecer-limites', 'cuidador',
  'Cuidar também significa reconhecer os próprios limites',
  'Mãe e cuidadora — perfil demonstrativo',
  $t$Durante muito tempo, a atenção da família fica concentrada nas necessidades da criança. Consultas, terapias, escola e atividades acabam ocupando grande parte da rotina.

Mas existe algo que também precisa de atenção: o bem-estar de quem cuida.

Uma prática que pode ajudar é construir uma rede de apoio. Converse com familiares de confiança, divida responsabilidades e permita que outras pessoas participem dos cuidados, respeitando as necessidades da criança.

Também tente reservar pequenos momentos para descansar, realizar atividades de que gosta ou simplesmente ficar um pouco sem responsabilidades.

Se possível, procure grupos de apoio e acompanhamento psicológico. Compartilhar experiências com outras famílias pode diminuir a sensação de isolamento e ajudar a encontrar novas formas de enfrentar os desafios.$t$,
  $t$Você não precisa dar conta de tudo sozinho. Pedir ajuda também é uma forma de cuidar da sua família.$t$,
  $j$[
    {"titulo": "Organização Mundial da Saúde (OMS)", "descricao": "Caregiver Skills Training – Caregiver Well-being (2026). Material específico sobre o bem-estar de cuidadores.", "url": "https://www.who.int/publications/i/item/9789240120983"},
    {"titulo": "NICE", "descricao": "Autism spectrum disorder in under 19s. Recomenda suporte às famílias, cuidadores e acesso a períodos de descanso.", "url": "https://www.nice.org.uk/guidance/cg170/chapter/recommendations"}
  ]$j$::jsonb,
  '/comunidade/conteudos/cuidador-autocuidado.jpg',
  'Mulher sentada junto a uma janela, segurando uma xícara e olhando para fora, num ambiente claro e tranquilo.',
  '2026-11-16 12:00:00-03'
);

-- ------------------------------------------------------------------ notícias
insert into public.news_articles
  (slug, title, description, content, image_url, image_hint, category, author_name, tags,
   published_at, source_url, source_citation, source_note)
values
(
  'desafios-das-familias-no-diagnostico-do-autismo',
  'Estudo brasileiro revela desafios enfrentados por famílias durante o diagnóstico do autismo',
  'Em pesquisa com 58 responsáveis, 74% perceberam os primeiros sinais antes dos dois anos — mas o diagnóstico veio, em média, dois anos depois.',
  $h$<p>Uma pesquisa publicada na <em>Revista Psicologia e Saúde</em> investigou como acontece o processo de diagnóstico do Transtorno do Espectro Autista (TEA) a partir das experiências de pais brasileiros.</p>
<p>O estudo contou com a participação de 58 responsáveis por crianças autistas. Entre os resultados, 74,14% dos participantes relataram que os primeiros sinais de desenvolvimento diferente foram percebidos antes dos dois anos de idade.</p>
<p>Entretanto, mesmo após a identificação desses sinais, o diagnóstico foi concluído, em média, apenas dois anos depois.</p>
<p>Outro dado importante é que as mães foram as principais responsáveis por perceber os primeiros sinais, representando 62,07% dos casos analisados.</p>
<p>Os resultados mostram que perceber características do desenvolvimento infantil nem sempre significa conseguir acesso rápido à avaliação e aos serviços especializados.</p>
<h2>O que isso significa para as famílias?</h2>
<p>Observar o desenvolvimento da criança e procurar orientação profissional diante de preocupações é importante. Também é fundamental que os serviços de saúde estejam preparados para acolher as famílias e facilitar o acesso à avaliação, sem desconsiderar suas dificuldades.</p>$h$,
  null, 'pesquisa diagnóstico',
  'saude',
  'Beatriz Soares de Araujo Ferreira, Carolina Aguiar de Oliveira, Ana Beatriz Pessoa Calderaro e Jaqueline de Carvalho Rodrigues',
  array['diagnóstico', 'famílias', 'pesquisa brasileira'],
  '2026-11-16 12:00:00-03',
  'https://pssa.ucdb.br/pssa/article/view/3132',
  'FERREIRA, Beatriz Soares de Araujo et al. Percurso Diagnóstico do Transtorno do Espectro Autista (TEA): Experiência de Pais Brasileiros. Revista Psicologia e Saúde, 2026. DOI: 10.20435/pssa.v18i1.3132',
  'Pesquisa exploratória com 58 responsáveis. Os resultados representam a amostra estudada, não todas as famílias brasileiras.'
),
(
  'mais-de-1-milhao-de-pessoas-autistas-no-brasil',
  'Pesquisa estima que mais de 1,1 milhão de pessoas autistas viviam no Brasil em 2023',
  'Estimativa do Global Burden of Disease aponta cerca de 0,53% da população no espectro, com prevalência ajustada por idade estável desde 1990.',
  $h$<p>Um estudo publicado na <em>Revista Brasileira de Epidemiologia</em> analisou a presença do Transtorno do Espectro Autista no Brasil entre 1990 e 2023, utilizando dados do Global Burden of Disease (GBD), uma iniciativa internacional de pesquisa em saúde.</p>
<p>Segundo as estimativas apresentadas, em 2023 mais de 1,1 milhão de brasileiros estavam no espectro autista, correspondendo a aproximadamente 0,53% da população.</p>
<p>A pesquisa também identificou que o número absoluto estimado de pessoas autistas aumentou desde 1990. Entretanto, a prevalência ajustada por idade permaneceu relativamente estável ao longo do período analisado.</p>
<p>Isso é importante porque o aumento no número estimado de pessoas não significa necessariamente que o autismo esteja se tornando mais frequente. Mudanças no tamanho e na composição da população também precisam ser consideradas.</p>
<h2>Por que essa pesquisa importa?</h2>
<p>Os dados ajudam a compreender a dimensão das necessidades relacionadas ao TEA no país e reforçam a importância de preparar os serviços de saúde e educação para oferecer atendimento, acessibilidade e acompanhamento adequados.</p>$h$,
  '/noticias/pesquisas/prevalencia-tea-brasil.jpg', 'mapa do Brasil com dados de prevalência',
  'dados',
  'Nathalia Avila Dimer, Ana Paula Souto Melo, Damian Santomauro, Deborah Carvalho Malta, Bruce Bartholow Duncan e Bárbara Niegia Garcia de Goulart',
  array['epidemiologia', 'Brasil', 'GBD'],
  '2026-08-07 12:00:00-03',
  'https://www.scielo.br/j/rbepid/a/sHqSSvbdLw4Vw8hyQMNyZMf/?format=html&lang=en',
  'DIMER, Nathalia Avila et al. Prevalence, incidence, and years lived with disability due to Autism Spectrum Disorder in Brazil, 1990–2023: Results from the Global Burden of Disease Study 2023. Revista Brasileira de Epidemiologia, 2026. DOI: 10.1590/1980-549720260025',
  'Os números são estimativas epidemiológicas, com intervalos de incerteza, e não uma contagem individual de pessoas diagnosticadas.'
),
(
  'universitarios-autistas-dificuldades-ufpe',
  'Pesquisa da UFPE aponta dificuldades enfrentadas por universitários autistas',
  'Estudo com nove estudantes identificou barreiras de comunicação social e de acessibilidade que afetam a permanência e a aprendizagem.',
  $h$<p>Uma pesquisa desenvolvida por pesquisadoras vinculadas à Universidade Federal de Pernambuco (UFPE) investigou a comunicação social e o desempenho acadêmico de estudantes universitários com Transtorno do Espectro Autista.</p>
<p>O estudo contou com nove universitários autistas de uma instituição pública de ensino superior.</p>
<p>Os resultados identificaram dificuldades relacionadas à comunicação social, incluindo aspectos como expressões faciais, contato visual e variações na entonação da fala.</p>
<p>Outro ponto importante foi a identificação de barreiras de acessibilidade no ambiente universitário. Segundo a pesquisa, a falta de recursos e estratégias inclusivas contribuiu para sentimentos de ansiedade e angústia, além de prejudicar o processo de aprendizagem.</p>
<h2>O que podemos aprender com essa pesquisa?</h2>
<p>A inclusão não termina quando uma pessoa autista consegue entrar na universidade. É necessário garantir condições para que ela consiga permanecer, aprender e participar das atividades acadêmicas.</p>
<p>Isso envolve adaptar estratégias de comunicação, oferecer suporte individualizado e construir ambientes que respeitem diferentes formas de interação e aprendizagem.</p>$h$,
  null, 'universidade inclusão',
  'educacao',
  'Tácia Soares dos Santos, Ana Cristina de Albuquerque Montenegro, Angélica Galindo Carneiro Rosal e Bianca Arruda Manchester de Queiroga',
  array['ensino superior', 'inclusão', 'acessibilidade'],
  '2025-11-25 12:00:00-03',
  'https://revistapsicopedagogia.com.br/revista/article/view/969',
  'SANTOS, Tácia Soares dos et al. Comunicação e desempenho acadêmico em universitários com TEA. Revista Psicopedagogia, v. 42, n. 129, p. 491–504, 2025. DOI: 10.51207/2179-4057.20250045',
  'Pesquisa com nove estudantes de uma instituição pública. Os resultados não devem ser generalizados para todos os universitários autistas.'
),
(
  'treinamento-de-pais-desenvolvimento-criancas-autistas',
  'Estudo aponta benefícios do treinamento de pais para o desenvolvimento de crianças autistas',
  'Revisão de 15 ensaios clínicos encontrou efeitos positivos em habilidades sociais, comunicação e comportamentos desafiadores.',
  $h$<p>Uma revisão sistemática publicada no <em>Journal of Autism and Developmental Disorders</em> investigou os efeitos de programas de treinamento voltados aos pais de crianças pequenas com Transtorno do Espectro Autista.</p>
<p>A pesquisa reuniu resultados de 15 ensaios clínicos randomizados, analisando como a participação dos responsáveis em atividades de aprendizagem e interação pode contribuir para o desenvolvimento infantil.</p>
<p>Os resultados apontaram benefícios nas habilidades sociais, na comunicação e na redução de comportamentos desafiadores.</p>
<p>Os pesquisadores identificaram efeitos positivos nas três áreas analisadas, embora os resultados variassem entre os estudos.</p>
<h2>Como isso pode ajudar as famílias?</h2>
<p>O treinamento de pais não significa transformar a família em terapeuta. A proposta é oferecer conhecimentos e estratégias para que os responsáveis consigam aproveitar situações cotidianas, como brincadeiras, refeições e momentos de interação, para estimular a comunicação e a participação da criança.</p>
<p>A pesquisa reforça a importância de incluir os cuidadores no processo de desenvolvimento, oferecendo orientação e acompanhamento adequados.</p>$h$,
  null, 'pais e criança',
  'desenvolvimento',
  'Eunhye Seo, Yaena Ha, Pureum Jeon e Eunyoung Yoo',
  array['treinamento de pais', 'intervenção precoce', 'revisão sistemática'],
  '2025-12-12 12:00:00-03',
  'https://pubmed.ncbi.nlm.nih.gov/41385127/',
  'SEO, Eunhye et al. Early Parent-Mediated Training for Social-Communication Skills in Toddlers and Preschoolers With ASD: A Systematic Review and Meta-analysis. Journal of Autism and Developmental Disorders, publicado online em 12 de dezembro de 2025. DOI: 10.1007/s10803-025-07155-6',
  'Revisão de 15 ensaios clínicos. Os autores também apontam diferenças importantes entre os estudos e a necessidade de pesquisas sobre os efeitos a longo prazo.'
);
