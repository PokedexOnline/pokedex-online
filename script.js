const API = "https://pokeapi.co/api/v2";

let allPokemon = [];
let filteredPokemon = [];
let visibleCount = 50;
let currentPokemon = null;

let megaFormsCache = null;
let pokemonCache = new Map();
let speciesCache = new Map();
let typeCache = new Map();

const generations = [
    {
        id: 1,
        roman: "I",
        region: "KANTO",
        description: "A região onde tudo começou.",
        css: "region-kanto"
    },
    {
        id: 2,
        roman: "II",
        region: "JOHTO",
        description: "Uma região repleta de tradição.",
        css: "region-johto"
    },
    {
        id: 3,
        roman: "III",
        region: "HOENN",
        description: "Uma região cercada por água e natureza.",
        css: "region-hoenn"
    },
    {
        id: 4,
        roman: "IV",
        region: "SINNOH",
        description: "Uma terra fria e cheia de montanhas.",
        css: "region-sinnoh"
    },
    {
        id: 5,
        roman: "V",
        region: "UNOVA",
        description: "Uma região marcada por grandes cidades.",
        css: "region-unova"
    },
    {
        id: 6,
        roman: "VI",
        region: "KALOS",
        description: "Elegância, beleza e grandes aventuras.",
        css: "region-kalos"
    },
    {
        id: 7,
        roman: "VII",
        region: "ALOLA",
        description: "Ilhas tropicais e cultura única.",
        css: "region-alola"
    },
    {
        id: 8,
        roman: "VIII",
        region: "GALAR",
        description: "Grandes estádios e fenômenos gigantes.",
        css: "region-galar"
    },
    {
        id: 9,
        roman: "IX",
        region: "PALDEA",
        description: "Uma região aberta para explorar.",
        css: "region-paldea"
    }
];

/* =========================================================
   TIPOS
========================================================= */

const typeInfo = {
    normal: {
        name: "Normal",
        icon: "◉",
        description: "Equilíbrio, simplicidade e versatilidade."
    },

    fire: {
        name: "Fogo",
        icon: "🔥",
        description: "Chamas, calor e poder destrutivo."
    },

    water: {
        name: "Água",
        icon: "💧",
        description: "Água, oceanos, rios e força adaptável."
    },

    electric: {
        name: "Elétrico",
        icon: "⚡",
        description: "Energia, eletricidade e velocidade."
    },

    grass: {
        name: "Planta",
        icon: "🌿",
        description: "Natureza, plantas, florestas e crescimento."
    },

    ice: {
        name: "Gelo",
        icon: "❄️",
        description: "Frio extremo, neve e cristais de gelo."
    },

    fighting: {
        name: "Lutador",
        icon: "🥊",
        description: "Força física, combate e determinação."
    },

    poison: {
        name: "Veneno",
        icon: "☠️",
        description: "Toxinas, veneno e energia corrosiva."
    },

    ground: {
        name: "Terrestre",
        icon: "🏜️",
        description: "Terra, areia, solo e terremotos."
    },

    flying: {
        name: "Voador",
        icon: "🪽",
        description: "Vento, céu, liberdade e velocidade."
    },

    psychic: {
        name: "Psíquico",
        icon: "🔮",
        description: "Mente, poderes psíquicos e energia mental."
    },

    bug: {
        name: "Inseto",
        icon: "🐛",
        description: "Insetos, natureza selvagem e pequenos seres."
    },

    rock: {
        name: "Pedra",
        icon: "🪨",
        description: "Rochas, minerais e resistência."
    },

    ghost: {
        name: "Fantasma",
        icon: "👻",
        description: "Mistério, espíritos e sombras."
    },

    dragon: {
        name: "Dragão",
        icon: "🐉",
        description: "Dragões e poder ancestral."
    },

    dark: {
        name: "Sombrio",
        icon: "🌑",
        description: "Trevas, astúcia e mistério."
    },

    steel: {
        name: "Aço",
        icon: "⚙️",
        description: "Metal, armadura e resistência."
    },

    fairy: {
        name: "Fada",
        icon: "✨",
        description: "Magia, encanto e energia feérica."
    }
};


/* =========================================================
   MENU / NAVEGAÇÃO
========================================================= */

function openMenu() {
    const menu = document.getElementById("sideMenu");
    const overlay = document.getElementById("menuOverlay");

    if (menu) menu.classList.add("open");
    if (overlay) overlay.classList.add("active");
}

function closeMenu() {
    const menu = document.getElementById("sideMenu");
    const overlay = document.getElementById("menuOverlay");

    if (menu) menu.classList.remove("open");
    if (overlay) overlay.classList.remove("active");
}

function showPage(pageId) {
    document.querySelectorAll(".page").forEach(page => {
        page.classList.remove("active");
    });

    const page = document.getElementById(pageId);

    if (page) {
        page.classList.add("active");
    }

    closeMenu();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* =========================================================
   GERAÇÕES
========================================================= */

function getGeneration(id) {
    id = Number(id);

    if (id <= 151) return 1;
    if (id <= 251) return 2;
    if (id <= 386) return 3;
    if (id <= 493) return 4;
    if (id <= 649) return 5;
    if (id <= 721) return 6;
    if (id <= 809) return 7;
    if (id <= 905) return 8;

    return 9;
}


/* =========================================================
   API
========================================================= */

async function apiFetch(url) {
    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Erro HTTP ${response.status}`);
        }

        return await response.json();

    } catch (error) {
        console.error("Erro na API:", url, error);
        return null;
    }
}


/* =========================================================
   CARREGAR POKÉMON
========================================================= */

async function loadPokemon() {
    const grid = document.getElementById("pokemonGrid");

    if (grid) {
        grid.innerHTML = `
            <div class="loading">
                <div class="loading-spinner"></div>
                <p>Carregando Pokédex...</p>
            </div>
        `;
    }

    const data = await apiFetch(`${API}/pokemon?limit=1025`);

    if (!data || !data.results) {
        if (grid) {
            grid.innerHTML = `
                <div class="error-message">
                    <h3>Não foi possível carregar a Pokédex.</h3>
                    <p>Verifique sua conexão e tente novamente.</p>
                    <button onclick="loadPokemon()">Tentar novamente</button>
                </div>
            `;
        }

        return;
    }

    allPokemon = data.results.map((pokemon, index) => ({
        name: pokemon.name,
        url: pokemon.url,
        id: index + 1
    }));

    filteredPokemon = [...allPokemon];

    renderPokemon();
}


/* =========================================================
   RENDERIZAR GRID
========================================================= */

async function renderPokemon() {
    const grid = document.getElementById("pokemonGrid");

    if (!grid) return;

    if (filteredPokemon.length === 0) {
        grid.innerHTML = `
            <div class="empty-message">
                <h3>Nenhum Pokémon encontrado.</h3>
                <p>Tente outro nome, número ou filtro.</p>
            </div>
        `;

        return;
    }

    const visible = filteredPokemon.slice(0, visibleCount);

    grid.innerHTML = "";

    for (const pokemon of visible) {
        const card = document.createElement("div");

        card.className = "pokemon-card";

        card.innerHTML = `
            <div class="pokemon-image-container">
                <span class="pokemon-number">
                    #${String(pokemon.id).padStart(4, "0")}
                </span>

                <img
                    src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png"
                    alt="${escapeHtml(pokemon.name)}"
                    loading="lazy"
                >
            </div>

            <div class="pokemon-card-info">
                <h3>${capitalize(pokemon.name)}</h3>
                <div class="card-types" id="types-${pokemon.id}">
                    <span class="type-loading">...</span>
                </div>
            </div>
        `;

        card.addEventListener("click", () => {
            openPokemon(pokemon.id);
        });

        grid.appendChild(card);
    }

    await loadCardTypes(visible);

    updateLoadMoreButton();
}


/* =========================================================
   TIPOS DOS CARDS
========================================================= */

async function loadCardTypes(pokemonList) {
    await Promise.all(
        pokemonList.map(async pokemon => {

            try {
                let data = pokemonCache.get(pokemon.id);

                if (!data) {
                    data = await apiFetch(`${API}/pokemon/${pokemon.id}`);

                    if (data) {
                        pokemonCache.set(pokemon.id, data);
                    }
                }

                if (!data) return;

                const container = document.getElementById(`types-${pokemon.id}`);

                if (!container) return;

                container.innerHTML = data.types
                    .map(typeData => {
                        const type = typeData.type.name;

                        return `
                            <span class="type-badge type-${type}">
                                ${typeInfo[type]?.name || capitalize(type)}
                            </span>
                        `;
                    })
                    .join("");

            } catch (error) {
                console.error(error);
            }
        })
    );
}


/* =========================================================
   CARREGAR MAIS
========================================================= */

function loadMore() {
    visibleCount += 50;
    renderPokemon();
}

function updateLoadMoreButton() {
    const button = document.getElementById("loadMoreButton");

    if (!button) return;

    if (visibleCount >= filteredPokemon.length) {
        button.style.display = "none";
    } else {
        button.style.display = "block";
    }
}


/* =========================================================
   PESQUISA
========================================================= */

function searchPokemon(value) {
    const search = String(value || "").trim().toLowerCase();

    visibleCount = 50;

    if (!search) {
        filteredPokemon = [...allPokemon];
        renderPokemon();
        return;
    }

    filteredPokemon = allPokemon.filter(pokemon => {
        const nameMatch = pokemon.name.toLowerCase().includes(search);

        const numberMatch =
            String(pokemon.id) === search ||
            String(pokemon.id).padStart(3, "0") === search ||
            String(pokemon.id).padStart(4, "0") === search;

        return nameMatch || numberMatch;
    });

    renderPokemon();
}


/* =========================================================
   PESQUISA DA PÁGINA DE BUSCA
========================================================= */

function searchPagePokemon(value) {
    const search = String(value || "").trim().toLowerCase();

    const results = document.getElementById("searchResults");

    if (!results) return;

    if (!search) {
        results.innerHTML = `
            <div class="search-empty">
                <p>Digite o nome ou número de um Pokémon.</p>
            </div>
        `;

        return;
    }

    const matches = allPokemon.filter(pokemon => {
        return (
            pokemon.name.toLowerCase().includes(search) ||
            String(pokemon.id) === search
        );
    });

    if (matches.length === 0) {
        results.innerHTML = `
            <div class="search-empty">
                <h3>Nenhum Pokémon encontrado.</h3>
                <p>Verifique o nome ou número digitado.</p>
            </div>
        `;

        return;
    }

    results.innerHTML = "";

    matches.slice(0, 50).forEach(pokemon => {

        const card = document.createElement("div");

        card.className = "pokemon-card";

        card.innerHTML = `
            <div class="pokemon-image-container">
                <span class="pokemon-number">
                    #${String(pokemon.id).padStart(4, "0")}
                </span>

                <img
                    src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png"
                    alt="${escapeHtml(pokemon.name)}"
                    loading="lazy"
                >
            </div>

            <div class="pokemon-card-info">
                <h3>${capitalize(pokemon.name)}</h3>
                <div class="card-types" id="search-types-${pokemon.id}">
                    <span class="type-loading">...</span>
                </div>
            </div>
        `;

        card.addEventListener("click", () => {
            openPokemon(pokemon.id);
        });

        results.appendChild(card);
    });

    matches.slice(0, 50).forEach(async pokemon => {

        let data = pokemonCache.get(pokemon.id);

        if (!data) {
            data = await apiFetch(`${API}/pokemon/${pokemon.id}`);

            if (data) {
                pokemonCache.set(pokemon.id, data);
            }
        }

        if (!data) return;

        const container = document.getElementById(`search-types-${pokemon.id}`);

        if (!container) return;

        container.innerHTML = data.types.map(typeData => {
            const type = typeData.type.name;

            return `
                <span class="type-badge type-${type}">
                    ${typeInfo[type]?.name || capitalize(type)}
                </span>
            `;
        }).join("");
    });
}


/* =========================================================
   FILTRO POR GERAÇÃO
========================================================= */

function filterGeneration(generation) {
    generation = Number(generation);

    visibleCount = 50;

    if (!generation || generation === 0) {
        filteredPokemon = [...allPokemon];
    } else {
        filteredPokemon = allPokemon.filter(pokemon => {
            return getGeneration(pokemon.id) === generation;
        });
    }

    renderPokemon();

    document.querySelectorAll(".generation-pill").forEach(button => {
        button.classList.remove("active");
    });

    const activeButton = document.querySelector(
        `.generation-pill[data-generation="${generation}"]`
    );

    if (activeButton) {
        activeButton.classList.add("active");
    }
}


/* =========================================================
   PÁGINA DE TIPOS
========================================================= */

function buildTypesPage() {
    const container = document.getElementById("typesGrid");

    if (!container) return;

    container.innerHTML = "";

    Object.entries(typeInfo).forEach(([type, info]) => {

        const card = document.createElement("div");

        card.className = `type-card type-${type}`;

        card.innerHTML = `
            <div class="type-card-background"></div>

            <div class="type-icon">
                ${info.icon}
            </div>

            <div class="type-card-content">
                <h3>${info.name}</h3>

                <p>${info.description}</p>

                <button
                    class="type-button"
                    onclick="filterType('${type}')"
                >
                    Ver Pokémon
                </button>
            </div>
        `;

        container.appendChild(card);
    });
}


/* =========================================================
   FILTRO POR TIPO
========================================================= */

async function filterType(type) {
    const grid = document.getElementById("pokemonGrid");

    if (grid) {
        grid.innerHTML = `
            <div class="loading">
                <div class="loading-spinner"></div>
                <p>Buscando Pokémon do tipo ${typeInfo[type]?.name || type}...</p>
            </div>
        `;
    }

    const data = await apiFetch(`${API}/type/${type}`);

    if (!data || !data.pokemon) {
        if (grid) {
            grid.innerHTML = `
                <div class="error-message">
                    <p>Não foi possível carregar este tipo.</p>
                </div>
            `;
        }

        return;
    }

    const ids = data.pokemon
        .map(item => {
            const match = item.pokemon.url.match(/\/pokemon\/(\d+)\/$/);

            return match ? Number(match[1]) : null;
        })
        .filter(id => id && id <= 1025);

    filteredPokemon = allPokemon.filter(pokemon =>
        ids.includes(pokemon.id)
    );

    visibleCount = 50;

    showPage("homePage");

    renderPokemon();
}


/* =========================================================
   PÁGINA DE GERAÇÕES
========================================================= */

function buildGenerations() {
    const container = document.getElementById("generationsGrid");

    if (!container) return;

    container.innerHTML = "";

    generations.forEach(generation => {

        const card = document.createElement("div");

        card.className = `generation-card ${generation.css}`;

        card.innerHTML = `
            <div class="generation-number">
                ${generation.roman}
            </div>

            <div class="generation-content">
                <span>GERAÇÃO ${generation.roman}</span>

                <h3>${generation.region}</h3>

                <p>${generation.description}</p>

                <button
                    onclick="filterGeneration(${generation.id}); showPage('homePage')"
                >
                    Explorar geração
                </button>
            </div>
        `;

        container.appendChild(card);
    });
}


/* =========================================================
   ABRIR FICHA DO POKÉMON
========================================================= */

async function openPokemon(identifier) {

    const detailsPage = document.getElementById("pokemonDetails");
    const detailContent = document.getElementById("detailContent");

    if (!detailsPage || !detailContent) {
        console.error("Elementos da ficha do Pokémon não encontrados.");
        return;
    }

    showPage("pokemonDetails");

    detailContent.innerHTML = `
        <div class="loading detail-loading">
            <div class="loading-spinner"></div>
            <p>Carregando informações...</p>
        </div>
    `;

    const pokemon = await apiFetch(`${API}/pokemon/${identifier}`);

    if (!pokemon) {
        detailContent.innerHTML = `
            <div class="error-message">
                <h3>Não foi possível carregar este Pokémon.</h3>
                <button onclick="closePokemon()">Voltar</button>
            </div>
        `;

        return;
    }

    currentPokemon = pokemon;

    pokemonCache.set(pokemon.id, pokemon);

    const species = await apiFetch(pokemon.species.url);

    if (species) {
        speciesCache.set(pokemon.id, species);
    }

    const portugueseName = getPortugueseName(species, pokemon.name);
    const description = getDescription(species);

    const types = pokemon.types.map(typeData => typeData.type.name);

    const weaknesses = species
        ? await getWeaknesses(types)
        : [];

    const generation = getGeneration(pokemon.id);

    const artwork =
        pokemon.sprites?.other?.["official-artwork"]?.front_default ||
        pokemon.sprites?.other?.home?.front_default ||
        pokemon.sprites?.front_default ||
        "";

    const shinyArtwork =
        pokemon.sprites?.other?.["official-artwork"]?.front_shiny ||
        pokemon.sprites?.other?.home?.front_shiny ||
        pokemon.sprites?.front_shiny ||
        artwork;

    const abilities = pokemon.abilities || [];

    detailContent.innerHTML = `
        <button class="back-button" onclick="closePokemon()">
            ← Voltar para Pokédex
        </button>

        <div class="detail-top">

            <div class="detail-art">

                <div class="detail-number">
                    #${String(pokemon.id).padStart(4, "0")}
                </div>

                <img
                    src="${artwork}"
                    alt="${escapeHtml(portugueseName)}"
                >

                <div class="shiny-mini-label">
                    ✨ Shiny disponível
                </div>

            </div>


            <div class="detail-info">

                <div class="detail-title">

                    <span class="detail-original-name">
                        ${capitalize(pokemon.name)}
                    </span>

                    <h1>${escapeHtml(portugueseName)}</h1>

                </div>


                <div class="detail-types">

                    ${types.map(type => `
                        <span class="detail-type type-${type}">
                            ${typeInfo[type]?.name || capitalize(type)}
                        </span>
                    `).join("")}

                </div>


                <div class="info-grid">

                    <div class="info-box">
                        <span>Altura</span>
                        <strong>${(pokemon.height / 10).toFixed(1)} m</strong>
                    </div>

                    <div class="info-box">
                        <span>Peso</span>
                        <strong>${(pokemon.weight / 10).toFixed(1)} kg</strong>
                    </div>

                    <div class="info-box">
                        <span>Experiência Base</span>
                        <strong>${pokemon.base_experience || "—"}</strong>
                    </div>

                    <div class="info-box">
                        <span>Geração</span>
                        <strong>${generations[generation - 1]?.roman || generation}</strong>
                    </div>

                </div>

            </div>

        </div>


        <section class="detail-section">

            <h2>📖 Descrição</h2>

            <p class="description">
                ${escapeHtml(description)}
            </p>

        </section>


        <section class="detail-section">

            <h2>⚡ Habilidades</h2>

            <div class="abilities-list">

                ${abilities.map(ability => `
                    <div class="ability">
                        ${capitalize(ability.ability.name.replace(/-/g, " "))}
                        ${ability.is_hidden ? '<span>Oculta</span>' : ""}
                    </div>
                `).join("")}

            </div>

        </section>


        <section class="detail-section">

            <h2>⚔️ Fraquezas</h2>

            <div class="weaknesses-list">

                ${
                    weaknesses.length
                    ? weaknesses.map(type => `
                        <span class="detail-type type-${type}">
                            ${typeInfo[type]?.name || capitalize(type)}
                        </span>
                    `).join("")
                    : "<p>Não foi possível determinar.</p>"
                }

            </div>

        </section>


        <section class="detail-section">

            <h2>📊 Estatísticas Base</h2>

            <div class="stats-list">

                ${pokemon.stats.map(stat => {

                    const statName = translateStat(stat.stat.name);
                    const value = stat.base_stat;

                    const percentage = Math.min((value / 255) * 100, 100);

                    return `
                        <div class="stat-row">

                            <div class="stat-name">
                                ${statName}
                            </div>

                            <div class="stat-value">
                                ${value}
                            </div>

                            <div class="stat-bar">
                                <div
                                    class="stat-fill"
                                    style="width:${percentage}%"
                                ></div>
                            </div>

                        </div>
                    `;

                }).join("")}

            </div>

        </section>


        <section class="detail-section">

            <h2>✨ Pokémon Shiny</h2>

            <div class="shiny-container">

                <div class="shiny-art">

                    <img
                        src="${shinyArtwork}"
                        alt="${escapeHtml(portugueseName)} Shiny"
                    >

                </div>

                <div class="shiny-info">

                    <h3>${escapeHtml(portugueseName)} Shiny</h3>

                    <p>
                        Esta é a versão Shiny deste Pokémon.
                    </p>

                </div>

            </div>

        </section>


        <section class="detail-section">

            <h2>🔄 Evoluções</h2>

            <div id="evolutionContainer">
                <div class="loading-small">
                    Carregando evoluções...
                </div>
            </div>

        </section>


        <section class="detail-section mega-section">

            <h2>💥 Mega Evoluções</h2>

            <div id="megaContainer">

                <div class="loading-small">
                    Procurando Mega Evoluções...
                </div>

            </div>

        </section>
    `;

    await loadEvolutionChain(species);

    await loadMegaTab(pokemon.name);
}


/* =========================================================
   NOME EM PORTUGUÊS
========================================================= */

function getPortugueseName(species, fallback) {

    if (!species || !species.names) {
        return capitalize(fallback);
    }

    const portuguese =
        species.names.find(
            item => item.language.name === "pt-br"
        ) ||
        species.names.find(
            item => item.language.name === "pt"
        );

    return portuguese
        ? portuguese.name
        : capitalize(fallback);
}


/* =========================================================
   DESCRIÇÃO
========================================================= */

function getDescription(species) {

    if (!species || !species.flavor_text_entries) {
        return "Descrição não disponível.";
    }

    const portuguese =
        species.flavor_text_entries.find(
            item => item.language.name === "pt-br"
        );

    const portuguesePortugal =
        species.flavor_text_entries.find(
            item => item.language.name === "pt"
        );

    const english =
        species.flavor_text_entries.find(
            item => item.language.name === "en"
        );

    const entry =
        portuguese ||
        portuguesePortugal ||
        english;

    if (!entry) {
        return "Descrição não disponível.";
    }

    return entry.flavor_text
        .replace(/\n|\f/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}


/* =========================================================
   FRAQUEZAS
========================================================= */

async function getWeaknesses(types) {

    const multipliers = {};

    types.forEach(type => {
        multipliers[type] = 1;
    });

    for (const type of types) {

        let data = typeCache.get(type);

        if (!data) {
            data = await apiFetch(`${API}/type/${type}`);

            if (data) {
                typeCache.set(type, data);
            }
        }

        if (!data) continue;

        const relations = data.damage_relations;

        relations.double_damage_from.forEach(item => {
            multipliers[item.name] =
                (multipliers[item.name] || 1) * 2;
        });

        relations.half_damage_from.forEach(item => {
            multipliers[item.name] =
                (multipliers[item.name] || 1) * 0.5;
        });

        relations.no_damage_from.forEach(item => {
            multipliers[item.name] = 0;
        });
    }

    return Object.entries(multipliers)
        .filter(([type, multiplier]) => {
            return multiplier >= 2;
        })
        .sort((a, b) => b[1] - a[1])
        .map(([type]) => type);
}


/* =========================================================
   TRADUÇÃO DOS STATUS
========================================================= */

function translateStat(stat) {

    const translations = {
        hp: "HP",
        attack: "Ataque",
        defense: "Defesa",
        "special-attack": "Ataque Especial",
        "special-defense": "Defesa Especial",
        speed: "Velocidade"
    };

    return translations[stat] || capitalize(stat);
}


/* =========================================================
   EVOLUÇÕES
========================================================= */

async function loadEvolutionChain(species) {

    const container = document.getElementById("evolutionContainer");

    if (!container) return;

    if (!species?.evolution_chain?.url) {

        container.innerHTML = `
            <p class="no-data">
                Este Pokémon não possui uma cadeia de evolução disponível.
            </p>
        `;

        return;
    }

    const data = await apiFetch(species.evolution_chain.url);

    if (!data?.chain) {

        container.innerHTML = `
            <p class="no-data">
                Não foi possível carregar as evoluções.
            </p>
        `;

        return;
    }

    const evolutionList = [];

    function walkChain(chain, depth = 0) {

        if (!chain) return;

        const match = chain.species.url.match(/\/pokemon-species\/(\d+)\/$/);

        const id = match ? Number(match[1]) : null;

        evolutionList.push({
            name: chain.species.name,
            id,
            depth,
            details: chain.evolution_details?.[0] || null
        });

        if (chain.evolves_to && chain.evolves_to.length) {

            chain.evolves_to.forEach(next => {
                walkChain(next, depth + 1);
            });

        }
    }

    walkChain(data.chain);

    if (!evolutionList.length) {

        container.innerHTML = `
            <p class="no-data">
                Nenhuma evolução encontrada.
            </p>
        `;

        return;
    }

    container.innerHTML = `
        <div class="evolution-chain">

            ${evolutionList.map((evolution, index) => {

                const image = evolution.id
                    ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${evolution.id}.png`
                    : "";

                const detail =
                    index > 0
                        ? formatEvolutionDetails(evolution.details)
                        : "Inicial";

                return `
                    <div class="evolution-item">

                        ${
                            index > 0
                            ? `<div class="evolution-arrow">→</div>`
                            : ""
                        }

                        <div
                            class="evolution-card"
                            onclick="openPokemon(${evolution.id || `'${evolution.name}'`})"
                        >

                            <img
                                src="${image}"
                                alt="${capitalize(evolution.name)}"
                                loading="lazy"
                            >

                            <span class="evolution-number">
                                #${evolution.id || "?"}
                            </span>

                            <h3>
                                ${capitalize(evolution.name)}
                            </h3>

                            <p>
                                ${detail}
                            </p>

                        </div>

                    </div>
                `;

            }).join("")}

        </div>
    `;
}


/* =========================================================
   DETALHES DA EVOLUÇÃO
========================================================= */

function formatEvolutionDetails(details) {

    if (!details) {
        return "Evolução";
    }

    if (details.min_level) {
        return `Nível ${details.min_level}`;
    }

    if (details.item) {
        return `Usando ${capitalize(
            details.item.name.replace(/-/g, " ")
        )}`;
    }

    if (details.trigger?.name === "trade") {
        return "Troca";
    }

    if (details.min_happiness) {
        return `Felicidade ${details.min_happiness}+`;
    }

    if (details.min_affection) {
        return `Afeição ${details.min_affection}+`;
    }

    if (details.known_move) {
        return `Com ${capitalize(
            details.known_move.name.replace(/-/g, " ")
        )}`;
    }

    if (details.time_of_day) {
        return `Durante ${details.time_of_day}`;
    }

    return "Evolução";
}


/* =========================================================
   MEGA EVOLUÇÕES
========================================================= */

/*
    Aqui está a parte que foi refeita.

    Primeiro procuramos os nomes mais comuns:
    pokemon-mega
    pokemon-mega-x
    pokemon-mega-y

    Depois, caso não encontremos nada, fazemos uma busca
    na lista de Pokémon Forms da PokéAPI.
*/

async function loadMegaTab(pokemonName) {

    const container = document.getElementById("megaContainer");

    if (!container) return;

    container.innerHTML = `
        <div class="loading-small">
            Procurando Mega Evoluções...
        </div>
    `;

    const megaForms = [];

    const candidates = [
        `${pokemonName}-mega`,
        `${pokemonName}-mega-x`,
        `${pokemonName}-mega-y`
    ];

    for (const name of candidates) {

        const form = await apiFetch(
            `${API}/pokemon-form/${name}`
        );

        if (form) {

            if (
                !megaForms.some(
                    item => item.name === form.name
                )
            ) {
                megaForms.push(form);
            }
        }
    }

    /*
        Se os nomes diretos não funcionarem,
        procuramos pela lista completa de forms.
    */

    if (megaForms.length === 0) {

        try {

            if (!megaFormsCache) {

                const formList = await apiFetch(
                    `${API}/pokemon-form?limit=2000`
                );

                if (formList?.results) {

                    megaFormsCache = formList.results
                        .map(item => item.name)
                        .filter(name => name.includes("-mega"));
                }
            }

            if (megaFormsCache) {

                const possibleNames = megaFormsCache.filter(name => {
                    return name.startsWith(`${pokemonName}-mega`);
                });

                for (const name of possibleNames) {

                    const form = await apiFetch(
                        `${API}/pokemon-form/${name}`
                    );

                    if (form) {
                        megaForms.push(form);
                    }
                }
            }

        } catch (error) {

            console.error(
                "Erro procurando Mega Evoluções:",
                error
            );
        }
    }

    /*
        Remove duplicados.
    */

    const uniqueForms = [];

    megaForms.forEach(form => {

        if (
            !uniqueForms.some(
                item => item.name === form.name
            )
        ) {
            uniqueForms.push(form);
        }

    });

    if (uniqueForms.length === 0) {

        container.innerHTML = `
            <div class="no-mega">

                <div class="no-mega-icon">
                    ◈
                </div>

                <h3>Sem Mega Evolução</h3>

                <p>
                    Este Pokémon não possui uma Mega Evolução conhecida.
                </p>

            </div>
        `;

        return;
    }

    container.innerHTML = `
        <div class="mega-grid">

            ${uniqueForms.map(form => {

                const artwork =
                    form.sprites?.other?.["official-artwork"]?.front_default ||
                    form.sprites?.other?.home?.front_default ||
                    form.sprites?.front_default ||
                    "";

                const shiny =
                    form.sprites?.other?.["official-artwork"]?.front_shiny ||
                    form.sprites?.other?.home?.front_shiny ||
                    form.sprites?.front_shiny ||
                    "";

                const title = formatMegaName(
                    form.name,
                    pokemonName
                );

                return `
                    <div class="mega-form-card">

                        <div class="mega-form-label">
                            💥 MEGA EVOLUÇÃO
                        </div>

                        <div class="mega-image">

                            <img
                                src="${artwork}"
                                alt="${escapeHtml(title)}"
                                loading="lazy"
                            >

                        </div>

                        <h3>
                            ${escapeHtml(title)}
                        </h3>

                        <p>
                            ${capitalize(pokemonName)}
                            em sua forma Mega.
                        </p>

                        ${
                            shiny
                            ? `
                                <div class="mega-shiny">

                                    <span>✨ Shiny</span>

                                    <img
                                        src="${shiny}"
                                        alt="${escapeHtml(title)} Shiny"
                                        loading="lazy"
                                    >

                                </div>
                            `
                            : ""
                        }

                    </div>
                `;

            }).join("")}

        </div>
    `;
}


/* =========================================================
   NOME DA MEGA
========================================================= */

function formatMegaName(formName, pokemonName) {

    const baseName = capitalize(
        pokemonName.replace(/-/g, " ")
    );

    const lower = formName.toLowerCase();

    if (lower.endsWith("-mega-x")) {
        return `Mega ${baseName} X`;
    }

    if (lower.endsWith("-mega-y")) {
        return `Mega ${baseName} Y`;
    }

    if (lower.includes("-mega-")) {

        const parts = formName.split("-");

        const megaIndex = parts.indexOf("mega");

        if (megaIndex !== -1 && parts.length > megaIndex + 1) {

            const suffix = parts
                .slice(megaIndex + 1)
                .join(" ");

            return `Mega ${baseName} ${suffix.toUpperCase()}`;
        }
    }

    return `Mega ${baseName}`;
}


/* =========================================================
   FECHAR FICHA
========================================================= */

function closePokemon() {

    currentPokemon = null;

    showPage("homePage");
}


/* =========================================================
   UTILITÁRIOS
========================================================= */

function capitalize(text) {

    if (!text) return "";

    return String(text)
        .split("-")
        .map(word => {
            return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join(" ");
}


function escapeHtml(text) {

    if (text === undefined || text === null) {
        return "";
    }

    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* =========================================================
   BOTÃO ENTER NAS PESQUISAS
========================================================= */

document.addEventListener("keydown", event => {

    if (event.key !== "Enter") return;

    const active = document.activeElement;

    if (!active) return;

    if (
        active.matches(
            "#homeSearch, #searchInput, .pokemon-search"
        )
    ) {

        const value = active.value;

        if (active.id === "searchInput") {
            searchPagePokemon(value);
        } else {
            searchPokemon(value);
        }
    }
});


/* =========================================================
   INICIALIZAÇÃO
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    console.log("Pokédex iniciando...");

    buildTypesPage();

    buildGenerations();

    loadPokemon();

});
