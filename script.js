/* =========================================================
   POKÉDEX ONLINE — SCRIPT PRINCIPAL
   Pokémon Community

   Pokémon: nomes em INGLÊS
   Interface: PORTUGUÊS
   Tipos: PORTUGUÊS
========================================================= */

const API = "https://pokeapi.co/api/v2";

let allPokemon = [];
let filteredPokemon = [];
let visibleCount = 50;
let currentPokemon = null;
let currentPage = "homePage";

const MAX_POKEMON = 1025;

/* =========================================================
   NOVO SISTEMA DE EXIBIÇÃO
   Pokémon:
   - Normal
   - Shiny

   Gerações:
   - Todas
   - I até IX
========================================================= */

let pokemonDisplayMode = "normal";
let selectedGeneration = 0;

/* =========================================================
   TIPOS
========================================================= */

const typeInfo = {
    normal: { name: "Normal", icon: "⚪" },
    fire: { name: "Fogo", icon: "🔥" },
    water: { name: "Água", icon: "💧" },
    electric: { name: "Elétrico", icon: "⚡" },
    grass: { name: "Planta", icon: "🌿" },
    ice: { name: "Gelo", icon: "❄️" },
    fighting: { name: "Lutador", icon: "🥊" },
    poison: { name: "Veneno", icon: "☠️" },
    ground: { name: "Terra", icon: "🌍" },
    flying: { name: "Voador", icon: "🪽" },
    psychic: { name: "Psíquico", icon: "🔮" },
    bug: { name: "Inseto", icon: "🦋" },
    rock: { name: "Pedra", icon: "🪨" },
    ghost: { name: "Fantasma", icon: "👻" },
    dragon: { name: "Dragão", icon: "🐉" },
    dark: { name: "Sombrio", icon: "🌑" },
    steel: { name: "Aço", icon: "⚙️" },
    fairy: { name: "Fada", icon: "✨" }
};

/* =========================================================
   GERAÇÕES
========================================================= */

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
        description: "Uma região repleta de tradição e mistérios.",
        css: "region-johto"
    },
    {
        id: 3,
        roman: "III",
        region: "HOENN",
        description: "Uma região marcada por oceanos e natureza.",
        css: "region-hoenn"
    },
    {
        id: 4,
        roman: "IV",
        region: "SINNOH",
        description: "Uma região antiga cercada por lendas.",
        css: "region-sinnoh"
    },
    {
        id: 5,
        roman: "V",
        region: "UNOVA",
        description: "Uma região moderna e cheia de novidades.",
        css: "region-unova"
    },
    {
        id: 6,
        roman: "VI",
        region: "KALOS",
        description: "Uma região conhecida por sua elegância.",
        css: "region-kalos"
    },
    {
        id: 7,
        roman: "VII",
        region: "ALOLA",
        description: "Ilhas tropicais com uma cultura única.",
        css: "region-alola"
    },
    {
        id: 8,
        roman: "VIII",
        region: "GALAR",
        description: "Uma região de grandes estádios e batalhas gigantes.",
        css: "region-galar"
    },
    {
        id: 9,
        roman: "IX",
        region: "PALDEA",
        description: "Uma região aberta com novas aventuras.",
        css: "region-paldea"
    }
];

/* =========================================================
   CACHE
========================================================= */

const pokemonCache = new Map();
const speciesCache = new Map();
const evolutionCache = new Map();

/* =========================================================
   FUNÇÕES BÁSICAS
========================================================= */

function capitalize(text) {
    if (!text) return "";

    return text.charAt(0).toUpperCase() + text.slice(1);
}

function formatPokemonName(name) {
    if (!name) return "";

    return name
        .split("-")
        .map(part => capitalize(part))
        .join(" ");
}

function formatNumber(id) {
    return String(id).padStart(4, "0");
}

function getIdFromUrl(url) {
    if (!url) return null;

    const parts = url
        .split("/")
        .filter(Boolean);

    const id = Number(parts[parts.length - 1]);

    return Number.isFinite(id) ? id : null;
}

/* =========================================================
   IMAGENS
========================================================= */

function getPokemonImage(pokemon) {
    return (
        pokemon?.sprites?.other?.["official-artwork"]?.front_default ||
        pokemon?.sprites?.other?.home?.front_default ||
        pokemon?.sprites?.front_default ||
        ""
    );
}

function getPokemonShiny(pokemon) {
    return (
        pokemon?.sprites?.other?.["official-artwork"]?.front_shiny ||
        pokemon?.sprites?.other?.home?.front_shiny ||
        pokemon?.sprites?.front_shiny ||
        getPokemonImage(pokemon)
    );
}

/* =========================================================
   NOVO:
   ESCOLHE A IMAGEM DE ACORDO COM NORMAL / SHINY
========================================================= */

function getPokemonDisplayImage(pokemon) {

    if (pokemonDisplayMode === "shiny") {
        return getPokemonShiny(pokemon);
    }

    return getPokemonImage(pokemon);
}

/* =========================================================
   API
========================================================= */

async function apiFetch(url) {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(
            `Erro HTTP ${response.status}: ${url}`
        );
    }

    return response.json();
}

/* =========================================================
   POKÉMON
========================================================= */

async function getPokemon(idOrName) {

    const key =
        String(idOrName).toLowerCase();

    if (pokemonCache.has(key)) {
        return pokemonCache.get(key);
    }

    const pokemon =
        await apiFetch(
            `${API}/pokemon/${key}`
        );

    pokemonCache.set(key, pokemon);

    if (pokemon?.id) {
        pokemonCache.set(
            String(pokemon.id),
            pokemon
        );

        pokemonCache.set(
            pokemon.name.toLowerCase(),
            pokemon
        );
    }

    return pokemon;
}

async function getSpecies(idOrName) {

    const key =
        String(idOrName).toLowerCase();

    if (speciesCache.has(key)) {
        return speciesCache.get(key);
    }

    const species =
        await apiFetch(
            `${API}/pokemon-species/${key}`
        );

    speciesCache.set(key, species);

    if (species?.id) {
        speciesCache.set(
            String(species.id),
            species
        );

        speciesCache.set(
            species.name.toLowerCase(),
            species
        );
    }

    return species;
}

/* =========================================================
   DADOS LOCALIZADOS
========================================================= */

function getEnglishPokemonName(
    species,
    pokemon
) {
    return formatPokemonName(
        pokemon?.name ||
        species?.name ||
        ""
    );
}

function getPortugueseDescription(
    species
) {

    if (!species?.flavor_text_entries) {
        return "Descrição não disponível.";
    }

    const entries =
        species.flavor_text_entries;

    const preferredLanguages = [
        "pt-br",
        "pt",
        "en"
    ];

    for (
        const language of preferredLanguages
    ) {

        const entry =
            entries.find(
                item =>
                    item.language?.name ===
                    language
            );

        if (entry?.flavor_text) {

            return entry.flavor_text
                .replace(/\n|\f/g, " ")
                .replace(/\s+/g, " ")
                .trim();
        }
    }

    return "Descrição não disponível.";
}

function getPortugueseGenus(
    species
) {

    if (!species?.genera) {
        return "";
    }

    const entry =
        species.genera.find(
            item =>
                item.language?.name ===
                "pt-br"
        ) ||
        species.genera.find(
            item =>
                item.language?.name ===
                "pt"
        ) ||
        species.genera.find(
            item =>
                item.language?.name ===
                "en"
        );

    return entry?.genus || "";
}

/* =========================================================
   CARREGAR OS 1025 POKÉMON
========================================================= */

async function loadPokemon() {

    const grid =
        document.getElementById(
            "pokedex"
        );

    if (grid) {

        grid.innerHTML = `
            <div class="loading">
                <div class="loading-spinner"></div>
                <p>Carregando Pokédex...</p>
            </div>
        `;
    }

    try {

        const data =
            await apiFetch(
                `${API}/pokemon?limit=${MAX_POKEMON}&offset=0`
            );

        allPokemon =
            data.results
                .map(
                    (pokemon, index) => ({
                        id: index + 1,
                        name: pokemon.name,
                        url: pokemon.url
                    })
                )
                .filter(
                    pokemon =>
                        pokemon.id <=
                        MAX_POKEMON
                );

        filteredPokemon =
            [...allPokemon];

        visibleCount = 50;

        renderPokemon();

    } catch (error) {

        console.error(
            "Erro ao carregar Pokémon:",
            error
        );

        if (grid) {

            grid.innerHTML = `
                <div class="error-message">

                    <div style="font-size:42px;">
                        ⚠️
                    </div>

                    <h3>
                        Não foi possível carregar a Pokédex
                    </h3>

                    <p>
                        Verifique sua conexão e tente novamente.
                    </p>

                    <button onclick="loadPokemon()">
                        Tentar novamente
                    </button>

                </div>
            `;
        }
    }
}

/* =========================================================
   RENDERIZAÇÃO DOS CARDS
========================================================= */

function renderPokemon() {

    const grid =
        document.getElementById(
            "pokedex"
        );

    if (!grid) return;

    grid.innerHTML = "";

    const visible =
        filteredPokemon.slice(
            0,
            visibleCount
        );

    if (!visible.length) {

        grid.innerHTML = `
            <div class="error-message">

                <div style="font-size:42px;">
                    🔎
                </div>

                <h3>
                    Nenhum Pokémon encontrado
                </h3>

                <p>
                    Tente outro nome ou número.
                </p>

            </div>
        `;

        updateLoadMoreButton();

        return;
    }

    visible.forEach(
        pokemon => {

            grid.appendChild(
                createPokemonCard(
                    pokemon
                )
            );

        }
    );

    updateLoadMoreButton();
}

/* =========================================================
   CARD
========================================================= */

function createPokemonCard(
    pokemon
) {

    const card =
        document.createElement(
            "article"
        );

    card.className =
        "pokemon-card";

    card.dataset.id =
        pokemon.id;

    card.innerHTML = `
        <div class="pokemon-card-number">
            #${formatNumber(pokemon.id)}
        </div>

        <div class="pokemon-card-image">

            <div class="card-loading">
                <div class="loading-spinner"></div>
            </div>

        </div>

        <div class="pokemon-card-info">

            <h3>
                ${formatPokemonName(
                    pokemon.name
                )}
            </h3>

            <div
                class="pokemon-card-types"
                data-types="${pokemon.id}"
            >
                <span class="type-loading">
                    ...
                </span>
            </div>

        </div>
    `;

    card.addEventListener(
        "click",
        () =>
            openPokemon(
                pokemon.id
            )
    );

    loadCardData(
        card,
        pokemon
    );

    return card;
}

/* =========================================================
   DADOS DOS CARDS
========================================================= */

async function loadCardData(
    card,
    pokemon
) {

    try {

        const data =
            await getPokemon(
                pokemon.id
            );

        const image =
            getPokemonDisplayImage(
                data
            );

        const imageContainer =
            card.querySelector(
                ".pokemon-card-image"
            );

        if (imageContainer) {

            imageContainer.innerHTML = `
                <img
                    class="pokemon-card-img"
                    src="${image}"
                    alt="${formatPokemonName(
                        pokemon.name
                    )}${pokemonDisplayMode === "shiny" ? " Shiny" : ""}"
                    loading="lazy"
                >
            `;
        }

        const typeContainer =
            card.querySelector(
                `[data-types="${pokemon.id}"]`
            );

        if (typeContainer) {

            typeContainer.innerHTML =
                data.types
                    .map(
                        item => {

                            const type =
                                item.type.name;

                            const info =
                                typeInfo[type];

                            return `
                                <span
                                    class="type-badge type-${type}"
                                >
                                    ${
                                        info?.name ||
                                        capitalize(type)
                                    }
                                </span>
                            `;
                        }
                    )
                    .join("");
        }

    } catch (error) {

        console.warn(
            "Erro ao carregar card:",
            pokemon.name,
            error
        );

        const imageContainer =
            card.querySelector(
                ".pokemon-card-image"
            );

        if (imageContainer) {

            imageContainer.innerHTML = `
                <div class="card-error">
                    ⚠️
                </div>
            `;
        }
    }
}

/* =========================================================
   CARREGAR MAIS
========================================================= */

function updateLoadMoreButton() {

    const button =
        document.getElementById(
            "loadMoreButton"
        );

    if (!button) return;

    if (
        visibleCount >=
        filteredPokemon.length
    ) {

        button.style.display =
            "none";

    } else {

        button.style.display =
            "block";

        button.textContent =
            "Carregar mais Pokémon";
    }
}

function loadMorePokemon() {

    visibleCount += 50;

    renderPokemon();
}

function loadMore() {

    loadMorePokemon();
}

/* =========================================================
   NOVO SISTEMA:
   MENU "POKÉMON"
========================================================= */

function setPokemonDisplayMode(mode) {

    if (
        mode !== "normal" &&
        mode !== "shiny"
    ) {
        mode = "normal";
    }

    pokemonDisplayMode = mode;

    visibleCount = 50;

    renderPokemon();

    updatePokemonMenuState();
}

/* =========================================================
   NOVO SISTEMA:
   MENU "GERAÇÕES"
========================================================= */

function setGenerationFilter(generation) {

    const generationNumber =
        Number(generation);

    if (
        !Number.isFinite(
            generationNumber
        )
    ) {
        return;
    }

    selectedGeneration =
        generationNumber;

    if (
        generationNumber === 0
    ) {

        filteredPokemon =
            [...allPokemon];

    } else {

        const range =
            getGenerationRange(
                generationNumber
            );

        if (!range) return;

        filteredPokemon =
            allPokemon.filter(
                pokemon =>
                    pokemon.id >=
                        range[0] &&
                    pokemon.id <=
                        range[1]
            );
    }

    visibleCount = 50;

    renderPokemon();

    updateGenerationMenuState();
}

/* =========================================================
   NOVO:
   CONSTRÓI OS DOIS MENUS NO LOCAL DOS BOTÕES ANTIGOS
========================================================= */

function setupGenerationButtons() {

    const container =
        document.querySelector(
            ".generation-pills"
        );

    if (!container) {
        return;
    }

    container.innerHTML = `
        <div
            class="pokedex-filter-menu"
            id="pokemonFilterMenu"
            style="
                position:relative;
                display:inline-block;
                margin-right:10px;
            "
        >

            <button
                type="button"
                class="generation-pill pokedex-filter-button"
                id="pokemonFilterButton"
                onclick="togglePokemonFilterMenu(event)"
            >
                Pokémon ▾
            </button>

            <div
                id="pokemonFilterDropdown"
                class="pokedex-filter-dropdown"
                style="
                    display:none;
                    position:absolute;
                    top:calc(100% + 8px);
                    left:0;
                    z-index:9999;
                    min-width:180px;
                    padding:8px;
                    border-radius:12px;
                    background:#10151f;
                    border:1px solid rgba(255,255,255,.12);
                    box-shadow:0 15px 40px rgba(0,0,0,.45);
                "
            >

                <button
                    type="button"
                    class="generation-pill pokemon-filter-option"
                    data-mode="normal"
                    onclick="selectPokemonMode('normal')"
                    style="width:100%;"
                >
                    Normal
                </button>

                <button
                    type="button"
                    class="generation-pill pokemon-filter-option"
                    data-mode="shiny"
                    onclick="selectPokemonMode('shiny')"
                    style="width:100%;"
                >
                    ✨ Shiny
                </button>

            </div>

        </div>

        <div
            class="pokedex-filter-menu"
            id="generationFilterMenu"
            style="
                position:relative;
                display:inline-block;
            "
        >

            <button
                type="button"
                class="generation-pill pokedex-filter-button"
                id="generationFilterButton"
                onclick="toggleGenerationFilterMenu(event)"
            >
                Gerações ▾
            </button>

            <div
                id="generationFilterDropdown"
                class="pokedex-filter-dropdown"
                style="
                    display:none;
                    position:absolute;
                    top:calc(100% + 8px);
                    left:0;
                    z-index:9999;
                    min-width:220px;
                    max-height:420px;
                    overflow-y:auto;
                    padding:8px;
                    border-radius:12px;
                    background:#10151f;
                    border:1px solid rgba(255,255,255,.12);
                    box-shadow:0 15px 40px rgba(0,0,0,.45);
                "
            >

                <button
                    type="button"
                    class="generation-pill generation-filter-option"
                    data-generation="0"
                    onclick="selectGeneration(0)"
                    style="width:100%;"
                >
                    Todas
                </button>

                ${generations
                    .map(
                        generation => `
                            <button
                                type="button"
                                class="generation-pill generation-filter-option"
                                data-generation="${generation.id}"
                                onclick="selectGeneration(${generation.id})"
                                style="width:100%;"
                            >
                                ${generation.roman} — ${generation.region}
                            </button>
                        `
                    )
                    .join("")}

            </div>

        </div>
    `;

    updatePokemonMenuState();
    updateGenerationMenuState();
}

/* =========================================================
   ABRIR/FECHAR MENU POKÉMON
========================================================= */

function togglePokemonFilterMenu(
    event
) {

    if (event) {
        event.stopPropagation();
    }

    const dropdown =
        document.getElementById(
            "pokemonFilterDropdown"
        );

    const generationDropdown =
        document.getElementById(
            "generationFilterDropdown"
        );

    if (!dropdown) return;

    if (generationDropdown) {
        generationDropdown.style.display =
            "none";
    }

    dropdown.style.display =
        dropdown.style.display === "block"
            ? "none"
            : "block";
}

/* =========================================================
   ABRIR/FECHAR MENU GERAÇÕES
========================================================= */

function toggleGenerationFilterMenu(
    event
) {

    if (event) {
        event.stopPropagation();
    }

    const dropdown =
        document.getElementById(
            "generationFilterDropdown"
        );

    const pokemonDropdown =
        document.getElementById(
            "pokemonFilterDropdown"
        );

    if (!dropdown) return;

    if (pokemonDropdown) {
        pokemonDropdown.style.display =
            "none";
    }

    dropdown.style.display =
        dropdown.style.display === "block"
            ? "none"
            : "block";
}

/* =========================================================
   SELECIONAR NORMAL / SHINY
========================================================= */

function selectPokemonMode(
    mode
) {

    setPokemonDisplayMode(
        mode
    );

    const dropdown =
        document.getElementById(
            "pokemonFilterDropdown"
        );

    if (dropdown) {
        dropdown.style.display =
            "none";
    }
}

/* =========================================================
   SELECIONAR GERAÇÃO
========================================================= */

function selectGeneration(
    generation
) {

    setGenerationFilter(
        generation
    );

    const dropdown =
        document.getElementById(
            "generationFilterDropdown"
        );

    if (dropdown) {
        dropdown.style.display =
            "none";
    }
}

/* =========================================================
   ATUALIZA TEXTO/ESTADO DO MENU POKÉMON
========================================================= */

function updatePokemonMenuState() {

    const button =
        document.getElementById(
            "pokemonFilterButton"
        );

    if (button) {

        button.textContent =
            pokemonDisplayMode === "shiny"
                ? "Pokémon • ✨ Shiny ▾"
                : "Pokémon • Normal ▾";
    }

    document
        .querySelectorAll(
            ".pokemon-filter-option"
        )
        .forEach(
            option => {

                const mode =
                    option.dataset.mode;

                option.classList.toggle(
                    "active",
                    mode ===
                    pokemonDisplayMode
                );
            }
        );
}

/* =========================================================
   ATUALIZA TEXTO/ESTADO DO MENU GERAÇÕES
========================================================= */

function updateGenerationMenuState() {

    const button =
        document.getElementById(
            "generationFilterButton"
        );

    if (button) {

        if (
            selectedGeneration === 0
        ) {

            button.textContent =
                "Gerações • Todas ▾";

        } else {

            const generation =
                generations.find(
                    item =>
                        item.id ===
                        selectedGeneration
                );

            if (generation) {

                button.textContent =
                    `Gerações • ${generation.roman} — ${generation.region} ▾`;
            }
        }
    }

    document
        .querySelectorAll(
            ".generation-filter-option"
        )
        .forEach(
            option => {

                const generation =
                    Number(
                        option.dataset.generation
                    );

                option.classList.toggle(
                    "active",
                    generation ===
                    selectedGeneration
                );
            }
        );
}

/* =========================================================
   FECHAR DROPDOWNS AO CLICAR FORA
========================================================= */

document.addEventListener(
    "click",
    event => {

        const pokemonMenu =
            document.getElementById(
                "pokemonFilterMenu"
            );

        const generationMenu =
            document.getElementById(
                "generationFilterMenu"
            );

        const pokemonDropdown =
            document.getElementById(
                "pokemonFilterDropdown"
            );

        const generationDropdown =
            document.getElementById(
                "generationFilterDropdown"
            );

        if (
            pokemonMenu &&
            !pokemonMenu.contains(event.target) &&
            pokemonDropdown
        ) {

            pokemonDropdown.style.display =
                "none";
        }

        if (
            generationMenu &&
            !generationMenu.contains(event.target) &&
            generationDropdown
        ) {

            generationDropdown.style.display =
                "none";
        }
    }
);

/* =========================================================
   PESQUISA HOME
========================================================= */

function searchPokemon(
    query
) {

    const input =
        document.getElementById(
            "homeSearchInput"
        );

    if (
        query === undefined ||
        query === null
    ) {

        query =
            input?.value || "";
    }

    query =
        String(query)
            .trim()
            .toLowerCase();

    if (!query) {

        if (
            selectedGeneration ===
            0
        ) {

            filteredPokemon =
                [...allPokemon];

        } else {

            const range =
                getGenerationRange(
                    selectedGeneration
                );

            if (range) {

                filteredPokemon =
                    allPokemon.filter(
                        pokemon =>
                            pokemon.id >=
                                range[0] &&
                            pokemon.id <=
                                range[1]
                    );

            } else {

                filteredPokemon =
                    [...allPokemon];
            }
        }

        visibleCount = 50;

        renderPokemon();

        return;
    }

    filteredPokemon =
        allPokemon.filter(
            pokemon => {

                if (
                    selectedGeneration !==
                    0
                ) {

                    const range =
                        getGenerationRange(
                            selectedGeneration
                        );

                    if (
                        !range ||
                        pokemon.id <
                            range[0] ||
                        pokemon.id >
                            range[1]
                    ) {

                        return false;
                    }
                }

                const name =
                    pokemon.name
                        .toLowerCase();

                const id =
                    String(
                        pokemon.id
                    );

                return (
                    name.includes(query) ||
                    id.includes(query)
                );
            }
        );

    visibleCount = 50;

    renderPokemon();
}

/* =========================================================
   PESQUISA DA PÁGINA
   FUNCIONA ENQUANTO DIGITA
========================================================= */

function searchFromPage() {

    const input =
        document.getElementById(
            "searchPageInput"
        );

    const results =
        document.getElementById(
            "searchResults"
        );

    if (!input || !results) {
        return;
    }

    const query =
        input.value
            .trim()
            .toLowerCase();

    if (!query) {

        results.innerHTML = "";

        return;
    }

    if (!allPokemon.length) {

        results.innerHTML = `
            <div class="search-empty">

                <div style="font-size:42px;">
                    ⏳
                </div>

                <h3>
                    Carregando Pokédex...
                </h3>

                <p>
                    Aguarde um instante.
                </p>

            </div>
        `;

        return;
    }

    const matches =
        allPokemon.filter(
            pokemon => {

                const name =
                    pokemon.name
                        .toLowerCase();

                const id =
                    String(
                        pokemon.id
                    );

                return (
                    name.includes(query) ||
                    id.includes(query)
                );
            }
        );

    if (!matches.length) {

        results.innerHTML = `
            <div class="search-empty">

                <div style="font-size:42px;">
                    😕
                </div>

                <h3>
                    Nenhum Pokémon encontrado
                </h3>

                <p>
                    Tente outro nome ou número.
                </p>

            </div>
        `;

        return;
    }

    results.innerHTML = "";

    matches
        .slice(0, 100)
        .forEach(
            pokemon => {

                results.appendChild(
                    createPokemonCard(
                        pokemon
                    )
                );

            }
        );
}

/* =========================================================
   FILTRO POR TIPO
========================================================= */

async function filterType(
    type
) {

    if (!type) return;

    await filterByType(
        type
    );
}

async function filterByType(
    type
) {

    if (!type) return;

    try {

        showPage(
            "homePage"
        );

        const grid =
            document.getElementById(
                "pokedex"
            );

        if (grid) {

            grid.innerHTML = `
                <div class="loading">

                    <div class="loading-spinner"></div>

                    <p>
                        Carregando Pokémon do tipo
                        ${
                            typeInfo[type]?.name ||
                            type
                        }...
                    </p>

                </div>
            `;
        }

        const data =
            await apiFetch(
                `${API}/type/${type}`
            );

        const ids =
            data.pokemon
                .map(
                    item =>
                        getIdFromUrl(
                            item.pokemon?.url
                        )
                )
                .filter(
                    id =>
                        Number.isFinite(id) &&
                        id > 0 &&
                        id <= MAX_POKEMON
                );

        const idSet =
            new Set(ids);

        filteredPokemon =
            allPokemon.filter(
                pokemon =>
                    idSet.has(
                        Number(
                            pokemon.id
                        )
                    )
            );

        visibleCount = 50;

        renderPokemon();

        if (
            typeof updateTypeFilterIndicator ===
            "function"
        ) {

            updateTypeFilterIndicator(
                type
            );
        }

        setTimeout(
            () => {

                const target =
                    document.getElementById(
                        "pokedex"
                    );

                if (target) {

                    target.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });
                }

            },
            100
        );

    } catch (error) {

        console.error(
            "Erro ao filtrar tipo:",
            error
        );

        const grid =
            document.getElementById(
                "pokedex"
            );

        if (grid) {

            grid.innerHTML = `
                <div class="error-message">

                    <div style="font-size:42px;">
                        ⚠️
                    </div>

                    <h3>
                        Não foi possível carregar este tipo
                    </h3>

                    <p>
                        Tente novamente em alguns segundos.
                    </p>

                    <button
                        onclick="filterByType('${type}')"
                    >
                        Tentar novamente
                    </button>

                </div>
            `;
        }
    }
}

/* =========================================================
   FILTRO POR GERAÇÃO
========================================================= */

function getGenerationRange(
    generation
) {

    const ranges = {

        1: [1, 151],
        2: [152, 251],
        3: [252, 386],
        4: [387, 493],
        5: [494, 649],
        6: [650, 721],
        7: [722, 809],
        8: [810, 905],
        9: [906, 1025]

    };

    return (
        ranges[generation] ||
        null
    );
}

function filterGeneration(
    generation,
    button
) {

    const generationNumber =
        Number(generation);

    if (
        generationNumber === 0 ||
        generation === "0"
    ) {

        selectedGeneration = 0;

        filteredPokemon =
            [...allPokemon];

    } else {

        const range =
            getGenerationRange(
                generationNumber
            );

        if (!range) return;

        selectedGeneration =
            generationNumber;

        filteredPokemon =
            allPokemon.filter(
                pokemon =>
                    pokemon.id >=
                        range[0] &&
                    pokemon.id <=
                        range[1]
            );
    }

    visibleCount = 50;

    /*
       Mantém compatibilidade com os
       antigos botões de geração caso
       existam em alguma parte do site.
    */

    document
        .querySelectorAll(
            ".generation-pill"
        )
        .forEach(
            item => {

                item.classList.remove(
                    "active"
                );

            }
        );

    if (button) {

        button.classList.add(
            "active"
        );

    }

    updateGenerationMenuState();

    showPage(
        "homePage"
    );

    renderPokemon();
}

/* =========================================================
   GERAÇÕES — PÁGINA
========================================================= */

function buildGenerations() {

    const grid =
        document.getElementById(
            "generationsGrid"
        );

    if (!grid) return;

    grid.innerHTML = "";

    generations.forEach(
        generation => {

            const card =
                document.createElement(
                    "article"
                );

            card.className =
                `generation-card ${generation.css}`;

            card.innerHTML = `
                <div class="generation-card-glow"></div>

                <div class="generation-content">

                    <div class="generation-number">
                        GERAÇÃO ${generation.roman}
                    </div>

                    <h2>
                        ${generation.region}
                    </h2>

                    <p>
                        ${generation.description}
                    </p>

                    <button
                        class="generation-explore"
                        onclick="filterGeneration(${generation.id})"
                    >
                        Explorar Pokémon
                    </button>

                </div>
            `;

            card.addEventListener(
                "click",
                event => {

                    if (
                        event.target.closest(
                            "button"
                        )
                    ) {
                        return;
                    }

                    filterGeneration(
                        generation.id
                    );
                }
            );

            grid.appendChild(
                card
            );
        }
    );
}

/* =========================================================
   ABRIR FICHA
========================================================= */

async function openPokemon(
    idOrPokemon
) {

    let id =
        typeof idOrPokemon ===
        "object"
            ? idOrPokemon.id
            : idOrPokemon;

    if (!id) return;

    currentPage =
        "pokemonDetails";

    const detailPage =
        document.getElementById(
            "pokemonDetails"
        );

    const detailContent =
        document.getElementById(
            "detailContent"
        );

    if (
        !detailPage ||
        !detailContent
    ) {
        return;
    }

    detailPage.classList.add(
        "active"
    );

    document
        .querySelectorAll(
            ".page"
        )
        .forEach(
            page => {

                page.classList.remove(
                    "active"
                );

            }
        );

    detailContent.innerHTML = `
        <div class="loading detail-loading">

            <div class="loading-spinner"></div>

            <p>
                Carregando informações...
            </p>

        </div>
    `;

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

    try {

        const pokemon =
            await getPokemon(
                id
            );

        currentPokemon =
            pokemon;

        await buildPokemonDetails(
            pokemon
        );

    } catch (error) {

        console.error(
            "Erro ao abrir Pokémon:",
            error
        );

        detailContent.innerHTML = `
            <div class="error-message">

                <div style="font-size:50px;">
                    ⚠️
                </div>

                <h2>
                    Não foi possível carregar este Pokémon
                </h2>

                <p>
                    Verifique sua conexão e tente novamente.
                </p>

                <button
                    onclick="openPokemon(${id})"
                >
                    Tentar novamente
                </button>

            </div>
        `;
    }
}

/* =========================================================
   FECHAR FICHA
========================================================= */

function closePokemon() {

    const detailPage =
        document.getElementById(
            "pokemonDetails"
        );

    if (detailPage) {

        detailPage.classList.remove(
            "active"
        );
    }

    currentPokemon = null;

    showPage(
        "homePage"
    );
}

/* =========================================================
   FICHA COMPLETA
========================================================= */

async function buildPokemonDetails(
    pokemon
) {

    const detailContent =
        document.getElementById(
            "detailContent"
        );

    if (!detailContent) return;

    const species =
        await getSpecies(
            pokemon.id
        );

    const englishName =
        getEnglishPokemonName(
            species,
            pokemon
        );

    const description =
        getPortugueseDescription(
            species
        );

    const genus =
        getPortugueseGenus(
            species
        );

    const image =
        getPokemonImage(
            pokemon
        );

    const shiny =
        getPokemonShiny(
            pokemon
        );

    const types =
        pokemon.types || [];

    const abilities =
        pokemon.abilities || [];

    const stats =
        pokemon.stats || [];

    const height =
        (pokemon.height / 10)
            .toFixed(1);

    const weight =
        (pokemon.weight / 10)
            .toFixed(1);

    detailContent.innerHTML = `

        <div class="pokemon-detail-header">

            <div class="pokemon-detail-number">
                #${formatNumber(pokemon.id)}
            </div>

            <h1>
                ${englishName}
            </h1>

            ${
                genus
                    ? `
                        <div class="pokemon-genus">
                            ${genus}
                        </div>
                    `
                    : ""
            }

            <div class="pokemon-detail-types">

                ${types
                    .map(
                        item => {

                            const type =
                                item.type.name;

                            return `
                                <span
                                    class="type-badge type-${type}"
                                >
                                    ${
                                        typeInfo[type]?.name ||
                                        capitalize(type)
                                    }
                                </span>
                            `;
                        }
                    )
                    .join("")}

            </div>

        </div>

        <div class="pokemon-main-showcase">

            <div class="pokemon-main-image">

                <img
                    src="${image}"
                    alt="${englishName}"
                    loading="eager"
                >

            </div>

            <div class="pokemon-description">

                <h2>
                    Sobre este Pokémon
                </h2>

                <p>
                    ${description}
                </p>

                <div class="pokemon-measures">

                    <div class="measure-box">

                        <span class="measure-label">
                            Altura
                        </span>

                        <strong>
                            ${height} m
                        </strong>

                    </div>

                    <div class="measure-box">

                        <span class="measure-label">
                            Peso
                        </span>

                        <strong>
                            ${weight} kg
                        </strong>

                    </div>

                </div>

            </div>

        </div>

        <div class="detail-section">

            <h2>
                Informações básicas
            </h2>

            <div
                id="basicInfoContainer"
                class="basic-info-grid"
            >
                ${buildBasicInfo(
                    pokemon,
                    species
                )}
            </div>

        </div>

        <div class="detail-section">

            <h2>
                Habilidades
            </h2>

            <div
                id="abilitiesContainer"
                class="abilities-list"
            >
                ${buildAbilities(
                    abilities
                )}
            </div>

        </div>

        <div class="detail-section">

            <h2>
                Fraquezas
            </h2>

            <div
                id="weaknessesContainer"
                class="weaknesses-list"
            >
                <div class="loading">
                    Calculando fraquezas...
                </div>
            </div>

        </div>

        <div class="detail-section">

            <h2>
                Estatísticas
            </h2>

            <div
                id="statsContainer"
                class="stats-container"
            >
                ${buildStats(
                    stats
                )}
            </div>

        </div>

        <div class="detail-section shiny-section">

            <h2>
                ✨ Shiny
            </h2>

            <div class="shiny-content">

                <div class="shiny-card">

                    <div class="shiny-label">
                        NORMAL
                    </div>

                    <img
                        src="${image}"
                        alt="${englishName}"
                        loading="lazy"
                    >

                    <strong>
                        ${englishName}
                    </strong>

                </div>

                <div class="shiny-card">

                    <div class="shiny-label">
                        SHINY
                    </div>

                    <img
                        src="${shiny}"
                        alt="${englishName} Shiny"
                        loading="lazy"
                    >

                    <strong>
                        ${englishName} Shiny
                    </strong>

                </div>

            </div>

        </div>

        <div class="detail-section">

            <h2>
                🧬 Evoluções
            </h2>

            <div
                id="evolutionContainer"
                class="evolution-container"
            >
                <div class="loading">
                    Carregando evoluções...
                </div>
            </div>

        </div>

        <div class="detail-section mega-section">

            <h2>
                ✨ Mega Evoluções
            </h2>

            <div
                id="megaContainer"
                class="mega-container"
            >
                <div class="loading">
                    Carregando Mega Evoluções...
                </div>
            </div>

        </div>
    `;

    buildEvolutionSection(
        species,
        pokemon.name
    );

    buildWeaknessesSection(
        pokemon
    );

    if (
        typeof loadMegaTab ===
        "function"
    ) {

        try {

            await loadMegaTab(
                pokemon.name
            );

        } catch (error) {

            console.error(
                "Erro ao carregar Mega Evoluções:",
                error
            );

            const megaContainer =
                document.getElementById(
                    "megaContainer"
                );

            if (megaContainer) {

                megaContainer.innerHTML = `
                    <div class="no-mega">

                        <h3>
                            Não foi possível carregar as Mega Evoluções
                        </h3>

                        <p>
                            Tente novamente em alguns segundos.
                        </p>

                    </div>
                `;
            }
        }

    } else {

        const megaContainer =
            document.getElementById(
                "megaContainer"
            );

        if (megaContainer) {

            megaContainer.innerHTML = `
                <div class="no-mega">

                    <h3>
                        Mega Evoluções indisponíveis
                    </h3>

                    <p>
                        O módulo de Mega Evoluções não foi carregado.
                    </p>

                </div>
            `;
        }
    }
}

/* =========================================================
   INFORMAÇÕES BÁSICAS
========================================================= */

function buildBasicInfo(
    pokemon,
    species
) {

    const genderRate =
        species?.gender_rate;

    let genderText =
        "Desconhecido";

    if (
        genderRate === -1
    ) {

        genderText =
            "Sem gênero";

    } else if (
        typeof genderRate ===
        "number"
    ) {

        const female =
            genderRate * 12.5;

        const male =
            100 - female;

        genderText =
            `${male}% ♂ / ${female}% ♀`;
    }

    const legendary =
        species?.is_legendary
            ? "Sim"
            : "Não";

    const mythical =
        species?.is_mythical
            ? "Sim"
            : "Não";

    return `

        <div class="info-box">

            <span>
                Nº Nacional
            </span>

            <strong>
                #${formatNumber(
                    pokemon.id
                )}
            </strong>

        </div>

        <div class="info-box">

            <span>
                Gênero
            </span>

            <strong>
                ${genderText}
            </strong>

        </div>

        <div class="info-box">

            <span>
                Lendário
            </span>

            <strong>
                ${legendary}
            </strong>

        </div>

        <div class="info-box">

            <span>
                Mítico
            </span>

            <strong>
                ${mythical}
            </strong>

        </div>

        <div class="info-box">

            <span>
                Taxa de captura
            </span>

            <strong>
                ${species?.capture_rate ?? "—"}
            </strong>

        </div>

        <div class="info-box">

            <span>
                Felicidade base
            </span>

            <strong>
                ${species?.base_happiness ?? "—"}
            </strong>

        </div>
    `;
}

/* =========================================================
   HABILIDADES
========================================================= */

function buildAbilities(
    abilities
) {

    if (!abilities?.length) {

        return `
            <p>
                Nenhuma habilidade disponível.
            </p>
        `;
    }

    return abilities
        .map(
            ability => {

                const name =
                    formatPokemonName(
                        ability.ability?.name
                    );

                const hidden =
                    ability.is_hidden
                        ? "Oculta"
                        : "Normal";

                return `

                    <div class="ability-card">

                        <div class="ability-name">
                            ${name}
                        </div>

                        <div class="ability-status">
                            ${hidden}
                        </div>

                    </div>

                `;
            }
        )
        .join("");
}

/* =========================================================
   FRAQUEZAS
========================================================= */

async function calculateWeaknesses(
    pokemon
) {

    const multiplier = {};

    Object.keys(
        typeInfo
    ).forEach(
        type => {

            multiplier[type] = 1;

        }
    );

    for (
        const item of pokemon.types
    ) {

        try {

            const data =
                await apiFetch(
                    `${API}/type/${item.type.name}`
                );

            const relations =
                data.damage_relations;

            relations
                .double_damage_from
                .forEach(
                    entry => {

                        multiplier[
                            entry.name
                        ] *= 2;

                    }
                );

            relations
                .half_damage_from
                .forEach(
                    entry => {

                        multiplier[
                            entry.name
                        ] *= 0.5;

                    }
                );

            relations
                .no_damage_from
                .forEach(
                    entry => {

                        multiplier[
                            entry.name
                        ] = 0;

                    }
                );

        } catch (error) {

            console.warn(
                "Erro ao calcular fraquezas:",
                error
            );
        }
    }

    return multiplier;
}

async function buildWeaknesses(
    pokemon
) {

    const multiplier =
        await calculateWeaknesses(
            pokemon
        );

    return Object.keys(
        typeInfo
    )
        .filter(
            type =>
                multiplier[type] !== 1
        )
        .sort(
            (a, b) =>
                multiplier[b] -
                multiplier[a]
        )
        .map(
            type => {

                const value =
                    multiplier[type];

                let label = "";

                if (value === 4) {
                    label = "4×";
                } else if (value === 2) {
                    label = "2×";
                } else if (value === 0.5) {
                    label = "½×";
                } else if (value === 0.25) {
                    label = "¼×";
                } else if (value === 0) {
                    label = "0×";
                } else {
                    label = `${value}×`;
                }

                return `

                    <div
                        class="weakness-item type-${type}"
                    >

                        <span>
                            ${typeInfo[type].icon}
                        </span>

                        <strong>
                            ${typeInfo[type].name}
                        </strong>

                        <b>
                            ${label}
                        </b>

                    </div>

                `;
            }
        )
        .join("");
}

async function buildWeaknessesSection(
    pokemon
) {

    const container =
        document.getElementById(
            "weaknessesContainer"
        );

    if (!container) return;

    try {

        container.innerHTML =
            await buildWeaknesses(
                pokemon
            );

    } catch (error) {

        console.error(
            "Erro nas fraquezas:",
            error
        );

        container.innerHTML = `
            <p>
                Não foi possível calcular as fraquezas.
            </p>
        `;
    }
}

/* =========================================================
   ESTATÍSTICAS
========================================================= */

function translateStat(
    stat
) {

    const names = {

        hp: "HP",
        attack: "Ataque",
        defense: "Defesa",
        "special-attack":
            "Ataque Especial",
        "special-defense":
            "Defesa Especial",
        speed:
            "Velocidade"

    };

    return (
        names[stat] ||
        capitalize(stat)
    );
}

function buildStats(
    stats
) {

    if (!stats?.length) {

        return `
            <p>
                Estatísticas indisponíveis.
            </p>
        `;
    }

    const total =
        stats.reduce(
            (sum, item) =>
                sum +
                item.base_stat,
            0
        );

    return `

        <div class="stats-list">

            ${stats
                .map(
                    item => {

                        const name =
                            item.stat.name;

                        const value =
                            item.base_stat;

                        const percentage =
                            Math.min(
                                100,
                                (value / 255) * 100
                            );

                        return `

                            <div class="stat-row">

                                <div class="stat-name">
                                    ${translateStat(
                                        name
                                    )}
                                </div>

                                <div class="stat-value">
                                    ${value}
                                </div>

                                <div class="stat-bar">

                                    <div
                                        class="stat-bar-fill"
                                        style="width:${percentage}%"
                                    ></div>

                                </div>

                            </div>

                        `;
                    }
                )
                .join("")}

            <div class="stat-total">

                <span>
                    Total
                </span>

                <strong>
                    ${total}
                </strong>

            </div>

        </div>
    `;
}

/* =========================================================
   EVOLUÇÕES
========================================================= */

async function getEvolutionChain(
    species
) {

    const url =
        species?.evolution_chain?.url;

    if (!url) {
        return null;
    }

    if (
        evolutionCache.has(url)
    ) {

        return evolutionCache.get(
            url
        );
    }

    const data =
        await apiFetch(url);

    evolutionCache.set(
        url,
        data
    );

    return data;
}

function findEvolutionNode(
    chain,
    targetName,
    ancestors = []
) {

    if (!chain) {
        return null;
    }

    const currentName =
        chain.species?.name
            ?.toLowerCase();

    if (
        currentName ===
        String(targetName).toLowerCase()
    ) {

        return {
            node: chain,
            ancestors: ancestors
        };
    }

    if (
        Array.isArray(
            chain.evolves_to
        )
    ) {

        for (
            const next of chain.evolves_to
        ) {

            const found =
                findEvolutionNode(
                    next,
                    targetName,
                    [
                        ...ancestors,
                        chain
                    ]
                );

            if (found) {
                return found;
            }
        }
    }

    return null;
}

function collectDescendants(
    node,
    result = []
) {

    if (!node?.evolves_to) {
        return result;
    }

    node.evolves_to.forEach(
        next => {

            if (
                next?.species?.name
            ) {

                result.push(next);

                collectDescendants(
                    next,
                    result
                );
            }

        }
    );

    return result;
}

function uniqueEvolutionNodes(
    nodes
) {

    const seen =
        new Set();

    return nodes.filter(
        node => {

            const name =
                node?.species?.name
                    ?.toLowerCase();

            if (!name) {
                return false;
            }

            if (
                seen.has(name)
            ) {
                return false;
            }

            seen.add(name);

            return true;
        }
    );
}

function buildEvolutionCards(
    nodes,
    currentName
) {

    const current =
        String(
            currentName
        ).toLowerCase();

    const filtered =
        uniqueEvolutionNodes(
            nodes
        ).filter(
            node =>
                node.species?.name
                    ?.toLowerCase() !==
                current
        );

    if (!filtered.length) {

        return `
            <div class="evolution-empty">
                <div style="font-size:38px;">
                    ✨
                </div>

                <p>
                    Este Pokémon não possui outras evoluções na cadeia.
                </p>
            </div>
        `;
    }

    return `
        <div class="evolution-chain">

            ${filtered
                .map(
                    (evolution, index) => {

                        const name =
                            evolution.species?.name;

                        const displayName =
                            formatPokemonName(
                                name
                            );

                        const id =
                            getIdFromUrl(
                                evolution.species?.url
                            );

                        return `

                            ${
                                index > 0
                                    ? `
                                        <div class="evolution-arrow">
                                            →
                                        </div>
                                    `
                                    : ""
                            }

                            <div
                                class="evolution-card"
                                onclick="openPokemon(${id})"
                                role="button"
                                tabindex="0"
                                title="Abrir ficha de ${displayName}"
                            >

                                <div class="evolution-number">
                                    #${formatNumber(id)}
                                </div>

                                <img
                                    src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png"
                                    alt="${displayName}"
                                    loading="lazy"
                                >

                                <strong>
                                    ${displayName}
                                </strong>

                            </div>

                        `;
                    }
                )
                .join("")}

        </div>
    `;
}

async function buildEvolutionSection(
    species,
    currentName
) {

    const container =
        document.getElementById(
            "evolutionContainer"
        );

    if (!container) return;

    try {

        const chain =
            await getEvolutionChain(
                species
            );

        if (!chain) {

            container.innerHTML = `
                <div class="evolution-empty">

                    <div style="font-size:38px;">
                        ✨
                    </div>

                    <p>
                        Este Pokémon não possui uma cadeia de evolução.
                    </p>

                </div>
            `;

            return;
        }

        const found =
            findEvolutionNode(
                chain.chain,
                currentName
            );

        if (!found) {

            const allNodes = [];

            flattenEvolutionChain(
                chain.chain,
                allNodes
            );

            container.innerHTML =
                buildEvolutionCards(
                    allNodes,
                    currentName
                );

            return;
        }

        const previous =
            found.ancestors || [];

        const next =
            collectDescendants(
                found.node
            );

        const evolutionNodes =
            uniqueEvolutionNodes([
                ...previous,
                ...next
            ]);

        container.innerHTML =
            buildEvolutionCards(
                evolutionNodes,
                currentName
            );

    } catch (error) {

        console.error(
            "Erro nas evoluções:",
            error
        );

        container.innerHTML = `
            <div class="evolution-empty">

                <p>
                    Não foi possível carregar as evoluções.
                </p>

            </div>
        `;
    }
}

/* =========================================================
   FUNÇÃO AUXILIAR PARA CADEIA COMPLETA
========================================================= */

function flattenEvolutionChain(
    chain,
    result = []
) {

    if (!chain) {
        return result;
    }

    result.push({
        name:
            chain.species?.name,

        url:
            chain.species?.url,

        details:
            chain.evolution_details ||
            [],

        species:
            chain.species
    });

    if (
        Array.isArray(
            chain.evolves_to
        )
    ) {

        chain.evolves_to.forEach(
            next => {

                flattenEvolutionChain(
                    next,
                    result
                );

            }
        );
    }

    return result;
}

/* =========================================================
   PÁGINAS
========================================================= */

function showPage(
    pageId
) {

    const detailPage =
        document.getElementById(
            "pokemonDetails"
        );

    if (detailPage) {

        detailPage.classList.remove(
            "active"
        );
    }

    document
        .querySelectorAll(
            ".page"
        )
        .forEach(
            page => {

                page.classList.remove(
                    "active"
                );

            }
        );

    const page =
        document.getElementById(
            pageId
        );

    if (page) {

        page.classList.add(
            "active"
        );

        currentPage =
            pageId;
    }

    if (
        pageId === "typesPage" &&
        typeof buildTypesPage ===
        "function"
    ) {

        buildTypesPage();
    }

    if (
        pageId ===
        "generationsPage"
    ) {

        buildGenerations();
    }

    closeMenu();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

/* =========================================================
   MENU
========================================================= */

function openSideMenu() {

    const overlay =
        document.getElementById(
            "menuOverlay"
        );

    if (overlay) {

        overlay.classList.add(
            "active"
        );
    }
}

function closeSideMenu(
    event
) {

    const overlay =
        document.getElementById(
            "menuOverlay"
        );

    if (!overlay) return;

    if (
        event &&
        event.target !== overlay
    ) {
        return;
    }

    overlay.classList.remove(
        "active"
    );
}

function openMenu() {

    openSideMenu();
}

function closeMenu(
    event
) {

    closeSideMenu(
        event
    );
}

/* =========================================================
   HOME
========================================================= */

function goHome() {

    showPage(
        "homePage"
    );
}

/* =========================================================
   PESQUISA
========================================================= */

function setupSearch() {

    const homeInput =
        document.getElementById(
            "homeSearchInput"
        );

    if (homeInput) {

        homeInput.addEventListener(
            "keydown",
            event => {

                if (
                    event.key !==
                    "Enter"
                ) {
                    return;
                }

                const query =
                    homeInput.value
                        .trim()
                        .toLowerCase();

                if (!query) return;

                const result =
                    allPokemon.find(
                        pokemon =>
                            pokemon.name
                                .toLowerCase() ===
                                query ||
                            String(
                                pokemon.id
                            ) === query
                    );

                if (result) {

                    openPokemon(
                        result.id
                    );
                }
            }
        );
    }

    const pageInput =
        document.getElementById(
            "searchPageInput"
        );

    if (pageInput) {

        pageInput.addEventListener(
            "keydown",
            event => {

                if (
                    event.key !==
                    "Enter"
                ) {
                    return;
                }

                const query =
                    pageInput.value
                        .trim()
                        .toLowerCase();

                if (!query) return;

                const result =
                    allPokemon.find(
                        pokemon =>
                            pokemon.name
                                .toLowerCase() ===
                                query ||
                            String(
                                pokemon.id
                            ) === query
                    );

                if (result) {

                    openPokemon(
                        result.id
                    );
                }
            }
        );
    }
}

/* =========================================================
   MENU
========================================================= */

function setupMenu() {

    const overlay =
        document.getElementById(
            "menuOverlay"
        );

    if (!overlay) return;

    const sideMenu =
        overlay.querySelector(
            ".side-menu"
        );

    if (sideMenu) {

        sideMenu.addEventListener(
            "click",
            event => {

                event.stopPropagation();

            }
        );
    }
}

/* =========================================================
   ESC
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key ===
            "Escape"
        ) {

            closeMenu();

            const pokemonDropdown =
                document.getElementById(
                    "pokemonFilterDropdown"
                );

            const generationDropdown =
                document.getElementById(
                    "generationFilterDropdown"
                );

            if (pokemonDropdown) {
                pokemonDropdown.style.display =
                    "none";
            }

            if (generationDropdown) {
                generationDropdown.style.display =
                    "none";
            }

            const detail =
                document.getElementById(
                    "pokemonDetails"
                );

            if (
                detail &&
                detail.classList.contains(
                    "active"
                )
            ) {

                closePokemon();
            }
        }
    }
);

/* =========================================================
   INICIALIZAÇÃO
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        setupSearch();

        setupGenerationButtons();

        setupMenu();

        buildGenerations();

        await loadPokemon();

    }
);
