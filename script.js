/* =========================================================
   POKÉDEX ONLINE — SCRIPT PRINCIPAL
   Pokémon Community
========================================================= */

const API = "https://pokeapi.co/api/v2";

let allPokemon = [];
let filteredPokemon = [];

let visibleCount = 50;
let currentPokemon = null;
let currentPage = "homePage";


/* =========================================================
   TRADUÇÃO DOS NOMES
========================================================= */

const pokemonNames = {

    bulbasaur:"Bulbassauro",
    ivysaur:"Ivysaur",
    venusaur:"Venusaur",

    charmander:"Charmander",
    charmeleon:"Charmeleon",
    charizard:"Charizard",

    squirtle:"Squirtle",
    wartortle:"Wartortle",
    blastoise:"Blastoise",

    caterpie:"Caterpie",
    metapod:"Metapod",
    butterfree:"Butterfree",

    weedle:"Weedle",
    kakuna:"Kakuna",
    beedrill:"Beedrill",

    pidgey:"Pidgey",
    pidgeotto:"Pidgeotto",
    pidgeot:"Pidgeot",

    rattata:"Rattata",
    raticate:"Raticate",

    spearow:"Spearow",
    fearow:"Fearow",

    ekans:"Ekans",
    arbok:"Arbok",

    pikachu:"Pikachu",
    raichu:"Raichu",

    sandshrew:"Sandshrew",
    sandslash:"Sandslash",

    nidoran:"Nidoran",
    nidorina:"Nidorina",
    nidorino:"Nidorino",
    nidoqueen:"Nidoqueen",
    nidoking:"Nidoking",

    clefairy:"Clefairy",
    clefable:"Clefable",

    vulpix:"Vulpix",
    ninetales:"Ninetales",

    jigglypuff:"Jigglypuff",
    wigglytuff:"Wigglytuff",

    zubat:"Zubat",
    golbat:"Golbat",
    crobat:"Crobat",

    oddish:"Oddish",
    gloom:"Gloom",
    vileplume:"Vileplume",

    paras:"Paras",
    parasect:"Parasect",

    venonat:"Venonat",
    venomoth:"Venomoth",

    diglett:"Diglett",
    dugtrio:"Dugtrio",

    meowth:"Meowth",
    persian:"Persian",

    psyduck:"Psyduck",
    golduck:"Golduck",

    mankey:"Mankey",
    primeape:"Primeape",

    growlithe:"Growlithe",
    arcanine:"Arcanine",

    poliwag:"Poliwag",
    poliwhirl:"Poliwhirl",
    poliwrath:"Poliwrath",

    abra:"Abra",
    kadabra:"Kadabra",
    alakazam:"Alakazam",

    machop:"Machop",
    machoke:"Machoke",
    machamp:"Machamp",

    bellsprout:"Bellsprout",
    weepinbell:"Weepinbell",
    victreebel:"Victreebel",

    tentacool:"Tentacool",
    tentacruel:"Tentacruel",

    geodude:"Geodude",
    graveler:"Graveler",
    golem:"Golem",

    ponyta:"Ponyta",
    rapidash:"Rapidash",

    slowpoke:"Slowpoke",
    slowbro:"Slowbro",

    magnemite:"Magnemite",
    magneton:"Magneton",
    magnezone:"Magnezone",

    farfetchd:"Farfetch'd",

    doduo:"Doduo",
    dodrio:"Dodrio",

    dewgong:"Dewgong",

    grimer:"Grimer",
    muk:"Muk",

    shellder:"Shellder",
    cloyster:"Cloyster",

    gastly:"Gastly",
    haunter:"Haunter",
    gengar:"Gengar",

    onix:"Onix",

    drowzee:"Drowzee",
    hypno:"Hypno",

    krabby:"Krabby",
    kingler:"Kingler",

    voltorb:"Voltorb",
    electrode:"Electrode",

    exeggcute:"Exeggcute",
    exeggutor:"Exeggutor",

    cubone:"Cubone",
    marowak:"Marowak",

    hitmonlee:"Hitmonlee",
    hitmonchan:"Hitmonchan",

    lickitung:"Lickitung",

    koffing:"Koffing",
    weezing:"Weezing",

    rhyhorn:"Rhyhorn",
    rhydon:"Rhydon",
    rhyperior:"Rhyperior",

    chansey:"Chansey",
    blissey:"Blissey",

    tangela:"Tangela",
    tangrowth:"Tangrowth",

    kangaskhan:"Kangaskhan",

    horsea:"Horsea",
    seadra:"Seadra",
    kingdra:"Kingdra",

    goldeen:"Goldeen",
    seaking:"Seaking",

    staryu:"Staryu",
    starmie:"Starmie",

    mr_mime:"Mr. Mime",
    mrmime:"Mr. Mime",

    scyther:"Scyther",
    scizor:"Scizor",

    jynx:"Jynx",

    electabuzz:"Electabuzz",
    electivire:"Electivire",

    magmar:"Magmar",
    magmortar:"Magmortar",

    pinsir:"Pinsir",

    tauros:"Tauros",

    magikarp:"Magikarp",
    gyarados:"Gyarados",

    lapras:"Lapras",

    ditto:"Ditto",

    eevee:"Eevee",
    vaporeon:"Vaporeon",
    jolteon:"Jolteon",
    flareon:"Flareon",
    espeon:"Espeon",
    umbreon:"Umbreon",
    leafeon:"Leafeon",
    glaceon:"Glaceon",
    sylveon:"Sylveon",

    porygon:"Porygon",
    porygon2:"Porygon2",
    porygon_z:"Porygon-Z",
    porygonz:"Porygon-Z",

    omanyte:"Omanyte",
    omastar:"Omastar",

    kabuto:"Kabuto",
    kabutops:"Kabutops",

    aerodactyl:"Aerodactyl",

    snorlax:"Snorlax",

    articuno:"Articuno",
    zapdos:"Zapdos",
    moltres:"Moltres",

    dratini:"Dratini",
    dragonair:"Dragonair",
    dragonite:"Dragonite",

    mewtwo:"Mewtwo",
    mew:"Mew"

};


/* =========================================================
   TIPOS
========================================================= */

const typeInfo = {

    normal:{
        name:"Normal",
        icon:"⚪",
        description:"Pokémon equilibrados e versáteis."
    },

    fire:{
        name:"Fogo",
        icon:"🔥",
        description:"Chamas, calor e ataques incendiários."
    },

    water:{
        name:"Água",
        icon:"💧",
        description:"Força dos oceanos, rios e mares."
    },

    electric:{
        name:"Elétrico",
        icon:"⚡",
        description:"Energia elétrica e descargas poderosas."
    },

    grass:{
        name:"Planta",
        icon:"🌿",
        description:"Natureza, plantas e energia vital."
    },

    ice:{
        name:"Gelo",
        icon:"❄️",
        description:"Frio extremo, neve e gelo."
    },

    fighting:{
        name:"Lutador",
        icon:"🥊",
        description:"Força física e técnicas de combate."
    },

    poison:{
        name:"Veneno",
        icon:"☠️",
        description:"Toxinas, venenos e efeitos nocivos."
    },

    ground:{
        name:"Terra",
        icon:"🌍",
        description:"Terra, areia e movimentos sísmicos."
    },

    flying:{
        name:"Voador",
        icon:"🪽",
        description:"Vento, velocidade e liberdade aérea."
    },

    psychic:{
        name:"Psíquico",
        icon:"🔮",
        description:"Poderes mentais e energia psíquica."
    },

    bug:{
        name:"Inseto",
        icon:"🦋",
        description:"Insetos e criaturas da natureza."
    },

    rock:{
        name:"Pedra",
        icon:"🪨",
        description:"Pedras, minerais e resistência."
    },

    ghost:{
        name:"Fantasma",
        icon:"👻",
        description:"Espíritos e energia sobrenatural."
    },

    dragon:{
        name:"Dragão",
        icon:"🐉",
        description:"Poder ancestral e energia dracônica."
    },

    dark:{
        name:"Sombrio",
        icon:"🌑",
        description:"Sombras, astúcia e mistério."
    },

    steel:{
        name:"Aço",
        icon:"⚙️",
        description:"Metal, armadura e resistência."
    },

    fairy:{
        name:"Fada",
        icon:"✨",
        description:"Magia, encanto e energia feérica."
    }

};


/* =========================================================
   GERAÇÕES
========================================================= */

const generations = [

    {
        id:1,
        roman:"I",
        region:"KANTO",
        description:"A região onde tudo começou.",
        css:"region-kanto"
    },

    {
        id:2,
        roman:"II",
        region:"JOHTO",
        description:"Tradição, história e novos Pokémon.",
        css:"region-johto"
    },

    {
        id:3,
        roman:"III",
        region:"HOENN",
        description:"Natureza, oceanos e clima tropical.",
        css:"region-hoenn"
    },

    {
        id:4,
        roman:"IV",
        region:"SINNOH",
        description:"Uma região de montanhas e lendas antigas.",
        css:"region-sinnoh"
    },

    {
        id:5,
        roman:"V",
        region:"UNOVA",
        description:"Uma nova jornada em uma região moderna.",
        css:"region-unova"
    },

    {
        id:6,
        roman:"VI",
        region:"KALOS",
        description:"Elegância, beleza e Mega Evolução.",
        css:"region-kalos"
    },

    {
        id:7,
        roman:"VII",
        region:"ALOLA",
        description:"Ilhas tropicais e formas regionais.",
        css:"region-alola"
    },

    {
        id:8,
        roman:"VIII",
        region:"GALAR",
        description:"Estádios, batalhas gigantes e Dynamax.",
        css:"region-galar"
    },

    {
        id:9,
        roman:"IX",
        region:"PALDEA",
        description:"Uma região aberta e repleta de mistérios.",
        css:"region-paldea"
    }

];


/* =========================================================
   FUNÇÕES AUXILIARES
========================================================= */

function capitalize(text){

    if(!text){
        return "";
    }

    return text.charAt(0).toUpperCase() + text.slice(1);

}


function formatPokemonName(name){

    if(!name){
        return "Desconhecido";
    }

    const clean =
        name
            .toLowerCase()
            .replace(/-f$/,"")
            .replace(/-m$/,"");

    if(pokemonNames[clean]){
        return pokemonNames[clean];
    }

    return clean
        .split("-")
        .map(capitalize)
        .join(" ");

}


function formatNumber(number){

    return String(number).padStart(4,"0");

}


function getPokemonImage(pokemon){

    return (
        pokemon?.sprites?.other?.["official-artwork"]?.front_default ||
        pokemon?.sprites?.front_default ||
        ""
    );

}


function getPokemonShiny(pokemon){

    return (
        pokemon?.sprites?.other?.["official-artwork"]?.front_shiny ||
        pokemon?.sprites?.front_shiny ||
        ""
    );

}


function getIdFromUrl(url){

    if(!url){
        return 0;
    }

    const parts =
        url.split("/").filter(Boolean);

    return Number(
        parts[parts.length - 1]
    );

}


/* =========================================================
   API
========================================================= */

async function apiFetch(url){

    try{

        const response =
            await fetch(url);

        if(!response.ok){
            throw new Error(`HTTP ${response.status}`);
        }

        return await response.json();

    }catch(error){

        console.error("Erro na API:",error);

        return null;

    }

}


/* =========================================================
   CARREGAR POKÉMON
========================================================= */

async function loadPokemon(){

    const grid =
        document.getElementById("pokedex") ||
        document.getElementById("pokemonGrid");

    if(grid){

        grid.innerHTML = `

            <div class="loading">

                <div class="loading-spinner"></div>

                <p>Carregando Pokédex...</p>

            </div>

        `;

    }

    try{

        const data =
            await apiFetch(
                `${API}/pokemon?limit=1025`
            );

        if(!data || !Array.isArray(data.results)){
            throw new Error("Resposta inválida da PokéAPI.");
        }

        allPokemon =
            data.results.map((pokemon,index) => ({

                id:index + 1,

                name:pokemon.name,

                url:pokemon.url,

                image:
                    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${index + 1}.png`

            }));

        filteredPokemon =
            [...allPokemon];

        visibleCount = 50;

        renderPokemon();

    }catch(error){

        console.error(
            "Erro carregando Pokédex:",
            error
        );

        if(grid){

            grid.innerHTML = `

                <div class="error-message">

                    <div style="font-size:50px;">
                        ⚠️
                    </div>

                    <h2>
                        Não foi possível carregar a Pokédex
                    </h2>

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
   RENDERIZAÇÃO
========================================================= */

function renderPokemon(){

    const grid =
        document.getElementById("pokedex") ||
        document.getElementById("pokemonGrid");

    if(!grid){
        return;
    }

    const list =
        Array.isArray(filteredPokemon)
            ? filteredPokemon
            : [];

    const visible =
        list.slice(0,visibleCount);

    if(!visible.length){

        grid.innerHTML = `

            <div class="empty-message">

                <div style="font-size:50px;">
                    🔎
                </div>

                <h3>
                    Nenhum Pokémon encontrado
                </h3>

                <p>
                    Tente pesquisar outro nome ou número.
                </p>

            </div>

        `;

        updateLoadMoreButton();

        return;

    }

    grid.innerHTML =
        visible
            .map(createPokemonCard)
            .join("");

    updateLoadMoreButton();

    visible.forEach(
        pokemon => loadCardTypes(pokemon)
    );

}


/* =========================================================
   CARD
========================================================= */

function createPokemonCard(pokemon){

    const id =
        Number(pokemon.id);

    const name =
        formatPokemonName(pokemon.name);

    const image =
        pokemon.image ||
        `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

    return `

        <article
            class="pokemon-card"
            data-id="${id}"
            onclick="openPokemon(${id})"
        >

            <div class="pokemon-image-container">

                <span class="pokemon-number">
                    #${formatNumber(id)}
                </span>

                <img
                    class="pokemon-image"
                    src="${image}"
                    alt="${name}"
                    loading="lazy"
                >

            </div>

            <div class="pokemon-card-info">

                <h3 class="pokemon-name">
                    ${name}
                </h3>

                <div
                    class="card-types"
                    id="card-types-${id}"
                >
                    <span class="type-badge">
                        ...
                    </span>
                </div>

            </div>

        </article>

    `;

}


/* =========================================================
   TIPOS DOS CARDS
========================================================= */

async function loadCardTypes(pokemon){

    const container =
        document.getElementById(
            `card-types-${pokemon.id}`
        );

    if(!container){
        return;
    }

    const data =
        await apiFetch(
            `${API}/pokemon/${pokemon.id}`
        );

    if(!data){

        container.innerHTML = "";

        return;

    }

    container.innerHTML =
        data.types
            .sort((a,b) => a.slot - b.slot)
            .map(typeData => {

                const type =
                    typeData.type.name;

                const info =
                    typeInfo[type] || {};

                return `

                    <span
                        class="type-badge type-${type}"
                        title="${info.name || type}"
                    >
                        ${info.icon || "●"}
                        ${info.name || capitalize(type)}
                    </span>

                `;

            })
            .join("");

}


/* =========================================================
   CARREGAR MAIS
========================================================= */

function updateLoadMoreButton(){

    let button =
        document.getElementById(
            "loadMoreButton"
        );

    if(!button){

        const grid =
            document.getElementById("pokedex") ||
            document.getElementById("pokemonGrid");

        if(!grid){
            return;
        }

        button =
            document.createElement("button");

        button.id =
            "loadMoreButton";

        button.className =
            "load-more";

        grid.parentElement.appendChild(button);

    }

    button.onclick =
        loadMorePokemon;

    if(
        visibleCount >=
        filteredPokemon.length
    ){

        button.style.display = "none";

    }else{

        button.style.display = "block";

        button.textContent =
            `CARREGAR MAIS — ${Math.min(
                visibleCount,
                filteredPokemon.length
            )}/${filteredPokemon.length}`;

    }

}


function loadMorePokemon(){

    visibleCount += 50;

    renderPokemon();

}


/* =========================================================
   PESQUISA
========================================================= */

function searchPokemon(query){

    /*
     * Compatibilidade com:
     * oninput="searchPokemon()"
     */
    if(query === undefined){

        const homeInput =
            document.getElementById(
                "homeSearchInput"
            );

        query =
            homeInput
                ? homeInput.value
                : "";

    }

    const value =
        String(query || "")
            .trim()
            .toLowerCase();

    if(!value){

        filteredPokemon =
            [...allPokemon];

        visibleCount = 50;

        renderPokemon();

        return;

    }

    filteredPokemon =
        allPokemon.filter(pokemon => {

            const id =
                String(pokemon.id);

            const name =
                pokemon.name.toLowerCase();

            const translated =
                formatPokemonName(
                    pokemon.name
                ).toLowerCase();

            return (
                name.includes(value) ||
                translated.includes(value) ||
                id === value ||
                id.padStart(4,"0") === value
            );

        });

    visibleCount = 50;

    renderPokemon();

}


/*
 * Compatibilidade com o HTML:
 * oninput="searchFromPage()"
 */
function searchFromPage(){

    const input =
        document.getElementById(
            "searchPageInput"
        );

    const results =
        document.getElementById(
            "searchResults"
        );

    if(!input || !results){
        return;
    }

    const value =
        input.value
            .trim()
            .toLowerCase();

    if(!value){

        results.innerHTML = "";

        return;

    }

    const matches =
        allPokemon.filter(pokemon => {

            const id =
                String(pokemon.id);

            const name =
                pokemon.name.toLowerCase();

            const translated =
                formatPokemonName(
                    pokemon.name
                ).toLowerCase();

            return (
                name.includes(value) ||
                translated.includes(value) ||
                id === value ||
                id.padStart(4,"0") === value
            );

        }).slice(0,50);

    if(!matches.length){

        results.innerHTML = `

            <div class="empty-message">

                <div style="font-size:45px;">
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

        return;

    }

    results.innerHTML =
        matches
            .map(pokemon => `

                <article
                    class="pokemon-card"
                    onclick="openPokemon(${pokemon.id})"
                >

                    <div class="pokemon-image-container">

                        <span class="pokemon-number">
                            #${formatNumber(pokemon.id)}
                        </span>

                        <img
                            class="pokemon-image"
                            src="${pokemon.image}"
                            alt="${formatPokemonName(pokemon.name)}"
                            loading="lazy"
                        >

                    </div>

                    <div class="pokemon-card-info">

                        <h3 class="pokemon-name">
                            ${formatPokemonName(pokemon.name)}
                        </h3>

                    </div>

                </article>

            `)
            .join("");

}


/* =========================================================
   FILTRO DE TIPO
========================================================= */

async function filterType(type){

    if(!type){
        return;
    }

    if(typeof filterByType === "function"){

        await filterByType(type);

        return;

    }

}


/* =========================================================
   FILTRO DE GERAÇÃO
========================================================= */

function filterGeneration(generation){

    const gen =
        Number(generation);

    if(!gen){

        filteredPokemon =
            [...allPokemon];

    }else{

        const ranges = {

            1:[1,151],
            2:[152,251],
            3:[252,386],
            4:[387,493],
            5:[494,649],
            6:[650,721],
            7:[722,809],
            8:[810,905],
            9:[906,1025]

        };

        const range =
            ranges[gen];

        if(!range){
            return;
        }

        filteredPokemon =
            allPokemon.filter(
                pokemon =>
                    pokemon.id >= range[0] &&
                    pokemon.id <= range[1]
            );

    }

    visibleCount = 50;

    /*
     * Suporta tanto:
     * .generation-pill
     * quanto os botões atuais dentro de .generation-pills
     */
    const generationButtons =
        document.querySelectorAll(
            ".generation-pill, .generation-pills button"
        );

    generationButtons.forEach((button,index) => {

        const buttonGeneration =
            button.dataset.generation
                ? Number(button.dataset.generation)
                : index;

        button.classList.toggle(
            "active",
            buttonGeneration === gen
        );

    });

    renderPokemon();

}


/* =========================================================
   GERAÇÕES
========================================================= */

function buildGenerations(){

    const grid =
        document.getElementById(
            "generationsGrid"
        );

    if(!grid){
        return;
    }

    grid.innerHTML =
        generations
            .map(gen => `

                <article
                    class="
                        generation-card
                        ${gen.css}
                    "
                    onclick="filterGeneration(${gen.id})"
                >

                    <div class="region-animation"></div>

                    <div class="generation-number">
                        ${gen.roman}
                    </div>

                    <div class="generation-content">

                        <span>
                            GERAÇÃO ${gen.id}
                        </span>

                        <h3>
                            ${gen.region}
                        </h3>

                        <p>
                            ${gen.description}
                        </p>

                        <button
                            onclick="
                                event.stopPropagation();
                                filterGeneration(${gen.id});
                            "
                        >
                            VER POKÉMON
                        </button>

                    </div>

                </article>

            `)
            .join("");

}


/* =========================================================
   ABRIR POKÉMON
========================================================= */

async function openPokemon(id){

    const numericId =
        Number(id);

    if(!numericId){
        return;
    }

    /*
     * Abre imediatamente a tela de detalhes.
     */
    showPage("pokemonDetails");

    const container =
        document.getElementById(
            "detailContent"
        );

    if(container){

        container.innerHTML = `

            <div class="detail-loading">

                <div class="loading-spinner"></div>

                <p>
                    Carregando Pokémon...
                </p>

            </div>

        `;

    }

    const pokemon =
        await apiFetch(
            `${API}/pokemon/${numericId}`
        );

    if(!pokemon){

        if(container){

            container.innerHTML = `

                <div class="error-message">

                    <div style="font-size:50px;">
                        ⚠️
                    </div>

                    <h2>
                        Não foi possível carregar este Pokémon.
                    </h2>

                    <button onclick="closePokemon()">
                        Voltar
                    </button>

                </div>

            `;

        }

        return;

    }

    currentPokemon =
        pokemon;

    await buildPokemonDetails(
        pokemon
    );

    window.scrollTo({
        top:0,
        behavior:"smooth"
    });

}


/* =========================================================
   FECHAR FICHA
========================================================= */

function closePokemon(){

    currentPokemon = null;

    showPage("homePage");

}


/* =========================================================
   FICHA COMPLETA
========================================================= */

async function buildPokemonDetails(pokemon){

    const container =
        document.getElementById(
            "detailContent"
        );

    if(!container){
        return;
    }

    container.innerHTML = `

        <div class="detail-loading">

            <div class="loading-spinner"></div>

            <p>
                Carregando informações de
                ${formatPokemonName(pokemon.name)}...
            </p>

        </div>

    `;

    const speciesPromise =
        apiFetch(
            `${API}/pokemon-species/${pokemon.id}`
        );

    const evolutionPromise =
        speciesPromise.then(species =>
            species?.evolution_chain?.url
                ? apiFetch(
                    species.evolution_chain.url
                )
                : null
        );

    const [
        species,
        evolutionChain
    ] =
        await Promise.all([
            speciesPromise,
            evolutionPromise
        ]);

    const types =
        [...(pokemon.types || [])]
            .sort(
                (a,b) =>
                    a.slot - b.slot
            )
            .map(
                item =>
                    item.type.name
            );

    const abilities =
        pokemon.abilities || [];

    const image =
        getPokemonImage(pokemon);

    const shiny =
        getPokemonShiny(pokemon);

    const weaknesses =
        calculateWeaknesses(types);

    container.innerHTML = `

        <div class="pokemon-detail">

            <button
                class="back-button"
                onclick="closePokemon()"
            >
                ← VOLTAR PARA A POKÉDEX
            </button>

            <div class="detail-header">

                <div class="detail-main-image">

                    <span class="detail-number">
                        #${formatNumber(pokemon.id)}
                    </span>

                    <img
                        src="${image}"
                        alt="${formatPokemonName(pokemon.name)}"
                    >

                </div>

                <div class="detail-title">

                    <div class="detail-original-name">
                        ${pokemon.name.toUpperCase()}
                    </div>

                    <h1>
                        ${formatPokemonName(pokemon.name)}
                    </h1>

                    <div class="detail-types">

                        ${types.map(type => {

                            const info =
                                typeInfo[type] || {};

                            return `

                                <span
                                    class="
                                        detail-type
                                        type-${type}
                                    "
                                >
                                    ${info.icon || ""}
                                    ${info.name || capitalize(type)}
                                </span>

                            `;

                        }).join("")}

                    </div>

                    <div class="detail-description">

                        ${getSpeciesDescription(species)}

                    </div>

                </div>

            </div>

            <div class="detail-sections">

                ${buildBasicInfo(pokemon)}

                ${buildAbilities(abilities)}

                ${buildWeaknesses(weaknesses)}

                ${buildStats(pokemon)}

                ${buildShinySection(
                    image,
                    shiny,
                    pokemon.name
                )}

                ${buildEvolutionSection(
                    evolutionChain
                )}

                <section class="detail-section mega-section">

                    <div class="section-title">

                        <span>
                            ✨
                        </span>

                        <h2>
                            Mega Evoluções
                        </h2>

                    </div>

                    <div id="megaContainer">

                        <div class="loading">
                            Carregando Mega Evoluções...
                        </div>

                    </div>

                </section>

            </div>

        </div>

    `;

    /*
     * mega.js fica responsável pelas Mega Evoluções.
     */
    if(typeof loadMegaTab === "function"){

        await loadMegaTab(
            pokemon.name
        );

    }

}


/* =========================================================
   INFORMAÇÕES BÁSICAS
========================================================= */

function buildBasicInfo(pokemon){

    const height =
        (pokemon.height / 10)
            .toFixed(1);

    const weight =
        (pokemon.weight / 10)
            .toFixed(1);

    return `

        <section class="detail-section">

            <div class="section-title">

                <span>
                    📋
                </span>

                <h2>
                    Informações
                </h2>

            </div>

            <div class="info-grid">

                <div class="info-box">

                    <span>
                        Altura
                    </span>

                    <strong>
                        ${height} m
                    </strong>

                </div>

                <div class="info-box">

                    <span>
                        Peso
                    </span>

                    <strong>
                        ${weight} kg
                    </strong>

                </div>

                <div class="info-box">

                    <span>
                        Experiência base
                    </span>

                    <strong>
                        ${pokemon.base_experience || "—"}
                    </strong>

                </div>

                <div class="info-box">

                    <span>
                        ID
                    </span>

                    <strong>
                        #${formatNumber(pokemon.id)}
                    </strong>

                </div>

            </div>

        </section>

    `;

}


/* =========================================================
   HABILIDADES
========================================================= */

function buildAbilities(abilities){

    return `

        <section class="detail-section">

            <div class="section-title">

                <span>
                    ⚡
                </span>

                <h2>
                    Habilidades
                </h2>

            </div>

            <div class="abilities-list">

                ${
                    abilities.length
                        ? abilities.map(
                            ability => `

                                <div class="ability">

                                    <strong>
                                        ${formatPokemonName(
                                            ability.ability.name
                                        )}
                                    </strong>

                                    ${
                                        ability.is_hidden
                                            ? `<small>Habilidade oculta</small>`
                                            : ""
                                    }

                                </div>

                            `
                        ).join("")
                        : `
                            <div class="no-data">
                                Nenhuma informação.
                            </div>
                        `
                }

            </div>

        </section>

    `;

}


/* =========================================================
   FRAQUEZAS
========================================================= */

function calculateWeaknesses(types){

    const defensive = {

        normal:{
            ghost:0,
            fighting:2
        },

        fire:{
            fire:0.5,
            water:2,
            grass:0.5,
            ice:0.5,
            bug:0.5,
            rock:2,
            steel:0.5,
            fairy:0.5
        },

        water:{
            fire:0.5,
            water:0.5,
            electric:2,
            grass:2,
            ice:0.5,
            steel:0.5
        },

        electric:{
            electric:0.5,
            ground:2,
            flying:0.5,
            steel:0.5
        },

        grass:{
            fire:2,
            water:0.5,
            electric:0.5,
            grass:0.5,
            ice:2,
            poison:2,
            ground:0.5,
            flying:2,
            bug:2
        },

        ice:{
            fire:2,
            ice:0.5,
            fighting:2,
            rock:2,
            steel:2
        },

        fighting:{
            flying:2,
            psychic:2,
            bug:0.5,
            rock:0.5,
            dark:0.5,
            fairy:2
        },

        poison:{
            grass:0.5,
            poison:0.5,
            ground:2,
            psychic:2,
            bug:0.5,
            fairy:0.5
        },

        ground:{
            water:2,
            electric:0,
            grass:2,
            ice:2,
            poison:0.5,
            rock:0.5
        },

        flying:{
            electric:2,
            grass:0.5,
            ice:2,
            fighting:0.5,
            ground:0,
            bug:0.5,
            rock:2
        },

        psychic:{
            fighting:0.5,
            psychic:0.5,
            bug:2,
            ghost:2,
            dark:2,
            fairy:0.5
        },

        bug:{
            fire:2,
            grass:0.5,
            fighting:0.5,
            ground:0.5,
            flying:2,
            rock:2
        },

        rock:{
            normal:0.5,
            fire:0.5,
            water:2,
            grass:2,
            fighting:2,
            poison:0.5,
            ground:2,
            flying:0.5,
            steel:2
        },

        ghost:{
            normal:0,
            fighting:0,
            poison:0.5,
            bug:0.5,
            ghost:2,
            dark:2
        },

        dragon:{
            fire:0.5,
            water:0.5,
            electric:0.5,
            grass:0.5,
            ice:2,
            dragon:2,
            fairy:2
        },

        dark:{
            psychic:0,
            ghost:0.5,
            dark:0.5,
            fighting:2,
            bug:2,
            fairy:2
        },

        steel:{
            normal:0.5,
            fire:2,
            water:1,
            electric:1,
            grass:0.5,
            ice:0.5,
            fighting:2,
            poison:0,
            ground:2,
            flying:0.5,
            psychic:0.5,
            bug:0.5,
            rock:0.5,
            dragon:0.5,
            steel:0.5,
            fairy:0.5
        },

        fairy:{
            fire:2,
            fighting:0.5,
            poison:2,
            bug:0.5,
            dragon:0,
            dark:0.5,
            steel:2
        }

    };

    const result = {};

    Object.keys(typeInfo).forEach(type => {

        let multiplier = 1;

        types.forEach(defendingType => {

            const chart =
                defensive[defendingType];

            if(
                chart &&
                chart[type] !== undefined
            ){

                multiplier *=
                    chart[type];

            }

        });

        result[type] =
            multiplier;

    });

    return result;

}


function buildWeaknesses(multipliers){

    const entries =
        Object.entries(multipliers)
            .filter(
                ([type,multiplier]) =>
                    multiplier > 1
            )
            .sort(
                (a,b) =>
                    b[1] - a[1]
            );

    return `

        <section class="detail-section">

            <div class="section-title">

                <span>
                    🛡️
                </span>

                <h2>
                    Fraquezas
                </h2>

            </div>

            <div class="weaknesses-list">

                ${
                    entries.length
                        ? entries.map(
                            ([type,multiplier]) => {

                                const info =
                                    typeInfo[type];

                                return `

                                    <div
                                        class="
                                            weakness
                                            type-${type}
                                        "
                                    >

                                        <span>
                                            ${info.icon}
                                            ${info.name}
                                        </span>

                                        <strong>
                                            ×${multiplier}
                                        </strong>

                                    </div>

                                `;

                            }
                        ).join("")
                        : `
                            <div class="no-data">
                                Nenhuma fraqueza encontrada.
                            </div>
                        `
                }

            </div>

        </section>

    `;

}


/* =========================================================
   ESTATÍSTICAS
========================================================= */

function buildStats(pokemon){

    const stats =
        pokemon.stats || [];

    return `

        <section class="detail-section">

            <div class="section-title">

                <span>
                    📊
                </span>

                <h2>
                    Estatísticas Base
                </h2>

            </div>

            <div class="stats-list">

                ${
                    stats.map(stat => {

                        const name =
                            translateStat(
                                stat.stat.name
                            );

                        const value =
                            stat.base_stat;

                        const percentage =
                            Math.min(
                                100,
                                (value / 255) * 100
                            );

                        return `

                            <div class="stat-row">

                                <div class="stat-name">
                                    ${name}
                                </div>

                                <div class="stat-value">
                                    ${value}
                                </div>

                                <div class="stat-bar">

                                    <span
                                        style="
                                            width:${percentage}%;
                                        "
                                    ></span>

                                </div>

                            </div>

                        `;

                    }).join("")
                }

            </div>

        </section>

    `;

}


function translateStat(stat){

    const translations = {

        hp:"HP",
        attack:"Ataque",
        defense:"Defesa",
        "special-attack":"Ataque Especial",
        "special-defense":"Defesa Especial",
        speed:"Velocidade"

    };

    return (
        translations[stat] ||
        capitalize(stat)
    );

}


/* =========================================================
   SHINY
========================================================= */

function buildShinySection(
    normalImage,
    shinyImage,
    name
){

    return `

        <section class="detail-section shiny-section">

            <div class="section-title">

                <span>
                    ✨
                </span>

                <h2>
                    Forma Shiny
                </h2>

            </div>

            <div class="shiny-container">

                <div class="shiny-card">

                    <img
                        class="shiny-art"
                        src="${normalImage}"
                        alt="${name}"
                        loading="lazy"
                    >

                    <div class="shiny-info">

                        <strong>
                            Normal
                        </strong>

                        <span>
                            Forma original
                        </span>

                    </div>

                </div>

                <div class="shiny-card shiny-special">

                    <img
                        class="shiny-art"
                        src="${shinyImage || normalImage}"
                        alt="${name} Shiny"
                        loading="lazy"
                    >

                    <div class="shiny-info">

                        <strong>
                            ✨ Shiny
                        </strong>

                        <span>
                            Coloração alternativa
                        </span>

                    </div>

                </div>

            </div>

        </section>

    `;

}


/* =========================================================
   EVOLUÇÕES
========================================================= */

function buildEvolutionSection(chain){

    if(!chain){

        return `

            <section class="detail-section">

                <div class="section-title">

                    <span>
                        🔄
                    </span>

                    <h2>
                        Evoluções
                    </h2>

                </div>

                <div class="no-data">
                    Nenhuma cadeia de evolução encontrada.
                </div>

            </section>

        `;

    }

    const stages = [];

    function collect(node){

        if(!node){
            return;
        }

        stages.push({

            name:node.species.name,

            id:getIdFromUrl(
                node.species.url
            )

        });

        if(
            node.evolves_to &&
            node.evolves_to.length
        ){

            node.evolves_to.forEach(
                child =>
                    collect(child)
            );

        }

    }

    collect(chain);

    const unique =
        stages.filter(
            (item,index,self) =>
                index ===
                self.findIndex(
                    other =>
                        other.id === item.id
                )
        );

    return `

        <section class="detail-section">

            <div class="section-title">

                <span>
                    🔄
                </span>

                <h2>
                    Linha Evolutiva
                </h2>

            </div>

            <div class="evolution-chain">

                ${
                    unique.map(
                        (stage,index) => `

                            <div
                                class="evolution-item"
                                onclick="openPokemon(${stage.id})"
                                style="cursor:pointer"
                            >

                                <img
                                    src="
                                        https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${stage.id}.png
                                    "
                                    alt="${formatPokemonName(stage.name)}"
                                    loading="lazy"
                                >

                                <strong>
                                    ${formatPokemonName(stage.name)}
                                </strong>

                                <span>
                                    #${formatNumber(stage.id)}
                                </span>

                            </div>

                            ${
                                index <
                                unique.length - 1
                                    ? `
                                        <div class="evolution-arrow">
                                            →
                                        </div>
                                    `
                                    : ""
                            }

                        `
                    ).join("")
                }

            </div>

        </section>

    `;

}


/* =========================================================
   DESCRIÇÃO
========================================================= */

function getSpeciesDescription(species){

    if(!species){
        return "Informações sobre este Pokémon.";
    }

    const entry =
        species.flavor_text_entries
            ?.find(
                item =>
                    item.language?.name === "pt-br"
            ) ||
        species.flavor_text_entries
            ?.find(
                item =>
                    item.language?.name === "en"
            );

    if(!entry){
        return "Informações sobre este Pokémon.";
    }

    return entry.flavor_text
        .replace(/\n|\f/g," ");

}


/* =========================================================
   NAVEGAÇÃO
========================================================= */

function showPage(pageId){

    const home =
        document.getElementById("homePage");

    const search =
        document.getElementById("searchPage");

    const types =
        document.getElementById("typesPage");

    const generationsPage =
        document.getElementById("generationsPage");

    const details =
        document.getElementById("pokemonDetails");

    const pages = [
        home,
        search,
        types,
        generationsPage
    ];

    pages.forEach(page => {

        if(page){

            page.classList.remove("active");
            page.style.display = "none";

        }

    });

    /*
     * pokemonDetails não possui .page no HTML atual.
     * Por isso ele precisa ser tratado separadamente.
     */
    if(details){

        details.style.display =
            pageId === "pokemonDetails"
                ? "block"
                : "none";

    }

    const target =
        document.getElementById(pageId);

    if(
        target &&
        pageId !== "pokemonDetails"
    ){

        target.classList.add("active");
        target.style.display = "block";

    }

    currentPage =
        pageId;

    closeSideMenu();

    if(pageId === "typesPage"){

        if(typeof buildTypesPage === "function"){
            buildTypesPage();
        }

    }

    if(pageId === "generationsPage"){

        buildGenerations();

    }

    window.scrollTo({
        top:0,
        behavior:"smooth"
    });

}


/* =========================================================
   MENU
========================================================= */

function openSideMenu(){

    const menu =
        document.getElementById("sideMenu") ||
        document.querySelector(".side-menu");

    const overlay =
        document.getElementById("menuOverlay");

    if(menu){
        menu.classList.add("active");
    }

    if(overlay){
        overlay.classList.add("active");
    }

}


function closeSideMenu(){

    const menu =
        document.getElementById("sideMenu") ||
        document.querySelector(".side-menu");

    const overlay =
        document.getElementById("menuOverlay");

    if(menu){
        menu.classList.remove("active");
    }

    if(overlay){
        overlay.classList.remove("active");
    }

}


/*
 * Compatibilidade com o index.html atual.
 */
function openMenu(){
    openSideMenu();
}


function closeMenu(event){

    /*
     * Se clicou diretamente no overlay,
     * fecha o menu.
     */
    if(
        event &&
        event.target &&
        event.target.id !== "menuOverlay"
    ){

        return;

    }

    closeSideMenu();

}


/* =========================================================
   BOTÃO VOLTAR
========================================================= */

function goHome(){

    filteredPokemon =
        [...allPokemon];

    visibleCount = 50;

    closePokemon();

}


/* =========================================================
   EVENTOS DE PESQUISA
========================================================= */

function setupSearch(){

    const homeInput =
        document.getElementById(
            "homeSearchInput"
        );

    const searchPageInput =
        document.getElementById(
            "searchPageInput"
        );

    /*
     * O HTML atual já usa oninput.
     * Estes listeners servem também para
     * garantir funcionamento caso o atributo
     * seja removido futuramente.
     */

    if(homeInput){

        homeInput.addEventListener(
            "input",
            event => {

                searchPokemon(
                    event.target.value
                );

            }
        );

    }

    if(searchPageInput){

        searchPageInput.addEventListener(
            "input",
            searchFromPage
        );

    }

}


/* =========================================================
   BOTÕES DE GERAÇÃO
========================================================= */

function setupGenerationButtons(){

    const buttons =
        document.querySelectorAll(
            ".generation-pill, .generation-pills button"
        );

    buttons.forEach((button,index) => {

        /*
         * Evita duplicar eventos se o HTML
         * já possuir onclick.
         */
        button.addEventListener(
            "click",
            () => {

                const generation =
                    button.dataset.generation
                        ? Number(
                            button.dataset.generation
                        )
                        : index;

                filterGeneration(
                    generation
                );

            }
        );

    });

}


/* =========================================================
   MENU / OVERLAY
========================================================= */

function setupMenu(){

    const overlay =
        document.getElementById(
            "menuOverlay"
        );

    if(!overlay){
        return;
    }

    /*
     * Não usamos aqui o clique geral no overlay
     * porque o próprio HTML já chama closeMenu(event).
     */

}


/* =========================================================
   TECLADO
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if(event.key === "Escape"){

            closeSideMenu();

        }

    }
);


/* =========================================================
   COMPATIBILIDADE DO BOTÃO CARREGAR MAIS
========================================================= */

function loadMore(){

    loadMorePokemon();

}


/* =========================================================
   INICIALIZAÇÃO
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        console.log(
            "Pokédex Online iniciando..."
        );

        setupSearch();

        setupGenerationButtons();

        setupMenu();

        buildGenerations();

        await loadPokemon();

        console.log(
            `Pokédex carregada: ${allPokemon.length} Pokémon`
        );

    }
);
