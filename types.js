/* =========================================================
   TIPOS POKÉMON
   Página de tipos + filtros + animações
========================================================= */

const typeNames = {

    normal:"Normal",
    fire:"Fogo",
    water:"Água",
    electric:"Elétrico",
    grass:"Planta",
    ice:"Gelo",
    fighting:"Lutador",
    poison:"Veneno",
    ground:"Terra",
    flying:"Voador",
    psychic:"Psíquico",
    bug:"Inseto",
    rock:"Pedra",
    ghost:"Fantasma",
    dragon:"Dragão",
    dark:"Sombrio",
    steel:"Aço",
    fairy:"Fada"

};


/* =========================================================
   CLASSES VISUAIS
========================================================= */

const typeClasses = {

    normal:"normal",
    fire:"fire",
    water:"water",
    electric:"electric",
    grass:"grass",
    ice:"ice",
    fighting:"fighting",
    poison:"poison",
    ground:"ground",
    flying:"flying",
    psychic:"psychic",
    bug:"bug",
    rock:"rock",
    ghost:"ghost",
    dragon:"dragon",
    dark:"dark",
    steel:"steel",
    fairy:"fairy"

};


/* =========================================================
   ÍCONES
========================================================= */

const typeIcons = {

    normal:"⚪",
    fire:"🔥",
    water:"💧",
    electric:"⚡",
    grass:"🌿",
    ice:"❄️",
    fighting:"🥊",
    poison:"☠️",
    ground:"🌍",
    flying:"🪽",
    psychic:"🔮",
    bug:"🦋",
    rock:"🪨",
    ghost:"👻",
    dragon:"🐉",
    dark:"🌑",
    steel:"⚙️",
    fairy:"✨"

};


/* =========================================================
   DESCRIÇÕES
========================================================= */

const typeDescriptions = {

    normal:
        "Equilíbrio, versatilidade e ataques físicos.",

    fire:
        "Chamas, calor, combustão e energia intensa.",

    water:
        "Oceanos, rios, chuva e o poder da água.",

    electric:
        "Eletricidade, energia e descargas poderosas.",

    grass:
        "Natureza, plantas, florestas e energia vital.",

    ice:
        "Frio extremo, neve, gelo e temperaturas congelantes.",

    fighting:
        "Força física, técnicas de combate e disciplina.",

    poison:
        "Toxinas, venenos, gases e efeitos nocivos.",

    ground:
        "Terra, areia, rochas subterrâneas e terremotos.",

    flying:
        "Vento, céu, velocidade e liberdade aérea.",

    psychic:
        "Poderes mentais, energia psíquica e percepção.",

    bug:
        "Insetos, criaturas pequenas e forças da natureza.",

    rock:
        "Pedras, montanhas, minerais e resistência.",

    ghost:
        "Espíritos, mistério, fantasmas e energia sobrenatural.",

    dragon:
        "Dragões, poder ancestral e energia devastadora.",

    dark:
        "Sombras, astúcia, mistério e ataques furtivos.",

    steel:
        "Metal, armaduras, máquinas e resistência.",

    fairy:
        "Magia, encanto, luz e energia feérica."

};


/* =========================================================
   ORDEM DOS TIPOS
========================================================= */

const typeOrder = [

    "normal",
    "fire",
    "water",
    "electric",
    "grass",
    "ice",
    "fighting",
    "poison",
    "ground",
    "flying",
    "psychic",
    "bug",
    "rock",
    "ghost",
    "dragon",
    "dark",
    "steel",
    "fairy"

];


/* =========================================================
   CONSTRÓI A PÁGINA DE TIPOS
========================================================= */

function buildTypesPage(){

    const grid =
        document.getElementById("typesGrid");

    if(!grid){
        return;
    }

    grid.innerHTML = "";

    typeOrder.forEach(type => {

        const card =
            document.createElement("article");

        card.className =
            `type-card type-${type}`;

        card.dataset.type = type;

        card.innerHTML = `

            <div class="type-animation anim-${typeClasses[type]}">

                <div class="type-effect effect-1"></div>
                <div class="type-effect effect-2"></div>
                <div class="type-effect effect-3"></div>

            </div>

            <div class="type-card-content">

                <div class="type-icon">
                    ${typeIcons[type]}
                </div>

                <div class="type-card-text">

                    <h3>
                        ${typeNames[type]}
                    </h3>

                    <p>
                        ${typeDescriptions[type]}
                    </p>

                </div>

            </div>

        `;

        card.addEventListener(
            "click",
            () => filterByType(type)
        );

        grid.appendChild(card);

    });

}


/* =========================================================
   FILTRAR POKÉMON POR TIPO
========================================================= */

async function filterByType(type){

    if(!type){
        return;
    }

    try{

        /*
         * Volta para a Pokédex principal.
         */
        if(typeof showPage === "function"){
            showPage("homePage");
        }

        /*
         * Mostra estado de carregamento.
         */
        const grid =
            document.getElementById("pokedex") ||
            document.getElementById("pokemonGrid");

        if(grid){

            grid.innerHTML = `
                <div class="loading">
                    <div class="loading-spinner"></div>
                    <p>
                        Carregando Pokémon do tipo
                        ${typeNames[type] || type}...
                    </p>
                </div>
            `;

        }

        /*
         * Consulta a PokéAPI.
         */
        const response =
            await fetch(`${API}/type/${type}`);

        if(!response.ok){
            throw new Error(
                `Erro HTTP ${response.status}`
            );
        }

        const data =
            await response.json();

        /*
         * Pega somente os IDs válidos.
         */
        const ids =
            data.pokemon
                .map(item => {

                    const url =
                        item.pokemon?.url || "";

                    const parts =
                        url
                            .split("/")
                            .filter(Boolean);

                    return Number(
                        parts[parts.length - 1]
                    );

                })
                .filter(id =>
                    Number.isFinite(id) &&
                    id > 0 &&
                    id <= 1025
                );

        /*
         * Filtra a lista que já foi carregada
         * pelo script principal.
         */
        if(
            Array.isArray(allPokemon) &&
            typeof filteredPokemon !== "undefined"
        ){

            filteredPokemon =
                allPokemon.filter(pokemon =>
                    ids.includes(
                        Number(pokemon.id)
                    )
                );

            /*
             * Volta para o primeiro lote.
             */
            if(typeof visibleCount !== "undefined"){
                visibleCount = 50;
            }

            /*
             * Remove filtro de geração.
             */
            document
                .querySelectorAll(
                    ".generation-pill"
                )
                .forEach(button => {

                    button.classList.remove(
                        "active"
                    );

                });

            /*
             * Renderiza novamente.
             */
            if(typeof renderPokemon === "function"){

                renderPokemon();

            }else{

                /*
                 * Compatibilidade caso o script
                 * principal use outro nome.
                 */
                if(
                    typeof renderPokemonGrid ===
                    "function"
                ){

                    renderPokemonGrid();

                }

            }

        }

        /*
         * Pequena indicação visual do filtro ativo.
         */
        updateTypeFilterIndicator(type);

        /*
         * Rola até a Pokédex.
         */
        setTimeout(() => {

            const target =
                document.getElementById("pokedex") ||
                document.getElementById("pokemonGrid");

            if(target){

                target.scrollIntoView({
                    behavior:"smooth",
                    block:"start"
                });

            }

        },100);

    }catch(error){

        console.error(
            "Erro ao filtrar Pokémon por tipo:",
            error
        );

        const grid =
            document.getElementById("pokedex") ||
            document.getElementById("pokemonGrid");

        if(grid){

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
   INDICADOR DE FILTRO
========================================================= */

function updateTypeFilterIndicator(type){

    /*
     * Remove indicadores anteriores.
     */
    document
        .querySelectorAll(".active-type-filter")
        .forEach(element => {

            element.classList.remove(
                "active-type-filter"
            );

        });

    /*
     * Procura o card correspondente.
     */
    const card =
        document.querySelector(
            `.type-card[data-type="${type}"]`
        );

    if(card){

        card.classList.add(
            "active-type-filter"
        );

    }

}


/* =========================================================
   INICIALIZAÇÃO
========================================================= */

function initializeTypesPage(){

    const grid =
        document.getElementById("typesGrid");

    if(!grid){
        return;
    }

    buildTypesPage();

}


/* =========================================================
   GARANTE QUE A PÁGINA SEJA MONTADA
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initializeTypesPage();

    }
);
