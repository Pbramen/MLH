import NodeCache from "node-cache";
import { validateAlpha, validateNumber } from '../Validate/validateInput.js';

const options = {
    stdTTL: 1800,
    checkperiod: 2000,
}
const myCache = new NodeCache(options);
const typeCache = new NodeCache(options);

async function getPractice(req, res) {
    console.log("practicing...");
    const id = req.params.id;
    if (validateAlpha(id) === false) {
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

//getPokemonByType paginated by specified limit.
async function getPokemonByType(req, res) {
    console.log("typing...");
    const id = req.query.id;
    const limit = req.query.limit;
    const page = req.query.page;
    console.log(id, limit);
    if (typeof id !== 'string') {
        const a = typeof id;
        return res.status(400).json({ "status": "400", "error": `Invalid input. Expected string, received ${a} instead` });
    }
    if (validateAlpha(id) === false) {
        return res.status(400).json({ "status": "400", "error": `Invalid input. Please use alpha-numeric characters` });
    }
    if (validateNumber(limit) == false) {
        return res.status(400).json({ "status": "400", "error": `Invalid input. Please enter only digits.` });
    }
    if (typeCache.has(id) && typeCache.has(id)) {
        //return only the limit range!
        let pokemon = typeCache.get(id);
        let i = 0;
        let len;
        let start = page * limit;
        var payload = [];
        for (i = start, len = pokemon.length; i < len && i < start + limit; i++){
            console.log(i + "\r\n");
            payload.push(pokemon[i]);
        }
        const json = {"status": "ok", "payload": payload}
        return res.status(200).json(json);
    }
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/type/${id}`, {"method": "Get"});
        const result = await response.json();
        const pokemon = result["pokemon"];
        
        typeCache.set(result.name, {});
        typeCache.set(id, pokemon);
    } catch (error) {
        //TODO: log error to db here
        console.log(error);
        return res.status(400).json({ "status": "400", "error": error.message });
    }
    return res.status(200).json({ "status": "200" });
}
export {getPokemonByType, getPractice}