import dotenv from 'dotenv';
dotenv.config();

function createPayload(pokemon, limit, page) {
    return _pushPokemon(pokemon, [], limit, page);
}

function createAbilityPayload(ability, limit, page ) {
    var payload = [];
    payload.push({
        "id": ability.id,
        "name": ability.name,
        "generation": ability.generation,
        "effect_entries": ability.effect_entries
    })
    return _pushPokemon(ability.pokemon, payload, limit, page);
}

function createMovePayload(move, limit, page) { 
    var payload = [];
    payload.push({
        "id": move.id,
        "name": move.name,
        "accuracy": move.accuracy,
        "effect_chance": move.effect_chance,
        "pp": move.pp,
        "priority": move.priority,
        "power": move.power
    });
    var i = 0;
    var start = page * limit;
    var index = {}
    var pokemon = move.learned_by_pokemon;
    var len = pokemon.length;

    if (start > len) {
        return false;
    }

    for (i = start; i < len && i < start + limit; i++){
        payload.push(move.learned_by_pokemon[i]);
        pokemon[i]["link"] = process.env.localhost + "/pokemon/sprite?id=" + pokemon[i].name;
    }
    index["start"] = start;
    index["end"] = i;
    index["total"] = len;
    return { "status": "ok", "payload": payload, "index": index };
}

function _pushPokemon(pokemon, payload=[], limit, page) {
    let i = 0;
    let len = pokemon.length;
    let start = page * limit;
    var index = {}

    if (start > len) {
        return false;
    }
    for (i = start; i < len && i < start + limit; i++){
        payload.push(pokemon[i]);
        pokemon[i]["pokemon"]["link"] = process.env.localhost + "/pokemon/sprite?id=" + pokemon[i]["pokemon"].name;
    }
    index["start"] = start;
    index["end"] = i;
    index["total"] = len;
    return { "status": "ok", "payload": payload, "index": index };
}

function _checkBounds(start, total) {
    return total > start;
}
export {createPayload, createAbilityPayload, createMovePayload}