const isElectron = typeof require !== 'undefined';
let ipcRenderer = null;

if (isElectron) {
    ipcRenderer = require('electron').ipcRenderer;
}

window.addEventListener('DOMContentLoaded', () => {
    const btnMinimize = document.getElementById('btn-minimize');
    const btnClose = document.getElementById('btn-close');

    if (isElectron && btnMinimize && btnClose) {
        btnMinimize.addEventListener('click', () => ipcRenderer.send('minimize-window'));
        btnClose.addEventListener('click', () => ipcRenderer.send('close-window'));
    } else if (btnMinimize && btnClose) {
        const controls = document.querySelector('.window-controls');
        if(controls) controls.style.display = 'none';
    }
});

const audioManager = {
    ambient: new Audio('audio/ambient.mp3'),
    click: new Audio('audio/click.mp3'),
    fusion: new Audio('audio/fusion.mp3'),
    glitch: new Audio('audio/glitch.mp3'),
    started: false,
    
    init: function() {
        this.ambient.loop = true;
        this.ambient.volume = 0.15; 
        this.click.volume = 0.5;
        this.fusion.volume = 0.7;
        this.glitch.volume = 0.6;
        this.glitch.loop = true; 

        document.body.addEventListener('click', () => {
            if (!this.started) {
                this.ambient.play().catch(e => console.log("Aguardando interação para o áudio..."));
                this.started = true;
            }
        });
    },
    
    playClick: function() {
        this.click.currentTime = 0; 
        this.click.play().catch(e => {});
    },
    
    playFusion: function() {
        this.fusion.currentTime = 0;
        this.fusion.play().catch(e => {});
    },
    
    playGlitch: function(state) {
        if (state) {
            this.glitch.play().catch(e => {});
            this.ambient.volume = 0.05; 
        } else {
            this.glitch.pause();
            this.ambient.volume = 0.15; 
        }
    }
};

audioManager.init(); 

const elementalData = {
    baseElements: {
        "Flama":   { desc: "Imbua seu ser ao calor do combate e torne seus pensamentos em armas.<br>-''Al-azim''", color: "#a61c1c", hoverColor: "#851616", manifestacoes: ["Controlar chamas", "Esferas de fogo", "Resistência ao calor"], lore: "Sangue jazido dos <span class='madness-word' data-note='Dizem que foram o primeiro povo de Sur-yaal e os criadores da Chama Sekhmet'>'Iitlaq</span>.", imagem: "", longDesc: "A manipulação das chamas transcende a simples destruição; é o ato de dar vida à entropia.", secretTitle: "KCOTOLOX", secretSubtitle: "\"A Punição\"", secretText: "Os primeiros piromantes de Nahvvatzal não conjuravam chamas do ar, mas queimavam as próprias memórias para gerar calor." },
        "Aqua":   { desc: "Flua à minha mente, ou afogue-se na vastidão do meu ser.<br>-''Gyeang-ju''", color: "#3a4dff", hoverColor: "#2f3ecc", manifestacoes: ["Moldar água", "Respirar sob água", "Criar névoa"], lore: "Lágrima da <span class='madness-word' data-note='Ela chora sangue quando eclipsada.'>Deusa da Lua</span>.", imagem: "", longDesc: "A água atua como um espelho para os terrores esquecidos.", secretTitle: "UTYLOF", secretSubtitle: "\"A Transformação\"", secretText: "A Deusa da Lua não chora de tristeza. Suas lágrimas são compostas pelas almas daqueles que sucumbiram às profundezas." },
        "Eol":     { desc: "Pense da menor reflexão de culpa à maior epifania noturna, esta é a liberdade.<br>-''Eristópheus''", color: "#00e689", hoverColor: "#00b86e", manifestacoes: ["Lufadas de vento", "Levitação breve", "Aumentar velocidade"], lore: "Sussurros dos <span class='madness-word' data-note='Eles nunca se calam! Façam parar!'>Céus</span>.", imagem: "", longDesc: "O ar não é vazio, mas um condutor de lamentos.", secretTitle: "EFENLORU", secretSubtitle: "\"A Liberdade\"", secretText: "Aqueles que escutam o vento por muito tempo perdem a própria voz." },
        "Terrae":  { desc: "Solidez, estabilidade, crescimento, fundação.", color: "#6c4d42", hoverColor: "#573e35", manifestacoes: ["Mover pedras", "Barreiras de terra", "Sentir tremores"], lore: "Corpo da <span class='madness-word' data-note='Seus ossos formam as nossas prisões e túmulos.'>Mãe Antiga</span>.", imagem: "", longDesc: "As pedras fundacionais deste mundo estão manchadas de sacrifício.", secretTitle: "HAVBAGAN", secretSubtitle: "\"A Formação\"", secretText: "A rocha não é cega. Cada pedra colocada nas fundações do Crisol de Apriori pulsa como um coração lento." },
        "Fulmen":   { desc: "Ouça o estrondo de minha presença ao pronunciar meu nome.<br>-''Tyapu''", color: "#ffff00", hoverColor: "#e6e600", manifestacoes: ["Disparar raios", "Magnetizar objetos", "Aumentar reflexos"], lore: "Fúria do <span class='madness-word' data-note='Um usurpador cego pela própria luz.'>Deus da Tempestade</span>.", imagem: "", longDesc: "Uma fração de segundo de energia pura que frita sinapses e altera percepções.", secretTitle: "TEZNITAJ", secretSubtitle: "\"A Movimentação\"", secretText: "Verdadeiro poder elétrico queima o nervo óptico. Magos experientes desta runa estão todos cegos." },
        "Crelix":   { desc: "Frio, estagnação, preservação, rigidez.", color: "#56e5ff", hoverColor: "#45b7cc", manifestacoes: ["Congelar superfícies", "Armas de gelo", "Suportar frio"], lore: "Sopro Invernal do <span class='madness-word' data-note='Ele está adormecido sob o gelo vermelho.'>Gigante</span>.", imagem: "", longDesc: "O verdadeiro poder de Crelix não é o gelo, mas a paralisação do tempo em escala molecular.", secretTitle: "ORGNOTAMOTR", secretSubtitle: "\"A Permanência\"", secretText: "No coração do Zero Absoluto, o tempo não passa." },
        "Lux":    { desc: "Iluminação, verdade, pureza, visão.", color: "#fbe4ec", hoverColor: "#f9d7e3", manifestacoes: ["Criar luz", "Dissipar sombras", "Cura leve"], lore: "Bênção do <span class='madness-word' data-note='Sua luz queima as almas impuras.'>Sol Eterno</span>.", imagem: "", longDesc: "A runa Lux arranca os véus da ilusão e expõe imperfeições.", secretTitle: "RASTONTRI", secretSubtitle: "\"A Presença\"", secretText: "Dizem que é cura, mas a luz queima as imperfeições." },
        "Umbra": { desc: "Em meu manto repousa os maiores terrores e mistérios do universo.<br>-''Ibi'una''", color: "#303030", hoverColor: "#262626", manifestacoes: ["Furtividade", "Escuridão localizada", "Intimidar"], lore: "Manto da <span class='madness-word' data-note='Não olhe para a escuridão por muito tempo.'>Noite Silenciosa</span>.", imagem: "", longDesc: "As sombras possuem textura e fome.", secretTitle: "YRMEGTORE", secretSubtitle: "\"A Ausência\"", secretText: "Não há escuridão vazia. Toda sombra projetada pelo sol é um portal." },
        "Vitae":  { desc: "Há formas de vida em todas as minhas criações e submissão às suas escolhas.<br>-''Yashima-no-Mikoto''", color: "#9d0e4f", hoverColor: "#7e0b3f", manifestacoes: ["Acelerar cura", "Estimular plantas", "Sentir auras"], lore: "Essência da <span class='madness-word' data-note='As raízes bebem dos nossos cadáveres.'>Natureza Viva</span>.", imagem: "", longDesc: "A energia da Vitae força células a se multiplicarem rapidamente.", secretTitle: "IGL'TRUTAE", secretSubtitle: "\"A Animação\"", secretText: "O excesso de magia vital causa o crescimento de órgãos redundantes no mago." },
        "Toxi": { desc: "Meu toque é o sussurro da entropia, a transformação inevitável e putrefata do todo.", color: "#76cf02", hoverColor: "#5ea602", manifestacoes: ["Criar venenos", "Causar náusea", "Resistência a doenças"], lore: "<span class='madness-word' data-note='Uma imensa máquina subterrânea que parece estar atravessando algumas Leis do Acaso.'>Núcleo Strolova</span>.", imagem: "", longDesc: "Senhores da putrefação e mestres do miasma.", secretTitle: "KARVPARLPAKS", secretSubtitle: "\"A Degradação\"", secretText: "A runa da toxina exige simbiose. O mago hospeda parasitas na sua corrente sanguínea." },
        "Vis":{ desc: "Força pura, movimento, poder bruto, potencial.", color: "#803631", hoverColor: "#662b27", manifestacoes: ["Empurrão telecinético", "Escudos de energia", "Aumentar força"], lore: "A primeira <span class='madness-word' data-note='O peso da magia esmaga a sanidade.'>Pluma</span>.", imagem: "", longDesc: "Desprovida de forma ou moralidade, a Vis é a energia cósmica crua.", secretTitle: "TSOZDNEMARO", secretSubtitle: "\"A Energia\"", secretText: "Conjurar energia bruta distorce os ossos do utilizador." },
        "Ulrhtau": { desc: "DADOS CORROMPIDOS // FALHA DE LEITURA", color: "#ff0000", hoverColor: "#ff0000", manifestacoes: ["Aberração espacial", "Distorção da realidade", "[ERRO]"], lore: "NÃO CLICAR. A <span class='madness-word' data-note='A DOR É INFINITA AQUI FORA A DOR É INFINITA'>runa esquecida</span> que corrói o grimório.", imagem: "fas fa-skull text-6xl text-red-600", longDesc: "A matéria grita ao ser tocada por esta anomalia. A DOR é o único idioma conhecido. //NÃO_OLHE_PARA_TRÁS//", secretTitle: "", secretSubtitle: "", secretText: "" }
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
        "Flama Fátuo": "Chamas etéreas que dançam com vida própria, guiando ou enganando os incautos.",
        "Vapor": "Uma névoa escaldante que obscurece a visão e queima ao toque, nascida do conflito elemental.",
        "Incêndio": "Uma reação catastrófica de chamas incontroláveis.",
        "Magma": "Rocha derretida em fúria rubra, remodelando o mundo.",
        "Faísca": "Um pequeno e súbito estalo de energia, o prenúncio de uma tempestade.",
        "Névoa": "Uma cortina opaca onde o calor encontra o frio.",
        "Radiação": "O calor da luz concentrado e nocivo.",
        "Fumaça": "Partículas densas que sufocam a luz.",
        "Alma": "A essência espiritual em fervor ardente.",
        "Fuligem": "Resíduos tóxicos impregnando o ambiente.",
        "Explosão": "Uma liberação violenta de energia e matéria.",
        "Purificação Reminiscente": "Água imbuída de calma profunda e memória ancestral.",
        "Bruma": "Vapor de água suspenso, obscurecendo caminhos.",
        "Lama": "Terra saturada de água, um terreno instável.",
        "Supercondução": "Água eletrizada em fluxo perpétuo.",
        "Cristal": "Água congelada em formas geométricas perfeitas.",
        "Ilusão": "Visões falsas criadas pela refração da luz na água.",
        "Miragem": "Imagens efêmeras dançando sobre a água.",
        "Sangue": "O fluido vital de Nahvvatzal.",
        "Ácido": "Substância corrosiva e virulenta.",
        "Corrente": "A força da água em movimento perpétuo.",
        "Turbilhão Vendaval": "Massas de ar em rotação violenta.",
        "Areia": "Terra erodida transportada pelo vento.",
        "Trovão": "A onda de choque sonora do Fulmen.",
        "Nevoeiro": "Ar gélido condensado e opaco.",
        "Fulgor": "Luz ofuscante concentrada pelo vento.",
        "Sopro": "O fluxo vital do ar.",
        "Gás": "Ar impregnado de vapores invisíveis e letais.",
        "Tornado": "Uma coluna de vento e energia em rotação destrutiva.",
        "Rocha Eterna": "Solidez inabalável do corpo da Mãe Antiga.",
        "Magnetismo": "A força invisível atraindo e repelindo metais.",
        "Geada": "Cristais de gelo cobrindo a terra.",
        "Domínio": "Terra consagrada imbuída de luz.",
        "Assombração": "Energia sombria se apegando à terra.",
        "Fertilidade": "Crescimento acelerado pela vida primordial.",
        "Erosão": "Decadência lenta da terra por toxinas.",
        "Tremor": "A terra chacoalhando com energia Vis.",
        "Intempérie Estrondosa": "Uma tempestade elétrica de fúria avassaladora.",
        "Granizo": "Bombardeio de gelo energizado pelo Fulmen.",
        "Clarão": "Um feixe de luz súbito e ofuscante.",
        "Crepúsculo": "O limite entre a luz residual e as sombras.",
        "Choque": "Descarga elétrica paralisante.",
        "Ionização": "O ar energizado em estado instável.",
        "Descarga": "Liberação caótica de poder Fulmen puro.",
        "Zero Absoluto": "A ausência total de movimento molecular.",
        "Prisma": "Gelo que refrata a luz em cores cósmicas.",
        "Escuridão": "Vazio gelado opressor.",
        "Hibernação": "Estado de sono vital induzido pelo frio.",
        "Congelamento": "Putrefação paralisada e neutralizada.",
        "Congelação": "Energia do frio parando a matéria.",
        "Difração Infinita": "Luz pura dobrando e se expandindo infinitamente.",
        "Contraste": "A borda afiada entre luz e sombra total.",
        "Aurora": "A luz da vida nascendo no horizonte.",
        "UV": "Luz invisível tóxica gerada por Vis.",
        "Facho": "Feixe concentrado de luz e energia.",
        "Vazio Profundo": "O abismo de nada absoluto.",
        "Fantasma": "Uma alma ou eco vital preso nas sombras.",
        "Veneno": "Toxina mística que age furtivamente.",
        "Pulso": "Uma onda de energia sombria asfixiante.",
        "Vida Plena": "A força vital em sua expressão máxima.",
        "Doença": "Putrefação vital acelerada.",
        "Vigor": "Energia vital concentrada.",
        "Praga Letal": "Putrefação que se espalha incontrolavelmente.",
        "Contágio": "Transmissão virulenta de toxinas e energia.",
        "Força Gravitacional": "Manifestação pura da energia Vis distorcendo o espaço."
    },
    complexElementTypes: {
        "Flama Fátuo": "Combinatória.", "Vapor": "Combinatória.", "Incêndio": "Reacionária.", "Magma": "Combinatória.", "Faísca": "Reacionária.", "Névoa": "Combinatória.", "Radiação": "Reacionária.", "Fumaça": "Combinatória.", "Alma": "Combinatória.", "Fuligem": "Reacionária.", "Explosão": "Reacionária.",
        "Purificação Reminiscente": "Combinatória.", "Bruma": "Combinatória.", "Lama": "Combinatória.", "Supercondução": "Combinatória.", "Cristal": "Combinatória.", "Ilusão": "Combinatória.", "Miragem": "Combinatória.", "Sangue": "Combinatória.", "Ácido": "Reacionária.", "Corrente": "Combinatória.",
        "Turbilhão Vendaval": "Combinatória.", "Areia": "Combinatória.", "Trovão": "Reacionária.", "Nevoeiro": "Combinatória.", "Fulgor": "Reacionária.", "Sopro": "Combinatória.", "Gás": "Reacionária.", "Tornado": "Combinatória.",
        "Rocha Eterna": "Combinatória.", "Magnetismo": "Combinatória.", "Geada": "Combinatória.", "Domínio": "Combinatória.", "Assombração": "Reacionária.", "Fertilidade": "Combinatória.", "Erosão": "Reacionária.", "Tremor": "Reacionária.",
        "Intempérie Estrondosa": "Reacionária.", "Granizo": "Reacionária.", "Clarão": "Reacionária.", "Crepúsculo": "Combinatória.", "Choque": "Reacionária.", "Ionização": "Reacionária.", "Descarga": "Reacionária.",
        "Zero Absoluto": "Reacionária.", "Prisma": "Combinatória.", "Escuridão": "Combinatória.", "Hibernação": "Combinatória.", "Congelamento": "Combinatória.", "Congelação": "Combinatória.",
        "Difração Infinita": "Reacionária.", "Contraste": "Combinatória.", "Aurora": "Reacionária.", "UV": "Reacionária.", "Facho": "Combinatória.",
        "Vazio Profundo": "Combinatória.", "Fantasma": "Combinatória.", "Veneno": "Combinatória.", "Pulso": "Reacionária.",
        "Vida Plena": "Combinatória.", "Doença": "Reacionária.", "Vigor": "Combinatória.",
        "Praga Letal": "Reacionária.", "Contágio": "Reacionária.",
        "Força Gravitacional": "Combinatória."
    },
    complexElementPowers: {
        "Flama Fátuo": "Nível de Poder: Médio.", "Vapor": "Nível de Poder: Baixo.", "Incêndio": "Nível de Poder: Alto.", "Magma": "Nível de Poder: Muito Alto.", "Faísca": "Nível de Poder: Baixo.", "Névoa": "Nível de Poder: Baixo.", "Radiação": "Nível de Poder: Alto.", "Fumaça": "Nível de Poder: Médio.", "Alma": "Nível de Poder: Alto.", "Fuligem": "Nível de Poder: Médio.", "Explosão": "Nível de Poder: Muito Alto.",
        "Purificação Reminiscente": "Nível de Poder: Médio.", "Bruma": "Nível de Poder: Baixo.", "Lama": "Nível de Poder: Médio.", "Supercondução": "Nível de Poder: Alto.", "Cristal": "Nível de Poder: Alto.", "Ilusão": "Nível de Poder: Médio.", "Miragem": "Nível de Poder: Baixo.", "Sangue": "Nível de Poder: Alto.", "Ácido": "Nível de Poder: Alto.", "Corrente": "Nível de Poder: Médio.",
        "Turbilhão Vendaval": "Nível de Poder: Alto.", "Areia": "Nível de Poder: Médio.", "Trovão": "Nível de Poder: Alto.", "Nevoeiro": "Nível de Poder: Médio.", "Fulgor": "Nível de Poder: Alto.", "Sopro": "Nível de Poder: Baixo.", "Gás": "Nível de Poder: Alto.", "Tornado": "Nível de Poder: Muito Alto.",
        "Rocha Eterna": "Nível de Poder: Alto.", "Magnetismo": "Nível de Poder: Médio.", "Geada": "Nível de Poder: Médio.", "Domínio": "Nível de Poder: Muito Alto.", "Assombração": "Nível de Poder: Alto.", "Fertilidade": "Nível de Poder: Alto.", "Erosão": "Nível de Poder: Médio.", "Tremor": "Nível de Poder: Alto.",
        "Intempérie Estrondosa": "Nível de Poder: Muito Alto.", "Granizo": "Nível de Poder: Médio.", "Clarão": "Nível de Poder: Alto.", "Crepúsculo": "Nível de Poder: Alto.", "Choque": "Nível de Poder: Alto.", "Ionização": "Nível de Poder: Alto.", "Descarga": "Nível de Poder: Alto.",
        "Zero Absoluto": "Nível de Poder: Extremo.", "Prisma": "Nível de Poder: Alto.", "Escuridão": "Nível de Poder: Muito Alto.", "Hibernação": "Nível de Poder: Alto.", "Congelamento": "Nível de Poder: Alto.", "Congelação": "Nível de Poder: Muito Alto.",
        "Difração Infinita": "Nível de Poder: Extremo.", "Contraste": "Nível de Poder: Muito Alto.", "Aurora": "Nível de Poder: Alto.", "UV": "Nível de Poder: Alto.", "Facho": "Nível de Poder: Muito Alto.",
        "Vazio Profundo": "Nível de Poder: Muito Alto.", "Fantasma": "Nível de Poder: Alto.", "Veneno": "Nível de Poder: Muito Alto.", "Pulso": "Nível de Poder: Alto.",
        "Vida Plena": "Nível de Poder: Muito Alto.", "Doença": "Nível de Poder: Alto.", "Vigor": "Nível de Poder: Muito Alto.",
        "Praga Letal": "Nível de Poder: Muito Alto.", "Contágio": "Nível de Poder: Alto.",
        "Força Gravitacional": "Nível de Poder: Extremo."
    },
    typings: {
        acquisition: {
            "Benção": { desc: "Concedida por uma entidade superior.", related: ["Única", "Múltipla", "Masterizadora"], mini_narrativa: "A Deusa tocou sua testa..." },
            "Treino": { desc: "Adquirida por prática intensiva.", related: ["Única"], mini_narrativa: "Anos de meditação no gelo..." }
        },
        classification: {
            "Única": { desc: "Afinidade com um único Elemento Base.", arquétipo: "O Piromante Novato" },
            "Múltipla": { desc: "Capacidade de manipular dois ou mais Elementos.", arquétipo: "O Geomante Aquático" }
        }
    }
};

// NOVO: Base de Dados Expansiva do Bestiário
const bestiaryData = [
    { 
        name: "Sombra Rastejante", 
        habitat: "Ruínas de Iitlaq", 
        lifeExpectancy: "Efêmera (depende do consumo de memórias)",
        reproductionRate: "Alto (em áreas de trauma mental)",
        reproductionMethod: "Por meios mágicos (Fissão de trauma)",
        vulnerability: "Lux (Luz pura), Fulmen", 
        resistance: "Umbra, Toxi, Ataques físicos", 
        peculiarity: "Totalmente invisíveis a olho nu. Só podem ser detetadas pelo rasto de ar gélido que deixam ou utilizando feitiços reveladores de Lux.",
        desc: "Parasitas incorpóreos que devoram as memórias e a sanidade dos magos.",
        fullDesc: "Seres formados a partir de resquícios de magia corrompida durante as antigas guerras de Iitlaq. Não possuem forma física definida, assemelhando-se a uma fumaça negra muito densa. Eles alimentam-se exclusivamente das lembranças de conjuradores desavisados, sugando a força mental até deixarem as suas vítimas num estado catatônico de amnésia paralisante permanente.",
        image: "",
        icon: "fas fa-ghost"
    },
    { 
        name: "Colosso de Geada", 
        habitat: "Picos do Gigante", 
        lifeExpectancy: "Milênios",
        reproductionRate: "Nulo",
        reproductionMethod: "Por meios mágicos (Criação artificial antiga)",
        vulnerability: "Flama intensificada, Magma", 
        resistance: "Crelix absoluto, Areia, Tremores", 
        peculiarity: "O seu núcleo emana um frio tão absoluto que congela instantaneamente a humidade do ar ao seu redor, criando uma armadura de gelo espessa e autorregenerativa.",
        desc: "Constructos adormecidos que despertam com o uso abusivo de magia.",
        fullDesc: "Armas de cerco gigantescas criadas numa era esquecida por mestres renegados de Crelix e Terrae. Os colossos são aglomerados massivos de rocha viva e gelo perene. Eles permanecem adormecidos como montanhas literais, e só despertam quando detetam picos extremos de manipulação mágica na sua vizinhança. Uma vez despertos, marcham em silêncio absoluto para erradicar a fonte do distúrbio com força brutal.",
        image: "img/teste imagem.jpg",
        icon: "img/teste imagem.jpg"
    },
    { 
        name: "Iturfratzse", 
        habitat: "Fnerhyszostzer", 
        lifeExpectancy: "80 - 130 anos",
        reproductionRate: "Média",
        reproductionMethod: "Sexuada e criação artificial antiga",
        vulnerability: "Flama intensificada, Magma", 
        resistance: "Ulrhtau", 
        peculiarity: "O seu núcleo emana um frio tão absoluto que congela instantaneamente a humidade do ar ao seu redor, criando uma armadura de gelo espessa e autorregenerativa.",
        desc: "Constructos adormecidos que despertam com o uso abusivo de magia.",
        fullDesc: "Armas de cerco gigantescas criadas numa era esquecida por mestres renegados de Crelix e Terrae. Os colossos são aglomerados massivos de rocha viva e gelo perene. Eles permanecem adormecidos como montanhas literais, e só despertam quando detetam picos extremos de manipulação mágica na sua vizinhança. Uma vez despertos, marcham em silêncio absoluto para erradicar a fonte do distúrbio com força brutal.",
        image: "img/teste-iturfratsze.jpg",
        icon: "img/teste-iturfratsze.jpg"
    },
    { 
        name: "Devorador de Essência", 
        habitat: "Vazio Fragmentado (Fendas dimensionais)", 
        lifeExpectancy: "Desconhecida",
        reproductionRate: "Baixo",
        reproductionMethod: "Assexuada (Brotamento parasítico em cadáveres)",
        vulnerability: "Ulrhtau (Energia instável do vazio), Lux concentrada", 
        resistance: "Vitae, Sangue, Toxi", 
        peculiarity: "Consegue mimetizar perfeitamente a assinatura mágica de feitiços de cura (Vitae) para atrair presas que estejam gravemente feridas e à procura de socorro.",
        desc: "Abominações predatórias que são atraídas pelo cheiro da cura.",
        fullDesc: "Criaturas monstruosas e cegas com múltiplos membros espasmódicos e uma bocarra desproporcional cheia de dentes como agulhas. Eles deslizam e contorcem-se pelas falhas na realidade provocadas por anomalias de Ulrhtau. São inteiramente imunes a toxinas, e qualquer tentativa de usar magia vital (Vitae) neles apenas os regenera e fortalece, tornando-os um pesadelo absoluto para clérigos e curandeiros nos campos de batalha.",
        image: "",
        icon: "fas fa-pastafarianism"
    },
    { 
        name: "Khatilis", 
        habitat: "Pirâmides Khermet", 
        lifeExpectancy: "15 - 30 anos",
        reproductionRate: "Alto",
        reproductionMethod: "Sexuada",
        vulnerability: "Aqua, Toxi", 
        resistance: "Flama, Umbra", 
        peculiarity: "Consegue mimetizar perfeitamente a assinatura mágica de feitiços de cura (Vitae) para atrair presas que estejam gravemente feridas e à procura de socorro.",
        desc: "Animais dóceis de domésticos semelhantes a panteras.",
        fullDesc: "Criaturas monstruosas e cegas com múltiplos membros espasmódicos e uma bocarra desproporcional cheia de dentes como agulhas. Eles deslizam e contorcem-se pelas falhas na realidade provocadas por anomalias de Ulrhtau. São inteiramente imunes a toxinas, e qualquer tentativa de usar magia vital (Vitae) neles apenas os regenera e fortalece, tornando-os um pesadelo absoluto para clérigos e curandeiros nos campos de batalha.",
        image: "",
        icon: "fas fa-pastafarianism"
    },
];
// Base de Dados das Nações
const nationsData = [
    { name: "Sur-yaal", element: "Flama", climate: "Deserto Vulcânico", government: "Teocracia Ígnea", culture: "Marcial e Religiosa", desc: "Berço dos piromantes originais, uma nação esculpida no calor e na rocha derretida, onde a força é lei.", image: "", icon: "fas fa-fire" },
    { name: "Sui-ryong", element: "Aqua", climate: "Arquipélago Submarino", government: "Dinastia Marítima", culture: "Erudita e Filosófica", desc: "O império das águas, famoso pelos seus palácios de cristal e bibliotecas insondáveis submersas no abismo.", image: "", icon: "fas fa-water" },
    { name: "Lîngyù", element: "Terrae", climate: "Montanhoso e Cavernoso", government: "Conselho dos Anciões", culture: "Isolacionista", desc: "A fortaleza inabalável, onde a magia geológica ergueu muralhas impenetráveis para proteger os seus segredos.", image: "", icon: "fas fa-mountain" },
    { name: "Aethelos", element: "Eol", climate: "Planícies Elevadas", government: "República dos Ventos", culture: "Nómada e Livre", desc: "Cidades cujas torres tocam as nuvens, suspensas por correntes perpétuas de Eol e habitadas por espíritos livres.", image: "", icon: "fas fa-wind" },
    { name: "Jövirefolnr", element: "Crelix", climate: "Tundra Glacial Perene", government: "Matriarcado do Frio", culture: "Estóica e Preservacionista", desc: "As terras do zero absoluto, onde o tempo parece parar e a história das eras antigas é preservada no gelo eterno.", image: "", icon: "fas fa-snowflake" },
    { name: "Py'aporã", element: "Fulmen, Lux, Umbra", climate: "Selva Tropical Densa", government: "Tribos Unidas", culture: "Xamânica e Dualista", desc: "Uma terra de contrastes absolutos. Tempestades elétricas rasgam a escuridão da noite, enquanto a luz da alvorada revela santuários esquecidos na selva.", image: "", icon: "fas fa-bolt" },
    { name: "Jinsei", element: "Vitae", climate: "Floresta Primordial", government: "Comuna Druídica", culture: "Simbiótica com a Natureza", desc: "Um domínio onde a flora e a fauna crescem de forma descontrolada e selvagem, movidas pela pura energia vital vibrante.", image: "", icon: "fas fa-leaf" },
    { name: "Moroyva", element: "Toxi", climate: "Pântano Miasmático", government: "Oligarquia Alquímica", culture: "Científica e Sobrevivencialista", desc: "Um refúgio sombrio, focado na transmutação, no estudo de pragas e no limite da sobrevivência biológica.", image: "", icon: "fas fa-skull-crossbones" },
    { name: "Praetorium", element: "Vis", climate: "Planaltos Desolados", government: "Império Militar Hegemónico", culture: "Imperialista", desc: "A nação do poder puro, focada na expansão territorial e no domínio absoluto da força telecinética esmagadora.", image: "", icon: "fas fa-fist-raised" }
];
window.addEventListener('load', () => {
    const loader = document.getElementById('loading-screen');
    if (loader) {
        setTimeout(() => {
            loader.classList.add('opacity-0', 'pointer-events-none');
            setTimeout(() => loader.remove(), 1000); 
        }, 2000); 
    }
});

let discoveredFusions = JSON.parse(localStorage.getItem('nahvvatzal_fusions')) || {};
let allFusionsData = {}; 

function initFusionsData() {
    for (const el1 in elementalData.combinations) {
        for (const el2 in elementalData.combinations[el1]) {
            const fusionName = elementalData.combinations[el1][el2];
            if (!allFusionsData[fusionName]) {
                allFusionsData[fusionName] = {
                    name: fusionName,
                    parent1: el1,
                    parent2: el2,
                    color1: elementalData.baseElements[el1].color,
                    color2: elementalData.baseElements[el2].color,
                    desc: elementalData.complexElementDescriptions[fusionName] || "Descrição oculta.",
                    type: elementalData.complexElementTypes[fusionName] || "Tipo desconhecido.",
                    power: elementalData.complexElementPowers[fusionName] || "Poder oculto."
                };
            }
        }
    }
}
initFusionsData(); 

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
        audioManager.playClick(); 
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
            audioManager.playGlitch(true);
        } else {
            document.body.classList.remove('anomalia-realidade');
            audioManager.playGlitch(false);
        }
        
        const ambientGlow = document.getElementById('ambient-glow');
        if (ambientGlow) {
            ambientGlow.style.setProperty('--aura-c1', color1 || 'transparent');
            ambientGlow.style.setProperty('--aura-c2', color2 || 'transparent');
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
                    
                    audioManager.playFusion();

                    // NOVO: Sistema de gravação preparado para Diário de Campo
                    if (!discoveredFusions[complexElementName]) {
                        discoveredFusions[complexElementName] = { discovered: true, notes: "" };
                        localStorage.setItem('nahvvatzal_fusions', JSON.stringify(discoveredFusions));
                        renderComplexGrid(); 
                        const selNode = document.querySelector('#genealogy-selector button.selected-node');
                        if (selNode) renderGenealogyTree(selNode.textContent);
                    }

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

    const grimoireGrid = document.getElementById('grimoire-grid');
    Object.entries(elementalData.baseElements).forEach(([name, data]) => {
        const card = document.createElement('div');
        card.className = 'grimoire-card p-5 cursor-default self-start expanded'; 
        card.style.setProperty('--rune-color', data.color);
        
        if (name === "Ulrhtau") {
            card.classList.add("card-amaldicoado");
        }

        const conteudoIlustracao = data.imagem 
            ? `<img src="${data.imagem}" alt="Ilustração de ${name}" class="w-full h-full object-cover opacity-80 mix-blend-lighten transition-transform duration-700 group-hover:scale-110">`
            : `<i class="fas fa-gem text-4xl opacity-40 transition-transform duration-700 group-hover:scale-125" style="color: ${data.color};"></i>`;

        const detailsHtml = `
            <div class="grimoire-card-details mt-4">
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
                        </div>
                        <button class="secret-btn" data-element="${name}">???</button>
                    </div>
                </div>
            </div>
        `;
        card.innerHTML = `<div class="flex justify-between items-center"><h3 class="font-bold text-xl uppercase tracking-widest" style="color: ${data.color};">${name}</h3></div><p class="text-content-dim text-sm mt-2">${data.desc}</p>${detailsHtml}`;
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
            acquisitionMethodsContainer.querySelectorAll('button').forEach(btn => btn.classList.remove('active-filter'));
            button.classList.add('active-filter');
            narrativeText.textContent = data.mini_narrativa || "Detalhes sobre este meio de aquisição.";
            narrativeDisplay.classList.remove('hidden');
            document.querySelectorAll('#typing-classifications > div').forEach(cardDiv => {
                if (data.related.includes(cardDiv.dataset.typing)) { cardDiv.classList.add('highlight'); } else { cardDiv.classList.remove('highlight'); }
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
    // NAVEGAÇÃO DE ABAS E MODAIS
    // =========================================
    const viewAltar = document.getElementById('view-altar');
    const viewComplex = document.getElementById('view-complex');
    const viewTypings = document.getElementById('view-typings');
    const viewGenealogy = document.getElementById('view-genealogy');
    const viewBestiary = document.getElementById('view-bestiary');
    const btnOpenNations = document.getElementById('btn-open-nations');
    const viewNations = document.getElementById('view-nations');

    if(btnOpenNations) {
        btnOpenNations.addEventListener('click', () => switchView(viewAltar, viewNations));
    }

    // =========================================
    // NAÇÕES DE GIONYYL - RENDERIZAÇÃO E MODAL
    // =========================================
    const nationsGrid = document.getElementById('nations-grid');
    if (nationsGrid) {
        nationsGrid.innerHTML = '';
        nationsData.forEach((nation, index) => {
            nationsGrid.innerHTML += `
                <div class="p-6 border border-slate-800 rounded bg-[#0a0a0f]/80 hover:border-[#d69e9e]/50 hover:bg-[#1a1a24] transition-all cursor-pointer group shadow-lg flex flex-col items-center text-center" data-nation-id="${index}">
                    <div class="w-16 h-16 rounded-full bg-[#050508] border border-slate-700 flex items-center justify-center group-hover:border-[#d69e9e] transition-colors mb-4">
                        <i class="${nation.icon} text-2xl text-slate-500 group-hover:text-[#d69e9e] transition-colors"></i>
                    </div>
                    <h3 class="font-cinzel text-xl text-white uppercase tracking-widest mb-1">${nation.name}</h3>
                    <span class="text-[10px] text-[#d69e9e] uppercase tracking-widest mb-3 border border-[#d69e9e]/30 px-2 py-1 rounded bg-[#d69e9e]/5">${nation.element}</span>
                    <p class="text-sm text-slate-400 font-serif line-clamp-3">${nation.desc}</p>
                </div>
            `;
        });

        // Lógica do Modal das Nações
        const nationModal = document.getElementById('nation-modal');
        const nationModalBg = document.getElementById('nation-modal-bg');
        const closeNationBtn = document.getElementById('close-nation-modal');

        nationsGrid.addEventListener('click', (e) => {
            const card = e.target.closest('[data-nation-id]');
            if (!card) return;
            
            const index = card.dataset.nationId;
            const data = nationsData[index];

            document.getElementById('nation-modal-name').innerText = data.name;
            document.getElementById('nation-modal-element').innerText = data.element;
            document.getElementById('nation-modal-gov').innerText = data.government;
            document.getElementById('nation-modal-climate').innerText = data.climate;
            document.getElementById('nation-modal-culture').innerText = data.culture;
            document.getElementById('nation-modal-desc').innerText = data.desc;

            // Manipula a exibição da Imagem vs Ícone
            const imgEl = document.getElementById('nation-modal-image');
            const iconEl = document.getElementById('nation-modal-icon');
            if (data.image && data.image !== "") {
                imgEl.src = data.image;
                imgEl.classList.remove('hidden');
                iconEl.classList.add('hidden');
            } else {
                imgEl.classList.add('hidden');
                iconEl.className = `${data.icon} text-6xl text-slate-800 absolute transition-transform duration-500 group-hover:scale-110`;
                iconEl.classList.remove('hidden');
            }

            nationModal.classList.add('active');
        });

        if(closeNationBtn) closeNationBtn.addEventListener('click', () => nationModal.classList.remove('active'));
        if(nationModalBg) nationModalBg.addEventListener('click', () => nationModal.classList.remove('active'));
    }
    // Transição genérica de ecrãs
    function switchView(fromView, toView) {
        if(!fromView || !toView) return;
        fromView.classList.remove('active');
        setTimeout(() => {
            fromView.classList.add('hidden');
            toView.classList.remove('hidden');
            setTimeout(() => toView.classList.add('active'), 50);
        }, 500); 
    }

    // Botões de Abertura
    document.getElementById('btn-open-arquivo')?.addEventListener('click', () => switchView(viewAltar, viewComplex));
    document.getElementById('btn-open-typings')?.addEventListener('click', () => switchView(viewAltar, viewTypings));
    document.getElementById('btn-open-genealogy')?.addEventListener('click', () => switchView(viewAltar, viewGenealogy));
    document.getElementById('btn-open-bestiary')?.addEventListener('click', () => switchView(viewAltar, viewBestiary));

    // Botões de Voltar ao Altar
    document.querySelectorAll('.btn-back-altar').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const currentView = e.target.closest('.view-section');
            switchView(currentView, viewAltar);
        });
    });

    // =========================================
    // BESTIÁRIO DE GIONYYL - RENDERIZAÇÃO E MODAL
    // =========================================
    const bestiaryGrid = document.getElementById('bestiary-grid');
    if (bestiaryGrid) {
        bestiaryGrid.innerHTML = '';
        bestiaryData.forEach((creature, index) => {
            bestiaryGrid.innerHTML += `
                <div class="p-6 border border-slate-800 rounded bg-[#0a0a0f]/80 hover:border-[#d69e9e]/50 hover:bg-[#1a1a24] transition-all cursor-pointer group shadow-lg" data-bestiary-id="${index}">
                    <div class="flex items-center gap-4 mb-4">
                        <div class="w-12 h-12 rounded-full bg-[#050508] border border-slate-700 flex items-center justify-center group-hover:border-[#d69e9e] transition-colors">
                            <i class="${creature.icon || 'fas fa-skull'} text-slate-500 group-hover:text-[#d69e9e]"></i>
                        </div>
                        <h3 class="font-cinzel text-xl text-[#d69e9e] uppercase tracking-widest">${creature.name}</h3>
                    </div>
                    <p class="text-xs text-slate-500 uppercase tracking-widest mb-4"><i class="fas fa-map-marker-alt mr-1"></i> ${creature.habitat}</p>
                    <p class="text-sm text-slate-400 font-serif line-clamp-2">${creature.desc}</p>
                </div>
            `;
        });

        // Lógica de Clique e Modal do Bestiário
        const bestiaryModal = document.getElementById('bestiary-modal');
        const bestiaryModalBg = document.getElementById('bestiary-modal-bg');
        const closeBestiaryBtn = document.getElementById('close-bestiary-modal');

        bestiaryGrid.addEventListener('click', (e) => {
            const card = e.target.closest('[data-bestiary-id]');
            if (!card) return;
            
            const index = card.dataset.bestiaryId;
            const data = bestiaryData[index];

            document.getElementById('bestiary-modal-title').innerText = data.name;
            document.getElementById('bestiary-modal-habitat').innerText = data.habitat;
            document.getElementById('bestiary-modal-life').innerText = data.lifeExpectancy;
            document.getElementById('bestiary-modal-repro-rate').innerText = data.reproductionRate;
            document.getElementById('bestiary-modal-repro-method').innerText = data.reproductionMethod;
            document.getElementById('bestiary-modal-vuln').innerText = data.vulnerability;
            document.getElementById('bestiary-modal-resist').innerText = data.resistance;
            document.getElementById('bestiary-modal-peculiarity').innerText = data.peculiarity;
            document.getElementById('bestiary-modal-desc').innerText = data.fullDesc;

            // Manipula a exibição da Imagem vs Ícone
            const imgEl = document.getElementById('bestiary-modal-image');
            const iconEl = document.getElementById('bestiary-modal-icon');
            if (data.image) {
                imgEl.src = data.image;
                imgEl.classList.remove('hidden');
                iconEl.classList.add('hidden');
            } else {
                imgEl.classList.add('hidden');
                iconEl.className = `${data.icon || 'fas fa-spider'} text-6xl text-slate-800 absolute transition-transform duration-500 group-hover:scale-110`;
                iconEl.classList.remove('hidden');
            }

            bestiaryModal.classList.add('active');
        });

        if(closeBestiaryBtn) closeBestiaryBtn.addEventListener('click', () => bestiaryModal.classList.remove('active'));
        if(bestiaryModalBg) bestiaryModalBg.addEventListener('click', () => bestiaryModal.classList.remove('active'));
    }


    // =========================================
    // ÍNDICE DOS SÁBIOS
    // =========================================
    const complexGrid = document.getElementById('complex-grid');
    const fusionCounter = document.getElementById('fusion-counter');

    function renderComplexGrid() {
        if (!complexGrid) return;
        complexGrid.innerHTML = '';
        const fusionsArray = Object.values(allFusionsData).sort((a, b) => a.name.localeCompare(b.name));
        let countUnlocked = 0;

        fusionsArray.forEach((data, index) => {
            const isDiscovered = discoveredFusions[data.name];
            if (isDiscovered) {
                countUnlocked++;
                complexGrid.innerHTML += `
                    <div class="fusion-card unlocked-fusion-card p-5 border rounded-sm flex flex-col relative overflow-hidden" style="--card-color1: ${data.color1}; border-color: ${data.color1}55;" data-fusion="${data.name}">
                        <div class="absolute top-0 right-0 bottom-0 w-48 opacity-10 pointer-events-none" style="background: linear-gradient(90deg, transparent, ${data.color1}, ${data.color2});"></div>
                        <div class="flex justify-between items-end mb-3 relative z-10">
                            <h4 class="font-cinzel text-xl text-white tracking-widest uppercase" style="text-shadow: 0 0 10px ${data.color1};">${data.name}</h4>
                            <span class="text-[9px] font-bold uppercase tracking-widest text-slate-400 bg-black/80 border border-[#2a3040] px-2 py-1 rounded">${data.parent1} + ${data.parent2}</span>
                        </div>
                        <p class="text-[#cbd5e0] text-sm font-serif relative z-10 leading-relaxed border-t border-slate-800 pt-3 opacity-60 line-clamp-2">${data.desc}</p>
                    </div>
                `;
            } else {
                complexGrid.innerHTML += `
                    <div class="locked-card p-5 rounded-sm flex flex-col items-center justify-center relative overflow-hidden h-36 opacity-60">
                        <span class="absolute top-2 left-2 text-[10px] text-slate-700 font-mono">#${(index + 1).toString().padStart(3, '0')}</span>
                        <i class="fas fa-lock text-3xl text-[#2a3040] mb-3"></i>
                        <h4 class="font-cinzel text-sm text-[#4a5568] tracking-widest uppercase">Essência Selada</h4>
                    </div>
                `;
            }
        });
        if (fusionCounter) fusionCounter.innerText = countUnlocked;
    }
    renderComplexGrid();

    // =========================================
    // ÁRVORE DE GENEALOGIA ELEMENTAL
    // =========================================
    const genealogySelector = document.getElementById('genealogy-selector');
    const genealogyTree = document.getElementById('genealogy-tree');

    function renderGenealogySelectors() {
        if (!genealogySelector) return;
        genealogySelector.innerHTML = '';
        Object.keys(elementalData.baseElements).forEach(name => {
            const data = elementalData.baseElements[name];
            const btn = document.createElement('button');
            btn.className = 'px-4 py-2 border border-slate-700 rounded font-cinzel text-sm uppercase tracking-widest text-slate-400 hover:text-white transition-all';
            btn.textContent = name;
            
            btn.addEventListener('mouseenter', () => {
                btn.style.borderColor = data.color;
                btn.style.textShadow = `0 0 8px ${data.color}`;
            });
            btn.addEventListener('mouseleave', () => {
                if(!btn.classList.contains('selected-node')) {
                    btn.style.borderColor = '#334155'; 
                    btn.style.textShadow = 'none';
                }
            });
            btn.addEventListener('click', () => {
                Array.from(genealogySelector.children).forEach(child => {
                    child.classList.remove('selected-node');
                    child.style.borderColor = '#334155';
                    child.style.textShadow = 'none';
                    child.style.backgroundColor = 'transparent';
                });
                btn.classList.add('selected-node');
                btn.style.borderColor = data.color;
                btn.style.textShadow = `0 0 8px ${data.color}`;
                btn.style.backgroundColor = `${data.color}22`; 
                
                renderGenealogyTree(name);
            });
            genealogySelector.appendChild(btn);
        });
    }

    function renderGenealogyTree(baseElementName) {
        if (!genealogyTree) return;
        const baseData = elementalData.baseElements[baseElementName];
        const combos = elementalData.combinations[baseElementName];

        let html = `
            <div class="flex flex-col items-center w-full relative z-10">
                <div class="genealogy-center-node p-8 border-2 rounded-full mb-16 flex flex-col items-center justify-center shadow-[0_0_30px_rgba(0,0,0,0.8)] z-20 bg-[#050508] relative" style="border-color: ${baseData.color}; box-shadow: 0 0 50px ${baseData.color}44; --node-color: ${baseData.color};">
                    <h3 class="font-cinzel text-4xl font-bold uppercase tracking-widest" style="color: ${baseData.color}; text-shadow: 0 0 15px ${baseData.color};">${baseElementName}</h3>
                    <span class="text-xs text-slate-400 mt-2 tracking-[0.3em] uppercase">Matriz Primordial</span>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full relative">
        `;

        let delay = 0;
        for (const [otherBase, complexName] of Object.entries(combos)) {
            const isDiscovered = discoveredFusions[complexName];
            const otherData = elementalData.baseElements[otherBase];
            const complexData = allFusionsData[complexName] || { color1: baseData.color, color2: otherData.color, type: "Desconhecido" };

            if (isDiscovered) {
                html += `
                    <div class="genealogy-branch p-5 border rounded bg-[#0a0a0f]/90 flex flex-col items-center text-center transition-all relative overflow-hidden group cursor-pointer hover:border-[${complexData.color1}]" style="border-color: ${complexData.color1}55; animation-delay: ${delay}ms;" data-fusion="${complexName}">
                        <div class="absolute inset-0 opacity-10 group-hover:opacity-30 transition-opacity duration-500" style="background: linear-gradient(135deg, ${complexData.color1}, ${complexData.color2});"></div>
                        <div class="flex items-center justify-center gap-2 mb-4 z-10">
                            <span class="text-[10px] uppercase tracking-widest text-slate-500">Fundido com</span>
                            <span class="font-cinzel font-bold text-sm" style="color: ${otherData.color}; text-shadow: 0 0 5px ${otherData.color};">${otherBase}</span>
                        </div>
                        <i class="fas fa-arrow-down text-slate-600 mb-4 text-xs opacity-50 z-10"></i>
                        <h4 class="font-cinzel text-xl text-white tracking-widest uppercase mb-2 z-10">${complexName}</h4>
                        <span class="text-[9px] uppercase tracking-widest text-slate-400 border border-slate-700 px-2 py-1 rounded bg-black/50 z-10">${complexData.type.split('.')[0]}</span>
                    </div>
                `;
            } else {
                html += `
                    <div class="genealogy-branch p-5 border border-slate-800 border-dashed rounded bg-[#050508]/50 flex flex-col items-center justify-center text-center opacity-40" style="animation-delay: ${delay}ms;">
                        <i class="fas fa-lock text-2xl text-slate-700 mb-3"></i>
                        <span class="text-[10px] text-slate-500 font-cinzel tracking-widest uppercase">Descendência Selada</span>
                        <div class="mt-2 text-[8px] text-slate-700 font-mono tracking-widest">Requer ${otherBase}</div>
                    </div>
                `;
            }
            delay += 50;
        }
        html += `</div></div>`;
        genealogyTree.innerHTML = html;
        
        const unlockedBranches = genealogyTree.querySelectorAll('.genealogy-branch[data-fusion]');
        unlockedBranches.forEach(branch => {
            branch.addEventListener('click', () => {
                const fusionName = branch.dataset.fusion;
                openMajesticScroll(fusionName);
            });
        });
    }
    renderGenealogySelectors();

    // =========================================
    // LÓGICA DO MODAL MAJESTOSO DAS FUSÕES E DIÁRIO
    // =========================================
    const fusionModal = document.getElementById('fusion-modal');
    const fusionModalBg = document.getElementById('fusion-modal-bg');
    const closeFusionBtn = document.getElementById('close-fusion-modal');
    const fusionModalContent = document.getElementById('fusion-modal-content');
    
    function openMajesticScroll(fusionName) {
        const data = allFusionsData[fusionName];
        if (!data) return;
        
        document.getElementById('fusion-modal-title').innerText = data.name;
        document.getElementById('fusion-modal-parents').innerText = `${data.parent1} + ${data.parent2}`;
        document.getElementById('fusion-modal-desc-content').innerText = data.desc;
        document.getElementById('fusion-modal-type-content').innerText = data.type;
        document.getElementById('fusion-modal-power-content').innerText = data.power;
        
        // CARREGA AS ANOTAÇÕES DO ALQUIMISTA
        const savedData = discoveredFusions[fusionName];
        const notesField = document.getElementById('fusion-notes');
        
        if (notesField) {
            // Retrocompatibilidade
            if (typeof savedData === 'boolean') {
                discoveredFusions[fusionName] = { discovered: true, notes: "" };
            }
            notesField.value = discoveredFusions[fusionName].notes || "";
            // Atrela a fusão atual ao botão de salvar
            const saveNotesBtn = document.getElementById('save-notes-btn');
            if (saveNotesBtn) saveNotesBtn.dataset.fusionTarget = fusionName;
        }
        
        fusionModalContent.style.setProperty('--modal-c1', data.color1);
        fusionModalContent.style.setProperty('--modal-c2', data.color2);
        fusionModal.classList.add('active');
    }

    // AÇÃO DE SALVAR ANOTAÇÕES DO DIÁRIO
    const saveNotesBtn = document.getElementById('save-notes-btn');
    if (saveNotesBtn) {
        saveNotesBtn.addEventListener('click', () => {
            const targetFusion = saveNotesBtn.dataset.fusionTarget;
            const textContent = document.getElementById('fusion-notes').value;
            
            if(typeof discoveredFusions[targetFusion] === 'boolean') {
                discoveredFusions[targetFusion] = { discovered: true, notes: textContent };
            } else {
                discoveredFusions[targetFusion].notes = textContent;
            }
            
            localStorage.setItem('nahvvatzal_fusions', JSON.stringify(discoveredFusions));
            
            const feedback = document.getElementById('save-feedback');
            if(feedback) {
                feedback.style.opacity = '1';
                setTimeout(() => feedback.style.opacity = '0', 2500);
            }
        });
    }

    if (complexGrid) {
        complexGrid.addEventListener('click', (e) => {
            const card = e.target.closest('.unlocked-fusion-card');
            if (card) openMajesticScroll(card.dataset.fusion);
        });
    }
    
    if (fusionModal) {
        closeFusionBtn.addEventListener('click', () => fusionModal.classList.remove('active'));
        fusionModalBg.addEventListener('click', () => fusionModal.classList.remove('active'));
    }

    // =========================================
    // LÓGICA DA JANELA SECRETA (EASTER EGGS DE HORROR)
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
                if (index < iterations / (maxIterations / finalString.length)) return finalString[index]; 
                return chars[Math.floor(Math.random() * chars.length)]; 
            }).join('');
            iterations++;
            if (iterations >= maxIterations) { clearInterval(interval); element.innerText = finalString; }
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
                if (char === " " || char === "\n") result += char; 
                else result += chars[Math.floor(Math.random() * chars.length)]; 
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
