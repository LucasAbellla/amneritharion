(function () {
    const escapeHTML = (value) => String(value ?? '')
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');

    const listOrPlaceholder = (items, placeholder = 'Ainda não documentado.') => {
        if (!Array.isArray(items) || items.length === 0) {
            return `<span class="character-placeholder">${escapeHTML(placeholder)}</span>`;
        }
        return items.map(item => `<span class="character-tag">${escapeHTML(item)}</span>`).join('');
    };

    window.initializeCharacters = function initializeCharacters(characters) {
        const grid = document.getElementById('characters-grid');
        const search = document.getElementById('characters-search');
        const counter = document.getElementById('characters-counter');
        const modal = document.getElementById('character-modal');
        const modalBackground = document.getElementById('character-modal-bg');
        const closeButton = document.getElementById('close-character-modal');

        if (!grid || !modal || !Array.isArray(characters)) return;
        let currentCharacters = characters;

        const render = (query = '') => {
            const normalizedQuery = query.trim().toLocaleLowerCase('pt-BR');
            const visible = currentCharacters.filter(character => {
                const searchable = [
                    character.name,
                    character.title,
                    character.origin,
                    character.race,
                    ...(character.affiliations || []),
                    ...(character.typings || []),
                    ...(character.events || [])
                ].join(' ').toLocaleLowerCase('pt-BR');
                return searchable.includes(normalizedQuery);
            });

            grid.innerHTML = visible.map(character => `
                <button class="character-card group text-left" data-character-id="${escapeHTML(character.id)}">
                    <div class="character-portrait">
                        ${character.image
                            ? `<img src="${escapeHTML(character.image)}" alt="Retrato de ${escapeHTML(character.name)}">`
                            : `<i class="${escapeHTML(character.icon || 'fas fa-user')}" aria-hidden="true"></i>`}
                    </div>
                    <div class="character-card-copy">
                        <span class="character-origin">${escapeHTML(character.origin)}</span>
                        <h3>${escapeHTML(character.name)}</h3>
                        <p>${escapeHTML(character.title)}</p>
                        <div class="character-card-tags">
                            <span>${escapeHTML(character.race)}</span>
                            <span>${escapeHTML(character.typings?.[0] || 'Tipagem não documentada')}</span>
                        </div>
                    </div>
                </button>
            `).join('');

            if (visible.length === 0) {
                grid.innerHTML = '<p class="character-empty">Nenhum registro corresponde à busca.</p>';
            }
            if (counter) counter.textContent = `${visible.length} / ${currentCharacters.length}`;
        };

        const setText = (id, value, placeholder = 'Ainda não documentado.') => {
            const element = document.getElementById(id);
            if (!element) return;
            element.textContent = value || placeholder;
            element.classList.toggle('character-placeholder', !value);
        };

        const openCharacter = (character) => {
            window.contentStore?.discover('characters', character.id);
            modal.dataset.characterId = character.id;
            setText('character-modal-name', character.name);
            setText('character-modal-title', character.title);
            setText('character-modal-origin', character.origin);
            setText('character-modal-race', character.race);
            setText('character-modal-status', character.status);
            setText('character-modal-biography', character.biography, 'Biografia reservada para preenchimento.');
            setText('character-modal-personality', character.personality, 'Personalidade reservada para preenchimento.');
            setText('character-modal-motivations', character.motivations, 'Motivações reservadas para preenchimento.');
            setText('character-modal-notes', character.notes, 'Notas da autora reservadas para preenchimento.');

            document.getElementById('character-modal-affiliations').innerHTML = listOrPlaceholder(character.affiliations);
            document.getElementById('character-modal-typings').innerHTML = listOrPlaceholder(character.typings);
            document.getElementById('character-modal-events').innerHTML = listOrPlaceholder(character.events);
            document.getElementById('character-modal-abilities').innerHTML = listOrPlaceholder(character.abilities);
            document.getElementById('character-modal-relics').innerHTML = listOrPlaceholder(character.relics);

            const relationships = document.getElementById('character-modal-relationships');
            relationships.innerHTML = character.relationships?.length
                ? character.relationships.map(relationship => `
                    <div class="character-relationship">
                        <strong>${escapeHTML(relationship.character)}</strong>
                        <span>${escapeHTML(relationship.relation)}</span>
                        <p>${escapeHTML(relationship.note)}</p>
                    </div>
                `).join('')
                : '<span class="character-placeholder">Relacionamentos ainda não documentados.</span>';

            const portraitImage = document.getElementById('character-modal-image');
            if (character.image) {
                portraitImage.src = character.image;
                portraitImage.alt = `Retrato de ${character.name}`;
                portraitImage.classList.remove('hidden');
            } else {
                portraitImage.removeAttribute('src');
                portraitImage.classList.add('hidden');
            }

            modal.classList.add('active');
        };

        const closeModal = () => modal.classList.remove('active');

        grid.addEventListener('click', event => {
            const card = event.target.closest('[data-character-id]');
            if (!card) return;
            const character = currentCharacters.find(item => item.id === card.dataset.characterId);
            if (character) openCharacter(character);
        });
        search?.addEventListener('input', event => render(event.target.value));
        closeButton?.addEventListener('click', closeModal);
        modalBackground?.addEventListener('click', closeModal);
        document.getElementById('edit-character-button')?.addEventListener('click', () => {
            const character = currentCharacters.find(item => item.id === modal.dataset.characterId);
            if (character) document.dispatchEvent(new CustomEvent('amneritharion:author-edit', { detail: { type: 'character', record: character } }));
        });
        document.addEventListener('keydown', event => {
            if (event.key === 'Escape' && modal.classList.contains('active')) closeModal();
        });

        render();
        window.refreshCharacters = () => {
            currentCharacters = window.contentStore?.getCharacters() || [];
            render(search?.value || '');
            if (modal.classList.contains('active')) {
                const updated = currentCharacters.find(item => item.id === modal.dataset.characterId);
                if (updated) openCharacter(updated); else closeModal();
            }
        };
    };
})();
