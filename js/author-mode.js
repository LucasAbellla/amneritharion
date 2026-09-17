(function () {
    const MODE_KEY = 'amneritharion_author_mode';
    const escapeHTML = value => String(value ?? '')
        .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;').replaceAll("'", '&#039;');
    const lines = value => Array.isArray(value) ? value.join('\n') : '';
    const parseLines = value => value.split('\n').map(item => item.trim()).filter(Boolean);
    const slugify = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
        .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

    const field = (name, label, value = '', options = {}) => `
        <label class="author-field ${options.wide ? 'author-field-wide' : ''}">
            <span>${escapeHTML(label)}</span>
            ${options.textarea
                ? `<textarea name="${name}" rows="${options.rows || 4}" placeholder="${escapeHTML(options.placeholder || '')}">${escapeHTML(value)}</textarea>`
                : `<input name="${name}" value="${escapeHTML(value)}" placeholder="${escapeHTML(options.placeholder || '')}" ${options.readonly ? 'readonly' : ''}>`}
            ${options.help ? `<small>${escapeHTML(options.help)}</small>` : ''}
        </label>`;

    const characterForm = record => {
        const relationships = (record.relationships || []).map(item => `${item.character} | ${item.relation} | ${item.note || ''}`).join('\n');
        return `
            <input type="hidden" name="recordType" value="character">
            <input type="hidden" name="id" value="${escapeHTML(record.id)}">
            ${field('name', 'Nome', record.name)}
            ${field('title', 'Título', record.title)}
            ${field('origin', 'Origem', record.origin)}
            ${field('race', 'Raça', record.race)}
            ${field('status', 'Estado do registro', record.status)}
            ${field('firstAppearance', 'Primeira aparição', record.firstAppearance)}
            ${field('affiliations', 'Afiliações', lines(record.affiliations), { textarea: true, rows: 3, help: 'Uma por linha.' })}
            ${field('typings', 'Tipagens', lines(record.typings), { textarea: true, rows: 3, help: 'Uma por linha.' })}
            ${field('events', 'Eventos', lines(record.events), { textarea: true, rows: 4, help: 'Um por linha.' })}
            ${field('relationships', 'Relacionamentos', relationships, { textarea: true, rows: 5, help: 'Formato: Nome | Relação | Nota', wide: true })}
            ${field('biography', 'Biografia', record.biography, { textarea: true, rows: 8, wide: true })}
            ${field('personality', 'Personalidade', record.personality, { textarea: true, rows: 5 })}
            ${field('motivations', 'Motivações', record.motivations, { textarea: true, rows: 5 })}
            ${field('abilities', 'Habilidades', lines(record.abilities), { textarea: true, rows: 4, help: 'Uma por linha.' })}
            ${field('relics', 'Relíquias', lines(record.relics), { textarea: true, rows: 4, help: 'Uma por linha.' })}
            ${field('quotes', 'Citações', lines(record.quotes), { textarea: true, rows: 4, help: 'Uma por linha.' })}
            ${field('notes', 'Notas da autora', record.notes, { textarea: true, rows: 6, wide: true })}`;
    };

    const emptyEvent = () => ({ id: '', name: '', category: 'Evento histórico', era: '', date: '', location: '', status: 'A documentar', summary: '', description: '', causes: [], consequences: [], participants: [], nations: [], typings: [], sources: [], notes: '' });
    const eventForm = input => {
        const record = input || emptyEvent();
        return `
            <input type="hidden" name="recordType" value="event">
            <input type="hidden" name="originalId" value="${escapeHTML(record.id)}">
            ${field('name', 'Nome do evento', record.name)}
            ${field('id', 'Identificador', record.id, { readonly: Boolean(record.id), help: 'Gerado pelo nome em novos eventos. Use letras, números e hífens.' })}
            ${field('category', 'Categoria', record.category)}
            ${field('status', 'Estado do registro', record.status)}
            ${field('era', 'Era ou período', record.era)}
            ${field('date', 'Data', record.date)}
            ${field('location', 'Local', record.location)}
            ${field('participants', 'Participantes', lines(record.participants), { textarea: true, rows: 4, help: 'Um ID de personagem por linha, como elza-amnerisath.' })}
            ${field('summary', 'Resumo', record.summary, { textarea: true, rows: 4, wide: true })}
            ${field('description', 'Descrição histórica', record.description, { textarea: true, rows: 9, wide: true })}
            ${field('causes', 'Causas', lines(record.causes), { textarea: true, rows: 5, help: 'Uma por linha.' })}
            ${field('consequences', 'Consequências', lines(record.consequences), { textarea: true, rows: 5, help: 'Uma por linha.' })}
            ${field('nations', 'Nações relacionadas', lines(record.nations), { textarea: true, rows: 4, help: 'Uma por linha.' })}
            ${field('typings', 'Tipagens relacionadas', lines(record.typings), { textarea: true, rows: 4, help: 'Uma por linha.' })}
            ${field('sources', 'Fontes e documentos', lines(record.sources), { textarea: true, rows: 4, help: 'Uma por linha.' })}
            ${field('notes', 'Notas da autora', record.notes, { textarea: true, rows: 6, wide: true })}`;
    };

    window.initializeAuthorMode = function initializeAuthorMode() {
        const toggle = document.getElementById('author-mode-toggle');
        const toolbar = document.getElementById('author-toolbar');
        const modal = document.getElementById('author-editor-modal');
        const form = document.getElementById('author-editor-form');
        const fields = document.getElementById('author-editor-fields');
        const title = document.getElementById('author-editor-title');
        const feedback = document.getElementById('author-feedback');
        const importInput = document.getElementById('author-import-input');
        if (!toggle || !modal || !form || !window.contentStore) return;

        const setMode = enabled => {
            document.body.classList.toggle('author-mode', enabled);
            toolbar?.classList.toggle('hidden', !enabled);
            toggle.classList.toggle('active', enabled);
            toggle.innerHTML = enabled ? '<i class="fas fa-feather-pointed"></i> Sair do Modo Autor' : '<i class="fas fa-feather-pointed"></i> Modo Autor';
            localStorage.setItem(MODE_KEY, enabled ? '1' : '0');
        };
        setMode(localStorage.getItem(MODE_KEY) === '1');
        toggle.addEventListener('click', () => setMode(!document.body.classList.contains('author-mode')));

        const openEditor = detail => {
            if (!document.body.classList.contains('author-mode')) return;
            title.textContent = detail.type === 'character' ? `Editar personagem — ${detail.record.name}` : detail.record ? `Editar evento — ${detail.record.name}` : 'Cadastrar novo evento';
            fields.innerHTML = detail.type === 'character' ? characterForm(detail.record) : eventForm(detail.record);
            feedback.textContent = '';
            modal.classList.add('active');
            fields.querySelector('[name="name"]')?.focus();
        };
        const closeEditor = () => modal.classList.remove('active');
        document.addEventListener('amneritharion:author-edit', event => openEditor(event.detail));
        document.getElementById('close-author-editor')?.addEventListener('click', closeEditor);
        document.getElementById('author-editor-bg')?.addEventListener('click', closeEditor);
        document.getElementById('author-cancel')?.addEventListener('click', closeEditor);

        form.addEventListener('submit', event => {
            event.preventDefault();
            const data = new FormData(form);
            const type = data.get('recordType');
            try {
                if (type === 'character') {
                    const existing = window.contentStore.getCharacters().find(item => item.id === data.get('id'));
                    const relationships = parseLines(data.get('relationships')).map(line => {
                        const [character = '', relation = '', note = ''] = line.split('|').map(part => part.trim());
                        return { character, relation, note };
                    }).filter(item => item.character);
                    window.contentStore.updateCharacter({
                        ...existing,
                        name: data.get('name').trim(), title: data.get('title').trim(), origin: data.get('origin').trim(), race: data.get('race').trim(),
                        status: data.get('status').trim(), firstAppearance: data.get('firstAppearance').trim(), biography: data.get('biography').trim(),
                        personality: data.get('personality').trim(), motivations: data.get('motivations').trim(), notes: data.get('notes').trim(),
                        affiliations: parseLines(data.get('affiliations')), typings: parseLines(data.get('typings')), events: parseLines(data.get('events')),
                        relationships, abilities: parseLines(data.get('abilities')), relics: parseLines(data.get('relics')), quotes: parseLines(data.get('quotes'))
                    });
                    window.refreshCharacters?.();
                } else {
                    const name = data.get('name').trim();
                    const originalId = data.get('originalId');
                    const id = (data.get('id').trim() || slugify(name));
                    if (!name || !id) throw new Error('Informe o nome e o identificador do evento.');
                    const eventRecord = {
                        id, name, category: data.get('category').trim(), status: data.get('status').trim(), era: data.get('era').trim(),
                        date: data.get('date').trim(), location: data.get('location').trim(), summary: data.get('summary').trim(),
                        description: data.get('description').trim(), notes: data.get('notes').trim(), participants: parseLines(data.get('participants')),
                        causes: parseLines(data.get('causes')), consequences: parseLines(data.get('consequences')), nations: parseLines(data.get('nations')),
                        typings: parseLines(data.get('typings')), sources: parseLines(data.get('sources'))
                    };
                    if (originalId) window.contentStore.updateEvent(eventRecord); else window.contentStore.addEvent(eventRecord);
                    window.refreshEvents?.();
                }
                feedback.textContent = 'Alterações salvas neste dispositivo.';
                setTimeout(closeEditor, 650);
            } catch (error) {
                feedback.textContent = error.message;
            }
        });

        document.getElementById('author-export')?.addEventListener('click', async () => {
            const json = JSON.stringify(window.contentStore.getSnapshot(), null, 2);
            if (window.desktopAPI?.exportBackup) {
                const result = await window.desktopAPI.exportBackup(json);
                if (!result.canceled) alert(`Backup salvo em:\n${result.filePath}`);
                return;
            }
            const blob = new Blob([json], { type: 'application/json' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob); link.download = `amneritharion-backup-${new Date().toISOString().slice(0, 10)}.json`; link.click();
            setTimeout(() => URL.revokeObjectURL(link.href), 500);
        });
        document.getElementById('author-import')?.addEventListener('click', async () => {
            if (!window.desktopAPI?.importBackup) { importInput?.click(); return; }
            try {
                const result = await window.desktopAPI.importBackup();
                if (result.canceled) return;
                window.contentStore.importSnapshot(JSON.parse(result.content));
                window.refreshCharacters?.(); window.refreshEvents?.();
                alert('Backup importado com sucesso.');
            } catch (error) { alert(`Não foi possível importar o backup: ${error.message}`); }
        });
        importInput?.addEventListener('change', async event => {
            const file = event.target.files?.[0];
            if (!file) return;
            try {
                window.contentStore.importSnapshot(JSON.parse(await file.text()));
                window.refreshCharacters?.(); window.refreshEvents?.();
                alert('Backup importado com sucesso.');
            } catch (error) { alert(`Não foi possível importar o backup: ${error.message}`); }
            event.target.value = '';
        });
        document.getElementById('author-reset')?.addEventListener('click', () => {
            if (!confirm('Restaurar todo o conteúdo de personagens e eventos para a versão original?')) return;
            window.contentStore.reset(); window.refreshCharacters?.(); window.refreshEvents?.();
        });
    };
})();
