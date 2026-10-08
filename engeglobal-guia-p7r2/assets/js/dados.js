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
        'Quantos concursos aparecem por semana, quantos analisam e a quantos concorrem?',
        'Que documentos são sempre exigidos e quais variam de concurso para concurso? Estão todos num arquivo digital?',
        'As duas ideias novas (alertas por palavras-chave na internet e cruzamento com o Código dos Contratos Públicos) entram já, ou ficam para depois?'
      ],
      expectativa: 'A IA filtra e resume; a decisão de concorrer continua com eles. Se as peças estiverem atrás de um login que não podemos usar, a Elsa continua a descarregá-las e o agente trata do resto.'
    },
    {
      id: 'propostas', letra: 'C', fase: 'Fase 1', titulo: 'Assistente de propostas e orçamentação',
      quem: ['Hélder Freitas', 'Luís', 'Hugo'],
      porque: 'É o coração do projeto. Os relvados são só o ponto de partida que o Luís sugeriu, e a parte mais simples: depois alarga-se às infraestruturas, vias, drenagem, loteamentos e movimentação de terras. O processo completo vai do estudo da obra à submissão, passa por medições, consultas ao mercado e formação do preço, e cada etapa tem as suas dependências. É aqui que está a maior incerteza do projeto.',
      arvores: [
        {
          titulo: 'Relvados sintéticos, o ponto de partida',
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
          titulo: 'Os restantes tipos de obra',
          q: 'Os outros tipos de obra orçamentam-se da mesma forma que os relvados?', quem: ['Hélder Freitas', 'Hugo'],
          ramos: [
            { r: 'Cada tipo tem a sua folha', tom: 'inv', vai: { fim: 'Mapear cada folha na auditoria e alargar tipo a tipo', tom: 'inv' } },
            { r: 'Preços unitários sobre o mapa do dono de obra', tom: 'ok', vai: {
              q: 'O mapa vem sempre, ou em parte das obras é preciso medir?', quem: ['Hélder Freitas'],
              ramos: [
                { r: 'Vem sempre', tom: 'ok', vai: { fim: 'Aplicar a base de preços ao mapa: viável', tom: 'ok' } },
                { r: 'Às vezes é preciso medir', tom: 'inv', vai: { fim: 'Medição por prova de conceito, por tipo de obra', tom: 'inv' } }
              ] } },
            { r: 'Depende de quem orçamenta', tom: 'fora', vai: { fim: 'Escrever as regras de cada tipo com o Hélder antes de automatizar', tom: 'inv' } }
          ]
        },
        {
          titulo: 'De onde vêm os preços',
          q: 'Como formam o preço de cada rubrica?', quem: ['Hélder Freitas'],
          ramos: [
            { r: 'Base de preços própria', tom: 'ok', vai: {
              q: 'Está atualizada e num só sítio?', quem: ['Hélder Freitas'],
              ramos: [
                { r: 'Sim', tom: 'ok', vai: { fim: 'O agente aplica os preços e indica a origem', tom: 'ok' } },
                { r: 'Dispersa ou antiga', tom: 'inv', vai: { fim: 'Consolidar a base na auditoria', tom: 'inv' } }
              ] } },
            { r: 'Cotações de fornecedores e subempreiteiros', tom: 'inv', vai: {
              q: 'Como pedem e comparam as cotações?', quem: ['Hélder Freitas'],
              ramos: [
                { r: 'Email e Excel', tom: 'inv', vai: { fim: 'Avaliar na auditoria: pedidos automáticos e mapa comparativo', tom: 'inv' } },
                { r: 'Plataforma de compras', tom: 'terc', vai: { fim: 'Depende da ligação a essa plataforma', tom: 'terc' } }
              ] } },
            { r: 'Decomposição (rendimentos e custos)', tom: 'inv', vai: { fim: 'Passar as regras do Hélder a fórmulas, rubrica a rubrica', tom: 'inv' } }
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
      tipos: [
        { etapa: 'Relvados sintéticos (ponto de partida)', perguntas: [
          'A folha de Excel dos relvados cobre todos os casos (incluindo iluminação, vedação, balneários), ou há exceções frequentes?'
        ] },
        { etapa: 'Infraestruturas e vias', perguntas: [
          'O preço sai sobretudo de equipamento e rendimentos, ou de materiais? Onde estão esses valores?'
        ] },
        { etapa: 'Drenagem e redes', perguntas: [
          'As quantidades vêm dos perfis longitudinais do projeto? Em que formato?'
        ] },
        { etapa: 'Loteamentos', perguntas: [
          'Para os privados, chega uma estimativa por indicadores (área, número de lotes, metros de arruamento) antes do orçamento detalhado?'
        ] },
        { etapa: 'Movimentação de terras', perguntas: [
          'Como calculam hoje os volumes de escavação, aterro e decapagem, com que software, e em que formato chegam as plantas com curvas de nível?'
        ] },
        { etapa: 'Construção civil e edifícios', perguntas: [
          'Entra neste projeto, ou fica para mais tarde?'
        ] }
      ],
      processo: [
        { etapa: 'Estudo da obra', perguntas: [
          'Que informação tiram do projeto e do caderno de encargos, e onde a anotam?',
          'Quando as peças se contradizem, qual prevalece e quem decide?'
        ] },
        { etapa: 'Quantidades', perguntas: [
          'Apresentam lista de erros e omissões? Querem que o agente a prepare?'
        ] },
        { etapa: 'Formação do preço', perguntas: [
          'Como decompõem o preço de uma rubrica (mão de obra, materiais, equipamento, subempreitada), e onde estão os rendimentos e custos?',
          'Como calculam estaleiro, custos indiretos e margem?'
        ] },
        { etapa: 'Consultas ao mercado', perguntas: [
          'Querem que o agente envie os pedidos de cotação e monte o mapa comparativo, ou só use os preços que já têm?'
        ] },
        { etapa: 'Montagem da proposta', perguntas: [
          'Em que formato entregam a lista de preços unitários (modelo da entidade ou Excel próprio)?',
          'Querem que o agente redija também memória descritiva, plano de trabalhos e cronograma financeiro?'
        ] }
      ],
      perguntas: [
        'Quantos orçamentos fazem por mês, por tipo de obra, e que tipo pesa mais?',
        'O orçamento muda quando o cliente é uma câmara ou um privado? Em quê?',
        'Onde estão as propostas anteriores e os conteúdos técnicos (fichas, certificados, currículo de obras), em que formato e quantos?'
      ],
      expectativa: 'Objetivo realista: 85% a 90% do orçamento preparado pelo agente, ao fim de alguns meses de ajustes. O preço final é sempre de uma pessoa. A medição a partir de desenhos é prova de conceito, não promessa.'
    },
    {
      id: 'informacao', letra: 'A', fase: 'Fase 2', titulo: 'Gestão inteligente de informação',
      quem: ['Hugo', 'IT'],
      porque: 'O PHC já ficou falado: a ligação depende da API que o parceiro desenvolver. O que falta saber é o resto, e é isso que define o tamanho do módulo: que perguntas, que fontes, que perfis e com que frequência.',
      arvores: [
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
        'Que 5 a 10 perguntas querem ver respondidas primeiro? (horas por obra, estado financeiro, documentos de uma obra)',
        'Além do PHC, que outras plataformas e repositórios entram no assistente?',
        'Onde se registam as horas e os recursos de cada obra?',
        'Que perfis existem (colaborador, gestão, administração) e quem vê o quê?',
        'A informação tem de estar atualizada ao minuto, ou basta uma vez por dia?',
        'A parte contabilística que querem cruzar com a económica chega da contabilidade externa por que via?'
      ],
      expectativa: 'Respeita sempre as permissões da origem e diz de onde vem cada resposta. Se a ligação ao PHC custar mais do que vale, começamos pelos mapas em Excel e o PHC entra depois.'
    },
    {
      id: 'contratos', letra: 'D', fase: 'Fase 3', titulo: 'Análise e preparação contratual',
      quem: ['Elsa'],
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
        'Que tipos de contrato têm e quantos por ano?',
        'O que mais dói hoje: prazos, penalizações, cauções e garantias, ou acompanhar datas?',
        'Têm modelos internos aprovados para os rascunhos?'
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
        'Que conteúdos aprovados existem para o agente usar (catálogos, brochuras, perguntas frequentes, vídeos)?',
        'Atendem clientes fora de Portugal? Em que línguas?'
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
        'Onde está a base de contactos, quantos são, e têm consentimento para comunicações?'
      ],
      expectativa: 'Nada sai para um cliente sem as regras acordadas e, se quiserem, sem aprovação. O WhatsApp tem custo da Meta por mensagem.'
    }
  ],
  transversal: [
    {
      titulo: 'Pessoas e tempo', icone: 'P',
      perguntas: [
        'Quem é o nosso ponto de contacto único durante o projeto?',
        'Quantas horas por mês conseguem dar o Hugo, o Luís, o Hélder e a Elsa? As sessões de acompanhamento são por chamada.'
      ]
    },
    {
      titulo: 'Dados e segurança', icone: 'S',
      perguntas: [
        'Há restrições sobre onde os dados podem ser processados (por exemplo, só na União Europeia)?',
        'Que informação nunca pode sair da empresa, nem anonimizada?',
        'Querem entrar com as contas Microsoft da empresa?'
      ]
    },
    {
      titulo: 'Financiamento', icone: 'F',
      perguntas: [
        'O financiamento impõe prazos ou entregáveis (relatórios, documentação) que tenhamos de cumprir?'
      ]
    },
    {
      titulo: 'Aceitação e formação', icone: 'A',
      perguntas: [
        'Que casos reais usamos nos testes de cada módulo, e quem os escolhe?',
        'Quantas pessoas vamos formar?'
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
    'Pessoas, ponto de contacto e horas por mês de cada uma',
    'Plataformas de concursos usadas e quem tem as contas',
    'Tipos de obra por ordem de peso, e o método de cada um',
    'Três concursos já entregues, com o orçamento real, para os testes (depois do NDA)',
    'As 5 a 10 perguntas prioritárias do assistente interno',
    'Restrições de dados e prazos do financiamento'
  ]
};
