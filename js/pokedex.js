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

    pokemon.evolution = await getEvolutionInformation(pokemon.evolution_chain.url);

    mostrar_modal_pokemon(pokemon);
}

const getBasicInformationID = async(id) => {
    let url = `https://pokeapi.co/api/v2/pokemon-species/${id}`;
    let rest = await fetch(url);
    let pokemon_aux = await rest.json();
    return pokemon_aux;
}

const getBasicInformationUrl = async(url) => {
    let rest = await fetch(url);
    let pokemon_aux = await rest.json();

    url = `https://pokeapi.co/api/v2/pokemon/${pokemon_aux.id}`;
    rest = await fetch(url);
    let pokemon_aux2 = await rest.json();
    pokemon_aux.pokemon = pokemon_aux2;

    return pokemon_aux;
}

const getEvolutionInformation = async(url) => {
    let rest = await fetch(url);
    let pokemon_aux3 = await rest.json();

    pokemon_aux3.chain.pokemon = await getBasicInformationUrl(pokemon_aux3.chain.species.url);

    let evolution = pokemon_aux3.chain.evolves_to;
    while (evolution.length > 0) {
        evolution[0].pokemon = await getBasicInformationUrl(evolution[0].species.url);
        evolution = evolution[0].evolves_to;
    }

    return pokemon_aux3;
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


const drawPokemonList = async() => {
    $("#lista_pokemon").html('');
    //lista_pokemon.forEach(async(element,i) => {
    //    await getInformacionPorUrl(element.url);
    //});

    for (let i = pagina * objetos_pagina - objetos_pagina; i < lista_pokemon.length && i < pagina * objetos_pagina; i++) {
        let pokemon = lista_pokemon[i];
        await getInformacionPorUrl(pokemon.url);
    }
}

const drawPokemonFilteredList = (filter) => {
    $("#lista_pokemon").html('');
    lista_pokemon.forEach(async(element) => {
        if (element.name.toLowerCase().includes(filter.toLowerCase()))
            await getInformacionPorUrl(element.url);
    });
}

function mostrar_modal_pokemon(pokemon) {
    let imagen = imagen_pokemon(pokemon.id);
    let poke_types = pokemon.pokemon.types.map(type => type.type.name);
    let unico_tipo = poke_types.length == 1 ? false : true;

    $("#header_modal").css("background-color", colors[poke_types[0]]);
    $("#header_modal").css("color", "black");

    $(this).addClass("active");

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
    $('#modal_habitat').html(pokemon.habitat.name);
    $('#modal_shape').html(pokemon.shape.name);
    $('#modal_height').html(pokemon.pokemon.height);
    $('#modal_weight').html(pokemon.pokemon.weight);
    
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

    //EVOLUTIONS
    generar_evoluciones(pokemon.evolution);
    
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

function generar_evoluciones(evolutions) {      
    $("#cartas_evolution").html('');

    carta_evolucion(evolutions.chain.pokemon);

    let evolution = evolutions.chain.evolves_to;
    while (evolution.length > 0) {
        carta_evolucion(evolution[0].pokemon);
        evolution = evolution[0].evolves_to;
    }
};

function carta_evolucion(pokemon){
    let imagen = imagen_pokemon(pokemon.id);
    let poke_types = pokemon.pokemon.types.map(type => type.type.name);
    let unico_tipo = poke_types.length == 1 ? false : true;

    $("#cartas_evolution").append(`
    <div class="col-md-4 alert alert-secondary pokemon${pokemon.id}">        
        <div class="col-md-12">   
            <h4 class="capitalize alert-heading">${pokemon.name}</h4>
        </div>    
        <div class="col-md-12">
            <div class="card-imagen">                
                <img src="${imagen}" alt="${pokemon.name}" class="img-fluid">
            </div>       
        </div>                
        <div class="row tipos">
            <div class="${unico_tipo?'col-12':'col-12'} capitalize" style="background-color: ${colors[poke_types[0]]};border-color: ${colors[poke_types[0]]};">
            ${poke_types[0]}
            </div>
            ${unico_tipo?`<div class="col-12 capitalize" style="background-color: ${colors[poke_types[1]]};border-color: ${colors[poke_types[1]]};">
            ${poke_types[1]}
            </div>`:''}                    
        </div>  
    </div>
    `);
    
    $('.pokemon'+pokemon.id).on( "click", function() {
        getInformacionPorId(pokemon.id);
    });
}

function pinta_pokemon(pokemon) {
    let imagen = imagen_pokemon(pokemon.id);

    let poke_types = pokemon.pokemon.types.map(type => type.type.name);
    let unico_tipo = poke_types.length == 1 ? false : true;


    $("#lista_pokemon").append(`
    <div class="col-lg-2 col-md-3 col-sm-4 col-xs-6 pokemon${pokemon.id}">
        <div class="card text-white bg-secondary mb-3" style="max-width: 20rem;">
            <div class="card-header capitalize" style="background-color: ${colors[poke_types[0]]}; color:black;"><h5>${pokemon.name}</h5></div>
            <div class="card-body card-imagen">                
                <img src="${imagen}" alt="${pokemon.name}" class="img-fluid">
            </div>            
            <div class="card-body">                
                <div class="row tipos">
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

    
    $('.pokemon'+pokemon.id).on( "click", function() {
        getInformacionPorId(pokemon.id);
    });
}

$(document).ready(async() => {
    $('#btn_buscar').click(buscador);
    $('#input_pokemon').keyup(buscador);
    $('#select_generacion').change(async function(){
        await getListaPokemonPorGeneracion($(this).val());
        crearPaginacion();
    });

    function buscador(){        
        let input_pokemon = $('#input_pokemon');
        if(input_pokemon.val()=='')
            drawPokemonList();
        else
            drawPokemonFilteredList(input_pokemon.val());
    }

    await getListaTipos();
    await getListaPokemonPorGeneracion(1);
    crearPaginacion();
});

let pagina = 1;
let objetos_pagina = 18;

function crearPaginacion() {
    let html = `<li class="page-item disabled" id="pagination_previous" data-dt="1"><a class="page-link" href="#">&laquo;</a></li>`;
    html = '';
    let paginas = Math.ceil(lista_pokemon.length / objetos_pagina);
    for(let i = 1; i <= paginas; i++){
        html += `<li class="page-item ${i==1?'active':''}" data-dt="${i}"><a class="page-link" href="#">${i}</a></li>`
    }
    //html += `<li class="page-item" id="pagination_next"><a class="page-link" href="#" data-dt="${paginas}">&raquo;</a></li>`;
    $("#pagination").html(html);
    drawPokemonList();

    $(document).on("click", ".page-item", function(){
        pagina = $(this).data('dt');

        $(".page-item").removeClass("active");
        $(this).addClass("active");

        $("#pagination_previous").removeClass("disabled");
        $("#pagination_next").removeClass("disabled");

        if(pagina == 1)
            $("#pagination_previous").addClass("disabled");
        if(pagina == paginas)
            $("#pagination_next").addClass("disabled");

        drawPokemonList();
    });
}