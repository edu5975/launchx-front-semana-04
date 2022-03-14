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

    url = `https://pokeapi.co/api/v2/pokemon/${pokemon.id}`;
    rest = await fetch(url);
    let pokemon_aux2 = await rest.json();
    pokemon.pokemon = pokemon_aux2;

    mostrar_modal_pokemon(pokemon);
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

const drawPokemonFilteredList = (filter) => {
    $("#lista_pokemon").html('');
    lista_pokemon.forEach(async(element) => {
        if (element.name.toLowerCase().includes(filter.toLowerCase()))
            await getInformacionPorUrl(element.url);
    });
}

function mostrar_modal_pokemon(pokemon) {
    console.log(pokemon);
    let imagen = imagen_pokemon(pokemon.id);
    let poke_types = pokemon.pokemon.types.map(type => type.type.name);
    let unico_tipo = poke_types.length == 1 ? false : true;

    // BASIC
    $('#modal_title').html(pokemon.name);
    $('#modal_imagen').html(`
        <div class="card-body card-imagen">                
            <img src="${imagen}" alt="${pokemon.name}" class="img-fluid">
        </div>`);
    $('#modal_tipos').html(`
        <div class="row tipos" >
            <div class="${unico_tipo?'col-6':'col-12'} capitalize" style="background-color: ${colors[poke_types[0]]};border-color: ${colors[poke_types[0]]};">
                ${poke_types[0]}
            </div>
            ${unico_tipo?`<div class="col-6 capitalize" style="background-color: ${colors[poke_types[1]]};border-color: ${colors[poke_types[1]]};">
                ${poke_types[1]}
            </div>`:''}                    
        </div>`)

    //GENERAL          
    $('#modal_id').html(pokemon.id);    
    $('#modal_name').html(pokemon.name); 

    let text_extry = 'Without description';  
    pokemon.flavor_text_entries.forEach((element) => {
        if (element.language.name == 'en')
            text_extry = element.flavor_text;
    });
    $('#modal_text_entry').html(text_extry);
    
    let genera = 'Without description';  
    pokemon.genera.forEach((element) => {
        if (element.language.name == 'en')
            genera = element.genus;
    });
    $('#modal_genera').html(genera);

    // MOVES
    $('#modal_table_moves_body').html('');
    pokemon.pokemon.moves.forEach(function(move){
        $('#modal_table_moves_body').append(`<tr><td scope="col" class="capitalize">${move.move.name}</td></tr>`)
    });

    //STATS
    generar_grafico_stats(pokemon.pokemon.stats);
    
    $('#modal_pokemon').modal('show');
}

function generar_grafico_stats(stats){
    let hp=0,attack=0,defense=0,special_attack=0,special_defense=0,speed=0;
    stats.forEach(function(stat){
        switch(stat.stat.name){
            case 'hp': hp = stat.base_stat; break;
            case 'attack': attack = stat.base_stat; break;
            case 'defense': defense = stat.base_stat; break;
            case 'special-attack': special_attack = stat.base_stat; break;
            case 'special-defense': special_defense = stat.base_stat; break;
            case 'speed': speed = stat.base_stat; break;
        }
    });

    const config = {
        type: 'polarArea',
        data:  {
            labels:  [
                'HP',
                'Attack', 
                'Defense', 
                'Special Attack', 
                'Special Defense', 
                'Speed'
            ],
            datasets: [{
                label: 'Dataset 1',
                data: [
                    hp, attack, defense, special_attack, special_defense, speed
                ],
                backgroundColor: [
                    '#4dc9f6',
                    '#f67019',
                    '#f53794',
                    '#537bc4',
                    '#acc236',
                    '#166a8f'
                ]
            }]
        },
        options: {
            responsive: true,
        },
    };

    $('#modal_chart_stats').remove();
    $('#tab_modal_stats').append('<canvas id="modal_chart_stats"></canvas>');
    const myChart = new Chart(
        document.getElementById('modal_chart_stats'),
        config
    );
}

function pinta_pokemon(pokemon) {
    let imagen = imagen_pokemon(pokemon.id);

    let poke_types = pokemon.pokemon.types.map(type => type.type.name);
    let unico_tipo = poke_types.length == 1 ? false : true;


    $("#lista_pokemon").append(`
    <div class="col-lg-3 col-md-4 col-sm-6 col-xs-12" id="pokemon${pokemon.id}">
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

    
    $('#pokemon'+pokemon.id).on( "click", function() {
        getInformacionPorId(pokemon.id);
    });
}

$(document).ready(async() => {
    $('#btn_buscar').click(buscador);
    $('#input_pokemon').keyup(buscador);

    function buscador(){        
        let input_pokemon = $('#input_pokemon');
        if(input_pokemon.val()=='')
            drawPokemonList();
        else
            drawPokemonFilteredList(input_pokemon.val());
    }

    await getListaTipos();
    await getListaPokemonPorGeneracion(1);
    drawPokemonList();
});