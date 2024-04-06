import NodeCache from "node-cache";
import { validateQuery, validateNumber } from '../../Validate/validateInput.js';
import {createPayload, createAbilityPayload, createMovePayload} from  "./helperFunctions.js";
const options = {
    stdTTL: 1800,
    checkperiod: 2000,
}
const myCache = new NodeCache(options);
const typeCache = new NodeCache(options);

async function getPractice(req, res) {
    console.log("practicing...");
    const id = req.params.id;
    if (validateQuery(id) === false) {
        console.log(id);
        return res.status(400).json({ "status": "400", "error": "Invalid input. Please use alpha-numeric characters" });
    }
    const options = {
        method: "GET"
    }
    if (myCache.has(id)) {
        res.json({ "cached": "ok" });
    }
    else {
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`, options);
            const result = await response.json();
            myCache.set(id, result);
        } catch (error) {
            //LOG error here...
            return res.status(400).json({ "status": "400", "error": error.message });
        }
        return res.json({ "status": "ok" });
    }
}

/**
 * Returns a list of pokemon by type per pagination. 
 * @param {object} req 
 * @param {object} res
 */
async function getPokemonByType(req, res) {
    console.log("typing...");
    const id = req.query.id;
    const limit = req.query.limit;
    const page = req.query.page;

    const msg = validateFilterParams(id, limit, page)
    if ( msg  !== 'ok') {
        return res.status(200).json({"error" : msg});
    }

    if (typeCache.has("type_" + id)) {
        const payload = createPayload(typeCache.get("type_" + id), limit, page);
        if (payload == false) {
            return res.status(400).json({ "status": "400", "error": "Page limit exceeded" });
        }
        return res.status(304).json(payload);    }
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/type/${id}`, {"method": "Get"});
        const result = await response.json();
        const pokemon = result["pokemon"];
        
        typeCache.set("type_"+ id, pokemon);
        const payload = createPayload(typeCache.get("type_" + id), limit, page);
        if (payload == false) {
            return res.status(400).json({ "status": "400", "error": "Page limit exceeded" });
        }
        return res.status(200).json(payload);

    } catch (error) {
        //TODO: log error to db here
        console.log(error);

        return res.status(400).json({ "status": "400", "error": error.message });
    }
}

async function getPokemonByAbility(req, res) {
    const id = req.query.id;
    const limit = req.query.limit;
    const page = req.query.page;

    const msg = validateFilterParams(id, limit, page)
    if ( msg  !== 'ok') {
        return res.status(200).json({"error" : msg});
    }

    if (typeCache.has(id)) {
        const payload = createPayload(typeCache.get("type_" + id), limit, page);
        if (payload == false) {
            return res.status(400).json({ "status": "400", "error": "Page limit exceeded" });
        }
        return res.status(304).json(payload);
    }
    else {
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/ability/${id}`);
            const result = await response.json();
            typeCache.set("ability_" + id, result);
        
            const payload = createPayload(typeCache.get("type_" + id), limit, page);
            if (payload == false) {
                return res.status(400).json({ "status": "400", "error": "Page limit exceeded" });
            }
            return res.status(200).json(payload);
        }
        catch {
            console.log(error);
            return res.status(400).json({ "status": "400", "error": error.message });
        }
    }
}
//** Returns default sprite for pokemon * /
async function getPokemonSprite(req, res) {
    var id = req.query.id;
    if (validateQuery(id) === false) {
        return res.status(409).json({ "status": "400", "error": "Invalid query param." });
    }
    
    if (typeCache.has("pokemon_" + id)) {
        return res.status(304).json({ "status": "304", "payload": typeCache.get(typeCache.get("pokemon_" + id)) });
    }
    else {
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`, { "method": "Get" });
            const result = await response.json();

            typeCache.set("pokemon_" + result.id, result);
            typeCache.set("pokemon_", + result.name, { "id": result.id });

            const payload = typeCache.get("pokemon_" + id)["sprites"]["other"]["official-artwork"]["front_default"] | typeCache.get("pokemon_" + id)["sprites"]["front_default"] | "no default sprite available";
            return res.status(200).json({ "status": "200", "payload": payload });
        } catch (error) {
            return res.status(400).json({ "status": "400", "error": error.message });
        }
    }
}

async function getPokemonByMove(req, res) {
    var id = req.query.id;
    var limit = req.query.limit;
    var page = req.query.page;

    if (validateQuery(id) === false) {
        return res.status(409).json({ "status": "400", "error": "Invalid query param." });
    }
    const errInt = validateNumber(limit, page);
    if (errInt !== -1) {
        return res.status(400).json({"status": "400", "error": `Please entery valid digit at ${errInt}`, })
    }

    if (typeCache.has("byMove_" + id)) {
        const payload = createMovePayload(typeCache.get("byMove_" + typeCache.get("byMove_" + id).id), limit, page);
        if (payload == false) {
            return res.status(400).json({ "status": "400", "error": "Page limit exceeded" });
        }
    
        return res.status(304).json({ "status": "304", "payload": payload });
    } 

    try {
        const response = await fetch(`https://pokeapi.co/api/v2/move/${id}`)
        const result = await response.json();

        typeCache.set("byMove_" + result.id , result);
        typeCache.set("byMove_" + result.name, { "id" : result.id });
        const payload = createMovePayload(result, limit, page);
        if (payload == false) {
            return res.status(400).json({ "status": "400", "error": "Page limit exceeded" });
        }
        return res.status(200).json({"status": "200", "payload" : payload})
    } catch (error) {
        console.log(error);
        return res.status(400).json({ "status": "400", "error": error.message });
    }
}
function validateFilterParams( id, limit, page) {
    if (typeof id !== 'string') {
        const a = typeof id;
        return `Invalid input for id. Expected string, received ${a} instead`;
    }
    if (validateQuery(id) === false) {
        return  `Invalid input. Please use alpha-numeric characters`;
    }
    if (validateNumber(limit) == false) {
        return `Invalid input. Please enter only digits.`;
    }
    return 'ok';
}

export {getPokemonByType, getPractice, getPokemonByAbility, getPokemonSprite, getPokemonByMove}