/* ============================================================
   TABELAS DE PREÇOS DA MACAMBI (sem IVA)
   Transcritas das tabelas enviadas a 7 de outubro de 2026:
   "Tabela Preços Cozinhas" (3 páginas) e "Tabela Preços Roupeiro".
   Aos valores acresce IVA à taxa legal em vigor.
   ============================================================ */
(function (root) {
  var T = {
    frentes: [
      { k: 'almlisa', t: 'Reta Almofada Lisa (Carvalho/Faia)', ml: 285, lat: 'termo' },
      { k: 'almmac', t: 'Reta Almofada Maciça (Carvalho/Faia)', ml: 360, lat: 'termo' },
      { k: 'folcf', t: 'Folheado Liso 19mm (Carvalho/Faia)', ml: 260, lat: 'termo' },
      { k: 'folcer', t: 'Folheado Liso 19mm (Cerejeira)', ml: 305, lat: 'termo' },
      { k: 'melke', t: 'Liso Melamina Krono/Egger', ml: 230, lat: 'mel' },
      { k: 'melsf', t: 'Liso Melamina Sonae/Finsa', ml: 230, lat: 'mel' },
      { k: 'melss', t: 'Liso Melamina Skim/Syncron', ml: 265, lat: 'mel' },
      { k: 'melfa', t: 'Liso Melamina Fundermax/Alvic', ml: 265, lat: 'mel' },
      { k: 'termab', t: 'Liso Termolaminado Alto Brilho', ml: 265, lat: 'termo' },
      { k: 'termm', t: 'Liso Termolaminado Mate', ml: 325, lat: 'termo' },
      { k: 'luxeb', t: 'Alvic Luxe Brilho', ml: 325, lat: 'termo' },
      { k: 'luxem', t: 'Alvic Luxe Mate', ml: 335, lat: 'termo' },
      { k: 'zenith', t: 'Alvic Zenith Mate', ml: 385, lat: 'termo' },
      { k: 'derwo', t: 'Liso Derwo Mate/Brilho Anti Manchas', ml: 325, lat: 'termo' },
      { k: 'lacm', t: 'Liso Lacado Mate (Cores Claras e Preto)', ml: 385, lat: 'lac' },
      { k: 'almlac', t: 'Reto Almofada Lisa (Cores Claras e Preto)', ml: 435, lat: 'lac' },
      { k: 'ral', t: 'Lacadas Cores RAL diversas', ml: null, lat: 'lac', consulta: true }
    ],
    lacadoBrilho: 60,
    laterais: { mel: 65, termo: 88.5, lac: 110 },
    portaMaquina: 65,
    superiorAlto: 85,
    golaInf: 25.5,
    golaSup: 11.5,
    gaveta: { mac: 32, blum: 37.5 },
    dobradica: { mac: 3.2, blum: 3.75 },
    fundoLava: [[0.5, 0.9, 17], [1.0, 1.2, 23]],
    portaTalheres: [[0.3, 0.6, 12], [0.7, 0.7, 19], [0.8, 0.8, 22], [0.9, 0.9, 25], [1.0, 1.0, 27], [1.1, 1.1, 30], [1.2, 1.2, 30]],
    acessorios: [
      ['Canto Mágico Inoxa Cr 500', 370], ['Cesto Giratório 3/4 800x800', 100], ['Cesto Giratório 3/4 900x900', 120],
      ['Cesto Garrafeira Inoxa Cr 150', 55], ['Cesto Garrafeira Inoxa Cr 200', 75], ['Cesto Garrafeira Inoxa Cr 300', 100],
      ['Gavetões Interiores c/SMOV c/Frentes Melamina 600-1000', 70], ['Sistema Elevatório Micro-ondas Blum HL', 145],
      ['Persiana Aluminio 600mm', 530], ['Balde Lixo Aluminio 13Litros', 43.5], ['Grelha Ventilação Aluminio 600mm', 10],
      ['Grelha Ventilação Aluminio 900mm', 12], ['Canto Feijão Porta 450/500mm', 250], ['Canto Le Mans Porta 500/600mm', 540],
      ['Aventos HF Blum', 150], ['Basculante Free Flap Mini (600x400)', 35], ['Basculante Free Flap Forte (700-acima)', 55],
      ['Fita LED + Rasgos c/Montagem', 62.5, 'ML'], ['Transformador 24v', 25], ['Transformador 36v', 31.5],
      ['Transformador 60v', 45], ['Sensor (Interruptor) S3', 23.5]
    ],
    roupeiro: {
      nota: 'Preços para caixotes em Laminado Textil 16mm c/orla textil + Portas Correr c/Perfil Cromado Syskor (outros perfis sob consulta)',
      portas: [
        { k: 'folcf', t: 'Portas Abrir/Correr Folheado Carvalho/Faia', m2: 215 },
        { k: 'folcer', t: 'Portas Abrir/Correr Folheado Cerejeira', m2: 255 },
        { k: 'folmog', t: 'Portas Abrir/Correr Folheado Mogno', m2: 200 },
        { k: 'mel', t: 'Portas Abrir/Correr Melamina Krono/Egger/Sonae/Finsa', m2: 185 },
        { k: 'lacbm', t: 'Portas Abrir/Correr Lacado Branco Mate', m2: 275 }
      ],
      espelho: 50, smov: { 2: 55, 3: 110, 4: 165 }, gavetao3: 96, puxadorJ: 17.5, laminado19: 15, closet: 185
    }
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = T; else root.TABELA_MC = T;
})(this);
