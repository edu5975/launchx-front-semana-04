/*pintar card pokemon*/
const colors = {
    normal: '#DDCCAA',
    fighting: '#FF5D5D',
    flying: '#CDCDCD',
    poison: '#9D5B9B',
    ground: '#CAAC4D',
    rock: '#90642D',
    bug: '#EAFD71',
    ghost: '#778899',
    steel: '#CCCCCC',
    fire: '#FFA05D',
    water: '#7E97C0',
    grass: '#8FD594',
    electric: '#FFE43B',
    psychic: '#FF96B5',
    ice: '#ADD8E6',
    dragon: '#97b3e6',
    dark: '#A9A9A9',
    fairy: '#FFB0FF',
    unknown: 'black',
    shadow: '#A9A9A9',
};
const main_types = Object.keys(colors);


function imagen_pokemon(id) {
    id = id.toString().padStart(3, 0);
    return `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${id}.png`;
};

let lista_pokemon = [];
let lista_generaciones = {}
let lista_tipos = {};
let pokemon = {};

const getInformacionPorId = async(id) => {
    let url = `https://pokeapi.co/api/v2/pokemon-species/${id}`;
    let rest = await fetch(url);
    let pokemon_aux = await rest.json();
    pokemon = pokemon_aux;

}

let imprime = true;

const getInformacionPorUrl = async(url) => {
    let rest = await fetch(url).then();
    let pokemon_aux = await rest.json().then();
    let pokemon = pokemon_aux;

    url = `https://pokeapi.co/api/v2/pokemon/${pokemon.id}`;
    rest = await fetch(url);
    let pokemon_aux2 = await rest.json();
    pokemon.pokemon = pokemon_aux2;

    pinta_pokemon(pokemon);
}

const getListaGeneraciones = async() => {
    const url = `https://pokeapi.co/api/v2/generation/`;
    const rest = await fetch(url);
    const lista_generaciones_aux = await rest.json();
    lista_generaciones = lista_generaciones_aux;
}

const getListaPokemonPorGeneracion = async(id) => {
    const url = `https://pokeapi.co/api/v2/generation/${id}`;
    const rest = await fetch(url);
    const lista_pokemon_aux = await rest.json();
    lista_pokemon = lista_pokemon_aux.pokemon_species;
}

const getListaTipos = async() => {
    const url = `https://pokeapi.co/api/v2/type`;
    const rest = await fetch(url);
    const lista_tipos_aux = await rest.json();
    lista_tipos = lista_tipos_aux;
}

const getListaPokemonPorTipo = async(url) => {
    const rest = await fetch(url);
    const lista_pokemon_aux = await rest.json();
    lista_pokemon = [];
    lista_pokemon_aux.pokemon.forEach((pokemon) => lista_pokemon.push(pokemon.pokemon));
}


const drawPokemonList = () => {
    $("#lista_pokemon").html('');
    lista_pokemon.forEach(async(element) => {
        await getInformacionPorUrl(element.url);
    });
}

function pinta_pokemon(pokemon) {
    let imagen = imagen_pokemon(pokemon.id);

    const poke_types = pokemon.pokemon.types.map(type => type.type.name);
    const unico_tipo = poke_types.length == 1 ? false : true;

    console.log(pokemon)
    $("#lista_pokemon").append(`
    <div class="col-lg-3 col-md-4 col-sm-6 col-xs-12">
        <div class="card text-white bg-secondary mb-3" style="max-width: 20rem;">
            <div class="card-header capitalize"><h5>${pokemon.name}</h5></div>
            <div class="card-body card-imagen">                
                <img src="${imagen}" alt="${pokemon.name}" class="img-fluid">
            </div>            
            <div class="card-body">                
                <div class="row tipos" >
                    <div class="${unico_tipo?'col-6':'col-12'} capitalize" style="background-color: ${colors[poke_types[0]]};border-color: ${colors[poke_types[0]]};">
                    ${poke_types[0]}
                    </div>
                    ${unico_tipo?`<div class="col-6 capitalize" style="background-color: ${colors[poke_types[1]]};border-color: ${colors[poke_types[1]]};">
                    ${poke_types[1]}
                    </div>`:''}
                    
                </div>
            </div>
        </div>
    </div>
    `);
}

$(document).ready(async() => {
    await getListaTipos();
    await getListaPokemonPorGeneracion(1);
    drawPokemonList();
    console.log(pokemon);
});