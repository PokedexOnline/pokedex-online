/* =========================================================
   MEGA EVOLUÇÕES — VERSÃO CORRIGIDA
========================================================= */

async function loadMegaTab(pokemonName){

    const container = document.getElementById("megaContainer");

    if(!container) return;

    container.innerHTML = `
        <div class="loading">
            Carregando Mega Evoluções...
        </div>
    `;

    try{

        const pokemonResponse = await fetch(
            `${API}/pokemon/${pokemonName}`
        );

        if(!pokemonResponse.ok){
            throw new Error("Pokémon não encontrado");
        }

        const pokemon = await pokemonResponse.json();

        /*
         * A PokéAPI possui os dados das formas alternativas
         * no próprio Pokémon.
         */
        const speciesId =
            pokemon.species?.url
                ?.split("/")
                .filter(Boolean)
                .pop();

        if(!speciesId){
            showNoMega(container);
            return;
        }

        const speciesResponse = await fetch(
            `${API}/pokemon-species/${speciesId}`
        );

        if(!speciesResponse.ok){
            showNoMega(container);
            return;
        }

        const species = await speciesResponse.json();

        /*
         * Procuramos todas as variedades da espécie.
         */
        const varieties = species.varieties || [];

        const megaVarieties = varieties.filter(item => {

            const name =
                item.pokemon?.name?.toLowerCase() || "";

            return name.includes("-mega");

        });

        /*
         * Algumas Mega Forms não aparecem nas varieties
         * dependendo da versão dos dados.
         *
         * Então também verificamos os nomes conhecidos.
         */
        const namesToTry = new Set(
            megaVarieties
                .map(item => item.pokemon?.name)
                .filter(Boolean)
        );

        namesToTry.add(`${pokemonName}-mega`);
        namesToTry.add(`${pokemonName}-mega-x`);
        namesToTry.add(`${pokemonName}-mega-y`);

        const megaForms = [];

        for(const formName of namesToTry){

            try{

                const response = await fetch(
                    `${API}/pokemon/${formName}`
                );

                if(!response.ok) continue;

                const form = await response.json();

                const name =
                    form.name?.toLowerCase() || "";

                if(!name.includes("-mega")) continue;

                const artwork =
                    form.sprites?.other?.["official-artwork"]?.front_default ||
                    form.sprites?.other?.home?.front_default ||
                    form.sprites?.front_default;

                const shiny =
                    form.sprites?.other?.["official-artwork"]?.front_shiny ||
                    form.sprites?.other?.home?.front_shiny ||
                    form.sprites?.front_shiny ||
                    artwork;

                if(!artwork) continue;

                if(
                    !megaForms.some(
                        item => item.name === form.name
                    )
                ){

                    megaForms.push({
                        name: form.name,
                        artwork: artwork,
                        shiny: shiny
                    });

                }

            }catch(error){

                console.warn(
                    "Erro ao carregar Mega:",
                    formName,
                    error
                );

            }

        }

        /*
         * Se ainda não encontrou, usa busca pelos pokemon-forms.
         */
        if(!megaForms.length){

            try{

                const response = await fetch(
                    `${API}/pokemon-form?limit=10000`
                );

                if(response.ok){

                    const data =
                        await response.json();

                    const matching =
                        data.results.filter(item => {

                            const name =
                                item.name?.toLowerCase() || "";

                            return name.startsWith(
                                `${pokemonName.toLowerCase()}-mega`
                            );

                        });

                    for(const item of matching){

                        try{

                            const formResponse =
                                await fetch(item.url);

                            if(!formResponse.ok) continue;

                            const form =
                                await formResponse.json();

                            if(!form.is_mega) continue;

                            const artwork =
                                form.sprites?.other?.["official-artwork"]?.front_default ||
                                form.sprites?.front_default;

                            const shiny =
                                form.sprites?.other?.["official-artwork"]?.front_shiny ||
                                form.sprites?.front_shiny ||
                                artwork;

                            if(!artwork) continue;

                            if(
                                !megaForms.some(
                                    mega => mega.name === form.name
                                )
                            ){

                                megaForms.push({
                                    name: form.name,
                                    artwork: artwork,
                                    shiny: shiny
                                });

                            }

                        }catch(error){

                            console.warn(
                                "Erro na Mega Form:",
                                error
                            );

                        }

                    }

                }

            }catch(error){

                console.warn(
                    "Busca alternativa de Mega falhou:",
                    error
                );

            }

        }

        if(!megaForms.length){

            showNoMega(container);
            return;

        }

        /*
         * Mega normal
         * Mega X
         * Mega Y
         */
        megaForms.sort((a,b) => {

            const order = name => {

                const n =
                    name.toLowerCase();

                if(n.endsWith("-mega")){
                    return 1;
                }

                if(n.endsWith("-mega-x")){
                    return 2;
                }

                if(n.endsWith("-mega-y")){
                    return 3;
                }

                return 10;

            };

            return order(a.name) - order(b.name);

        });

        container.innerHTML = `

            <div class="mega-grid">

                ${megaForms.map(form => {

                    let displayName =
                        form.name
                            .replace(/-/g," ")
                            .replace(/\b\w/g, letter =>
                                letter.toUpperCase()
                            );

                    return `

                        <article class="mega-form-card">

                            <div class="mega-form-label">
                                ${displayName}
                            </div>

                            <div class="mega-images">

                                <div class="mega-image-box">

                                    <small>NORMAL</small>

                                    <img
                                        class="mega-image"
                                        src="${form.artwork}"
                                        alt="${displayName}"
                                        loading="lazy"
                                    >

                                </div>

                                <div class="mega-image-box">

                                    <small>SHINY</small>

                                    <img
                                        class="mega-shiny"
                                        src="${form.shiny}"
                                        alt="${displayName} Shiny"
                                        loading="lazy"
                                    >

                                </div>

                            </div>

                        </article>

                    `;

                }).join("")}

            </div>

        `;

    }catch(error){

        console.error(
            "Erro ao carregar Mega Evoluções:",
            error
        );

        showNoMega(container);

    }

}


/* =========================================================
   MENSAGEM SEM MEGA
========================================================= */

function showNoMega(container){

    container.innerHTML = `

        <div class="no-mega">

            <div class="no-mega-icon">
                ✨
            </div>

            <h3>
                Nenhuma Mega Evolução encontrada
            </h3>

            <p>
                Este Pokémon não possui uma Mega Evolução registrada.
            </p>

        </div>

    `;

}


/* =========================================================
   VERIFICAÇÃO
========================================================= */

async function hasMegaEvolution(pokemonName){

    try{

        const response = await fetch(
            `${API}/pokemon-species/${pokemonName}`
        );

        if(!response.ok){
            return false;
        }

        const species =
            await response.json();

        return (species.varieties || [])
            .some(item =>
                item.pokemon?.name
                    ?.toLowerCase()
                    .includes("-mega")
            );

    }catch(error){

        return false;

    }

}
