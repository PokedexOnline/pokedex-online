const API = "https://pokeapi.co/api/v2";

let allPokemon = [];
let filteredPokemon = [];
let visibleCount = 50;
let currentPokemon = null;

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
        description:"Uma região repleta de tradição.",
        css:"region-johto"
    },
    {
        id:3,
        roman:"III",
        region:"HOENN",
        description:"Uma região cercada por água e natureza.",
        css:"region-hoenn"
    },
    {
        id:4,
        roman:"IV",
        region:"SINNOH",
        description:"Uma terra fria e cheia de montanhas.",
        css:"region-sinnoh"
    },
    {
        id:5,
        roman:"V",
        region:"UNOVA",
        description:"Uma região marcada por grandes cidades.",
        css:"region-unova"
    },
    {
        id:6,
        roman:"VI",
        region:"KALOS",
        description:"Elegância, beleza e grandes aventuras.",
        css:"region-kalos"
    },
    {
        id:7,
        roman:"VII",
        region:"ALOLA",
        description:"Ilhas tropicais e cultura única.",
        css:"region-alola"
    },
    {
        id:8,
        roman:"VIII",
        region:"GALAR",
        description:"Grandes estádios e fenômenos gigantes.",
        css:"region-galar"
    },
    {
        id:9,
        roman:"IX",
        region:"PALDEA",
        description:"Uma região aberta para explorar.",
        css:"region-paldea"
    }
];
