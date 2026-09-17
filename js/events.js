(function () {
    const escapeHTML = value => String(value ?? '')
        .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;').replaceAll("'", '&#039;');
    const placeholder = '<span class="event-placeholder">Ainda não documentado.</span>';
    let currentEvents = [];
    let currentQuery = '';

    const characterName = id => window.contentStore?.getCharacters().find(character => character.id === id)?.name || id;
    const renderTags = (items, mapper = item => item) => Array.isArray(items) && items.length
        ? items.map(item => `<span class="event-tag">${escapeHTML(mapper(item))}</span>`).join('')
        : placeholder;

    window.initializeEvents = function initializeEvents(events) {
        const grid = document.getElementById('events-grid');
        const search = document.getElementById('events-search');
        const counter = document.getElementById('events-counter');
        const modal = document.getElementById('event-modal');
        if (!grid || !modal) return;
        currentEvents = events || [];

        const render = () => {
            const query = currentQuery.trim().toLocaleLowerCase('pt-BR');
            const visible = currentEvents.filter(event => [event.name, event.category, event.era, event.date, event.location, event.summary]
                .join(' ').toLocaleLowerCase('pt-BR').includes(query));
            grid.innerHTML = visible.map(event => `
                <article class="event-card" data-event-id="${escapeHTML(event.id)}">
                    <div class="event-card-marker"><i class="fas fa-hourglass-half"></i></div>
                    <div class="event-card-copy">
                        <span class="event-category">${escapeHTML(event.category || 'Evento histórico')}</span>
                        <h3>${escapeHTML(event.name)}</h3>
                        <p>${escapeHTML(event.summary || 'Registro preparado para documentação histórica.')}</p>
                        <div class="event-meta">
                            <span><i class="fas fa-calendar"></i> ${escapeHTML(event.date || event.era || 'Data pendente')}</span>
                            <span><i class="fas fa-location-dot"></i> ${escapeHTML(event.location || 'Local pendente')}</span>
                        </div>
                    </div>
                    <button class="event-open" aria-label="Abrir ${escapeHTML(event.name)}"><i class="fas fa-arrow-right"></i></button>
                </article>
            `).join('') || '<p class="event-empty">Nenhum evento corresponde à busca.</p>';
            if (counter) counter.textContent = `${visible.length} / ${currentEvents.length}`;
        };

        const text = (id, value, fallback = 'Ainda não documentado.') => {
            const element = document.getElementById(id);
            if (!element) return;
            element.textContent = value || fallback;
            element.classList.toggle('event-placeholder', !value);
        };

        const open = event => {
            window.contentStore?.discover('events', event.id);
            modal.dataset.eventId = event.id;
            text('event-modal-name', event.name);
            text('event-modal-category', event.category);
            text('event-modal-status', event.status);
            text('event-modal-era', event.era);
            text('event-modal-date', event.date);
            text('event-modal-location', event.location);
            text('event-modal-summary', event.summary, 'Resumo reservado para preenchimento.');
            text('event-modal-description', event.description, 'Descrição histórica reservada para preenchimento.');
            text('event-modal-notes', event.notes, 'Notas da autora reservadas para preenchimento.');
            document.getElementById('event-modal-causes').innerHTML = renderTags(event.causes);
            document.getElementById('event-modal-consequences').innerHTML = renderTags(event.consequences);
            document.getElementById('event-modal-participants').innerHTML = renderTags(event.participants, characterName);
            document.getElementById('event-modal-nations').innerHTML = renderTags(event.nations);
            document.getElementById('event-modal-typings').innerHTML = renderTags(event.typings);
            modal.classList.add('active');
        };
        const close = () => modal.classList.remove('active');

        grid.addEventListener('click', event => {
            const card = event.target.closest('[data-event-id]');
            if (!card) return;
            const historicalEvent = currentEvents.find(item => item.id === card.dataset.eventId);
            if (historicalEvent) open(historicalEvent);
        });
        search?.addEventListener('input', event => { currentQuery = event.target.value; render(); });
        document.getElementById('close-event-modal')?.addEventListener('click', close);
        document.getElementById('event-modal-bg')?.addEventListener('click', close);
        document.getElementById('edit-event-button')?.addEventListener('click', () => {
            const historicalEvent = currentEvents.find(item => item.id === modal.dataset.eventId);
            if (historicalEvent) document.dispatchEvent(new CustomEvent('amneritharion:author-edit', { detail: { type: 'event', record: historicalEvent } }));
        });
        document.getElementById('create-event-button')?.addEventListener('click', () => {
            document.dispatchEvent(new CustomEvent('amneritharion:author-edit', { detail: { type: 'event', record: null } }));
        });
        document.addEventListener('keydown', event => { if (event.key === 'Escape') close(); });
        render();

        window.refreshEvents = () => {
            currentEvents = window.contentStore?.getEvents() || [];
            render();
            if (modal.classList.contains('active')) {
                const updated = currentEvents.find(item => item.id === modal.dataset.eventId);
                if (updated) open(updated); else close();
            }
        };
    };
})();
