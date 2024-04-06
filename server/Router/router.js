import { Router } from "express";
import { getPractice, getPokemonByType} from "../Contorller/pokeController.js";

const router = Router(); 

router.get("/pokemon/:id", getPractice);
router.get("/type", getPokemonByType);
export default router;