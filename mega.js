async function loadMegaTab(pokemonName){

    const container =
        document.getElementById("megaContainer");

    if(!container) return;

    const possibleForms = [
        `${pokemonName}-mega`,
        `${pokemonName}-mega-x`,
        `${pokemonName}-mega-y`
    ];

    const megaForms = [];

    for(const formName of possibleForms){

        try{

            const response =
                await fetch(
                    `${API}/pokemon-form/${formName}`
                );

            if(!response.ok) continue;

            const form =
                await response.json();

            if(!form.is_mega) continue;

            const artwork =
                form.sprites?.front_default;

            const shiny =
                form.sprites?.front_shiny;

            if(!artwork) continue;

            megaForms.push({
                name:form.name,
                artwork,
                shiny
            });

        }catch(error){}
    }

    if(!megaForms.length){

        container.innerHTML = `

            <div class="loading">
                Este Pokémon não possui Mega Evolução.
            </div>

        `;

        return;
    }

    container.innerHTML = `

        <div class="mega-forms">

            ${megaForms.map(form=>`

                <div class="mega-form">

                    <h3>
                        ${form.name.replaceAll("-"," ")}
                    </h3>

                    <div class="mega-images">

                        <div>

                            <small>
                                Normal
                            </small>

                            <img
                                src="${form.artwork}"
                                alt="${form.name}"
                            >

                        </div>

                        <div>

                            <small>
                                Shiny
                            </small>

                            <img
                                src="${form.shiny || form.artwork}"
                                alt="${form.name} Shiny"
                            >

                        </div>

                    </div>

                </div>

            `).join("")}

        </div>
    `;
}
