const elementalData = {
    baseElements: {
        "Flama":   { 
            desc: "Al-azim", color: "#a61c1c", hoverColor: "#851616", manifestacoes: ["Controlar chamas", "Esferas de fogo", "Resistência ao calor"], 
            lore: "Sangue jazido dos <span class='madness-word' data-note='Eles ainda queimam no fundo do poço...'>'Iitlaq</span>.", imagem: "img/flamasimbolo.png",
            longDesc: "A manipulação das chamas transcende a simples destruição; é o ato de dar vida à entropia. Magos de Flama comumente carregam cicatrizes profundas e escondidas, pois o fogo primevo de Nahvvatzal exige parte da carne de seu conjurador como combustível antes de obedecer.",
            secretTitle: "KCOTOLOX", secretSubtitle: "\"A Punição\"", secretText: "Os primeiros piromantes de Nahvvatzal não conjuravam chamas do ar, mas queimavam as próprias memórias para gerar calor. Muitos morreram sem saber os próprios nomes."
        },
        "Aqua":   { 
            desc: "Flua à minha mente, ou afogue-se na vastidão do meu ser.<br>-''Gyeang-ju''", color: "#3a4dff", hoverColor: "#2f3ecc", manifestacoes: ["Moldar água", "Respirar sob água", "Criar névoa"], 
            lore: "Lágrima da <span class='madness-word' data-note='Ela chora sangue quando eclipsada.'>Deusa da Lua</span>.", imagem: "img/aquasimbolo.png",
            longDesc: "A água atua como um espelho para os terrores esquecidos. Ao conjurar Aqua, o mago não apenas manipula fluidos, mas ouve os ecos das almas que se afogaram nos mares antigos. Uma mente fraca pode facilmente se perder na vastidão de suas próprias memórias líquidas.",
            secretTitle: "UTYLOF", secretSubtitle: "\"A Transformação\"", secretText: "A Deusa da Lua não chora de tristeza. Suas lágrimas são compostas pelas almas daqueles que sucumbiram às profundezas. Beber dessa água é convidar os mortos para habitarem sua mente."
        },
        "Eol":     { 
            desc: "Pense da menor reflexão de culpa à maior epifania noturna, esta é a liberdade.<br>-''Eristópheus''", color: "#00e689", hoverColor: "#00b86e", manifestacoes: ["Lufadas de vento", "Levitação breve", "Aumentar velocidade"], 
            lore: "Sussurros dos <span class='madness-word' data-note='Eles nunca se calam! Façam parar!'>Céus</span>.", imagem: "",
            longDesc: "O ar não é vazio, mas um condutor de lamentos. Dominar o Eol significa suportar o ruído constante dos deuses mortos sussurrando em seus ouvidos. Conjuradores experientes conseguem extrair o oxigênio dos pulmões de seus inimigos em absoluto e perturbador silêncio.",
            secretTitle: "EFENLORU", secretSubtitle: "\"A Liberdade\"", secretText: "Aqueles que escutam o vento por muito tempo perdem a própria voz. O ar em Gionyyl não é um elemento vazio, mas uma rede neural de confissões desesperadas."
        },
        "Terrae":  { 
            desc: "Solidez, estabilidade, crescimento, fundação.", color: "#6c4d42", hoverColor: "#573e35", manifestacoes: ["Mover pedras", "Barreiras de terra", "Sentir tremores"], 
            lore: "Corpo da <span class='madness-word' data-note='Seus ossos formam as nossas prisões e túmulos.'>Mãe Antiga</span>.", imagem: "",
            longDesc: "As pedras fundacionais deste mundo estão manchadas de sacrifício. Terrae é a runa da estabilidade implacável, permitindo erguer barreiras intransponíveis ou enterrar exércitos vivos, unindo a vontade do mago ao ritmo geológico brutal do Crisol de Apriori.",
            secretTitle: "HAVBAGAN", secretSubtitle: "\"A Formação\"", secretText: "A rocha não é cega. Cada pedra colocada nas fundações do Crisol de Apriori pulsa como um coração lento e exige sacrifícios de sangue a cada ciclo lunar."
        },
        "Fulmen":   { 
            desc: "Ouça o estrondo de minha presença ao pronunciar meu nome.<br>-''Tyapu''", color: "#ffff00", hoverColor: "#e6e600", manifestacoes: ["Disparar raios", "Magnetizar objetos", "Aumentar reflexos"], 
            lore: "Fúria do <span class='madness-word' data-note='Um usurpador cego pela própria luz.'>Deus da Tempestade</span>.", imagem: "",
            longDesc: "Uma fração de segundo de energia pura que frita sinapses e altera percepções. Fulmen concede uma velocidade divina, mas seus usuários frequentemente perdem a sensibilidade tátil e desenvolvem tremores crônicos após canalizarem as tormentas elétricas.",
            secretTitle: "TEZNITAJ", secretSubtitle: "\"A Movimentação\"", secretText: "Verdadeiro poder elétrico queima o nervo óptico. Magos experientes desta runa estão todos cegos, usando a estática do ar para tatear a realidade."
        },
        "Crelix":   { 
            desc: "Frio, estagnação, preservação, rigidez.", color: "#56e5ff", hoverColor: "#45b7cc", manifestacoes: ["Congelar superfícies", "Armas de gelo", "Suportar frio"], 
            lore: "Sopro Invernal do <span class='madness-word' data-note='Ele está adormecido sob o gelo vermelho.'>Gigante</span>.", imagem: "",
            longDesc: "O verdadeiro poder de Crelix não é o gelo, mas a paralisação do tempo em escala molecular. É a runa da preservação implacável. Magos de gelo enxergam a vida como uma anomalia caótica que deve ser cristalizada e silenciada para a ordem prevalecer.",
            secretTitle: "ORGNOTAMOTR", secretSubtitle: "\"A Permanência\"", secretText: "No coração do Zero Absoluto, o tempo não passa. Os primeiros traidores da ordem foram congelados vivos, e os seus pensamentos gritam no gelo há quatro milênios."
        },
        "Lux":    { 
            desc: "Iluminação, verdade, pureza, visão.", color: "#fbe4ec", hoverColor: "#f9d7e3", manifestacoes: ["Criar luz", "Dissipar sombras", "Cura leve"], 
            lore: "Bênção do <span class='madness-word' data-note='Sua luz queima as almas impuras.'>Sol Eterno</span>.", imagem: "",
            longDesc: "Diferente dos contos antigos, a luz em Gionyyl é aterradora. A runa Lux arranca os véus da ilusão e expõe imperfeições. É um poder tão absoluto e puro que chega a queimar a própria sanidade dos conjuradores ao revelar horrores que as sombras gentilmente ocultavam.",
            secretTitle: "RASTONTRI", secretSubtitle: "\"A Presença\"", secretText: "Dizem que é cura, mas a luz queima as imperfeições. Usar este elemento repetidamente purifica tanto o mago que ele começa a perder os seus sentimentos humanos."
        },
        "Umbra": { 
            desc: "Em meu manto repousa os maiores terrores e mistérios do universo.<br>-''Ibi'una''", color: "#303030", hoverColor: "#262626", manifestacoes: ["Furtividade", "Escuridão localizada", "Intimidar"], 
            lore: "Manto da <span class='madness-word' data-note='Não olhe para a escuridão por muito tempo.'>Noite Silenciosa</span>.", imagem: "",
            longDesc: "As sombras possuem textura e fome. Ao manipular Umbra, o feiticeiro permite ser abraçado pelo vazio. A furtividade perfeita que ela confere é o resultado de transportar o próprio corpo para uma dimensão paralela densa e asfixiante por breves e angustiantes períodos.",
            secretTitle: "YRMEGTORE", secretSubtitle: "\"A Ausência\"", secretText: "Não há escuridão vazia. Toda sombra projetada pelo sol é um portal para a dimensão de Umbra, onde as entidades esquecidas aguardam que feche os olhos."
        },
        "Vitae":  { 
            desc: "Há formas de vida em todas as minhas criações e submissão às suas escolhas.<br>-''Yashima-no-Mikoto''", color: "#9d0e4f", hoverColor: "#7e0b3f", manifestacoes: ["Acelerar cura", "Estimular plantas", "Sentir auras"], 
            lore: "Essência da <span class='madness-word' data-note='As raízes bebem dos nossos cadáveres.'>Natureza Viva</span>.", imagem: "",
            longDesc: "Curar não é um milagre, é uma reescrita biológica violenta. A energia da Vitae força células a se multiplicarem rapidamente. É comum que aprendizes ineptos gerem tumores e anomalias corpóreas em seus aliados ao tentarem remendar ferimentos de batalha.",
            secretTitle: "IGL'TRUTAE", secretSubtitle: "\"A Animação\"", secretText: "O excesso de magia vital causa o crescimento de órgãos redundantes no mago. É comum ver mestres desta runa escondendo múltiplos olhos debaixo das vestes."
        },
        "Toxi": { 
            desc: "Meu toque é o sussurro da entropia, a transformação inevitável e putrefata do todo.<br>-''Koscheniev''", color: "#76cf02", hoverColor: "#5ea602", manifestacoes: ["Criar venenos", "Causar náusea", "Resistência a doenças"], 
            lore: "Peste <span class='madness-word' data-note='O cheiro... o cheiro é insuportável na mente.'>Rastejante</span>.", imagem: "",
            longDesc: "Senhores da putrefação e mestres do miasma. A toxina dissolve lentamente os tecidos, corroendo armaduras e vontades com igual facilidade. Magos de Toxi costumam usar filtros purificadores severos para esconder as feridas deixadas por seus próprios vapores na garganta.",
            secretTitle: "KARVPARLPAKS", secretSubtitle: "\"A Degradação\"", secretText: "A runa da toxina exige simbiose. Para canalizar o veneno verdadeiro, o mago hospeda parasitas na sua corrente sanguínea que devoram lentamente o seu pâncreas."
        },
        "Vis":{ 
            desc: "Força pura, movimento, poder bruto, potencial.", color: "#803631", hoverColor: "#662b27", manifestacoes: ["Empurrão telecinético", "Escudos de energia", "Aumentar força"], 
            lore: "Fluxo <span class='madness-word' data-note='O peso da magia esmaga a sanidade.'>Primordial</span>.", imagem: "",
            longDesc: "Desprovida de forma ou moralidade, a Vis é a energia cósmica crua. A pressão espacial gerada por esta runa pode defletir rochedos ou implodir o ar ao redor. Usar Vis exige um foco monumental, sob pena do usuário colapsar e estilhaçar sua própria estrutura óssea pelo impacto recuo.",
            secretTitle: "TSOZDNEMARO", secretSubtitle: "\"A Energia\"", secretText: "Conjurar energia bruta distorce os ossos do utilizador. As salas de treino da Vis no Crisol estão constantemente manchadas com o sangue de novatos que implodiram."
        },
        "Ulrhtau": { 
            desc: "DADOS CORROMPIDOS // FALHA DE LEITURA", color: "#ff0000", hoverColor: "#ff0000", manifestacoes: ["Aberração espacial", "Distorção da realidade", "[ERRO]"], 
            // CORREÇÃO: Sintaxe HTML na Lore corrigida (tag span fechada corretamente)
            lore: "NÃO CLICAR. A <span class='madness-word' data-note='A DOR É INFINITA AQUI FORA A DOR É INFINITA'>runa esquecida</span> que corrói o grimório.",
            // ATUALIZAÇÃO: Adicionado uma mensagem de erro vermelha como ilustração
            imagem: "img/o-olho.jpg", 
            // ATUALIZAÇÃO: Adicionado longDesc para Ulrhtau com texto de horror e anotações
            longDesc: "A matéria grita ao ser tocada por esta anomalia. As leis fundamentais da física de Gionyyl são estraçalhadas. A <span class='madness-word' data-note='ELES_ESTÃO_ATRAS_DE_TI_..._FOGE_...'>DOR</span> é o único idioma conhecido por aqueles que sobrevivem ao manipular o Vazio Fragmentado. //NÃO_OLHE_PARA_TRÁS//",
            // Mantém os segredos em branco, pois Ulrhtau usa o efeito do olho
            secretTitle: "", secretSubtitle: "", secretText: ""
        }
    },
    combinations: {
        "Flama": {"Flama": "Flama Fátuo", "Aqua": "Vapor", "Eol": "Incêndio", "Terrae": "Magma", "Fulmen": "Faísca", "Crelix": "Névoa", "Lux": "Radiação", "Umbra": "Fumaça", "Vitae": "Alma", "Toxi": "Fuligem", "Vis": "Explosão"},
        "Aqua": {"Flama": "Vapor", "Aqua": "Purificação Reminiscente", "Eol": "Bruma", "Terrae": "Lama", "Fulmen": "Supercondução", "Crelix": "Cristal", "Lux": "Ilusão", "Umbra": "Miragem", "Vitae": "Sangue", "Toxi": "Ácido", "Vis": "Corrente"},
        "Eol": {"Flama": "Incêndio", "Aqua": "Bruma", "Eol": "Turbilhão Vendaval", "Terrae": "Areia", "Fulmen": "Trovão", "Crelix": "Nevoeiro", "Lux": "Fulgor", "Umbra": "Névoa", "Vitae": "Sopro", "Toxi": "Gás", "Vis": "Tornado"},
        "Terrae": {"Flama": "Magma", "Aqua": "Lama", "Eol": "Areia", "Terrae": "Rocha Eterna", "Fulmen": "Magnetismo", "Crelix": "Geada", "Lux": "Domínio", "Umbra": "Assombração", "Vitae": "Fertilidade", "Toxi": "Erosão", "Vis": "Tremor"},
        "Fulmen": {"Flama": "Faísca", "Aqua": "Supercondução", "Eol": "Trovão", "Terrae": "Magnetismo", "Fulmen": "Intempérie Estrondosa", "Crelix": "Granizo", "Lux": "Clarão", "Umbra": "Crepúsculo", "Vitae": "Choque", "Toxi": "Ionização", "Vis": "Descarga"},
        "Crelix": {"Flama": "Névoa", "Aqua": "Cristal", "Eol": "Nevoeiro", "Terrae": "Geada", "Fulmen": "Granizo", "Crelix": "Zero Absoluto", "Lux": "Prisma", "Umbra": "Escuridão", "Vitae": "Hibernação", "Toxi": "Congelamento", "Vis": "Congelação"},
        "Lux": {"Flama": "Radiação", "Aqua": "Ilusão", "Eol": "Fulgor", "Terrae": "Domínio", "Fulmen": "Clarão", "Crelix": "Prisma", "Lux": "Difração Infinita", "Umbra": "Contraste", "Vitae": "Aurora", "Toxi": "UV", "Vis": "Facho"},
        "Umbra": {"Flama": "Fumaça", "Aqua": "Miragem", "Eol": "Névoa", "Terrae": "Assombração", "Fulmen": "Crepúsculo", "Crelix": "Escuridão", "Lux": "Contraste", "Umbra": "Vazio Profundo", "Vitae": "Fantasma", "Toxi": "Veneno", "Vis": "Pulso"},
        "Vitae": {"Flama": "Alma", "Aqua": "Sangue", "Eol": "Sopro", "Terrae": "Fertilidade", "Fulmen": "Choque", "Crelix": "Hibernação", "Lux": "Aurora", "Umbra": "Fantasma", "Vitae": "Vida Plena", "Toxi": "Doença", "Vis": "Vigor"},
        "Toxi": {"Flama": "Fuligem", "Aqua": "Ácido", "Eol": "Gás", "Terrae": "Erosão", "Fulmen": "Ionização", "Crelix": "Congelamento", "Lux": "UV", "Umbra": "Veneno", "Vitae": "Doença", "Toxi": "Praga Letal", "Vis": "Contágio"},
        "Vis": {"Flama": "Explosão", "Aqua": "Corrente", "Eol": "Tornado", "Terrae": "Tremor", "Fulmen": "Descarga", "Crelix": "Congelação", "Lux": "Facho", "Umbra": "Pulso", "Vitae": "Vigor", "Toxi": "Contágio", "Vis": "Força Gravitacional"}
    },
    complexElementDescriptions: {
        "Fogo Fátuo": "Chamas etéreas que dançam com vida própria, guiando ou enganando os incautos.",
        "Vapor": "Uma névoa escaldante que obscurece a visão e queima ao toque, nascida do conflito elemental.",
        "Incêndio": "Chamas vorazes alimentadas pelo ar, espalhando-se com fúria indomável e consumindo tudo.",
        "Magma": "Rocha derretida em fúria rubra, capaz de consumir e remodelar a própria terra.",
        "Faísca": "Estalos de energia pura, o prenúncio de uma descarga maior ou uma chama súbita.",
        "Névoa": "Uma cortina opaca onde o calor encontra o frio, ou onde o ar se mistura com sombras, criando um ambiente de visibilidade reduzida e perigo.",
        "Radiação": "O calor da luz concentrado, capaz de queimar e purificar com sua intensidade luminosa.",
        "Fumaça": "Partículas densas e escuras que sufocam a luz e o ar, um subproduto da combustão incompleta.",
        "Alma": "A essência espiritual imbuída de fervor ardente, manifestando a força da vida em chamas etéreas.",
        "Fuligem": "Resíduos tóxicos da queima, impregnando o ambiente com impureza e dificuldade de respirar.",
        "Explosão": "Uma liberação súbita e violenta de energia ígnea, devastando a área circundante.",
        "Purificação Reminiscente": "Água imbuída de uma calma profunda, capaz de limpar impurezas e acalmar espíritos.",
        "Bruma": "Gotículas de água suspensas no ar, criando uma atmosfera úmida e misteriosa.",
        "Lama": "Terra saturada de água, um terreno instável que aprisiona e dificulta o movimento.",
        "Supercondução": "Água energizada pelo raio, tornando-se um condutor perfeito de eletricidade e poder.",
        "Cristal": "Água congelada em formas geométricas perfeitas, refletindo e refratando a luz com beleza gélida.",
        "Ilusão": "A luz refletida e distorcida pela água, criando imagens falsas e confundindo os sentidos.",
        "Miragem": "Sombras dançantes sobre a água, criando visões efêmeras e enganosas à distância.",
        "Sangue": "O fluido vital que carrega a essência da vida, pulsando com poder aquático e orgânico.",
        "Ácido": "Água corrompida por toxinas, tornando-se uma substância corrosiva e perigosa.",
        "Corrente": "A força da água em movimento constante, carregando energia cinética e poder de arrasto.",
        "Turbilhão Vendaval": "Massas de ar em rotação violenta, um testemunho do poder bruto e indomável do ar.",
        "Areia": "Partículas de terra erodidas e transportadas pelo vento, capazes de cegar e açoitar.",
        "Trovão": "A onda de choque sonora que acompanha o raio, um estrondo que reverbera com a fúria do céu.",
        "Nevoeiro": "Ar frio e úmido condensado, reduzindo a visibilidade e criando um ambiente gélido.",
        "Fulgor": "Luz dispersa e intensificada pelo ar, criando um brilho difuso e ofuscante.",
        "Sopro": "O fluxo vital do ar, essencial para a respiração e capaz de carregar a própria essência da vida.",
        "Gás": "Ar impregnado de substâncias tóxicas, invisível e letal, espalhando-se silenciosamente.",
        "Tornado": "Uma coluna de ar e energia em rotação destrutiva, um vórtice de poder caótico.",
        "Rocha Eterna": "A solidez inabalável da terra, representando resistência, estabilidade e permanência.",
        "Magnetismo": "A força invisível da terra que atrai e repele metais, carregada pela energia do raio.",
        "Geada": "Cristais de gelo que se formam sobre a terra fria, um toque gélido da natureza.",
        "Domínio": "A terra imbuída de luz, conferindo controle e autoridade sobre o terreno consagrado.",
        "Assombração": "A energia sombria que se apega à terra, manifestando presenças espectrais e medo.",
        "Fertilidade": "A terra nutrida pela força vital, capaz de gerar e sustentar vida abundante.",
        "Erosão": "A terra desgastada e corroída por toxinas, um processo lento de decadência e destruição.",
        "Tremor": "A terra chacoalhando com energia acumulada, um prenúncio de abalos sísmicos e instabilidade.",
        "Intempérie Estrondosa": "Uma tempestade elétrica de poder avassalador, onde raios dançam com fúria.",
        "Granizo": "Pedaços de gelo que caem do céu eletrificado, um bombardeio gélido e perigoso.",
        "Clarão": "Um feixe de luz ofuscante e súbito, liberado pela energia elétrica concentrada.",
        "Crepúsculo": "O momento de transição entre luz e sombra, carregado com a energia residual do raio.",
        "Choque": "Uma descarga elétrica que percorre o corpo vital, paralisando e causando dor intensa.",
        "Ionização": "O ar carregado eletricamente por toxinas, tornando-se instável e condutor de energia.",
        "Descarga": "Uma liberação controlada ou caótica de energia elétrica pura, com potencial destrutivo.",
        "Zero Absoluto": "A ausência total de calor, onde o próprio movimento cessa em um frio paralisante.",
        "Prisma": "Gelo que refrata a luz em um espectro de cores, revelando a beleza oculta da luz.",
        "Escuridão": "A ausência de luz intensificada pelo frio, um vazio gélido e opressor.",
        "Hibernação": "Um estado de dormência induzido pelo frio, preservando a energia vital em suspensão.",
        "Congelamento": "O frio extremo que solidifica toxinas, neutralizando seu perigo ou aprisionando-as.",
        "Congelação": "A energia do frio absoluto, capaz de parar o movimento e cristalizar a matéria.",
        "Difração Infinita": "A luz pura em sua forma mais absoluta, capaz de se dobrar e se espalhar em todas as direções.",
        "Contraste": "A interação nítida entre luz e sombra, definindo formas e revelando ou ocultando a verdade.",
        "Aurora": "A luz da vida que surge no horizonte, trazendo esperança, renovação e calor vital.",
        "UV": "Luz invisível e tóxica, capaz de queimar e corromper com sua radiação nociva.",
        "Facho": "Um feixe de luz concentrado e energizado, com poder de perfuração e iluminação intensa.",
        "Vazio Profundo": "A escuridão absoluta, um abismo de nada onde a luz não ousa penetrar.",
        "Fantasma": "Uma alma ou eco vital preso nas sombras, uma manifestação etérea e melancólica.",
        "Veneno": "Uma toxina sombria que age furtivamente, corrompendo e destruindo por dentro.",
        "Pulso": "Uma onda de energia sombria que emana, perturbando e drenando a força vital.",
        "Vida Plena": "A força vital em sua expressão máxima, irradiando saúde, vigor e resiliência.",
        "Doença": "A força vital corrompida por toxinas, levando à fraqueza, degeneração e sofrimento.",
        "Vigor": "A energia vital concentrada, conferindo força, resistência e poder de recuperação.",
        "Praga Letal": "Uma toxina virulenta em sua forma mais pura, espalhando doença e morte rapidamente.",
        "Contágio": "A capacidade de uma toxina ou energia se espalhar e infectar outros rapidamente.",
        "Força Gravitacional": "A manifestação pura da energia controlando a atração fundamental entre as massas."
    },
    typings: {
        acquisition: {
            "Benção": { desc: "Concedida por uma entidade superior como um presente.", related: ["Única", "Múltipla", "Masterizadora", "Própria", "Atravessadora"], mini_narrativa: "A Deusa da Floresta tocou sua testa, e o poder da vida selvagem fluiu em suas veias." },
            "Treino": { desc: "Adquirida por prática intensiva e disciplina.", related: ["Única", "Múltipla", "Masterizadora"], mini_narrativa: "Anos de meditação no topo da Montanha Gélida despertaram sua afinidade com o frio eterno." },
            "Estudo": { desc: "Obtida por conhecimento teórico e pesquisa.", related: ["Única", "Múltipla", "Masterizadora", "Própria"], mini_narrativa: "Ao decifrar o Tomo Proibido, linhas de energia crepitaram em seus dedos pela primeira vez." },
            "Maldição": { desc: "Imposta contra a vontade, class: como punição ou efeito colateral.", related: ["Única", "Múltipla", "Masterizadora", "Própria", "Atravessadora"], mini_narrativa: "Por profanar o túmulo ancestral, as sombras se agarraram à sua alma, tornando-se parte dele." },
            "Herança": { desc: "Passada por laços de sangue ou tradições familiares.", related: ["Única", "Múltipla", "Masterizadora", "Própria", "Atravessadora"], mini_narrativa: "O sangue dos Reis Trovejantes corria em sua família; a primeira tempestade revelou seu legado." },
            "Pacto": { desc: "Resultado de um acordo com uma entidade mágica.", related: ["Única", "Múltipla", "Masterizadora", "Própria", "Atravessadora"], mini_narrativa: "Em troca de sua memória mais querida, um Djinn do deserto concedeu-lhe o domínio sobre as areias." },
            "Sacrifício": { desc: "Obtida ao oferecer algo de grande valor pessoal.", related: ["Múltipla", "Masterizadora", "Própria", "Atravessadora"], mini_narrativa: "Ao oferecer seu próprio olho esquerdo à Fonte do Conhecimento, as runas da toxina se gravaram em sua mente." }
        },
        classification: {
            "Única": { desc: "Afinidade com um único Elemento Base. Não pode usar Elementos Complexos ou Puros.", arquétipo: "O Piromante Novato, focado apenas nas chamas." },
            "Múltipla": { desc: "Capacidade de manipular dois ou mais Elementos Base. Permite o uso de Elementos Complexos.", arquétipo: "O Geomante Aquático, que combina terra e água com versatilidade." },
            "Masterizadora": { desc: "Domínio excepcional de um ou mais Elementos Base, permitindo o uso do Elemento Puro.", arquétipo: "A Arquimaga da Luz, cuja pureza luminosa dissipa qualquer escuridão." },
            "Própria": { desc: "Afinidade com um elemento único e exclusivo, fora dos 11 Elementos Base comuns.", arquétipo: "O Cronomante, manipulador do tempo, um poder além da compreensão comum." },
            "Atravessadora": { desc: "Capacidade de usar uma linha/coluna inteira da Tabela Elemental.", arquétipo: "O Avatar da Tempestade, que comanda raios, trovões, ventos e suas fusões." }
        }
    }
};

window.addEventListener('load', () => {
    const loader = document.getElementById('loading-screen');
    if (loader) {
        setTimeout(() => {
            loader.classList.add('opacity-0', 'pointer-events-none');
            setTimeout(() => loader.remove(), 1000); 
        }, 2000); 
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const selector1El = document.querySelector('#selector1 .grid');
    const selector2El = document.querySelector('#selector2 .grid');
    const resultCardDisplay = document.getElementById('result-card-display');
    const placeholderTextEl = document.getElementById('placeholder-text');
    const complexResultContainerEl = document.getElementById('complex-result-container');
    const complexElementNameEl = document.getElementById('complex-element-name');
    const complexElementCombinationEl = document.getElementById('complex-element-combination');
    const complexElementDescriptionEl = document.getElementById('complex-element-description');
    const resetBtn = document.getElementById('reset-btn');
    
    document.getElementById('current-year').textContent = new Date().getFullYear();

    let selected1 = null;
    let selected2 = null;

    const qoldBg = document.getElementById('qoldjornesz-bg');
    if (qoldBg) {
        const runesSet = "⍙⎍⍜⍎⍑⍋⍝⍯⍮⍫⍡⍪⍤⍥⍨⍢⍣⍗⍒⍞⍟§‡ℵ";
        const numRunes = 40;
        const runeElements = [];

        for(let i = 0; i < numRunes; i++) {
            let el = document.createElement('div');
            el.className = 'qold-rune';
            el.innerText = runesSet[Math.floor(Math.random() * runesSet.length)];
            el.style.left = Math.random() * 100 + 'vw';
            el.style.top = Math.random() * 100 + 'vh';
            el.style.fontSize = (Math.random() * 2 + 1) + 'rem';
            el.style.opacity = Math.random() * 0.2 + 0.05;
            el.dataset.speed = Math.random() * 0.4 + 0.1;
            qoldBg.appendChild(el);
            runeElements.push(el);
        }

        window.addEventListener('scroll', () => {
            let scrollY = window.scrollY;
            runeElements.forEach(el => {
                let speed = parseFloat(el.dataset.speed);
                el.style.transform = `translateY(${scrollY * -speed}px)`;
            });
        });
    }

    const canvas = document.createElement('canvas');
    canvas.id = 'magic-particles';
    canvas.className = 'absolute inset-0 w-full h-full pointer-events-none opacity-80 mix-blend-screen';
    
    resultCardDisplay.style.position = 'relative';
    resultCardDisplay.style.overflow = 'hidden';
    
    placeholderTextEl.style.position = 'relative';
    placeholderTextEl.style.zIndex = '10';
    complexResultContainerEl.style.position = 'relative';
    complexResultContainerEl.style.zIndex = '10';
    
    resultCardDisplay.insertBefore(canvas, resultCardDisplay.firstChild);
    
    const ctx = canvas.getContext('2d');
    let particlesArray = [];
    let isAnimating = false;
    let activeColors = [];
    let isGlitchMode = false;

    function resizeCanvas() {
        canvas.width = resultCardDisplay.offsetWidth;
        canvas.height = resultCardDisplay.offsetHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas(); 

    class Particle {
        constructor(color, isGlitch) {
            this.x = Math.random() * canvas.width;
            this.y = canvas.height + Math.random() * 20; 
            this.size = Math.random() * 3 + 1;
            this.speedX = Math.random() * 2 - 1;
            this.speedY = Math.random() * -2 - 0.5; 
            this.color = color;
            this.life = Math.random() * 80 + 40;
            this.maxLife = this.life;
            this.isGlitch = isGlitch;
        }
        update() {
            if (this.isGlitch) {
                this.speedX += (Math.random() * 2 - 1);
                this.speedY += (Math.random() * 2 - 1);
            }
            this.x += this.speedX;
            this.y += this.speedY;
            this.life--;
            if (this.size > 0.1) this.size -= 0.02; 
        }
        draw() {
            ctx.globalAlpha = Math.max(0, this.life / this.maxLife);
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 15;
            ctx.shadowColor = this.color;
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        if (activeColors.length > 0) {
            for(let i=0; i < 2; i++) {
                const color = activeColors[Math.floor(Math.random() * activeColors.length)];
                particlesArray.push(new Particle(color, isGlitchMode));
            }
        }
        
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
            particlesArray[i].draw();
            if (particlesArray[i].life <= 0) {
                particlesArray.splice(i, 1);
                i--;
            }
        }
        ctx.shadowBlur = 0; 
        
        if (isAnimating || particlesArray.length > 0) {
            requestAnimationFrame(animateParticles);
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height); 
        }
    }

    function updateMagicParticles(color1, color2, glitch) {
        resizeCanvas();
        activeColors = [];
        if(color1) activeColors.push(color1);
        if(color2) activeColors.push(color2);
        isGlitchMode = glitch;
        
        if (activeColors.length > 0 && !isAnimating) {
            isAnimating = true;
            animateParticles();
        } else if (activeColors.length === 0) {
            isAnimating = false; 
        }
    }

    let originalTitle = document.title;
    let glitchTitleInterval;
    const cursedChars = "§§†‡ℵℶ¥ØѼ☠☢☣☤ERROR";

    function setGlitchTitle(isGlitch) {
        if (isGlitch) {
            if (!glitchTitleInterval) {
                glitchTitleInterval = setInterval(() => {
                    let newTitle = "";
                    for(let i=0; i<12; i++) newTitle += cursedChars[Math.floor(Math.random() * cursedChars.length)];
                    document.title = newTitle;
                }, 100);
            }
        } else {
            if (glitchTitleInterval) {
                clearInterval(glitchTitleInterval);
                glitchTitleInterval = null;
                document.title = originalTitle;
            }
        }
    }

    function createButton(elementName, selectorId) {
        const button = document.createElement('button');
        button.className = 'element-btn p-3 rounded-lg focus:outline-none text-sm';
        button.textContent = elementName;
        button.dataset.element = elementName;
        button.dataset.selector = selectorId;
        
        if (elementName === "Ulrhtau") {
            button.classList.add("btn-amaldicoado");
        }
        
        const elementColor = elementalData.baseElements[elementName].color;
        button.style.setProperty('--rune-color', elementColor);
        
        button.addEventListener('click', handleSelection);
        return button;
    }

    function populateSelectors() {
        Object.keys(elementalData.baseElements).forEach(name => {
            selector1El.appendChild(createButton(name, 1));
            selector2El.appendChild(createButton(name, 2));
        });
    }

    function applyButtonSelectedStyle(button) {
        button.classList.add('selected');
    }

    function resetButtonDefaultStyle(button) {
        button.classList.remove('selected');
    }

    function handleSelection(event) {
        const button = event.currentTarget;
        const { element, selector } = button.dataset;
        
        if (selector === '1') {
            if (selected1 === element) { 
                selected1 = null;
                resetButtonDefaultStyle(button);
            } else { 
                if (selected1) { 
                    const prevSelectedBtn1 = document.querySelector(`#selector1 .element-btn[data-element="${selected1}"]`);
                    if (prevSelectedBtn1) resetButtonDefaultStyle(prevSelectedBtn1);
                }
                selected1 = element;
                applyButtonSelectedStyle(button);
            }
        } else { 
            if (selected2 === element) { 
                selected2 = null;
                resetButtonDefaultStyle(button);
            } else { 
                if (selected2) { 
                     const prevSelectedBtn2 = document.querySelector(`#selector2 .element-btn[data-element="${selected2}"]`);
                    if (prevSelectedBtn2) resetButtonDefaultStyle(prevSelectedBtn2);
                }
                selected2 = element;
                applyButtonSelectedStyle(button);
            }
        }
        updateResult();
    }

    function updateResult() {
        const textElementsToAnimate = [complexElementNameEl, complexElementCombinationEl, complexElementDescriptionEl];
        
        textElementsToAnimate.forEach(el => {
            el.style.animation = 'none';
            el.offsetHeight; 
            el.style.animation = null; 
            el.classList.remove('visible');
        });

        let color1 = selected1 ? elementalData.baseElements[selected1].color : null;
        let color2 = selected2 ? elementalData.baseElements[selected2].color : null;
        let hasGlitch = false;

        if (selected1 === "Ulrhtau" || selected2 === "Ulrhtau") {
            hasGlitch = true;
            if (selected1 === "Ulrhtau") color1 = "#ff0000";
            if (selected2 === "Ulrhtau") color2 = "#0000ff";
            if (selected1 === "Ulrhtau" && selected2 === "Ulrhtau") {
                color1 = "#ff0000"; color2 = "#0000ff";
            }
        }

        if (hasGlitch) {
            document.body.classList.add('anomalia-realidade');
        } else {
            document.body.classList.remove('anomalia-realidade');
        }
        
        setGlitchTitle(hasGlitch);
        updateMagicParticles(color1, color2, hasGlitch);

        if (selected1 && selected2) {
            resultCardDisplay.classList.remove('visible'); 
            
            setTimeout(() => { 
                let complexElementName;
                let description;

                if (hasGlitch) {
                    const glitchNames = ["Anomalia Crítica", "Falha de Sistema", "Corrupção de Matéria", "[REDACTED]", "Vazio Fragmentado"];
                    complexElementName = glitchNames[Math.floor(Math.random() * glitchNames.length)];
                    description = "A tentativa de fusão sobrecarregou a malha da realidade. Os deuses não programaram isso.";
                } else if (elementalData.combinations[selected1] && elementalData.combinations[selected1][selected2]) {
                    complexElementName = elementalData.combinations[selected1][selected2];
                    description = elementalData.complexElementDescriptions[complexElementName] || "Descrição não disponível.";
                } else {
                    complexElementName = "Desconhecido";
                    description = "Combinação não catalogada.";
                }

                resultCardDisplay.style.setProperty('--color1', color1);
                resultCardDisplay.style.setProperty('--color2', color2);
                
                complexElementNameEl.textContent = complexElementName;
                complexElementCombinationEl.textContent = `${selected1} + ${selected2}`;
                complexElementDescriptionEl.innerHTML = description;

                placeholderTextEl.style.display = 'none';
                complexResultContainerEl.classList.remove('hidden');
                
                resultCardDisplay.classList.add('fissao-ativa');
                resultCardDisplay.classList.add('visible');

                let delay = 0;
                textElementsToAnimate.forEach(el => {
                    setTimeout(() => el.classList.add('visible'), delay);
                    delay += 150; 
                });
            }, 50); 

        } else {
            resultCardDisplay.classList.remove('visible');
            setTimeout(() => {
                placeholderTextEl.style.display = 'block';
                complexResultContainerEl.classList.add('hidden');
                
                resultCardDisplay.classList.remove('fissao-ativa');
                resultCardDisplay.classList.add('visible'); 
            }, 50);
        }
    }
    
    function resetSelections() {
        if (selected1) {
            const prevSelectedBtn1 = document.querySelector(`#selector1 .element-btn[data-element="${selected1}"]`);
            if (prevSelectedBtn1) resetButtonDefaultStyle(prevSelectedBtn1);
        }
        if (selected2) {
            const prevSelectedBtn2 = document.querySelector(`#selector2 .element-btn[data-element="${selected2}"]`);
            if (prevSelectedBtn2) resetButtonDefaultStyle(prevSelectedBtn2);
        }
        selected1 = null;
        selected2 = null;
        updateResult();
    }

    resetBtn.addEventListener('click', resetSelections);
    
    const sectionToggles = [
        { button: document.getElementById('toggle-grimoire'), content: document.getElementById('content-grimoire') },
        { button: document.getElementById('toggle-typings'), content: document.getElementById('content-typings') }
    ];

    sectionToggles.forEach(toggle => {
        toggle.button.addEventListener('click', () => {
            const isOpen = toggle.content.classList.toggle('open');
            toggle.button.classList.toggle('active-toggle', isOpen); 
        });
    });

    const grimoireGrid = document.getElementById('grimoire-grid');
    Object.entries(elementalData.baseElements).forEach(([name, data]) => {
        const card = document.createElement('div');
        // ATUALIZAÇÃO NÚMERO 1: Adicionado a classe "self-start" para não esticar os cartões adjacentes!
        card.className = 'grimoire-card p-5 cursor-pointer self-start';
        card.style.setProperty('--rune-color', data.color);
        
        if (name === "Ulrhtau") {
            card.classList.add("card-amaldicoado");
        }

        const conteudoIlustracao = data.imagem 
            ? `<img src="${data.imagem}" alt="Ilustração de ${name}" class="w-full h-full object-cover opacity-80 mix-blend-lighten transition-transform duration-700 group-hover:scale-110">`
            : `<i class="fas fa-gem text-4xl opacity-40 transition-transform duration-700 group-hover:scale-125" style="color: ${data.color};"></i>`;

        const detailsHtml = `
            <div class="grimoire-card-details mt-0">
                <div class="w-full h-px mt-4 mb-4" style="background: linear-gradient(90deg, transparent, ${data.color}55, transparent);"></div>
                
                <div class="flex flex-col md:flex-row gap-6">
                    
                    <div class="flex-1">
                        <h4 class="font-bold text-content-light uppercase tracking-wider text-xs">Manifestações Típicas:</h4>
                        <ul class="list-disc list-inside text-content-dim text-sm pl-2 mt-1 mb-5">
                            ${data.manifestacoes.map(m => `<li>${m}</li>`).join('')}
                        </ul>
                        
                        <h4 class="font-bold text-content-light uppercase tracking-wider text-xs flex items-center gap-2">
                            <i class="fas fa-book-open text-[10px]" style="color: ${data.color};"></i> Registro do Tomo:
                        </h4>
                        <div class="text-content-dim text-sm italic mt-2 border-l-2 pl-3 space-y-2" style="border-color: ${data.color}55">
                            <p class="font-semibold" style="color: ${data.color};">${data.lore}</p>
                            <p class="opacity-80">${data.longDesc}</p>
                        </div>
                    </div>

                    <div class="w-full md:w-32 lg:w-40 flex-shrink-0 flex flex-col items-center justify-start mt-2 md:mt-0">
                        <div class="rune-image-placeholder relative flex items-center justify-center w-full aspect-[3/4] rounded-sm overflow-hidden group cursor-crosshair">
                            <div class="absolute inset-0 opacity-20 group-hover:opacity-50 transition-opacity duration-700" style="background: radial-gradient(circle at center, ${data.color} 0%, transparent 70%);"></div>
                            
                            ${conteudoIlustracao}
                            
                            <div class="absolute inset-0 border border-slate-700/50 mix-blend-overlay pointer-events-none"></div>
                            <span class="absolute bottom-2 text-[9px] text-slate-500 uppercase tracking-widest opacity-60 pointer-events-none">Ilustração</span>
                        </div>
                        
                        <button class="secret-btn" data-element="${name}">???</button>
                    </div>
                    
                </div>
            </div>
        `;
        
        card.innerHTML = `
            <div class="flex justify-between items-center">
                <h3 class="font-bold text-xl uppercase tracking-widest" style="color: ${data.color};">${name}</h3>
                <span class="text-sm text-slate-500 opacity-50 transition-transform duration-300 icon-expand inline-block"><i class="fas fa-chevron-down"></i></span>
            </div>
            <p class="text-content-dim text-sm mt-2">${data.desc}</p>
            ${detailsHtml}
        `;
        
        card.addEventListener('click', (e) => {
            if (window.getSelection().toString().length > 0) return;

            if (e.target.closest('.grimoire-card') === card) {
                card.classList.toggle('expanded');
                const iconContainer = card.querySelector('.icon-expand');
                if (iconContainer) {
                    iconContainer.style.transform = card.classList.contains('expanded') ? 'rotate(180deg)' : 'rotate(0deg)';
                }
            }
        });
        
        grimoireGrid.appendChild(card);
    });

    const acquisitionMethodsContainer = document.getElementById('acquisition-methods');
    const typingClassificationsContainer = document.getElementById('typing-classifications');
    const narrativeDisplay = document.getElementById('acquisition-narrative-display');
    const narrativeText = document.getElementById('narrative-text');

    Object.entries(elementalData.typings.acquisition).forEach(([name, data]) => {
        const button = document.createElement('button');
        button.className = 'button-secondary p-2 px-4 rounded-lg shadow-md transition-all text-sm';
        button.textContent = name;
        button.addEventListener('click', () => {
            acquisitionMethodsContainer.querySelectorAll('button').forEach(btn => {
                btn.classList.remove('active-filter');
            });
            button.classList.add('active-filter');

            narrativeText.textContent = data.mini_narrativa || "Detalhes sobre este meio de aquisição.";
            narrativeDisplay.classList.remove('hidden');

            document.querySelectorAll('#typing-classifications > div').forEach(cardDiv => {
                if (data.related.includes(cardDiv.dataset.typing)) {
                    cardDiv.classList.add('highlight');
                } else {
                    cardDiv.classList.remove('highlight');
                }
            });
        });
        acquisitionMethodsContainer.appendChild(button);
    });

    Object.entries(elementalData.typings.classification).forEach(([name, data]) => {
        const card = document.createElement('div');
        card.className = 'card-bg p-4 rounded-lg shadow-md border-2 border-transparent transition-all';
        card.dataset.typing = name; 
        let archetypeHtml = (typeof data === 'object' && data.arquétipo) ? `<p class="text-teal-400 text-sm mt-2"><em>Arquétipo: ${data.arquétipo}</em></p>` : '';
        let descriptionText = (typeof data === 'object' && data.desc) ? data.desc : (typeof data === 'string' ? data : 'Descrição não disponível.');
        card.innerHTML = `<h4 class="font-bold text-lg text-content-light">${name}</h4><p class="text-content-dim">${descriptionText}</p>${archetypeHtml}`;
        typingClassificationsContainer.appendChild(card);
    });

    // =========================================
    // LÓGICA DA JANELA SECRETA E DECODIFICAÇÃO
    // =========================================
    const secretModal = document.getElementById('secret-modal');
    const closeSecretBtn = document.getElementById('close-secret-modal');
    const secretBg = document.getElementById('secret-modal-bg');
    const secretModalContent = document.getElementById('secret-modal-content');
    
    let activeGlitchIntervals = [];

    function clearAllIntervals() {
        activeGlitchIntervals.forEach(clearInterval);
        activeGlitchIntervals = [];
    }

    function scrambleText(element, finalString, duration) {
        const chars = "⍙⎍⍜⍎⍑⍋⍝⍯⍮⍫⍡⍪⍤⍥⍨⍢⍣⍗⍒⍞⍟§‡ℵERROR10101010";
        let iterations = 0;
        const maxIterations = duration / 30; 
        
        element.innerText = ""; 

        const interval = setInterval(() => {
            element.innerText = finalString.split('').map((letter, index) => {
                if (letter === " " || letter === "\n") return letter; 
                if (index < iterations / (maxIterations / finalString.length)) {
                    return finalString[index]; 
                }
                return chars[Math.floor(Math.random() * chars.length)]; 
            }).join('');
            
            iterations++;
            if (iterations >= maxIterations) {
                clearInterval(interval);
                element.innerText = finalString; 
            }
        }, 30);
        
        activeGlitchIntervals.push(interval);
    }

    function animateEye(element) {
        const template = [
            "                          ████████                          ",
            "                  ██████████████████████                  ",
            "              ████████                  ████████              ",
            "          ██████           ██████           ██████          ",
            "        █████            ██████████            █████        ",
            "       █████           ██████████████           █████       ",
            "      █████            ██████  ██████            █████      ",
            "       █████           ██████████████           █████       ",
            "        █████            ██████████            █████        ",
            "          ██████           ██████           ██████          ",
            "              ████████                  ████████              ",
            "                  ██████████████████████                  ",
            "                          ████████                          "
        ].join('\n');
        
        const chars = "⍙⎍⍜⍎⍑⍋⍝⍯⍮⍫⍡⍪⍤⍥⍨⍢⍣⍗⍒⍞⍟§‡ℵ";
        
        const interval = setInterval(() => {
            let result = "";
            for(let i=0; i<template.length; i++) {
                const char = template[i];
                if (char === " " || char === "\n") {
                    result += char; 
                } else {
                    result += chars[Math.floor(Math.random() * chars.length)]; 
                }
            }
            element.innerText = result;
        }, 50); 
        
        activeGlitchIntervals.push(interval);
    }

    if(secretModal) {
        function openSecretModal(elementName, data) {
            clearAllIntervals(); 

            secretModalContent.style.setProperty('--modal-rune-color', data.color);
            secretModal.classList.add('active');
            
            const titleEl = document.getElementById('secret-modal-title');
            const subEl = document.getElementById('secret-modal-subtitle');
            const textEl = document.getElementById('secret-modal-text');

            if (elementName === "Ulrhtau") {
                titleEl.className = "text-3xl font-cinzel text-red-600 mb-6 tracking-widest text-center font-bold";
                subEl.innerText = "";
                textEl.className = "ascii-eye";
                
                scrambleText(titleEl, "MILN JADITYL XCO", 2000);
                animateEye(textEl);

            } else {
                titleEl.className = "text-2xl font-cinzel text-red-900 mb-6 tracking-widest text-center";
                textEl.className = "mt-4"; 
                
                const sTitle = data.secretTitle || "REGISTOS OBSCUROS";
                const sSub = data.secretSubtitle || "\"As páginas que a ordem tentou queimar...\"";
                const sText = data.secretText || "Nenhum registo proibido encontrado para esta anomalia.";

                if(titleEl) scrambleText(titleEl, sTitle, 1500); 
                if(subEl) scrambleText(subEl, sSub, 2500); 
                if(textEl) scrambleText(textEl, sText, 4000); 
            }
        }

        function closeSecretModal() {
            secretModal.classList.remove('active');
            clearAllIntervals(); 
        }

        closeSecretBtn.addEventListener('click', closeSecretModal);
        secretBg.addEventListener('click', closeSecretModal);

        grimoireGrid.addEventListener('click', (e) => {
            if (e.target.classList.contains('secret-btn')) {
                e.stopPropagation(); 
                const elementName = e.target.dataset.element;
                const elementData = elementalData.baseElements[elementName];
                openSecretModal(elementName, elementData);
            }
        });
    }

    populateSelectors();
});