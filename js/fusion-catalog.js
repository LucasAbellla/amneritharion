window.createFusionCatalog = function createFusionCatalog(elementalData) {
  const catalog = {};

  for (const [parent1, combinations] of Object.entries(elementalData.combinations)) {
    for (const [parent2, fusionName] of Object.entries(combinations)) {
      if (catalog[fusionName]) continue;
      catalog[fusionName] = {
        name: fusionName,
        parent1,
        parent2,
        color1: elementalData.baseElements[parent1].color,
        color2: elementalData.baseElements[parent2].color,
        desc: elementalData.complexElementDescriptions[fusionName] || 'Descrição oculta.',
        type: elementalData.complexElementTypes[fusionName] || 'Tipo desconhecido.',
        power: elementalData.complexElementPowers[fusionName] || 'Poder oculto.',
        mechanics: elementalData.complexElementMechanics[fusionName]
          || elementalData.complexElementMechanics.default
          || 'Mecânica desconhecida.'
      };
    }
  }

  return catalog;
};
