(function () {
    const esc = value => String(value ?? '').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;');
    const slug = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
    const parseLines = value => value.split('\n').map(item => item.trim()).filter(Boolean);
    const fillScore = (record, fields) => fields.reduce((score, field) => { const value = record?.[field]; return score + (Array.isArray(value) ? Number(value.length > 0) : Number(Boolean(String(value || '').trim()))); }, 0);

    window.initializeUniverseHub = function initializeUniverseHub() {
        if (!window.contentStore) return;
        const root = document.getElementById('universe-hub');
        const panels = [...document.querySelectorAll('.universe-panel')];
        const tabs = [...document.querySelectorAll('[data-universe-tab]')];
        if (!root || !panels.length) return;
        let narrative = window.contentStore.getNarrative();
        let gallery = window.contentStore.getGallery();

        const showTab = id => {
            tabs.forEach(tab => tab.classList.toggle('active', tab.dataset.universeTab === id));
            panels.forEach(panel => panel.classList.toggle('active', panel.id === `universe-${id}`));
            if (id === 'dashboard') renderDashboard();
            if (id === 'relationships') setTimeout(renderGraph, 20);
            if (id === 'genealogy') renderGenealogy();
            if (id === 'reading') renderReading();
            if (id === 'gallery') renderGallery();
            if (id === 'discoveries') renderDiscoveries();
        };
        tabs.forEach(tab => tab.addEventListener('click', () => showTab(tab.dataset.universeTab)));

        const renderDashboard = () => {
            const characters = window.contentStore.getCharacters(), events = window.contentStore.getEvents(), atlas = window.contentStore.getAtlas();
            narrative = window.contentStore.getNarrative(); gallery = window.contentStore.getGallery();
            const characterFields = ['name','title','origin','race','affiliations','typings','events','relationships','biography','personality','motivations','abilities'];
            const eventFields = ['name','category','era','date','location','summary','description','causes','consequences','participants'];
            const chapterFields = ['title','arcId','summary','content'];
            const earned = characters.reduce((n,r)=>n+fillScore(r,characterFields),0) + events.reduce((n,r)=>n+fillScore(r,eventFields),0) + narrative.chapters.reduce((n,r)=>n+fillScore(r,chapterFields),0) + Number(Boolean(atlas.background.url)) + atlas.markers.length + gallery.reduce((n,r)=>n+fillScore(r,['title','description','url']),0);
            const possible = characters.length*characterFields.length + events.length*eventFields.length + narrative.chapters.length*chapterFields.length + 1 + Math.max(atlas.markers.length,1) + gallery.length*3;
            const completion = possible ? Math.round(earned/possible*100) : 0;
            document.getElementById('universe-completion-value').textContent = `${completion}%`;
            document.getElementById('universe-completion-bar').style.width = `${completion}%`;
            const stats = [
                ['fas fa-users','Personagens',characters.length], ['fas fa-hourglass-half','Eventos',events.length], ['fas fa-map-location-dot','Pontos no atlas',atlas.markers.length],
                ['fas fa-layer-group','Arcos',narrative.arcs.length], ['fas fa-book-open','Capítulos',narrative.chapters.length], ['fas fa-images','Galeria',gallery.length]
            ];
            document.getElementById('universe-stats-grid').innerHTML = stats.map(([icon,label,value])=>`<article><i class="${icon}"></i><strong>${value}</strong><span>${label}</span></article>`).join('');
            const incomplete = [];
            characters.forEach(item => { const missing=characterFields.filter(f=>!item[f] || (Array.isArray(item[f])&&!item[f].length)); if(missing.length) incomplete.push(`${item.name}: ${missing.length} campos pendentes`); });
            events.forEach(item => { const missing=eventFields.filter(f=>!item[f] || (Array.isArray(item[f])&&!item[f].length)); if(missing.length) incomplete.push(`${item.name}: ${missing.length} campos pendentes`); });
            if (!atlas.background.url) incomplete.push('Atlas: imagem-base ainda não selecionada');
            if (!narrative.chapters.length) incomplete.push('Narrativa: nenhum capítulo cadastrado');
            document.getElementById('universe-pending-list').innerHTML = incomplete.slice(0,8).map(item=>`<li>${esc(item)}</li>`).join('') || '<li>Todos os registros principais estão completos.</li>';
        };

        const renderGraph = () => {
            const container=document.getElementById('relationship-graph'), characters=window.contentStore.getCharacters();
            const nodes=new Map(), edges=[];
            characters.forEach(c=>{nodes.set(c.name,{id:c.id,label:c.name,kind:'primary'});(c.relationships||[]).forEach(r=>{if(!nodes.has(r.character))nodes.set(r.character,{id:slug(r.character),label:r.character,kind:'related'});edges.push({from:c.name,to:r.character,label:r.relation});});});
            const list=[...nodes.values()], width=Math.max(container.clientWidth,700), height=520, cx=width/2,cy=height/2,radius=Math.min(width,height)*.34;
            list.forEach((node,index)=>{const angle=(Math.PI*2*index/list.length)-Math.PI/2;node.x=cx+Math.cos(angle)*radius;node.y=cy+Math.sin(angle)*radius;});
            const byLabel=new Map(list.map(n=>[n.label,n]));
            container.innerHTML=`<svg viewBox="0 0 ${width} ${height}">${edges.map(e=>{const a=byLabel.get(e.from),b=byLabel.get(e.to);const mx=(a.x+b.x)/2,my=(a.y+b.y)/2;return `<line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}"></line><text x="${mx}" y="${my}">${esc(e.label)}</text>`;}).join('')}</svg>${list.map(n=>`<button class="graph-node ${n.kind}" style="left:${n.x}px;top:${n.y}px"><i class="fas fa-user"></i><span>${esc(n.label)}</span></button>`).join('')}`;
        };

        const renderGenealogy = () => {
            const characters=window.contentStore.getCharacters(), cards=new Map(characters.map(c=>[c.name,c]));
            characters.forEach(c=>(c.relationships||[]).forEach(r=>{if(!cards.has(r.character))cards.set(r.character,{name:r.character,title:'Registro relacionado'});}));
            const family=[];
            characters.forEach(c=>(c.relationships||[]).forEach(r=>{const rel=r.relation.toLowerCase();if(rel.includes('filh'))family.push({parent:c.name,child:r.character});else if(rel.includes('mãe')||rel.includes('pai'))family.push({parent:r.character,child:c.name});}));
            const spouses=[];characters.forEach(c=>(c.relationships||[]).forEach(r=>{if(/espos|marid|cônjuge/i.test(r.relation))spouses.push([c.name,r.character]);}));
            const roots=[...new Set(family.map(e=>e.parent).filter(p=>!family.some(e=>e.child===p)))];
            const card=name=>`<article class="family-card"><i class="fas fa-user"></i><strong>${esc(name)}</strong><span>${esc(cards.get(name)?.title||'Registro familiar')}</span></article>`;
            document.getElementById('genealogy-tree-characters').innerHTML=family.length?roots.map(root=>{const partner=spouses.find(pair=>pair.includes(root))?.find(n=>n!==root);const children=family.filter(e=>e.parent===root).map(e=>e.child);return `<div class="family-branch"><div class="family-couple">${card(root)}${partner?`<span class="family-bond"><i class="fas fa-ring"></i></span>${card(partner)}`:''}</div>${children.length?`<div class="family-line"></div><div class="family-children">${children.map(card).join('')}</div>`:''}</div>`;}).join(''):'<div class="universe-empty"><i class="fas fa-people-roof"></i><p>Nenhuma relação de parentesco documentada.</p></div>';
        };

        const renderReading = (selectedChapterId) => {
            narrative=window.contentStore.getNarrative();
            const arcsRoot=document.getElementById('reading-arcs'), chaptersRoot=document.getElementById('reading-chapters'), reader=document.getElementById('chapter-reader');
            arcsRoot.innerHTML=narrative.arcs.map(arc=>`<button data-arc-id="${esc(arc.id)}"><strong>${esc(arc.title)}</strong><span>${narrative.chapters.filter(c=>c.arcId===arc.id).length} capítulos</span></button>`).join('')||'<p>Nenhum arco cadastrado.</p>';
            chaptersRoot.innerHTML=narrative.chapters.map((chapter,index)=>`<button data-chapter-id="${esc(chapter.id)}"><span>${String(index+1).padStart(2,'0')}</span><strong>${esc(chapter.title)}</strong></button>`).join('')||'<div class="universe-empty"><i class="fas fa-book"></i><p>Use o Modo Autor para criar o primeiro arco e capítulo.</p></div>';
            const selected=narrative.chapters.find(c=>c.id===(selectedChapterId||narrative.chapters[0]?.id));
            reader.innerHTML=selected?`<span>${esc(narrative.arcs.find(a=>a.id===selected.arcId)?.title||'Sem arco')}</span><h2>${esc(selected.title)}</h2><p class="chapter-summary">${esc(selected.summary||'')}</p><div class="chapter-content">${esc(selected.content||'Capítulo ainda não escrito.').split(/\n\n+/).map(p=>`<p>${p.replaceAll('\n','<br>')}</p>`).join('')}</div><button class="author-only" data-edit-chapter="${esc(selected.id)}"><i class="fas fa-pen"></i> Editar capítulo</button>`:'<div class="universe-empty"><i class="fas fa-feather-pointed"></i><p>Selecione ou crie um capítulo para iniciar a leitura.</p></div>';
            if(selected)window.contentStore.discover('chapters',selected.id);
        };

        const renderGallery = () => {
            gallery=window.contentStore.getGallery();
            document.getElementById('gallery-grid').innerHTML=gallery.map(item=>`<article class="gallery-card" data-gallery-id="${esc(item.id)}">${item.kind==='image'?`<img src="${esc(item.url)}" alt="${esc(item.title)}">`:`<div class="gallery-document"><i class="fas fa-file-lines"></i><span>${esc(item.extension||'documento')}</span></div>`}<div><span>${esc(item.category||item.kind)}</span><h3>${esc(item.title)}</h3><p>${esc(item.description||'Sem descrição.')}</p></div><button><i class="fas fa-arrow-up-right-from-square"></i></button></article>`).join('')||'<div class="universe-empty"><i class="fas fa-images"></i><p>A galeria está vazia. Adicione imagens ou documentos no Modo Autor.</p></div>';
        };

        const renderDiscoveries = () => {
            const d=window.contentStore.getDiscoveries(), chars=window.contentStore.getCharacters(),events=window.contentStore.getEvents(),atlas=window.contentStore.getAtlas();narrative=window.contentStore.getNarrative();gallery=window.contentStore.getGallery();
            let fusions={};try{fusions=JSON.parse(localStorage.getItem('nahvvatzal_fusions'))||{};}catch{}
            const groups=[['Personagens',chars,d.characters],['Eventos',events,d.events],['Pontos do atlas',atlas.markers,d.markers],['Capítulos',narrative.chapters,d.chapters],['Galeria',gallery,d.gallery]];
            document.getElementById('discoveries-summary').innerHTML=`<article><strong>${Object.keys(fusions).length}</strong><span>Fusões descobertas</span></article>${groups.map(([name,items,found])=>`<article><strong>${found.length}/${items.length}</strong><span>${name}</span></article>`).join('')}`;
            document.getElementById('discoveries-catalog').innerHTML=groups.map(([name,items,found])=>`<section><h3>${name}</h3><div>${items.map(item=>`<span class="${found.includes(item.id)?'found':'locked'}"><i class="fas ${found.includes(item.id)?'fa-unlock':'fa-lock'}"></i>${found.includes(item.id)?esc(item.name||item.title):'Registro não descoberto'}</span>`).join('')||'<em>Nenhum registro disponível.</em>'}</div></section>`).join('');
        };

        const editor=document.getElementById('hub-editor-modal'), form=document.getElementById('hub-editor-form'), fields=document.getElementById('hub-editor-fields');
        const openEditor=(type,record=null,asset=null)=>{editor.dataset.type=type;editor.dataset.id=record?.id||'';document.getElementById('hub-editor-title').textContent=type==='arc'?(record?'Editar arco':'Novo arco'):type==='chapter'?(record?'Editar capítulo':'Novo capítulo'):'Catalogar item da galeria';
            if(type==='arc')fields.innerHTML=`<label><span>Título</span><input name="title" value="${esc(record?.title||'')}" required></label><label><span>Descrição</span><textarea name="description" rows="6">${esc(record?.description||'')}</textarea></label>`;
            if(type==='chapter')fields.innerHTML=`<label><span>Título</span><input name="title" value="${esc(record?.title||'')}" required></label><label><span>Arco</span><select name="arcId">${narrative.arcs.map(a=>`<option value="${esc(a.id)}" ${a.id===record?.arcId?'selected':''}>${esc(a.title)}</option>`).join('')}</select></label><label><span>Resumo</span><textarea name="summary" rows="4">${esc(record?.summary||'')}</textarea></label><label><span>Texto do capítulo</span><textarea name="content" rows="16">${esc(record?.content||'')}</textarea></label>`;
            if(type==='gallery'){editor.dataset.asset=JSON.stringify(asset);fields.innerHTML=`<label><span>Título</span><input name="title" value="${esc(asset.name)}" required></label><label><span>Categoria</span><input name="category" value="${asset.kind==='image'?'Ilustração':'Documento'}"></label><label><span>Descrição</span><textarea name="description" rows="6"></textarea></label>`;}
            editor.classList.add('active');};
        const closeEditor=()=>editor.classList.remove('active');
        document.getElementById('hub-add-arc')?.addEventListener('click',()=>openEditor('arc'));
        document.getElementById('hub-add-chapter')?.addEventListener('click',()=>{narrative=window.contentStore.getNarrative();if(!narrative.arcs.length)return alert('Crie um arco antes do primeiro capítulo.');openEditor('chapter');});
        document.getElementById('hub-add-gallery')?.addEventListener('click',async()=>{const asset=await window.desktopAPI?.selectGalleryAsset?.();if(asset&&!asset.canceled)openEditor('gallery',null,asset);});
        document.getElementById('close-hub-editor')?.addEventListener('click',closeEditor);document.getElementById('hub-editor-bg')?.addEventListener('click',closeEditor);document.getElementById('hub-editor-cancel')?.addEventListener('click',closeEditor);
        form.addEventListener('submit',event=>{event.preventDefault();const data=new FormData(form),type=editor.dataset.type,id=editor.dataset.id;narrative=window.contentStore.getNarrative();gallery=window.contentStore.getGallery();
            if(type==='arc'){const record={id:id||`${slug(data.get('title'))}-${Date.now().toString(36)}`,title:data.get('title').trim(),description:data.get('description').trim()};const i=narrative.arcs.findIndex(a=>a.id===id);if(i<0)narrative.arcs.push(record);else narrative.arcs[i]=record;window.contentStore.updateNarrative(narrative);}
            if(type==='chapter'){const record={id:id||`${slug(data.get('title'))}-${Date.now().toString(36)}`,title:data.get('title').trim(),arcId:data.get('arcId'),summary:data.get('summary').trim(),content:data.get('content').trim()};const i=narrative.chapters.findIndex(c=>c.id===id);if(i<0)narrative.chapters.push(record);else narrative.chapters[i]=record;window.contentStore.updateNarrative(narrative);}
            if(type==='gallery'){const asset=JSON.parse(editor.dataset.asset);gallery.push({id:`gallery-${Date.now().toString(36)}`,title:data.get('title').trim(),category:data.get('category').trim(),description:data.get('description').trim(),...asset});window.contentStore.updateGallery(gallery);}
            closeEditor();renderReading();renderGallery();renderDashboard();});

        document.getElementById('reading-chapters')?.addEventListener('click',e=>{const button=e.target.closest('[data-chapter-id]');if(button)renderReading(button.dataset.chapterId);});
        document.getElementById('chapter-reader')?.addEventListener('click',e=>{const button=e.target.closest('[data-edit-chapter]');if(button){narrative=window.contentStore.getNarrative();openEditor('chapter',narrative.chapters.find(c=>c.id===button.dataset.editChapter));}});
        document.getElementById('gallery-grid')?.addEventListener('click',async e=>{const card=e.target.closest('[data-gallery-id]');if(!card)return;gallery=window.contentStore.getGallery();const item=gallery.find(i=>i.id===card.dataset.galleryId);if(!item)return;window.contentStore.discover('gallery',item.id);if(item.kind==='document')await window.desktopAPI?.openGalleryDocument?.(item.path);else{document.getElementById('gallery-preview-image').src=item.url;document.getElementById('gallery-preview-title').textContent=item.title;document.getElementById('gallery-preview').classList.add('active');}});
        document.getElementById('close-gallery-preview')?.addEventListener('click',()=>document.getElementById('gallery-preview').classList.remove('active'));document.getElementById('gallery-preview-bg')?.addEventListener('click',()=>document.getElementById('gallery-preview').classList.remove('active'));
        document.addEventListener('amneritharion:content-changed',()=>{narrative=window.contentStore.getNarrative();gallery=window.contentStore.getGallery();const active=document.querySelector('[data-universe-tab].active')?.dataset.universeTab;if(active)showTab(active);});
        showTab('dashboard');
    };
})();
