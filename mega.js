/* =========================================================
   MEGA EVOLUÇÕES
   Responsável exclusivamente pelas Mega Evoluções
========================================================= */

async function loadMegaTab(pokemonName){

    const container = document.getElementById("megaContainer");

    if(!container){
        return;
    }

    container.innerHTML = `
        <div class="loading">
            Carregando Mega Evoluções...
        </div>
    `;

    const possibleForms = [
        `${pokemonName}-mega`,
        `${pokemonName}-mega-x`,
        `${pokemonName}-mega-y`
    ];

    const megaForms = [];

    /*
     * Primeiro tenta diretamente os nomes conhecidos.
     */
    for(const formName of possibleForms){

        try{

            const response = await fetch(
                `${API}/pokemon-form/${formName}`
            );

            if(!response.ok){
                continue;
            }

            const form = await response.json();

            if(!form.is_mega){
                continue;
            }

            const artwork =
                form.sprites?.other?.["official-artwork"]?.front_default ||
                form.sprites?.front_default;

            const shiny =
                form.sprites?.other?.["official-artwork"]?.front_shiny ||
                form.sprites?.front_shiny;

            if(!artwork){
                continue;
            }

            if(
                !megaForms.some(
                    item => item.name === form.name
                )
            ){

                megaForms.push({
                    name:form.name,
                    artwork,
                    shiny:shiny || artwork
                });

            }

        }catch(error){

            console.warn(
                `Erro ao carregar Mega ${formName}:`,
                error
            );

        }
    }

    /*
     * Caso os nomes diretos não funcionem,
     * procura pelas Mega Forms disponíveis na API.
     */
    if(!megaForms.length){

        try{

            const response = await fetch(
                `${API}/pokemon-form?limit=2000`
            );

            if(response.ok){

                const data = await response.json();

                const matchingForms =
                    data.results.filter(form => {

                        const name =
                            form.name.toLowerCase();

                        return (
                            name.startsWith(
                                `${pokemonName.toLowerCase()}-mega`
                            )
                        );

                    });

                for(const formInfo of matchingForms){

                    try{

                        const formResponse =
                            await fetch(formInfo.url);

                        if(!formResponse.ok){
                            continue;
                        }

                        const form =
                            await formResponse.json();

                        if(!form.is_mega){
                            continue;
                        }

                        const artwork =
                            form.sprites?.other?.["official-artwork"]?.front_default ||
                            form.sprites?.front_default;

                        const shiny =
                            form.sprites?.other?.["official-artwork"]?.front_shiny ||
                            form.sprites?.front_shiny;

                        if(!artwork){
                            continue;
                        }

                        if(
                            !megaForms.some(
                                item => item.name === form.name
                            )
                        ){

                            megaForms.push({
                                name:form.name,
                                artwork,
                                shiny:shiny || artwork
                            });

                        }

                    }catch(error){

                        console.warn(
                            "Erro ao carregar formulário Mega:",
                            error
                        );

                    }

                }

            }

        }catch(error){

            console.warn(
                "Erro na busca de Mega Evoluções:",
                error
            );

        }

    }

    /*
     * Não possui Mega Evolução.
     */
    if(!megaForms.length){

        container.innerHTML = `
            <div class="no-mega">
                <div style="font-size:42px;margin-bottom:12px;">
                    ✨
                </div>

                <h3 style="margin-bottom:8px;">
                    Nenhuma Mega Evolução encontrada
                </h3>

                <p>
                    Este Pokémon não possui uma Mega Evolução
                    registrada na PokéAPI.
                </p>
            </div>
        `;

        return;
    }

    /*
     * Ordenação:
     * Mega normal → Mega X → Mega Y
     */
    megaForms.sort((a,b)=>{

        const order = {
            "mega":1,
            "mega-x":2,
            "mega-y":3
        };

        const getOrder = name => {

            const lower =
                name.toLowerCase();

            if(lower.endsWith("-mega")){
                return 1;
            }

            if(lower.endsWith("-mega-x")){
                return 2;
            }

            if(lower.endsWith("-mega-y")){
                return 3;
            }

            return 10;
        };

        return getOrder(a.name) - getOrder(b.name);

    });

    container.innerHTML = `
        <div class="mega-grid">

            ${megaForms.map(form => {

                const displayName =
                    form.name
                        .replaceAll("-", " ");

                return `

                    <article class="mega-form-card">

                        <div class="mega-form-label">
                            ${displayName}
                        </div>

                        <div class="mega-images">

                            <div>

                                <small>
                                    NORMAL
                                </small>

                                <img
                                    class="mega-image"
                                    src="${form.artwork}"
                                    alt="${displayName}"
                                    loading="lazy"
                                >

                            </div>

                            <div>

                                <small>
                                    SHINY
                                </small>

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
}


/* =========================================================
   VERIFICAÇÃO DE MEGA
========================================================= */

async function hasMegaEvolution(pokemonName){

    const possibleForms = [
        `${pokemonName}-mega`,
        `${pokemonName}-mega-x`,
        `${pokemonName}-mega-y`
    ];

    for(const formName of possibleForms){

        try{

            const response = await fetch(
                `${API}/pokemon-form/${formName}`
            );

            if(!response.ok){
                continue;
            }

            const form = await response.json();

            if(form.is_mega){
                return true;
            }

        }catch(error){}

    }

    return false;
}
