/* Guia da reunião presencial EngeGlobal, 8 de outubro de 2026.
   Fontes: Memorando de Âmbito v1.0 (02/10), discovery de 28/09, follow-up de 06/10.
   Árvore: { q: pergunta, quem: [...], ramos: [ { r: resposta, tom, vai: árvore | { fim, tom } } ] }
   tom: ok (viável), inv (investigar na Fase 0), terc (depende de terceiros), fora (fica fora desta fase) */
window.GUIA = {
  modulos: [
    {
      id: 'concursos', letra: 'B', fase: 'Fase 1', titulo: 'Pesquisa e análise de concursos',
      quem: ['Elsa', 'Diretor de produção', 'Luís'],
      porque: 'O Hugo disse-o na reunião: falhar um documento obrigatório é ficar excluído à nascença. A rotina só é útil se lermos as peças certas, nas plataformas certas, com os critérios deles.',
      arvores: [
        {
          titulo: 'De onde vêm os concursos e as peças',
          q: 'Onde aparecem hoje os concursos que analisam?', quem: ['Elsa'],
          ramos: [
            { r: 'Portal BASE e Diário da República', tom: 'ok', vai: {
              q: 'As peças do procedimento descarregam-se sem login?', quem: ['Elsa'],
              ramos: [
                { r: 'Sim', tom: 'ok', vai: { fim: 'Leitura automática viável', tom: 'ok' } },
                { r: 'Não', tom: 'inv', vai: { fim: 'Ver em que plataforma estão, quem tem conta e se exige assinatura digital', tom: 'inv' } }
              ] } },
            { r: 'Plataformas eletrónicas de contratação', tom: 'inv', vai: {
              q: 'Que plataformas usam e quem tem a conta?', quem: ['Elsa'],
              ramos: [
                { r: 'Têm API ou exportação', tom: 'ok', vai: { fim: 'Ligação direta, a confirmar nos termos de uso', tom: 'ok' } },
                { r: 'Só acesso manual', tom: 'terc', vai: { fim: 'Alertas por email da plataforma e upload das peças pela Elsa', tom: 'terc' } }
              ] } },
            { r: 'Convites diretos por email', tom: 'ok', vai: { fim: 'Entra pela caixa de email, com leitura dos anexos', tom: 'ok' } }
          ]
        },
        {
          titulo: 'Os critérios de seleção',
          q: 'Os critérios para concorrer estão escritos em algum lado?', quem: ['Diretor de produção', 'Luís'],
          ramos: [
            { r: 'Sim', tom: 'ok', vai: { fim: 'Passam a regras configuráveis do agente', tom: 'ok' } },
            { r: 'Estão na cabeça de quem decide', tom: 'inv', vai: { fim: 'Escrevê-los na auditoria, com 5 a 10 concursos reais já decididos', tom: 'inv' } }
          ]
        }
      ],
      perguntas: [
        'Quantos concursos aparecem por semana, quantos analisam e a quantos concorrem? (o Hugo falou em 10 para 2 ou 3)',
        'Critérios: zona geográfica, tipo de obra, valor base mínimo, categorias e classes de alvará, equipas disponíveis. Há mais algum?',
        'Quem decide concorrer e em quanto tempo? Onde querem receber o resumo (email, CRM, WhatsApp)?',
        'Que documentos são sempre exigidos e quais variam de concurso para concurso? Onde está esse arquivo?',
        'Ideia do Luís: cruzar com o Código dos Contratos Públicos para detetar exigências que já não são enquadráveis. Quem valida a reclamação?',
        'Alertas na internet por palavras-chave (obras e relvados planeados): que palavras, que fontes, com que frequência?'
      ],
      expectativa: 'A IA filtra e resume; a decisão de concorrer continua com eles. Se as peças estiverem atrás de um login que não podemos usar, a Elsa continua a descarregá-las e o agente trata do resto.'
    },
    {
      id: 'propostas', letra: 'C', fase: 'Fase 1', titulo: 'Assistente de propostas e orçamentação',
      quem: ['Hélder Freitas', 'Luís', 'Hugo'],
      porque: 'É o coração do projeto e onde está mais incerteza: os mapas do Hélder, de onde vêm os preços, e se o projeto chega com mapa de quantidades ou tem de ser medido.',
      arvores: [
        {
          titulo: 'Como se faz hoje um orçamento',
          q: 'Como é feito hoje um orçamento de relvado sintético?', quem: ['Luís', 'Hélder Freitas'],
          ramos: [
            { r: 'Folha de Excel própria', tom: 'ok', vai: {
              q: 'Os preços e as fórmulas estão todos na folha?', quem: ['Hélder Freitas'],
              ramos: [
                { r: 'Sim', tom: 'ok', vai: { fim: 'O agente preenche a folha, como na demonstração', tom: 'ok' } },
                { r: 'Vêm de fora', tom: 'inv', vai: { fim: 'Mapear a origem: PHC, fornecedores, histórico', tom: 'inv' } }
              ] } },
            { r: 'Software de orçamentação', tom: 'inv', vai: {
              q: 'Qual, e tem importação, exportação ou API?', quem: ['Hélder Freitas'],
              ramos: [
                { r: 'Sim', tom: 'ok', vai: { fim: 'Ligação ao software', tom: 'ok' } },
                { r: 'Não', tom: 'terc', vai: { fim: 'Trabalhar sobre exportações do software', tom: 'terc' } }
              ] } },
            { r: 'Depende de quem orçamenta', tom: 'fora', vai: { fim: 'Primeiro escrever as regras com o Hélder, na auditoria', tom: 'inv' } }
          ]
        },
        {
          titulo: 'As quantidades',
          q: 'O concurso traz mapa de quantidades?', quem: ['Hélder Freitas'],
          ramos: [
            { r: 'Sim, em Excel ou XML', tom: 'ok', vai: { fim: 'Transcrição automática para a folha', tom: 'ok' } },
            { r: 'Sim, em PDF', tom: 'ok', vai: { fim: 'Extração com verificação humana', tom: 'ok' } },
            { r: 'Não vem', tom: 'inv', vai: {
              q: 'Em que formato chegam as peças desenhadas?', quem: ['Hélder Freitas'],
              ramos: [
                { r: 'DWG, DXF, DWFX', tom: 'inv', vai: { fim: 'Prova de conceito de medição, com 2 ou 3 projetos', tom: 'inv' } },
                { r: 'Só PDF digitalizado', tom: 'fora', vai: { fim: 'Medição continua manual nesta fase', tom: 'fora' } }
              ] } }
          ]
        }
      ],
      perguntas: [
        'Quantos orçamentos de relvados fazem por mês? E de outras obras?',
        'Que variáveis mudam o preço de um relvado (base, drenagem, tipo de enchimento, linhas, equipamento)?',
        'Onde estão as propostas anteriores, em que formato e quantas? Podem servir de base ao rascunho?',
        'Que modelos têm para memória descritiva, plano de trabalhos e lista de preços unitários?',
        'Ferramentas auxiliares do Hélder (custo de mão de obra por localização, tempo, dificuldade): quais e onde estão?',
        'O Hugo falou em plantas com curvas de nível para escavação e aterro. Em que formato chegam e com que frequência?',
        'Como validamos a Fase 1: três concursos já entregues, com o orçamento real deles ao lado?'
      ],
      expectativa: 'Objetivo realista: 85% a 90% do orçamento preparado pelo agente, ao fim de alguns meses de ajustes. O preço final é sempre de uma pessoa. A medição a partir de desenhos é prova de conceito, não promessa.'
    },
    {
      id: 'informacao', letra: 'A', fase: 'Fase 2', titulo: 'Gestão inteligente de informação',
      quem: ['Hugo', 'Parceiro PHC', 'IT'],
      porque: 'É o módulo mais dependente de terceiros. Se o PHC não tiver forma de ligação, o custo e o prazo mudam, e é isso que temos de saber antes de fechar.',
      arvores: [
        {
          titulo: 'O PHC',
          q: 'Já existe API ou Web Services no vosso PHC?', quem: ['Hugo', 'Parceiro PHC'],
          ramos: [
            { r: 'Sim', tom: 'ok', vai: { fim: 'Ligação de leitura: custos, faturação e produção por obra', tom: 'ok' } },
            { r: 'Não', tom: 'terc', vai: {
              q: 'O parceiro PHC desenvolve? Com que custo e prazo?', quem: ['Parceiro PHC'],
              ramos: [
                { r: 'Sim', tom: 'terc', vai: { fim: 'Orçamento do parceiro entra no projeto', tom: 'terc' } },
                { r: 'Não, ou caro demais', tom: 'inv', vai: { fim: 'Exportações periódicas dos mapas', tom: 'inv' } }
              ] } },
            { r: 'Não sabem', tom: 'inv', vai: { fim: 'Contactar o parceiro PHC já esta semana', tom: 'inv' } }
          ]
        },
        {
          titulo: 'Documentos e permissões',
          q: 'Onde estão os documentos de cada obra?', quem: ['Hugo', 'IT'],
          ramos: [
            { r: 'Microsoft 365 e SharePoint', tom: 'ok', vai: { fim: 'Ligação com as permissões de origem', tom: 'ok' } },
            { r: 'Servidor próprio', tom: 'inv', vai: { fim: 'Acesso remoto seguro, a definir com quem gere o IT', tom: 'inv' } },
            { r: 'Excel de controlo de obra', tom: 'ok', vai: { fim: 'Leitura direta dos mapas do Hugo', tom: 'ok' } }
          ]
        }
      ],
      perguntas: [
        'Que versão do PHC têm, está na cloud ou em servidor próprio, e quem é o parceiro PHC?',
        'Quem gere o IT (interno ou externo)? Quem nos pode dar acessos de leitura?',
        'Que 5 a 10 perguntas querem ver respondidas primeiro? (horas por obra, estado financeiro, documentos de uma obra)',
        'Onde se registam as horas e os recursos de cada obra?',
        'Que perfis existem (colaborador, gestão, administração) e quem vê o quê?',
        'A parte contabilística vem da contabilidade externa: chega por que via e com que regularidade?',
        'O assistente é só para a EngeGlobal ou também para a Nelugo, que tem a mesma gestão?'
      ],
      expectativa: 'Respeita sempre as permissões da origem e diz de onde vem cada resposta. Se a ligação ao PHC custar mais do que vale, começamos pelos mapas em Excel e o PHC entra depois.'
    },
    {
      id: 'contratos', letra: 'D', fase: 'Fase 3', titulo: 'Análise e preparação contratual',
      quem: ['Elsa', 'Assessoria jurídica'],
      porque: 'Segundo o Hugo, os contratos estão com a Elsa, em servidores próprios, sem passar pelo PHC. Falta saber o formato e o que mais dói.',
      arvores: [
        {
          titulo: 'Os documentos',
          q: 'Em que formato chegam os contratos?', quem: ['Elsa'],
          ramos: [
            { r: 'PDF digital', tom: 'ok', vai: { fim: 'Extração com ligação ao texto original', tom: 'ok' } },
            { r: 'Papel digitalizado', tom: 'inv', vai: { fim: 'Reconhecimento de texto: testar a qualidade com casos reais', tom: 'inv' } },
            { r: 'Word dos modelos internos', tom: 'ok', vai: { fim: 'Rascunhos a partir dos modelos aprovados', tom: 'ok' } }
          ]
        }
      ],
      perguntas: [
        'Que tipos de contrato têm (empreitada, subempreitada, fornecimento)? Quantos por ano?',
        'O que mais dói hoje: prazos, penalizações, cauções e garantias, ou acompanhar datas?',
        'Têm modelos internos aprovados? Quem os mantém?',
        'Quem faz a revisão jurídica? A IA apoia, não substitui o parecer.'
      ],
      expectativa: 'Cada elemento extraído leva ao parágrafo que o suporta. A decisão de assinar e a revisão jurídica ficam com eles.'
    },
    {
      id: 'chat', letra: 'E', fase: 'Fase 4', titulo: 'Chat de captação comercial',
      quem: ['Luís', 'Hugo'],
      porque: 'O Luís deu-lhe prioridade alta e quer levá-lo dos relvados à construção privada e aos loteamentos. Depende do site novo e do WhatsApp da empresa.',
      arvores: [
        {
          titulo: 'Os canais',
          q: 'Por onde chegam hoje os pedidos de clientes privados?', quem: ['Luís'],
          ramos: [
            { r: 'Site', tom: 'inv', vai: {
              q: 'O site novo tem data e quem o está a fazer?', quem: ['Hugo'],
              ramos: [
                { r: 'Sim', tom: 'ok', vai: { fim: 'Chat integrado no lançamento', tom: 'ok' } },
                { r: 'Não', tom: 'inv', vai: { fim: 'Chat numa página própria até o site sair', tom: 'inv' } }
              ] } },
            { r: 'WhatsApp', tom: 'ok', vai: {
              q: 'Há WhatsApp Business num número da empresa?', quem: ['Luís'],
              ramos: [
                { r: 'Sim', tom: 'ok', vai: { fim: 'API oficial da Meta, com verificação da empresa', tom: 'terc' } },
                { r: 'Não', tom: 'inv', vai: { fim: 'Criar o número e a conta Meta Business', tom: 'inv' } }
              ] } },
            { r: 'Telefone e email', tom: 'fora', vai: { fim: 'Fora do chat; pode alimentar o CRM', tom: 'fora' } }
          ]
        }
      ],
      perguntas: [
        'Que tipos de pedido chegam e de quem (clubes, municípios, particulares, loteadores)?',
        'Que conteúdos aprovados existem: catálogos, brochuras, vídeos, perguntas frequentes?',
        'Quem recebe cada tipo de pedido, e em que horário?',
        'O chatbot do parceiro no Brasil: há árvore de decisão que possamos reaproveitar?'
      ],
      expectativa: 'Começa pelos relvados e alarga depois. O agente nunca dá preço nem prazo fechado: qualifica e passa a uma pessoa.'
    },
    {
      id: 'followup', letra: 'F', fase: 'Fase 4', titulo: 'Follow-up e relação comercial',
      quem: ['Luís', 'Hugo'],
      porque: 'O memorando pede ligação ao CRM em vários módulos, mas ainda não sabemos se existe CRM nem qual.',
      arvores: [
        {
          titulo: 'O CRM',
          q: 'Têm CRM hoje?', quem: ['Hugo'],
          ramos: [
            { r: 'Sim', tom: 'ok', vai: {
              q: 'Qual, e tem API?', quem: ['Hugo'],
              ramos: [
                { r: 'Sim', tom: 'ok', vai: { fim: 'Oportunidades e interações registadas automaticamente', tom: 'ok' } },
                { r: 'Não', tom: 'terc', vai: { fim: 'Exportações, ou avaliar outra ferramenta', tom: 'terc' } }
              ] } },
            { r: 'Não', tom: 'inv', vai: {
              q: 'Querem que o CRM faça parte do projeto?', quem: ['Luís', 'Hugo'],
              ramos: [
                { r: 'Sim', tom: 'inv', vai: { fim: 'Componente nova, a definir no âmbito', tom: 'inv' } },
                { r: 'Não', tom: 'ok', vai: { fim: 'Registo simples nesta fase', tom: 'ok' } }
              ] } }
          ]
        }
      ],
      perguntas: [
        'Onde está a base de contactos, quantos são e têm consentimento para comunicações (RGPD)?',
        'Que regras de follow-up fazem sentido (por exemplo, 5 dias e 15 dias depois da proposta)?',
        'Por email, por WhatsApp, ou os dois? Com aprovação humana antes de cada envio?',
        'Quem não deve receber comunicações (exclusões)?'
      ],
      expectativa: 'Nada sai para um cliente sem as regras acordadas e, se quiserem, sem aprovação. O WhatsApp tem custo da Meta por mensagem.'
    }
  ],
  transversal: [
    {
      titulo: 'Pessoas e tempo', icone: 'P',
      perguntas: [
        'Quem é o nosso ponto de contacto único durante o projeto?',
        'Quanto tempo por semana conseguem dar o Hugo, o Luís, o Hélder (presencial uma vez por semana) e a Elsa?',
        'Qual é o papel do José Matias no projeto?',
        'Vão contratar alguém com perfil para estes temas, como o Luís sugeriu? Quando?'
      ]
    },
    {
      titulo: 'Dados e segurança', icone: 'S',
      perguntas: [
        'NDA: quem assina, que âmbito, e se cobre também a Nelugo.',
        'Há restrições sobre onde os dados podem ser processados (por exemplo, só na União Europeia)?',
        'Que informação nunca pode sair da empresa, nem anonimizada?'
      ]
    },
    {
      titulo: 'Financiamento', icone: 'F',
      perguntas: [
        'Que linha de financiamento é, e que critérios o projeto tem de cumprir?',
        'Há prazos do financiamento que condicionem as fases?',
        'Que entregáveis ou relatórios o financiamento exige de nós?'
      ]
    }
  ],
  expectativas: {
    sim: [
      'Um projeto por fases: a base a funcionar muito bem antes de subir o degrau seguinte, como o Hugo pediu',
      'Cerca de 85% a 90% do trabalho de preparação feito pela IA, ao fim de alguns meses de ajustes',
      'Ciclos de ajuste por WhatsApp, mais intensos nos primeiros três a quatro meses',
      'Cada resposta com a fonte, e o que não se sabe aparece como "a confirmar"',
      'Novas ideias (alertas, Código dos Contratos Públicos) avaliadas na auditoria e acrescentadas por fases'
    ],
    nao: [
      '100% de automação: o preço, a decisão de concorrer e a assinatura são sempre de pessoas',
      'Ritmo independente deles: o prazo depende de acessos, documentos e tempo da equipa EngeGlobal',
      'PHC garantido: depende do parceiro PHC e pode ter custo de terceiros',
      'Medição a partir de desenhos como certa: é prova de conceito, com critérios escritos antes',
      'Acesso às plataformas de concursos sem as credenciais e a autorização deles'
    ]
  },
  saida: [
    'Lista de pessoas e tempo disponível de cada uma',
    'Contacto do parceiro PHC e a versão do PHC',
    'Quem gere o IT e o Microsoft 365',
    'Plataformas de concursos usadas e quem tem as contas',
    'Três concursos já entregues, com o orçamento real, para os testes',
    'A folha de Excel dos relvados e os mapas do Hélder (depois do NDA)',
    'Data da reunião com a Elsa (cerca de uma hora) e da reunião com o Hélder',
    'Critérios e prazos do financiamento'
  ]
};
