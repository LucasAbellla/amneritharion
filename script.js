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

// =====================================
// DADOS EXTERNOS
// Os objetos abaixo foram movidos para /data/*.js.
// Garanta que os arquivos de dados sejam carregados no index.html antes deste script.
// =====================================
const elementalData = window.elementalData;
const bestiaryData = window.bestiaryData;
const nationsData = window.nationsData;
const relicsData = window.relicsData;
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
    for (const [el1, combinations] of Object.entries(elementalData.combinations)) {
        for (const [el2, fusionName] of Object.entries(combinations)) {
            if (!allFusionsData[fusionName]) {
                let mech = elementalData.complexElementMechanics["default"] || "Mecânica desconhecida.";
                if(elementalData.complexElementMechanics[fusionName]) {
                    mech = elementalData.complexElementMechanics[fusionName];
                }
                allFusionsData[fusionName] = {
                    name: fusionName,
                    parent1: el1,
                    parent2: el2,
                    color1: elementalData.baseElements[el1].color,
                    color2: elementalData.baseElements[el2].color,
                    desc: elementalData.complexElementDescriptions[fusionName] || "Descrição oculta.",
                    type: elementalData.complexElementTypes[fusionName] || "Tipo desconhecido.",
                    power: elementalData.complexElementPowers[fusionName] || "Poder oculto.",
                    mechanics: mech
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
                        <button class="secret-btn" style="--rune-color: ${data.color};" data-element="${name}">???</button>
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
    const viewNations = document.getElementById('view-nations');
    const viewRelics = document.getElementById('view-relics');
    
    function switchView(fromView, toView) {
        if(!fromView || !toView) return;
        fromView.classList.remove('active');
        setTimeout(() => {
            fromView.classList.add('hidden');
            toView.classList.remove('hidden');
            setTimeout(() => toView.classList.add('active'), 50);
        }, 500); 
    }

    document.getElementById('btn-open-arquivo')?.addEventListener('click', () => switchView(viewAltar, viewComplex));
    document.getElementById('btn-open-typings')?.addEventListener('click', () => switchView(viewAltar, viewTypings));
    document.getElementById('btn-open-genealogy')?.addEventListener('click', () => switchView(viewAltar, viewGenealogy));
    document.getElementById('btn-open-bestiary')?.addEventListener('click', () => switchView(viewAltar, viewBestiary));
    document.getElementById('btn-open-nations')?.addEventListener('click', () => switchView(viewAltar, viewNations));
    document.getElementById('btn-open-relics')?.addEventListener('click', () => switchView(viewAltar, viewRelics));

    document.querySelectorAll('.btn-back-altar').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const currentView = e.target.closest('.view-section');
            switchView(currentView, viewAltar);
        });
    });

    // =========================================
    // RELÍQUIAS
    // =========================================
    const relicsGrid = document.getElementById('relics-grid');
    if (relicsGrid) {
        relicsGrid.innerHTML = '';
        relicsData.forEach((relic, index) => {
            relicsGrid.innerHTML += `
                <div class="relic-card p-6 flex flex-col items-center text-center shadow-lg rounded-sm" data-relic-id="${index}" style="--relic-color: ${relic.color};">
                    <div class="w-16 h-16 rounded-full border flex items-center justify-center mb-4 transition-colors bg-[#050508] relative z-10" style="border-color: ${relic.color}55;">
                        <i class="${relic.icon} text-2xl" style="color: ${relic.color};"></i>
                    </div>
                    <h3 class="font-cinzel text-xl text-white uppercase tracking-widest mb-2 relative z-10" style="text-shadow: 0 0 10px ${relic.color}55;">${relic.name}</h3>
                    <span class="text-[10px] uppercase tracking-widest text-slate-400 mb-4 bg-black/50 border border-slate-700 px-2 py-1 rounded relative z-10">${relic.theme}</span>
                    <p class="text-sm text-slate-500 font-serif line-clamp-2 italic relative z-10">${relic.lore}</p>
                </div>
            `;
        });

        const relicModal = document.getElementById('relic-modal');
        const relicModalBg = document.getElementById('relic-modal-bg');
        const closeRelicBtn = document.getElementById('close-relic-modal');
        const relicModalContent = document.getElementById('relic-modal-content');

        relicsGrid.addEventListener('click', (e) => {
            const card = e.target.closest('.relic-card');
            if (!card) return;
            
            const index = card.dataset.relicId;
            const data = relicsData[index];

            document.getElementById('relic-modal-title').innerText = data.name;
            
            relicModalContent.style.setProperty('--relic-color', data.color);
            
            document.getElementById('relic-modal-theme').innerText = data.theme;
            document.getElementById('relic-modal-lore').innerText = `"${data.lore}"`;
            
            document.getElementById('relic-modal-2pc').innerText = data.bonuses["2"];
            document.getElementById('relic-modal-4pc').innerText = data.bonuses["4"];
            document.getElementById('relic-modal-6pc').innerText = data.bonuses["6"];

            const imgEl = document.getElementById('relic-modal-image');
            const iconEl = document.getElementById('relic-modal-icon');
            if (data.image && data.image !== "") {
                imgEl.src = data.image;
                imgEl.classList.remove('hidden');
                iconEl.classList.add('hidden');
            } else {
                imgEl.classList.add('hidden');
                iconEl.className = `${data.icon} text-5xl transition-transform duration-500 relative z-10`;
                iconEl.style.color = data.color;
                iconEl.classList.remove('hidden');
            }

            relicModal.classList.add('active');
        });

        if(closeRelicBtn) closeRelicBtn.addEventListener('click', () => relicModal.classList.remove('active'));
        if(relicModalBg) relicModalBg.addEventListener('click', () => relicModal.classList.remove('active'));
    }

    // =========================================
    // BESTIÁRIO DE GIONYYL
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

            const imgEl = document.getElementById('bestiary-modal-image');
            const iconEl = document.getElementById('bestiary-modal-icon');
            if (data.image && data.image !== "") {
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
    // NAÇÕES DE GIONYYL
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

        const nationModal = document.getElementById('nation-modal');
        const nationModalBg = document.getElementById('nation-modal-bg');
        const closeNationBtn = document.getElementById('close-nation-modal');
        const nationModalContent = document.getElementById('nation-modal-content');

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

            const primaryElement = data.element.split(',')[0].trim();
            const elemColor = elementalData.baseElements[primaryElement] ? elementalData.baseElements[primaryElement].color : '#d69e9e';
            
            nationModalContent.style.setProperty('--nation-color', elemColor);

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
                    <div class="fusion-card unlocked-fusion-card p-5 border rounded-sm flex flex-col relative overflow-hidden cursor-pointer" style="--card-color1: ${data.color1}; border-color: ${data.color1}55;" data-fusion="${data.name}">
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
                    <div class="locked-card p-5 border border-slate-800 rounded-sm flex flex-col items-center justify-center relative overflow-hidden h-36 opacity-60">
                        <span class="absolute top-2 left-2 text-[10px] text-slate-700 font-mono">#${(index + 1).toString().padStart(3, '0')}</span>
                        <i class="fas fa-lock text-3xl text-slate-700 mb-3"></i>
                        <h4 class="font-cinzel text-sm text-slate-500 tracking-widest uppercase">Essência Selada</h4>
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
        const combos = elementalData.combinations[baseElementName] || {};

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
    // DESCRIÇÃO ENCICLOPÉDICA DAS FUSÕES
    // =========================================
    const fusionElementProfiles = {
        "Flama": {
            natureza: "calor, combustão, impulso e pressão ofensiva",
            funcao: "acelera a matéria, intensifica reações e converte energia em ruptura térmica",
            aplicacao: "forjas rituais, purificação por fogo, ofensivas diretas e destruição controlada",
            risco: "pode consumir oxigênio, memória corporal e estabilidade emocional quando mantida por tempo demais"
        },
        "Aqua": {
            natureza: "fluxo, adaptação, cura, afogamento e memória líquida",
            funcao: "redistribui energia, regula estados vitais e conduz alterações internas",
            aplicacao: "tratamentos, manipulação de pressão, travessias, selamentos fluidos e controle de terreno",
            risco: "pode diluir identidades mágicas, afogar sinais vitais ou tornar a matriz instável por excesso de oscilação"
        },
        "Eol": {
            natureza: "movimento, dispersão, velocidade, respiração e liberdade direcional",
            funcao: "carrega, espalha, amplia alcance e altera trajetória de outras essências",
            aplicacao: "mobilidade, propagação de efeitos, barreiras de vento, leitura de correntes e evasão",
            risco: "pode fragmentar conjurações, espalhar efeitos indesejados ou tornar a magia difícil de conter"
        },
        "Terrae": {
            natureza: "estrutura, peso, estabilidade, crescimento mineral e fundação",
            funcao: "dá corpo físico às essências, ancora fenômenos e aumenta resistência",
            aplicacao: "arquitetura arcana, escudos, selamentos, contenção, muralhas e alteração de relevo",
            risco: "pode petrificar fluxos, endurecer tecidos ou tornar a conjuração lenta e excessivamente rígida"
        },
        "Fulmen": {
            natureza: "descarga, impulso nervoso, tempestade, reflexo e ruptura súbita",
            funcao: "ativa respostas rápidas, energiza matéria e cria picos de instabilidade destrutiva",
            aplicacao: "sinalização, sobrecarga, interrupção de feitiços, ataque em área e condução energética",
            risco: "pode queimar nervos, cegar sentidos mágicos ou causar reações em cadeia fora do controle"
        },
        "Crelix": {
            natureza: "frio, preservação, lentidão, rigidez e suspensão de movimento",
            funcao: "reduz atividade, cristaliza formas e conserva estados antes que se decomponham",
            aplicacao: "prisões, preservação histórica, armas cristalinas, selos de estase e controle de temperatura",
            risco: "pode paralisar processos vitais, congelar intenções mágicas ou interromper ciclos naturais"
        },
        "Lux": {
            natureza: "revelação, presença, refração, cura leve e exposição de verdades",
            funcao: "torna visível o oculto, purifica impurezas superficiais e direciona energia com precisão",
            aplicacao: "diagnóstico, iluminação ritual, dissipação de sombras, prismas, selos e leitura de inscrições",
            risco: "pode expor segredos, queimar imperfeições ou tornar uma presença impossível de ocultar"
        },
        "Umbra": {
            natureza: "ausência, silêncio, ocultação, medo ancestral e profundidade",
            funcao: "absorve sinais, cria zonas de ocultamento e dobra a percepção ao redor da matéria",
            aplicacao: "furtividade, proteção de arquivos, rituais noturnos, apagamento de rastros e travessia por sombras",
            risco: "pode isolar sentidos, alimentar paranoia ou abrir espaço para ecos que não pertencem ao conjurador"
        },
        "Vitae": {
            natureza: "vida, crescimento, invocação, regeneração e instinto orgânico",
            funcao: "estimula células, desperta organismos e acelera ciclos biológicos",
            aplicacao: "cura viva, botânica arcana, pactos com fauna, crescimento de matéria orgânica e restauração",
            risco: "pode gerar crescimento desordenado, simbiose indesejada ou multiplicação de tecidos instáveis"
        },
        "Toxi": {
            natureza: "degradação, doença, corrosão, veneno e mutação inevitável",
            funcao: "quebra estruturas, contamina fluxos e transforma matéria por desgaste progressivo",
            aplicacao: "alquimia, antídotos, venenos, deterioração controlada, estudo de pragas e guerra química arcana",
            risco: "pode contaminar o usuário, persistir no ambiente ou converter cura em vetor de doença"
        },
        "Vis": {
            natureza: "força bruta, cinética, pressão, potencial e energia sem forma",
            funcao: "amplifica impacto, empurra limites físicos e converte intenção em potência direta",
            aplicacao: "telecinese, impacto, compressão, deslocamento, reforço físico e ruptura de barreiras",
            risco: "pode distorcer ossos, romper contenções ou transformar pequenas falhas em colapsos violentos"
        }
    };

    const fusionTypeExplanations = {
        "Combinatória": "Forma uma essência relativamente estável. A fusão cria uma nova matriz, com identidade própria, que pode ser estudada como fenômeno independente.",
        "Reacionária": "Surge do choque entre matrizes. A fusão tende a acontecer como efeito, explosão, descarga, dispersão ou transformação momentânea, sendo mais instável e contextual."
    };

    function escapeHTML(value) {
        return String(value ?? '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function normalizeFusionType(typeText) {
        return String(typeText || 'Tipo desconhecido').replace('.', '').trim();
    }

    function normalizePower(powerText) {
        return String(powerText || 'Poder não catalogado')
            .replace('Nível de Poder:', '')
            .replace('.', '')
            .trim();
    }

    function getPowerReading(powerLabel) {
        const readings = {
            "Baixo": "efeito localizado, útil para registros simples, práticas iniciais e fenômenos de baixa escala",
            "Médio": "efeito consistente, com utilidade prática e boa presença em rituais, ofícios ou conflitos limitados",
            "Alto": "efeito intenso, capaz de alterar o ambiente, pressionar defesas e mudar o curso de uma situação",
            "Muito Alto": "fenômeno de grande impacto, normalmente associado a destruição ampla, alterações ambientais ou uso especializado",
            "Extremo": "manifestação rara e perigosa, próxima de fenômenos catastróficos, proibidos ou de escala histórica"
        };
        return readings[powerLabel] || "efeito ainda sem escala totalmente definida nos registros do Amneritharion";
    }

    function getElementProfile(elementName) {
        return fusionElementProfiles[elementName] || {
            natureza: "natureza ainda não catalogada",
            funcao: "atua de modo pouco documentado",
            aplicacao: "aplicações ainda em estudo",
            risco: "riscos ainda não documentados"
        };
    }

    function cleanMechanicRecord(mechanicsText) {
        const defaultText = elementalData?.complexElementMechanics?.default || '';
        if (!mechanicsText || mechanicsText === defaultText) return "Sem anotação individual antiga. A leitura abaixo foi organizada a partir das matrizes elementais, do tipo mágico e do nível de poder registrado.";

        return String(mechanicsText)
            .split('\n')
            .map(line => line.trim())
            .filter(line => line && !line.includes('Custo de AP') && !line.includes('Custo de MP'))
            .map(line => line
                .replace(/^🔸\s*/g, '')
                .replace(/^Dano:\s*/i, 'Manifestação registrada: ')
                .replace(/^Efeito:\s*/i, '')
            )
            .join(' ');
    }

    function buildFusionTags(data, profile1, profile2) {
        const source1 = elementalData.baseElements[data.parent1]?.manifestacoes || [];
        const source2 = elementalData.baseElements[data.parent2]?.manifestacoes || [];
        const tags = [
            normalizeFusionType(data.type),
            normalizePower(data.power),
            ...source1.slice(0, 2),
            ...source2.slice(0, 2)
        ];
        return [...new Set(tags)].filter(Boolean).slice(0, 8);
    }

    function getFusionBehavior(data, profile1, profile2, typeLabel, powerLabel) {
        const sameElement = data.parent1 === data.parent2;
        const isDispersal = data.name.toLowerCase().includes('dispersão');

        if (isDispersal) {
            const dispersed = data.parent1 === 'Eol' ? data.parent2 : data.parent1;
            const dispersedProfile = getElementProfile(dispersed);
            return `A fusão funciona como uma técnica de espalhamento: Eol não substitui a essência de ${dispersed}, mas a carrega pelo espaço, abrindo o raio de influência da matriz. Na prática enciclopédica, ${data.name} é entendida como ${dispersedProfile.natureza} projetada por correntes de movimento, criando alcance, contágio direcional e pressão sobre vários pontos do ambiente.`;
        }

        if (sameElement) {
            return `${data.name} representa a saturação de ${data.parent1}: não é uma mistura entre forças diferentes, mas a mesma matriz comprimida até revelar uma forma superior. Seu comportamento principal é intensificar ${profile1.natureza}, transformando uma essência comum em um estado mais denso, simbólico e difícil de desfazer.`;
        }

        if (typeLabel === 'Reacionária') {
            return `${data.name} acontece quando ${data.parent1} e ${data.parent2} entram em atrito. ${data.parent1} fornece ${profile1.funcao}; ${data.parent2} acrescenta ${profile2.funcao}. O resultado não costuma permanecer estável por muito tempo: manifesta-se como reação, ruptura, descarga ou alteração brusca do ambiente.`;
        }

        return `${data.name} nasce da integração entre ${data.parent1} e ${data.parent2}. ${data.parent1} contribui com ${profile1.natureza}; ${data.parent2} estrutura a fusão por meio de ${profile2.natureza}. Por ser combinatória, tende a formar uma essência reconhecível, com comportamento próprio e possível uso recorrente dentro dos registros de Ecliptari.`;
    }

    function getFusionApplications(data, profile1, profile2, typeLabel) {
        const sameElement = data.parent1 === data.parent2;
        if (sameElement) {
            return `Aplicada principalmente quando se deseja levar ${data.parent1} ao limite: ${profile1.aplicacao}. Em registros de mundo, esse tipo de fusão costuma aparecer como técnica de mestres, rituais nacionais ou fenômenos raros ligados à matriz original.`;
        }

        if (typeLabel === 'Reacionária') {
            return `Serve melhor para situações em que a mudança precisa ser rápida: interrupção, resposta imediata, transformação de campo ou desencadeamento de uma consequência arcana. Une usos de ${data.parent1}, como ${profile1.aplicacao}, com propriedades de ${data.parent2}, como ${profile2.aplicacao}.`;
        }

        return `Pode ser documentada como essência de uso contínuo: ${profile1.aplicacao}; ${profile2.aplicacao}. Por formar uma matriz mais estável, também pode aparecer em arquitetura arcana, relíquias, fauna adaptada, tradições regionais ou técnicas transmitidas por linhagens.`;
    }

    function getFusionRisks(data, profile1, profile2, typeLabel, powerLabel) {
        const intensity = ['Muito Alto', 'Extremo'].includes(powerLabel)
            ? 'Por estar em escala elevada, exige contenção rigorosa e costuma deixar resíduos mágicos difíceis de apagar.'
            : 'Mesmo em escala menor, exige leitura correta das matrizes para evitar efeitos secundários.';

        if (data.parent1 === data.parent2) {
            return `${intensity} O maior risco vem da saturação: ${profile1.risco}.`;
        }

        if (typeLabel === 'Reacionária') {
            return `${intensity} Como reação, pode ocorrer fora do tempo desejado ou em cadeia. Os riscos principais vêm de ${data.parent1}, que ${profile1.risco}, e de ${data.parent2}, que ${profile2.risco}.`;
        }

        return `${intensity} Como combinação, tende a ser mais previsível, mas pode fixar defeitos na própria essência. Os riscos herdados são: ${profile1.risco}; ${profile2.risco}.`;
    }

    function renderFusionCard(title, icon, body, accent, full = false) {
        return `
            <section class="fusion-explanation-card ${full ? 'full' : ''}" style="--accent-color: ${accent};">
                <h3 class="fusion-explanation-title"><i class="${icon}"></i>${escapeHTML(title)}</h3>
                <div class="fusion-explanation-body">${body}</div>
            </section>
        `;
    }

    function buildFusionExplanation(data) {
        const profile1 = getElementProfile(data.parent1);
        const profile2 = getElementProfile(data.parent2);
        const typeLabel = normalizeFusionType(data.type);
        const powerLabel = normalizePower(data.power);
        const tags = buildFusionTags(data, profile1, profile2);
        const behavior = getFusionBehavior(data, profile1, profile2, typeLabel, powerLabel);
        const applications = getFusionApplications(data, profile1, profile2, typeLabel);
        const risks = getFusionRisks(data, profile1, profile2, typeLabel, powerLabel);
        const record = cleanMechanicRecord(data.mechanics);
        const typeExplanation = fusionTypeExplanations[typeLabel] || 'Classificação ainda em revisão nos arquivos do Amneritharion.';
        const powerReading = getPowerReading(powerLabel);

        const relationLines = `
            <div class="fusion-relation-line">
                <div class="fusion-relation-name">${escapeHTML(data.parent1)}</div>
                <div class="fusion-relation-text">${escapeHTML(profile1.natureza)}.</div>
            </div>
            <div class="fusion-relation-line">
                <div class="fusion-relation-name">${escapeHTML(data.parent2)}</div>
                <div class="fusion-relation-text">${escapeHTML(data.parent1 === data.parent2 ? 'Reforça e satura a mesma matriz, criando um estado superior da essência.' : profile2.natureza + '.')}</div>
            </div>
            <div class="fusion-relation-line">
                <div class="fusion-relation-name">Resultado</div>
                <div class="fusion-relation-text">${escapeHTML(data.desc)}</div>
            </div>
        `;

        const tagHtml = `<div class="fusion-tags">${tags.map(tag => `<span class="fusion-tag">${escapeHTML(tag)}</span>`).join('')}</div>`;

        return `
            ${renderFusionCard('Síntese enciclopédica', 'fas fa-feather-alt', `<strong>${escapeHTML(data.name)}</strong> é registrada como uma fusão <strong>${escapeHTML(typeLabel)}</strong> de poder <strong>${escapeHTML(powerLabel)}</strong>. ${escapeHTML(data.desc)}`, data.color1, true)}
            ${renderFusionCard('Como a fusão atua', 'fas fa-atom', escapeHTML(behavior), data.color1)}
            ${renderFusionCard('Aplicações conhecidas', 'fas fa-compass', escapeHTML(applications), data.color2)}
            ${renderFusionCard('Classificação e escala', 'fas fa-layer-group', `<p><strong>${escapeHTML(typeLabel)}:</strong> ${escapeHTML(typeExplanation)}</p><p class="mt-3"><strong>Escala ${escapeHTML(powerLabel)}:</strong> ${escapeHTML(powerReading)}.</p>`, data.color1)}
            ${renderFusionCard('Limitações e riscos', 'fas fa-triangle-exclamation', escapeHTML(risks), data.color2)}
            ${renderFusionCard('Matrizes envolvidas', 'fas fa-project-diagram', relationLines, data.color1, true)}
            ${renderFusionCard('Marcadores de consulta', 'fas fa-tags', tagHtml, data.color2)}
            ${renderFusionCard('Registro técnico anterior', 'fas fa-book-open', escapeHTML(record), data.color1)}
        `;
    }

    // =========================================
    // LÓGICA DO MODAL MAJESTOSO DAS FUSÕES
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

        document.getElementById('fusion-modal-mechanics-content').innerHTML = buildFusionExplanation(data);
        
        const savedData = discoveredFusions[fusionName];
        const notesField = document.getElementById('fusion-notes');
        
        if (notesField) {
            if (typeof savedData === 'boolean') {
                discoveredFusions[fusionName] = { discovered: true, notes: "" };
            }
            notesField.value = discoveredFusions[fusionName].notes || "";
            const saveNotesBtn = document.getElementById('save-notes-btn');
            if (saveNotesBtn) saveNotesBtn.dataset.fusionTarget = fusionName;
        }
        
        fusionModalContent.style.setProperty('--modal-c1', data.color1);
        fusionModalContent.style.setProperty('--modal-c2', data.color2);
        fusionModal.classList.add('active');
    }

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
    const secretModalContent = document.getElementById('secret-modal-content');
    const whispersContainer = document.getElementById('creepy-whispers-container');
    
    let activeGlitchIntervals = [];
    let whisperInterval;

    const creepyPhrases = [
        "ELES VÊM", "A DOR É INFINITA", "NÃO HÁ LUZ AQUI", "A PEDRA SANGRA", 
        "FECHE OS OLHOS", "ULRHTAU DESPERTA", "ESQUEÇA O SEU NOME", "TUDO QUEIMA",
        "O VAZIO FALA", "A CULPA É SUA"
    ];

    function clearAllIntervals() {
        activeGlitchIntervals.forEach(clearInterval);
        activeGlitchIntervals = [];
        clearInterval(whisperInterval);
        if(whispersContainer) whispersContainer.innerHTML = '';
    }

    function spawnWhispers() {
        if(!whispersContainer) return;
        whisperInterval = setInterval(() => {
            const whisper = document.createElement('div');
            whisper.className = 'creepy-whisper text-red-800/20 text-xs font-mono absolute whitespace-nowrap pointer-events-none';
            whisper.innerText = creepyPhrases[Math.floor(Math.random() * creepyPhrases.length)];
            
            whisper.style.left = `${Math.random() * 80 + 10}%`;
            whisper.style.top = `${Math.random() * 80 + 10}%`;
            
            const rot = (Math.random() * 40) - 20;
            whisper.style.transform = `rotate(${rot}deg)`;
            
            whispersContainer.appendChild(whisper);
            setTimeout(() => whisper.remove(), 4000);
        }, 1500); 
    }

    function scrambleTextEldritch(element, finalString, duration) {
        if (!element || !finalString) return;
        const chars = "⍙⎍⍜⍎⍑⍋⍝⍯⍮⍫⍡⍪⍤⍥⍨⍢⍣⍗⍒⍞⍟§‡ℵ¥ØѼ☠☢☣";
        let iterations = 0;
        const maxIterations = duration / 30; 
        element.innerText = ""; 
        
        const resolveInterval = setInterval(() => {
            element.innerText = finalString.split('').map((letter, index) => {
                if (letter === " " || letter === "\n") return letter; 
                if (index < iterations / (maxIterations / finalString.length)) return finalString[index]; 
                return chars[Math.floor(Math.random() * chars.length)]; 
            }).join('');
            iterations++;
            
            if (iterations >= maxIterations) { 
                clearInterval(resolveInterval); 
                element.innerText = finalString; 
                
                const curseInterval = setInterval(() => {
                    if(Math.random() > 0.8) { 
                        const arr = finalString.split('');
                        const randIdx = Math.floor(Math.random() * arr.length);
                        if(arr[randIdx] !== " ") arr[randIdx] = chars[Math.floor(Math.random() * chars.length)];
                        element.innerText = arr.join('');
                        setTimeout(() => { element.innerText = finalString; }, 100);
                    }
                }, 200);
                activeGlitchIntervals.push(curseInterval);
            }
        }, 30);
        activeGlitchIntervals.push(resolveInterval);
    }

    function animateEye(element) {
        if (!element) return;
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
        const chars = "⍙⎍⍜⍎⍑⍋⍝⍯⍮⍫⍡⍪⍤⍥⍨⍢⍣⍗⍒⍞⍟§‡ℵX";
        const interval = setInterval(() => {
            let result = "";
            for(let i=0; i<template.length; i++) {
                const char = template[i];
                if (char === " " || char === "\n") result += char; 
                else result += chars[Math.floor(Math.random() * chars.length)]; 
            }
            element.innerText = result;
        }, 30); 
        activeGlitchIntervals.push(interval);
    }

    if(secretModal) {
        function openSecretModal(elementName, data) {
            clearAllIntervals(); 
            audioManager.playGlitch(true);

            const glitchOverlay = document.getElementById('intro-glitch-overlay');
            const glitchText = document.getElementById('intro-glitch-text');
            if(glitchOverlay) glitchOverlay.classList.add('active');
            if(glitchText) glitchText.classList.add('violent-glitch-text');
            
            let garbage = "";
            const chars = "⍙⎍⍜⍎⍑⍋⍝⍯⍮⍫⍡⍪⍤⍥⍨⍢⍣⍗⍒⍞⍟§‡ℵ¥ØѼ☠☢☣01ERRO";
            for(let i=0; i<3000; i++) garbage += chars[Math.floor(Math.random() * chars.length)];
            if(glitchText) glitchText.innerText = garbage;

            const introInterval = setInterval(() => {
                if(!glitchText) return;
                const arr = glitchText.innerText.split('');
                for(let i=0; i<150; i++) arr[Math.floor(Math.random() * arr.length)] = chars[Math.floor(Math.random() * chars.length)];
                glitchText.innerText = arr.join('');
            }, 50);
            activeGlitchIntervals.push(introInterval);

            secretModalContent.style.setProperty('--modal-rune-color', data.color);
            const secretGlow = document.getElementById('secret-glow');
            if (secretGlow) secretGlow.style.backgroundColor = data.color; 
            
            const titleEl = document.getElementById('secret-modal-title');
            const subEl = document.getElementById('secret-modal-subtitle');
            const textEl = document.getElementById('secret-modal-text');

            setTimeout(() => {
                clearInterval(introInterval);
                if(glitchOverlay) glitchOverlay.classList.remove('active'); 
                secretModal.classList.add('active'); 
                
                spawnWhispers();

                if (elementName === "Ulrhtau") {
                    if (titleEl) titleEl.className = "text-5xl font-cinzel text-red-600 mb-8 tracking-[0.5em] text-center font-bold z-10 uppercase eerie-text-shadow";
                    if (subEl) subEl.innerText = "";
                    if (textEl) textEl.className = "ascii-eye mt-10";
                    scrambleTextEldritch(titleEl, "MILN JADITYL XCO", 2000);
                    animateEye(textEl);
                } else {
                    if (titleEl) {
                        titleEl.className = "text-4xl md:text-5xl font-cinzel text-[#cbd5e1] mb-6 tracking-widest text-center z-10 eerie-text-shadow";
                        titleEl.style.color = data.color;
                    }
                    if (textEl) textEl.className = "mt-6 font-medium text-justify md:text-center text-xl tracking-wide eerie-body-text"; 
                    
                    const sTitle = data.secretTitle || "REGISTOS OBSCUROS";
                    const sSub = data.secretSubtitle || "\"As páginas que a ordem tentou queimar...\"";
                    const sText = data.secretText || "Nenhum registo proibido encontrado. O vazio consumiu esta página.";
                    
                    if(titleEl) scrambleTextEldritch(titleEl, sTitle, 1000); 
                    if(subEl) scrambleTextEldritch(subEl, sSub, 2000); 
                    if(textEl) scrambleTextEldritch(textEl, sText, 3500); 
                }
            }, 800); 
        }

        function closeSecretModal() {
            secretModal.classList.remove('active');
            audioManager.playGlitch(false);
            clearAllIntervals(); 
        }
        
        secretModal.addEventListener('click', closeSecretModal);

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
