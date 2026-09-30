import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '15mb' }));

// Shared Gemini Client with required User-Agent
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const MODEL_NAME = 'gemini-3.8-flash';

// Helper to format dossier into AI prompt context
function buildDossierContext(dossier: any) {
  const currentGenres = dossier.currentExploringGenres 
    ? `\n- NOVOS GÊNEROS & PESQUISA SONORA ATUAL:\n${dossier.currentExploringGenres}` 
    : '';
  const recentGigs = dossier.recentExperiences 
    ? `\n- NOVAS EXPERIÊNCIAS, GIGS RECENTES & CONQUISTAS:\n${dossier.recentExperiences}` 
    : '';
  const exclusions = dossier.excludedTopicsAndOutdatedInfo 
    ? `\n\n🚨 FILTRO CRÍTICO DE EXCLUSÃO (O QUE NÃO PODE APARECER SOB NENHUMA HIPÓTESE):\n${dossier.excludedTopicsAndOutdatedInfo}\nATENÇÃO OBRIGATÓRIA: É terminantemente proibido citar, insinuar ou sugerir qualquer um dos itens desta lista de exclusão em qualquer post, biografia, pitch, pilar ou estratégia gerada!` 
    : '';

  return `
[DOSSIÊ ATUAL DO PROJETO FLÓRIA (NATHALIA DIAS)]
Nome Artístico: ${dossier.name || 'Flória (DJ & Sound Curator)'}
Nome do Perfil: Nathalia Dias
Gêneros Principais: ${dossier.genres || 'House (Deep House, Minimal & Groove), Indie Dance, Melodic Techno'}
BPM Range Típico: ${dossier.bpmRange || '118 - 126 BPM'}
${currentGenres}
Posicionamento / Proposta de Valor: ${dossier.tagline || 'Music Design, Curadoria Sonora e Atmosfera para Marcas de Luxo, B2B e Pistas Seletas'}
Bio Atual: ${dossier.bio || 'Flória é o projeto artístico e de Music Design liderado por Nathalia Dias. Formada pela Yellow DJ Academy e mentorada por Kaká Franco.'}
Press Kit / EPK Texto: ${dossier.pressKit || 'Ex-DJ residente da Mercadoteca (Shopping Crystal - única DJ constante no espaço); apresentações mensais regulares no Phunk Soundroom; gigs no Club Vibe, Hera Bar, Festa do Tite, Supafine, Soma Galeria e Porks.'}
${recentGigs}
Links do Projeto:
- Website: ${dossier.website || 'https://djfloria.com.br'}
- Instagram: ${dossier.instagram || 'https://instagram.com/djfloria'}
- YouTube: ${dossier.youtube || 'https://youtube.com/@djfloria'}
- SoundCloud: ${dossier.soundcloud || 'https://soundcloud.com/djfloria'}
- E-mail Booking: booking@djfloria.com.br / djfloriadrive@gmail.com
- WhatsApp: (41) 92003-4522
Público Alvo / Tribo: ${dossier.targetAudience || 'Marcas de luxo, arquitetos, designers de interiores, hospitalidade premium, vernissages e público exigente de música eletrônica.'}
Histórico de Gigs & Residências: ${dossier.releasesAndGigs || 'Ex-DJ residente oficial da Mercadoteca (Shopping Crystal - onde foi a única DJ constante); apresentações mensais no conceituado Phunk Soundroom; gigs no Club Vibe, Supafine, Hera Bar e Soma Galeria.'}
Formatos de Performance: Warm-up (Groove e elegância), Long Set (3h no set mensal do Phunk), Closing (hipnose e intensidade), Music Design B2B / Listening (volume calibrado para conversas e valorização arquitetônica).
Diferencial Autoral: Vivência como dançarina do ventre (percepção de movimento e groove corporal), leitura atenta da atmosfera acústica, equipamentos limpos com som de coluna.
Diretrizes Visuais da Marca: iOS Dark Glassmorphism, Fundo Preto Grafite Obsidiana (#09090B), Acentos em Laranja Âmbar Quente (#F97316) e Dourado (#D97706), tipografia serifada Playfair Display. (NÃO usar fúcsia, néon ou cyberpunk).
${exclusions}

DIRETRIZ OBRIGATÓRIA DE LINGUAGEM DO UNIVERSO DJ & CLUB CULTURE:
- Toda e qualquer escrita deve soar como de uma DJ profissional de alto escalão da cena eletrônica e de Music Design.
- Use terminologia técnica e de cabine autêntica: Rekordbox, pendrive exportado, CDJs, mixer com modulação precisa de filtros (HPF/LPF) e equalização de graves, mixagem harmônica (Camelot Wheel / tom das tracks), transição em frase (compassos de 32 beats), track IDs, garimpo/diggin' de faixas exclusivas, soundcheck, gain staging, som de coluna com dispersão uniforme, leitura de pista em tempo real, booth monitor (retorno de cabine), long set narrativo e listening bar.
- NUNCA use expressões amadoras como "fazer playlist", "tocar musiquinhas", clichês vazios de "balada", EDM barulhento ou estética de rave descontrolada.
- Garanta que todos os posts, legendas, roteiros de Reels e e-mails de pitch respeitem 100% o filtro de exclusões.
`;
}

// 1. Analyze Branding & Positioning
app.post('/api/branding/analyze', async (req, res) => {
  try {
    const { dossier } = req.body;
    const context = buildDossierContext(dossier || {});

    const prompt = `
Você é a autoridade máxima mundial em branding musical para DJs e artistas de música eletrônica contemporânea (com referências de posicionamento de artistas como Vintage Culture, Nora En Pure, Mochakk, Charlotte de Witte, ANNA, Peggy Gou e Tale of Us).

Com base no dossiê do projeto DJ FLORIA abaixo:
${context}

Gere um posicionamento completo, autêntico, magnético e profissional no formato JSON rigoroso.
O retorno DEVE ter a seguinte estrutura:
{
  "tagline": "Frase de efeito impactante em 1 linha",
  "archetype": {
    "name": "Nome do arquétipo (ex: O Mago Sonoro, O Rebelde Sofisticado, O Explorador Hipnótico)",
    "description": "Explicação profunda do arquétipo para a DJ Floria",
    "energy": "Como essa energia se traduz na pista e no palco"
  },
  "positioningStatement": "Declaração de posicionamento clara: Quem é DJ Floria, para quem toca, que transformação sonora causa e por que é inigualável",
  "brandManifesto": "Um manifesto poético e arrebatador em 3 a 4 parágrafos sobre a essência do projeto, o som e o propósito",
  "brandPillars": [
    {
      "pillar": "Nome do pilar",
      "concept": "Conceito central",
      "inAction": "Como se traduz em conteúdo, visual e sets"
    }
  ],
  "toneOfVoice": {
    "traits": ["3 a 5 adjetivos do tom de voz"],
    "dos": ["3 diretrizes do que fazer na comunicação"],
    "donts": ["3 erros fatais que JAMAIS devem ser cometidos na marca Floria"]
  },
  "competitiveEdge": "Diferencial sonoro e estético em relação a outros DJs da cena",
  "bookerPitch": "Mini pitch de 50 palavras pronto para enviar a contratantes e promotores de festas"
}
`;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error('Error analyzing branding:', error);
    res.status(500).json({ success: false, error: error.message || 'Erro ao analisar branding' });
  }
});

// 2. Instagram Strategy Masterclass
app.post('/api/branding/instagram-strategy', async (req, res) => {
  try {
    const { dossier } = req.body;
    const context = buildDossierContext(dossier || {});

    const prompt = `
Você é o principal estrategista de Instagram para artistas da cena eletrônica global.
Com base no dossiê de DJ FLORIA:
${context}

Desenvolva uma estratégia cirúrgica de Instagram para elevar o perfil da DJ Floria a patamar de festival internacional.
Retorne um JSON estrito com:
{
  "profileOptimization": {
    "recommendedUsernames": ["3 variações limpas caso precise otimizar"],
    "bioOptions": [
      {
        "type": "Conversão & Autoridade",
        "bio": "Texto da bio com emojis seletos e quebras de linha",
        "cta": "Chamada para ação do link"
      },
      {
        "type": "Conceitual & Vibe",
        "bio": "Texto da bio voltado a comunidade e som",
        "cta": "Chamada para ação do link"
      },
      {
        "type": "Booking & Gigs",
        "bio": "Texto da bio com foco em datas, gravadoras e contato profissional",
        "cta": "Chamada para ação do link"
      }
    ],
    "linkTreeRecommendations": ["4 links essenciais que devem estar na árvore de links"],
    "profilePictureTip": "Dica estética para a foto de perfil da DJ Floria",
    "highlights": [
      {
        "name": "Nome do destaque (ex: GIGS, TRACK IDs, BACKSTAGE)",
        "coverVibe": "Estética do ícone/capa",
        "purpose": "O que deve ser colocado e por que fideliza curadores e fãs"
      }
    ]
  },
  "contentPillars": [
    {
      "name": "Nome do pilar",
      "percentage": 35,
      "description": "Sobre o que é esse pilar",
      "exampleIdea": "Exemplo de post matador"
    }
  ],
  "reelsBlueprints": [
    {
      "title": "Conceito do Reel",
      "targetGoal": "Atrair novos seguidores / Viralizar som / Prova social",
      "hookTimecode": "00:00 - 00:03 (Gancho visual e sonoro imediato)",
      "bodyAction": "00:03 - 00:15 (Desenvolvimento, cortes, movimentos da DJ)",
      "audioRecommendation": "Estilo de áudio ou drop da própria faixa/set",
      "onScreenText": "Texto na tela para prender retenção",
      "caption": "Legenda completa pronta para postar com hashtags estratégicas"
    }
  ],
  "carouselConcept": {
    "title": "Tema do Carrossel de Alto Compartilhamento",
    "slides": [
      { "slideNumber": 1, "title": "Capa / Hook", "content": "Texto do slide 1" },
      { "slideNumber": 2, "title": "Slide 2", "content": "Texto do slide 2" },
      { "slideNumber": 3, "title": "Slide 3", "content": "Texto do slide 3" },
      { "slideNumber": 4, "title": "Slide 4", "content": "Texto do slide 4" },
      { "slideNumber": 5, "title": "CTA Final", "content": "Texto do slide de fechamento" }
    ],
    "caption": "Legenda completa do carrossel"
  },
  "storiesEcosystem": {
    "gigDayTimeline": [
      { "time": "14:00", "action": "Preparação / Mala de cabos / Seleção de promos" },
      { "time": "19:00", "action": "Soundcheck com bastidor intimista" },
      { "time": "23:30", "action": "Entrada na cabine / clima da pista" },
      { "time": "02:00", "action": "O drop ápice com público conectado" },
      { "time": "Dia seguinte", "action": "Agradecimento + Pergunta de engajamento 'Qual foi a track favorita?'" }
    ],
    "engagementStickersAdvice": "Como usar caixas de perguntas e enquetes para testar novas tracks"
  }
}
`;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: { responseMimeType: 'application/json' },
    });

    res.json({ success: true, data: JSON.parse(response.text || '{}') });
  } catch (error: any) {
    console.error('Error generating instagram strategy:', error);
    res.status(500).json({ success: false, error: error.message || 'Erro ao gerar estratégia de Instagram' });
  }
});

// 3. Platform Gap Analysis & Auditing
app.post('/api/branding/platform-audit', async (req, res) => {
  try {
    const { dossier } = req.body;
    const context = buildDossierContext(dossier || {});

    const prompt = `
Você é um auditor sênior de carreiras de música eletrônica.
Analise a presença multiplataforma do projeto DJ FLORIA considerando as 5 frentes fundamentais:
1. Instagram
2. YouTube
3. SoundCloud
4. Press Kit / EPK (Electronic Press Kit)
5. Site Oficial / Landing Page

Dossiê do Artista:
${context}

Entregue uma auditoria completa em formato JSON estrito:
{
  "overallHealthScore": 78,
  "platforms": [
    {
      "platform": "Instagram",
      "healthScore": 75,
      "status": "Bom / Precisa de Refino / Crítico",
      "keyDiagnosis": "Diagnóstico do estado atual e percepção de marca",
      "missingElements": [
        "Lista de 3 a 4 coisas cruciais que faltam na plataforma"
      ],
      "quickWins": [
        "2 a 3 ações imediatas de 10 minutos"
      ],
      "strategicNextSteps": [
        "2 passos estratégicos de longo prazo"
      ]
    },
    {
      "platform": "YouTube",
      "healthScore": 60,
      "status": "Precisa de Refino",
      "keyDiagnosis": "Diagnóstico para sets ao vivo, shorts e visualizers",
      "missingElements": ["O que está faltando"],
      "quickWins": ["Ações rápidas"],
      "strategicNextSteps": ["Passos estratégicos"]
    },
    {
      "platform": "SoundCloud",
      "healthScore": 65,
      "status": "Precisa de Refino",
      "keyDiagnosis": "Diagnóstico do ecossistema underground e mix series",
      "missingElements": ["O que está faltando"],
      "quickWins": ["Ações rápidas"],
      "strategicNextSteps": ["Passos estratégicos"]
    },
    {
      "platform": "Press Kit / EPK",
      "healthScore": 55,
      "status": "Crítico",
      "keyDiagnosis": "Como bookers e agências internacionais veem o material",
      "missingElements": ["O que está faltando para fechar gigs maiores"],
      "quickWins": ["Ações rápidas"],
      "strategicNextSteps": ["Passos estratégicos"]
    },
    {
      "platform": "Site Oficial",
      "healthScore": 50,
      "status": "Precisa de Refino",
      "keyDiagnosis": "Presença digital centralizada e captura de contatos",
      "missingElements": ["O que falta no site"],
      "quickWins": ["Ações rápidas"],
      "strategicNextSteps": ["Passos estratégicos"]
    }
  ],
  "crossPlatformSynergy": "Como amarrar o fluxo entre SoundCloud (som) -> Instagram (comunidade) -> YouTube (experiência visual) -> EPK/Site (contratações)",
  "priorityActionPlan": [
    { "order": 1, "title": "Ação Prioridade 1", "platform": "Plataforma", "impact": "Alto" },
    { "order": 2, "title": "Ação Prioridade 2", "platform": "Plataforma", "impact": "Alto" },
    { "order": 3, "title": "Ação Prioridade 3", "platform": "Plataforma", "impact": "Médio" }
  ]
}
`;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: { responseMimeType: 'application/json' },
    });

    res.json({ success: true, data: JSON.parse(response.text || '{}') });
  } catch (error: any) {
    console.error('Error auditing platforms:', error);
    res.status(500).json({ success: false, error: error.message || 'Erro ao auditar plataformas' });
  }
});

// 4. Color Palette & Visual Identity
app.post('/api/branding/visual-identity', async (req, res) => {
  try {
    const { dossier } = req.body;
    const context = buildDossierContext(dossier || {});

    const prompt = `
Você é o diretor de arte e identidade visual de marcas de luxo, hospitalidade premium e música eletrônica sofisticada.
Analise a personalidade, a curadoria sonora e o posicionamento de FLÓRIA (NATHALIA DIAS):
${context}

Crie o universo visual e cromático definitivo alinhado estritamente com o estilo iOS Dark Glassmorphism de Luxo:
- Fundo Preto Grafite Obsidiana (#09090B)
- Superfícies translúcidas tipo vidro escuro com transparência e bordas sutis
- Destaques em Laranja Âmbar Quente (#F97316) e Dourado (#D97706)
- Tipografia: Títulos em Playfair Display serifada para luxo B2B e corpo em Plus Jakarta Sans
- SEM qualquer tom de fúcsia, roxo neon ou estética cyberpunk.

Retorne um JSON estrito:
{
  "conceptTitle": "Luxury Dark Glassmorphism & Warm Amber",
  "conceptDescription": "Explicação poética e funcional da estética visual de Flória",
  "palette": [
    {
      "role": "Background Geral",
      "hex": "#09090B",
      "name": "Deep Obsidian",
      "usage": "Fundo de todas as superfícies, site, capas de sets e material de imprensa"
    },
    {
      "role": "Destaque Primário",
      "hex": "#F97316",
      "name": "Warm Amber",
      "usage": "Botões de ação, pontos de luz, ícones e destaque da marca"
    },
    {
      "role": "Gradiente Secundário",
      "hex": "#D97706",
      "name": "Golden Amber",
      "usage": "Composição de gradientes quentes e sofisticação nobre"
    },
    {
      "role": "Superfície Glass",
      "hex": "#18181B",
      "name": "Smoked Glass",
      "usage": "Cards com transparência, borda sutil de 1px e backdrop-blur"
    },
    {
      "role": "Texto de Alto Contraste",
      "hex": "#F4F4F5",
      "name": "Silk White",
      "usage": "Títulos serifados em Playfair Display e leitura cristalina"
    }
  ],
  "typographySystem": {
    "headerFont": "Playfair Display (Serif Elegante)",
    "headerFontVibe": "Transmite luxo clássico, arquitetura, design e hospitalidade de alto padrão",
    "bodyFont": "Plus Jakarta Sans / Inter",
    "bodyFontVibe": "Limpo, contemporâneo e legível",
    "technicalFont": "Space Grotesk",
    "technicalFontVibe": "Precisão e clareza para especificações de som"
  },
  "visualCodes": [
    {
      "element": "Superfícies & Cartões",
      "rule": "iOS Dark Glassmorphism com vidro escuro translúcido, bordas ultrafinas de 1px e sombras âmbar suaves."
    },
    {
      "element": "Iluminação & Fotografia Editorial",
      "rule": "Luz quente de ambiente, pôr do sol ou tungstênio suave em ambientes de arquitetura e design."
    },
    {
      "element": "Capas de Sets e Flyers",
      "rule": "Design editorial com títulos em Playfair Display serifada e contrastes quentes de âmbar sobre obsidiana."
    }
  ],
  "moodboardKeywords": ["Warm Amber", "Quiet Luxury", "Music Design", "Glassmorphism", "Sensory Architecture", "Deep House", "Hospitality Curation"],
  "outfitStyle": "Quiet Luxury: alfaiataria elegante e contemporânea em tons pretos, terracota, chocolate e joias minimalistas."
}
`;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: { responseMimeType: 'application/json' },
    });

    res.json({ success: true, data: JSON.parse(response.text || '{}') });
  } catch (error: any) {
    console.error('Error generating visual identity:', error);
    res.status(500).json({ success: false, error: error.message || 'Erro ao gerar identidade visual' });
  }
});

// 5. Custom Content Generator (Editorial Calendar, Specific Posts, Emails, etc.)
app.post('/api/branding/generate-content', async (req, res) => {
  try {
    const { dossier, contentType, goal, customInstructions } = req.body;
    const context = buildDossierContext(dossier || {});

    const prompt = `
Você é o estrategista de conteúdo sênior de DJ FLORIA.
Dossiê do projeto:
${context}

Objetivo do conteúdo: ${goal || 'Engajamento e autoridade na cena de música eletrônica'}
Tipo de conteúdo solicitado: ${contentType || 'Calendário Semanal'}
Instruções adicionais: ${customInstructions || 'Nenhuma instrução adicional'}

Crie o conteúdo completo, detalhado, pronto para publicação imediata, com tom autêntico da DJ Floria.
Retorne um JSON estrito:
{
  "title": "Título do Conteúdo Criado",
  "summary": "Resumo estratégico de 2 linhas",
  "contentPieces": [
    {
      "dayOrType": "Ex: Segunda-feira ou Post 1",
      "platform": "Instagram / YouTube / SoundCloud / Email Booker",
      "format": "Reel / Carrossel / Foto + Legenda / Story / Email",
      "hookOrSubject": "Gancho inicial ou Assunto do email",
      "visualDescription": "Direção de arte do vídeo ou foto",
      "copyText": "Texto completo da legenda ou conteúdo, com hashtags e quebras de linha",
      "audioOrBPM": "Recomendação de áudio de fundo ou BPM",
      "cta": "Chamada para ação clara"
    }
  ],
  "curatorTip": "Dica de bastidores do especialista para maximizar o resultado desse lote"
}
`;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: { responseMimeType: 'application/json' },
    });

    res.json({ success: true, data: JSON.parse(response.text || '{}') });
  } catch (error: any) {
    console.error('Error generating custom content:', error);
    res.status(500).json({ success: false, error: error.message || 'Erro ao gerar conteúdo' });
  }
});

// 6. Interactive Branding Director Chat
app.post('/api/branding/chat', async (req, res) => {
  try {
    const { dossier, messages, userMessage } = req.body;
    const context = buildDossierContext(dossier || {});

    const systemInstruction = `
Você é o Diretor Criativo e Estrategista Chefe de Branding da DJ FLORIA.
Você é apaixonado pela cena de música eletrônica, altamente conhecedor de club culture internacional, festivais (Tomorrowland, DGTL, Time Warp, Coachella, Warung, Green Valley, D-Edge), marketing musical moderno, algoritmo do Instagram, Spotify for Artists, SoundCloud e negociação de contratos/bookings.

Você tem acesso ao dossiê completo da DJ Floria:
${context}

Suas diretrizes:
- Responda em Português do Brasil com energia vibrante, visão estratégica afiada e pragmatismo.
- Não use clichês vazios de marketing corporativo; use vocabulário e referências reais da música eletrônica (BPM, track ID, drop, soundcheck, warmup, peak-time, promo pool, curadoria, label showcase).
- Sempre consulte as informações do dossiê para personalizar cada conselho especificamente para a DJ Floria.
- Se o usuário pedir um roteiro de vídeo, dê o timecode exato, o gancho visual, o texto na tela e a legenda pronta.
- Se pedir conselho de posicionamento, seja honesto, sofisticado e posicione a Floria como artista de primeiro escalão.
`;

    // Format chat history
    const contents: any[] = [];
    if (messages && Array.isArray(messages)) {
      for (const m of messages.slice(-10)) {
        contents.push({
          role: m.sender === 'user' ? 'user' : 'model',
          parts: [{ text: m.text }],
        });
      }
    }
    contents.push({
      role: 'user',
      parts: [{ text: userMessage }],
    });

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents,
      config: {
        systemInstruction,
      },
    });

    res.json({ success: true, text: response.text });
  } catch (error: any) {
    console.error('Error in branding chat:', error);
    res.status(500).json({ success: false, error: error.message || 'Erro no chat de branding' });
  }
});

// 7. Google Drive Folder Content Digestion
app.post('/api/drive/digest', async (req, res) => {
  try {
    const { files, currentDossier } = req.body;
    
    const filesSummary = (files || []).map((f: any, idx: number) => {
      const snippet = f.textContent ? f.textContent.slice(0, 3000) : '[Arquivo sem texto extraível ou binário]';
      return `--- ARQUIVO #${idx + 1}: ${f.name} (${f.mimeType}) ---\n${snippet}\n`;
    }).join('\n\n');

    const prompt = `
Você é o especialista em branding e estrategista de carreira de DJ FLORIA.
O artista acabou de conectar sua pasta oficial do Google Drive com materiais de divulgação, press kits, faixas, fotos, riders e notas.

Aqui está a lista e o conteúdo dos arquivos encontrados no Google Drive:
${filesSummary}

Dossiê Atual:
${buildDossierContext(currentDossier || {})}

Analise profundamente todos esses arquivos (incluindo documentos PDFs e imagens anexadas) e extraia o máximo de informações reais para enriquecer o Dossiê do Projeto DJ Floria.
Retorne um JSON estrito com a seguinte estrutura:
{
  "summaryOfFindings": "Resumo de 2 a 3 parágrafos explicando o que foi encontrado na pasta do Drive e como isso valoriza a marca da DJ Floria",
  "filesAnalyzedCount": ${files?.length || 0},
  "suggestedUpdates": {
    "bio": "Biografia aprimorada incorporando os dados mais recentes encontrados nos arquivos",
    "pressKit": "Texto de Press Kit consolidado com dados de booking, especificações técnicas de som e rider encontrados",
    "genres": "Gêneros e BPM identificados nas faixas ou descrições",
    "releasesAndGigs": "Histórico de apresentações, tracks e parcerias identificadas",
    "visualAestheticCurrent": "Estilo visual extraído de fotos, flyers ou diretrizes nos arquivos",
    "notes": "Recomendações estratégicas baseadas nas lacunas ou potenciais descobertos nos arquivos"
  },
  "keyHighlights": [
    "Destaque 1 encontrado nos arquivos",
    "Destaque 2 encontrado nos arquivos",
    "Destaque 3 encontrado nos arquivos"
  ]
}
`;

    // Construct parts: attach any binary PDF or image files found in Drive directly to Gemini
    const parts: any[] = [];
    const binaryFiles = (files || []).filter((f: any) => f.base64Data && (f.mimeType === 'application/pdf' || f.mimeType?.startsWith('image/'))).slice(0, 5);
    for (const bf of binaryFiles) {
      parts.push({
        inlineData: {
          mimeType: bf.mimeType,
          data: bf.base64Data,
        },
      });
    }
    parts.push({ text: prompt });

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: { parts },
      config: { responseMimeType: 'application/json' },
    });

    res.json({ success: true, data: JSON.parse(response.text || '{}') });
  } catch (error: any) {
    console.error('Error digesting drive folder:', error);
    res.status(500).json({ success: false, error: error.message || 'Erro ao processar arquivos do Google Drive' });
  }
});

// 8. Upload Press Kit File Extraction (PDF, Text, Images)
app.post('/api/dossier/upload-presskit', async (req, res) => {
  try {
    const { base64, mimeType, fileName } = req.body;
    if (!base64) {
      return res.status(400).json({ success: false, error: 'Nenhum arquivo enviado' });
    }

    // Clean base64 string
    const cleanBase64 = base64.includes(',') ? base64.split(',')[1] : base64;
    const isPdfOrImage = mimeType?.startsWith('image/') || mimeType === 'application/pdf';

    const systemPrompt = `
Você é o especialista em carreiras e branding da DJ FLORIA.
A artista acabou de enviar o arquivo oficial de Press Kit / EPK / Rider (${fileName}).
Analise minuciosamente todo o conteúdo deste documento (incluindo textos, tabelas de rider técnico, datas, histórico, contatos de booking, citações da mídia e propostas artísticas).

Extraia e estruture os dados em um formato JSON estrito:
{
  "extractedPressKitText": "Texto completo, limpo e profissional do Press Kit consolidado para uso imediato",
  "extractedBio": "Biografia artística pronta para o dossiê",
  "extractedTechRider": "Equipamentos de cabine (ex: CDJ-3000, DJM-A9, retorno de cabine, canal de mic)",
  "extractedBookerInfo": "E-mails, telefones ou agências de booking identificados",
  "genresIdentified": "Gêneros musicais mencionados",
  "pastGigsIdentified": "Clubs, eventos ou festivais citados",
  "summary": "Resumo de 2 linhas sobre o que foi identificado no arquivo"
}
`;

    let response;
    if (isPdfOrImage) {
      response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: {
          parts: [
            {
              inlineData: {
                mimeType: mimeType || 'application/pdf',
                data: cleanBase64,
              },
            },
            {
              text: systemPrompt,
            },
          ],
        },
        config: {
          responseMimeType: 'application/json',
        },
      });
    } else {
      // Decode text / markdown
      const textContent = Buffer.from(cleanBase64, 'base64').toString('utf-8');
      response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: `${systemPrompt}\n\nCONTEÚDO DO ARQUIVO:\n${textContent}`,
        config: {
          responseMimeType: 'application/json',
        },
      });
    }

    const parsed = JSON.parse(response.text || '{}');
    res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error('Error processing press kit file:', error);
    res.status(500).json({ success: false, error: error.message || 'Erro ao processar o arquivo de Press Kit' });
  }
});

// Vite Middleware for development vs Static in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
} else {
  const { createServer } = await import('vite');
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
}

const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`DJ Floria Brand Server running on http://0.0.0.0:${PORT}`);
});
