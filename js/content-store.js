(function () {
    const STORAGE_KEY = 'amneritharion_author_content_v1';
    const clone = value => JSON.parse(JSON.stringify(value));
    const recordKey = item => String(item?.id || item?.name || '').trim().toLocaleLowerCase('pt-BR');
    const fingerprint = value => {
        const text = JSON.stringify(value);
        let hash = 2166136261;
        for (let index = 0; index < text.length; index++) {
            hash ^= text.charCodeAt(index);
            hash = Math.imul(hash, 16777619);
        }
        return (hash >>> 0).toString(16);
    };
    const mergeCodeFirst = (saved, source) => {
        const sourceKeys = new Set(source.map(recordKey));
        return [...clone(source), ...clone(Array.isArray(saved) ? saved : []).filter(item => !sourceKeys.has(recordKey(item)))];
    };
    const defaults = {
        version: 1,
        characters: clone(window.charactersData || []),
        events: clone(window.eventsData || []),
        atlas: clone(window.atlasData || { background: { url: '', name: '' }, layers: [], markers: [] }),
        narrative: clone(window.narrativeData || { arcs: [], chapters: [] }),
        gallery: clone(window.galleryData || []),
        discoveries: { characters: [], events: [], markers: [], chapters: [], gallery: [] },
        sourceSignatures: {
            characters: fingerprint(window.charactersData || []),
            events: fingerprint(window.eventsData || [])
        }
    };

    const normalize = content => {
        const savedSignatures = content?.sourceSignatures || {};
        const charactersChanged = savedSignatures.characters !== defaults.sourceSignatures.characters;
        const eventsChanged = savedSignatures.events !== defaults.sourceSignatures.events;
        return ({
        version: 1,
        characters: charactersChanged ? mergeCodeFirst(content?.characters, defaults.characters) : clone(Array.isArray(content?.characters) ? content.characters : defaults.characters),
        events: eventsChanged ? mergeCodeFirst(content?.events, defaults.events) : clone(Array.isArray(content?.events) ? content.events : defaults.events),
        atlas: content?.atlas && Array.isArray(content.atlas.layers) && Array.isArray(content.atlas.markers)
            ? content.atlas
            : clone(defaults.atlas),
        narrative: content?.narrative && Array.isArray(content.narrative.arcs) && Array.isArray(content.narrative.chapters)
            ? content.narrative : clone(defaults.narrative),
        gallery: Array.isArray(content?.gallery) ? content.gallery : clone(defaults.gallery),
        discoveries: content?.discoveries && typeof content.discoveries === 'object'
            ? { ...clone(defaults.discoveries), ...content.discoveries }
            : clone(defaults.discoveries),
        sourceSignatures: clone(defaults.sourceSignatures)
        });
    };

    const load = () => {
        try {
            const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
            return saved ? normalize(saved) : clone(defaults);
        } catch (error) {
            console.error('Não foi possível carregar o conteúdo do Modo Autor.', error);
            return clone(defaults);
        }
    };

    let content = load();
    const notify = detail => document.dispatchEvent(new CustomEvent('amneritharion:content-changed', { detail }));
    const persist = detail => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
        notify(detail);
    };

    window.contentStore = {
        getCharacters: () => clone(content.characters),
        getEvents: () => clone(content.events),
        getAtlas: () => clone(content.atlas),
        getNarrative: () => clone(content.narrative),
        getGallery: () => clone(content.gallery),
        getDiscoveries: () => clone(content.discoveries),
        getSnapshot: () => clone(content),
        hasChanges: () => localStorage.getItem(STORAGE_KEY) !== null,

        updateCharacter(updatedCharacter) {
            const index = content.characters.findIndex(item => item.id === updatedCharacter.id);
            if (index < 0) content.characters.push(clone(updatedCharacter));
            else content.characters[index] = clone(updatedCharacter);
            persist({ type: 'characters', id: updatedCharacter.id });
        },

        updateEvent(updatedEvent) {
            const index = content.events.findIndex(item => item.id === updatedEvent.id);
            if (index < 0) content.events.push(clone(updatedEvent));
            else content.events[index] = clone(updatedEvent);
            persist({ type: 'events', id: updatedEvent.id });
        },

        addEvent(event) {
            if (content.events.some(item => item.id === event.id)) throw new Error('Já existe um evento com esse identificador.');
            content.events.push(clone(event));
            persist({ type: 'events', id: event.id });
        },

        updateAtlas(atlas) {
            content.atlas = clone(atlas);
            persist({ type: 'atlas' });
        },

        updateNarrative(narrative) {
            content.narrative = clone(narrative);
            persist({ type: 'narrative' });
        },

        updateGallery(gallery) {
            content.gallery = clone(gallery);
            persist({ type: 'gallery' });
        },

        discover(type, id) {
            if (!content.discoveries[type] || !id || content.discoveries[type].includes(id)) return;
            content.discoveries[type].push(id);
            persist({ type: 'discoveries', discoveryType: type, id });
        },

        importSnapshot(snapshot) {
            content = normalize(snapshot);
            persist({ type: 'all' });
        },

        reset() {
            content = clone(defaults);
            localStorage.removeItem(STORAGE_KEY);
            notify({ type: 'all' });
        }
    };
})();
