import { Router } from "express";
import { getPractice, getPokemonByType, getPokemonByAbility, getPokemonSprite, getPokemonByMove} from "../Contorller/pokemonAPI/pokeController.js";

const router = Router(); 

router.get("/single/:id", getPractice);
router.get("/type", getPokemonByType);
router.get("/ability", getPokemonByAbility);
router.get("/sprite", getPokemonSprite);
router.get("/move", getPokemonByMove);
export default router;