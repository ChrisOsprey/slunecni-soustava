import {Color3} from "@babylonjs/core"
import { IOrbitalniPrvky } from "./orbitalni-prvky.interface"

export interface IPlaneta extends IOrbitalniPrvky {
    nazev: string,
    pocatek: number,
    objeznaDraha: number,
    scale: number,
    color: Color3,
    rocky: boolean
}