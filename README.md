# O Amneritharion

<p align="center">
  <i>Um compêndio digital interativo para explorar a história do universo de Ecliptari .</i>
</p>

---

## Sobre o Projeto

Este projeto tem como finalidade a organização de informações essenciais sobre o universo fictício de Ecliptari. Atuando como um grimório digital, a interface foi feita para melhor imersão e o entendimento de sistemas complexos, criaturas, artefatos e de todo o *worldbuilding*.

## Funcionalidades Principais

O projeto contempla em sua página inicial um altar interativo onde o usuário pode selecionar botões das "Tipagens" *(elementos básicos)*. Ao interagir com este sistema, é possível iniciar fusões e reações elementais que resultam em combinações com efeitos únicos, detalhando o tipo de dano, custos de recursos, pontos necessários e efeitos específicos.

### Exploração do Universo
Acima do altar, o projeto disponibiliza botões de navegação que exploram detalhadamente o *worldbuilding* deste universo:

* **Nações:** Detalha o funcionamento, cultura, hierarquia e demais pontos sobre as nações principais: Aethelos, Jinsei, Jövirefolnr, Lîngyù, Moroyva, Praetorium, Py'aporã, Sui-Ryong e Sur'yaal.
* **Relíquias:** Uma janela dedicada a artefatos poderosos, revelando seus visuais detalhados e mistérios ocultos através de uma interface personalizada.
* **Bestiário:** Registros detalhados das criaturas de Gionyy *(mundo onde se passa a história)*l, compreendendo anatomias complexas e núcleos biológicos vitais.
* **Árvore Genealógica das Combinações:** Um mapa visual que destrincha a origem, as ramificações e os resultados de todas as fusões mágicas.
* **Tipagens Primárias:** A essência primordial de Ecliptari. Contém as anotações detalhadas e campos específicos para descrições técnicas de cada elemento.

##  Tecnologias Utilizadas

* **HTML5 & CSS3:** Interface visual rica com fundos detalhados e estilização dinâmica para janelas de combinações.
* **JavaScript:** Lógica central para o motor do grimório, processamento de reações elementais e manipulação de dados em tempo real.
* **Node.js / Electron:** Ambiente de execução que transforma o sistema em uma aplicação desktop funcional.

##  Como Executar o Projeto

1. Certifique-se de ter o [Node.js](https://nodejs.org/) instalado.
2. Clone o repositório ou extraia os arquivos do projeto em uma pasta local.
3. Abra o terminal na pasta raiz do projeto.
4. Instale as dependências necessárias executando:
   ```bash
   npm install
   ```

5. Inicie o aplicativo em modo de desenvolvimento:
   ```bash
   npm start
   ```

## Atualizar personagens e eventos pelo código

Os personagens ficam em `data/characters-data.js` e os eventos em `data/events-data.js`. Cada novo registro deve permanecer **dentro do mesmo array**, separado do anterior por uma vírgula.

Ao iniciar, a versão 2.0 calcula uma assinatura desses arquivos. Quando o código muda, os registros do arquivo passam a prevalecer e são combinados com entradas que existam somente no Modo Autor. Não é necessário limpar o armazenamento local nem usar "Restaurar base" depois de adicionar um personagem pelo código.

Depois de salvar o arquivo no VS Code, feche a janela anterior do Electron e execute novamente:

```bash
npm start
```

## Gerar os Executáveis

Execute:

```bash
npm run build
```

A pasta `dist` receberá dois artefatos para Windows:

* o instalador NSIS, que cria atalhos e permite escolher a pasta de instalação;
* a versão portátil, que pode ser executada diretamente sem instalação.

## Versão 1.2

A versão 1.2 inicia a expansão do grimório para um compêndio narrativo completo.
Ela acrescenta o Arquivo de Personagens, pesquisa por metadados e fichas capazes
de relacionar origem, raça, afiliações, tipagens, eventos históricos e vínculos
entre personagens. Novos registros devem ser adicionados em
`data/characters-data.js`, sem necessidade de alterar a interface.

### Eventos históricos e Modo Autor

O Arquivo de Eventos registra categoria, era, data, local, participantes,
causas, consequências, nações e tipagens relacionadas. O Modo Autor permite
editar as fichas de personagens, alterar eventos existentes e cadastrar novos
eventos diretamente pelo aplicativo. As alterações ficam armazenadas no perfil
local do aplicativo e podem ser exportadas para um backup JSON.

Use **Exportar backup** após sessões de escrita. **Importar** restaura um arquivo
exportado, enquanto **Restaurar base** apaga as alterações locais e retorna ao
conteúdo distribuído nesta versão.

### Modelo de personagem

Cada personagem possui um identificador único e campos preparados para
biografia, personalidade, motivações, habilidades, relíquias, citações, notas da
autora e primeira aparição. Campos ainda não escritos recebem um marcador visual
de conteúdo pendente, sem inventar informações do universo.

## Arquivo do Universo — Versão 2.0

A versão 2.0 reúne as ferramentas narrativas avançadas em uma única área com
abas, evitando acrescentar seis novos destinos independentes ao altar.

* **Painel:** estatísticas e completude calculada pelos campos preenchidos.
* **Relações:** grafo automático a partir das relações dos personagens.
* **Genealogia:** linhagens inferidas por termos como filha, mãe, pai e esposa.
* **Leitura:** organização e escrita por arcos e capítulos no Modo Autor.
* **Galeria:** imagens e documentos copiados para o perfil local do aplicativo.
* **Descobertas:** progresso de registros abertos pelo leitor, junto às fusões.

Para escrever a história, ative o Modo Autor, abra o Arquivo do Universo e use
**Novo arco** antes de criar capítulos. O texto aceita parágrafos separados por
uma linha vazia. A Galeria usa o seletor nativo do Windows e aceita PNG, JPG,
WebP, GIF, PDF, TXT, Markdown e DOCX.

O percentual de completude não avalia a qualidade literária. Ele mede quantos
campos estruturais possuem conteúdo, servindo como guia de trabalho. Todos os
novos dados entram no backup JSON. Imagens e documentos são copiados para o
perfil local e devem ser selecionados novamente ao migrar para outro computador.

## Atlas de Gionyyl — Versão 1.4

O Atlas aceita uma ilustração-base de Gionyyl e adiciona uma camada interativa
sem modificar a imagem original. No Modo Autor, use **Selecionar imagem-base**
para escolher um PNG, JPG ou WebP. O aplicativo copia a imagem para o seu perfil
local, então o arquivo original pode ser movido depois da importação.

### Como construir o mapa

1. Desenhe apenas a geografia-base em um editor de sua preferência. Uma imagem
   horizontal em proporção aproximada de 14:9 funciona melhor; 2800 × 1800 px é
   uma boa resolução de trabalho.
2. Importe essa imagem no Atlas pelo Modo Autor.
3. Ative **Adicionar ponto** e clique na posição do local.
4. Preencha nome, tipo, camada, descrição e relações narrativas.
5. Use as camadas para separar geografia, política, história e influência
   elemental sem precisar criar várias cópias da imagem.
6. Exporte um backup pelo Modo Autor depois de cada sessão de cartografia.

Os marcadores usam coordenadas percentuais. Isso significa que eles continuam
alinhados quando a janela ou a escala do mapa mudam. O mapa oferece zoom pela
roda do mouse, deslocamento por arraste e enquadramento automático.

### Planejamento visual recomendado

Comece pela silhueta dos continentes, oceanos e grandes cadeias naturais. Em uma
segunda etapa, acrescente fronteiras e capitais. Use os marcadores do aplicativo
para cidades, ruínas, santuários, zonas de perigo e locais de eventos; assim, a
imagem-base permanece legível e as informações podem ser alteradas sem redesenho.

O backup JSON guarda camadas e marcadores. A imagem-base fica no perfil local do
aplicativo; ao transferir o projeto para outro computador, selecione novamente a
imagem depois de importar o backup.

## Estabilização 1.1

Esta versão funciona sem conexão com a internet. Tailwind CSS, Font Awesome e
as fontes Cinzel e Quattrocento Sans são distribuídos junto com o aplicativo.
O renderer do Electron usa isolamento de contexto, sandbox e uma API mínima de
preload para os controles da janela.

