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

const typeClasses = {
    normal:"normal",
    fire:"fogo",
    water:"agua",
    electric:"eletrico",
    grass:"planta",
    ice:"gelo",
    fighting:"lutador",
    poison:"veneno",
    ground:"terra",
    flying:"voador",
    psychic:"psiquico",
    bug:"inseto",
    rock:"pedra",
    ghost:"fantasma",
    dragon:"dragao",
    dark:"sombrio",
    steel:"aco",
    fairy:"fada"
};

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

const typeDescriptions = {
    normal:"Equilíbrio e versatilidade.",
    fire:"Chamas, calor e energia.",
    water:"O poder dos oceanos e rios.",
    electric:"Energia e eletricidade.",
    grass:"Natureza, plantas e vida.",
    ice:"Frio, neve e gelo.",
    fighting:"Força, disciplina e combate.",
    poison:"Toxinas e efeitos venenosos.",
    ground:"Terra, areia e movimentos sísmicos.",
    flying:"Céus, vento e liberdade.",
    psychic:"Poderes mentais e energia psíquica.",
    bug:"Insetos e criaturas da natureza.",
    rock:"Pedras, montanhas e resistência.",
    ghost:"Mistério, espíritos e sombras.",
    dragon:"Dragões e poder ancestral.",
    dark:"Trevas, astúcia e mistério.",
    steel:"Metal, armadura e resistência.",
    fairy:"Magia, encanto e energia feérica."
};

function buildTypesPage(){

    const grid =
        document.getElementById("typesGrid");

    grid.innerHTML = "";

    Object.keys(typeNames).forEach(type=>{

        const card =
            document.createElement("div");

        card.className = "type-card";

        card.onclick = ()=>{
            filterByType(type);
        };

        card.innerHTML = `

            <div
                class="type-animation anim-${typeClasses[type]}"
            ></div>

            <div class="type-card-content">

                <div class="type-icon">
                    ${typeIcons[type]}
                </div>

                <h3>
                    ${typeNames[type]}
                </h3>

                <p>
                    ${typeDescriptions[type]}
                </p>

            </div>
        `;

        grid.appendChild(card);
    });
}

async function filterByType(type){

    try{

        showPage("homePage");

        const response =
            await fetch(`${API}/type/${type}`);

        const data =
            await response.json();

        const ids =
            data.pokemon.map(item=>
                Number(
                    item.pokemon.url
                        .split("/")
                        .filter(Boolean)
                        .pop()
                )
            );

        filteredPokemon =
            allPokemon.filter(pokemon=>
                ids.includes(pokemon.id)
            );

        visibleCount = 50;

        document
            .querySelectorAll(".generation-pill")
            .forEach(item=>{
                item.classList.remove("active");
            });

        renderPokemon();

        window.scrollTo({
            top:400,
            behavior:"smooth"
        });

    }catch(error){}
}
