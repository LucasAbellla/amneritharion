(function () {
    const escapeHTML = value => String(value ?? '')
        .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;').replaceAll("'", '&#039;');
    const lines = value => Array.isArray(value) ? value.join('\n') : '';
    const parseLines = value => value.split('\n').map(item => item.trim()).filter(Boolean);
    const slugify = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const markerColors = { city: '#d69e9e', landmark: '#d9b66f', danger: '#b33939', event: '#8a7bd1', sanctuary: '#7bbf9b', other: '#91a0b5' };
    const markerIcons = { city: 'fas fa-city', landmark: 'fas fa-location-dot', danger: 'fas fa-skull', event: 'fas fa-hourglass-half', sanctuary: 'fas fa-place-of-worship', other: 'fas fa-map-pin' };

    window.initializeAtlas = function initializeAtlas() {
        const viewport = document.getElementById('atlas-viewport');
        const stage = document.getElementById('atlas-stage');
        const markersRoot = document.getElementById('atlas-markers');
        const layersRoot = document.getElementById('atlas-layers');
        const emptyState = document.getElementById('atlas-empty-state');
        const background = document.getElementById('atlas-background');
        const status = document.getElementById('atlas-status');
        const markerModal = document.getElementById('atlas-marker-modal');
        const editorModal = document.getElementById('atlas-editor-modal');
        const editorForm = document.getElementById('atlas-editor-form');
        if (!viewport || !stage || !window.contentStore) return;

        let atlas = window.contentStore.getAtlas();
        let scale = 1, translateX = 0, translateY = 0;
        let addingMarker = false, editingMarkerId = null;

        const applyTransform = () => { stage.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`; status.textContent = `${Math.round(scale * 100)}%`; };
        const fit = () => {
            scale = Math.min((viewport.clientWidth - 40) / 1400, (viewport.clientHeight - 40) / 900, 1);
            translateX = 0; translateY = 0; applyTransform();
        };
        const save = () => { window.contentStore.updateAtlas(atlas); render(); };
        const visibleLayerIds = () => new Set(atlas.layers.filter(layer => layer.visible).map(layer => layer.id));

        const render = () => {
            background.style.backgroundImage = atlas.background.url ? `url("${atlas.background.url}")` : 'none';
            emptyState.classList.toggle('hidden', Boolean(atlas.background.url));
            document.getElementById('atlas-background-name').textContent = atlas.background.name || 'Nenhuma imagem selecionada';
            layersRoot.innerHTML = atlas.layers.map(layer => `
                <label class="atlas-layer-toggle">
                    <input type="checkbox" data-layer-id="${escapeHTML(layer.id)}" ${layer.visible ? 'checked' : ''}>
                    <i class="${escapeHTML(layer.icon)}"></i><span>${escapeHTML(layer.name)}</span>
                </label>`).join('');
            const visible = visibleLayerIds();
            markersRoot.innerHTML = atlas.markers.filter(marker => visible.has(marker.layer)).map(marker => {
                const color = marker.color || markerColors[marker.type] || markerColors.other;
                const icon = marker.icon || markerIcons[marker.type] || markerIcons.other;
                return `<button class="atlas-marker" data-marker-id="${escapeHTML(marker.id)}" style="left:${marker.x}%;top:${marker.y}%;--marker-color:${color}" title="${escapeHTML(marker.name)}"><span><i class="${escapeHTML(icon)}"></i></span><strong>${escapeHTML(marker.name)}</strong></button>`;
            }).join('');
            document.getElementById('atlas-marker-count').textContent = `${atlas.markers.length} ${atlas.markers.length === 1 ? 'ponto' : 'pontos'}`;
        };

        const setDetail = (id, value, fallback = 'Ainda não documentado.') => {
            const element = document.getElementById(id); if (!element) return;
            element.textContent = value || fallback; element.classList.toggle('atlas-placeholder', !value);
        };
        const tags = values => Array.isArray(values) && values.length ? values.map(value => `<span>${escapeHTML(value)}</span>`).join('') : '<em class="atlas-placeholder">Nenhum vínculo registrado.</em>';
        const openMarker = marker => {
            window.contentStore?.discover('markers', marker.id);
            markerModal.dataset.markerId = marker.id;
            setDetail('atlas-marker-name', marker.name); setDetail('atlas-marker-type', marker.type); setDetail('atlas-marker-layer', atlas.layers.find(layer => layer.id === marker.layer)?.name);
            setDetail('atlas-marker-description', marker.description, 'Descrição do local reservada para preenchimento.');
            setDetail('atlas-marker-notes', marker.notes, 'Notas cartográficas reservadas para preenchimento.');
            document.getElementById('atlas-marker-nations').innerHTML = tags(marker.nations);
            document.getElementById('atlas-marker-characters').innerHTML = tags(marker.characters);
            document.getElementById('atlas-marker-events').innerHTML = tags(marker.events);
            document.getElementById('atlas-marker-typings').innerHTML = tags(marker.typings);
            markerModal.classList.add('active');
        };
        const closeMarker = () => markerModal.classList.remove('active');

        const openEditor = marker => {
            editingMarkerId = marker?.id || null;
            const record = marker || { name: '', type: 'landmark', layer: 'geography', description: '', notes: '', nations: [], characters: [], events: [], typings: [], x: 50, y: 50 };
            document.getElementById('atlas-editor-title').textContent = marker ? `Editar ponto — ${marker.name}` : 'Adicionar ponto ao mapa';
            editorForm.elements.name.value = record.name;
            editorForm.elements.type.value = record.type;
            editorForm.elements.layer.innerHTML = atlas.layers.map(layer => `<option value="${escapeHTML(layer.id)}" ${layer.id === record.layer ? 'selected' : ''}>${escapeHTML(layer.name)}</option>`).join('');
            editorForm.elements.description.value = record.description || '';
            editorForm.elements.notes.value = record.notes || '';
            editorForm.elements.nations.value = lines(record.nations);
            editorForm.elements.characters.value = lines(record.characters);
            editorForm.elements.events.value = lines(record.events);
            editorForm.elements.typings.value = lines(record.typings);
            editorForm.elements.x.value = Number(record.x).toFixed(2);
            editorForm.elements.y.value = Number(record.y).toFixed(2);
            document.getElementById('atlas-delete-marker').classList.toggle('hidden', !marker);
            editorModal.classList.add('active');
        };
        const closeEditor = () => editorModal.classList.remove('active');

        document.getElementById('atlas-select-image')?.addEventListener('click', async () => {
            const result = await window.desktopAPI?.selectAtlasImage?.();
            if (!result || result.canceled) return;
            atlas.background = { url: result.url, name: result.name }; save(); fit();
        });
        document.getElementById('atlas-add-marker')?.addEventListener('click', () => {
            addingMarker = true; viewport.classList.add('placing-marker'); status.textContent = 'Clique no mapa';
        });
        document.getElementById('atlas-zoom-in')?.addEventListener('click', () => { scale = Math.min(2.5, scale + .15); applyTransform(); });
        document.getElementById('atlas-zoom-out')?.addEventListener('click', () => { scale = Math.max(.25, scale - .15); applyTransform(); });
        document.getElementById('atlas-fit')?.addEventListener('click', fit);
        layersRoot.addEventListener('change', event => {
            const layer = atlas.layers.find(item => item.id === event.target.dataset.layerId); if (!layer) return;
            layer.visible = event.target.checked; save();
        });
        markersRoot.addEventListener('click', event => {
            event.stopPropagation(); const button = event.target.closest('[data-marker-id]'); if (!button) return;
            const marker = atlas.markers.find(item => item.id === button.dataset.markerId); if (marker) openMarker(marker);
        });
        stage.addEventListener('click', event => {
            if (!addingMarker || !document.body.classList.contains('author-mode')) return;
            const rect = stage.getBoundingClientRect();
            addingMarker = false; viewport.classList.remove('placing-marker');
            openEditor(null); editorForm.elements.x.value = (((event.clientX - rect.left) / rect.width) * 100).toFixed(2); editorForm.elements.y.value = (((event.clientY - rect.top) / rect.height) * 100).toFixed(2);
        });
        viewport.addEventListener('wheel', event => {
            event.preventDefault(); scale = Math.max(.25, Math.min(2.5, scale + (event.deltaY < 0 ? .1 : -.1))); applyTransform();
        }, { passive: false });
        let pan = null;
        viewport.addEventListener('pointerdown', event => { if (addingMarker || event.target.closest('.atlas-marker')) return; pan = { x: event.clientX, y: event.clientY, tx: translateX, ty: translateY }; viewport.setPointerCapture(event.pointerId); });
        viewport.addEventListener('pointermove', event => { if (!pan) return; translateX = pan.tx + event.clientX - pan.x; translateY = pan.ty + event.clientY - pan.y; applyTransform(); });
        viewport.addEventListener('pointerup', () => { pan = null; });

        document.getElementById('close-atlas-marker')?.addEventListener('click', closeMarker);
        document.getElementById('atlas-marker-bg')?.addEventListener('click', closeMarker);
        document.getElementById('edit-atlas-marker')?.addEventListener('click', () => { const marker = atlas.markers.find(item => item.id === markerModal.dataset.markerId); if (marker) openEditor(marker); });
        document.getElementById('close-atlas-editor')?.addEventListener('click', closeEditor);
        document.getElementById('atlas-editor-bg')?.addEventListener('click', closeEditor);
        document.getElementById('atlas-editor-cancel')?.addEventListener('click', closeEditor);
        editorForm.addEventListener('submit', event => {
            event.preventDefault(); const data = new FormData(editorForm); const name = data.get('name').trim(); if (!name) return;
            const existing = atlas.markers.find(item => item.id === editingMarkerId);
            const marker = { id: existing?.id || `${slugify(name)}-${Date.now().toString(36)}`, name, type: data.get('type'), layer: data.get('layer'), x: Number(data.get('x')), y: Number(data.get('y')), description: data.get('description').trim(), notes: data.get('notes').trim(), nations: parseLines(data.get('nations')), characters: parseLines(data.get('characters')), events: parseLines(data.get('events')), typings: parseLines(data.get('typings')) };
            if (existing) Object.assign(existing, marker); else atlas.markers.push(marker); save(); closeEditor(); if (markerModal.classList.contains('active')) openMarker(marker);
        });
        document.getElementById('atlas-delete-marker')?.addEventListener('click', () => {
            if (!editingMarkerId || !confirm('Excluir este ponto do atlas?')) return;
            atlas.markers = atlas.markers.filter(item => item.id !== editingMarkerId); save(); closeEditor(); closeMarker();
        });
        document.addEventListener('amneritharion:content-changed', event => { if (event.detail?.type === 'atlas' || event.detail?.type === 'all') { atlas = window.contentStore.getAtlas(); render(); } });
        window.addEventListener('resize', fit);
        new ResizeObserver(entries => {
            const rect = entries[0]?.contentRect;
            if (rect?.width > 0 && rect?.height > 0) fit();
        }).observe(viewport);
        render(); setTimeout(fit, 50);
    };
})();
