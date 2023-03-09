import { Planety } from "./Planety.enum"
import { Vector3 } from "@babylonjs/core/Maths";
import { IPlaneta } from "./planeta.interface";
import { Color3, Scalar } from "babylonjs";

export class ObjezneDrahyPlanet {
    private d: number = new Date().getDate();
    public readonly orbitalniPrvky: Record<string, IPlaneta> = {
        [Planety.Merkur]: {
            nazev: "Merkur",
            pocatek: Scalar.RandomRange(0, 2 * Math.PI),
            objeznaDraha: 5.791 + 69.634,
            scale: 2.44,
            color: new Color3(0.69, 0.69, 0.69),
            rocky: true,
            
            a: 57909050 / 10000000,
            e: 0.2056,
            i: 7.005,
            N: 48.331,
            w: 29.124,
            M: 174.795,
        },
        [Planety.Venuse]: {
            nazev: "Venuše",
            pocatek: Scalar.RandomRange(0, 2 * Math.PI),
            objeznaDraha: 10.821  + 69.634,
            scale: 6.05,
            color: new Color3(1, 0.65, 0.200),
            rocky: true,

            a: 108209475 / 10000000,
            e: 0.0068,
            i: 3.39471,
            N: 76.68069,
            w: 54.85229,
            M: 50.115,
        },
        [Planety.Zeme]: {
            nazev: "Země",
            pocatek: Scalar.RandomRange(0, 2 * Math.PI),
            objeznaDraha: 14.960 + 69.634,
            scale: 6.37,
            color: new Color3(0.23, 0.44, 0.73),
            rocky: true,

            a: 149597870 / 10000000,
            e: 0.0167,
            i: 0.00005,
            N: 174.873,
            w: 288.064,
            M: 357.529
        },
        [Planety.Mars]: {
            nazev: "Mars",
            pocatek: Scalar.RandomRange(0, 2 * Math.PI),
            objeznaDraha: 22.792 + 69.634,
            scale: 3.39,
            color: new Color3(0.70, 0.32, 0),
            rocky: true, 

            a: 227940000 / 10000000,
            e: 0.0934,
            i: 1.850,
            N: 49.562,
            w: 286.537,
            M: 19.373,
        },
        [Planety.Jupiter]: {
            nazev: "Jupiter",
            pocatek: Scalar.RandomRange(0, 2 * Math.PI),
            objeznaDraha: 77.857 + 69.634,
            scale: 6.991 * 3,
            color: new Color3(0.8, 0.75, 0.65),
            rocky: true, 

            a: 778330000 / 10000000,
            e: 0.0489,
            i: 1.3053,
            N: 100.492,
            w: 273.867,
            M: 20.020
        },
        [Planety.Saturn]: {
            nazev: "Saturn",
            pocatek: Scalar.RandomRange(0, 2 * Math.PI),
            objeznaDraha: 143.353 + 69.634,
            scale: 5.823 * 3,
            color: new Color3(0.9, 0.76, 0.52),
            rocky: true,

            a: 1429400000 / 10000000,
            e: 0.0557,
            i: 2.4845,
            N: 113.642,
            w: 339.391,
            M: 317.020
        },
        [Planety.Uran]: {
            nazev: "Uran",
            pocatek: Scalar.RandomRange(0, 2 * Math.PI),
            objeznaDraha: 287.246 + 69.634,
            scale: 2.536 * 3,
            color: new Color3(0.7, 1, 0.99),
            rocky: true,
            
            a: 2870990000 / 10000000,
            e: 0.0463,
            i: 0.7699,
            N: 74.000,
            w: 96.998857,
            M: 141.05,
        },
        [Planety.Neptun]: {
            nazev: "Neptun",
            pocatek: Scalar.RandomRange(0, 2 * Math.PI),
            objeznaDraha: 449.506 + 69.634,
            scale: 2.462 * 3,
            color: new Color3(0.15, 0.5, 1),
            rocky: true,

            a: 4498400000 / 10000000,
            e: 0.0086,
            i: 1.767975,
            N: 131.79431,
            w: 265.646853,
            M: 256.225
        }
    }

    private toRadians(degrees: number): number {
        return degrees * (Math.PI / 180);
      }

    private vypocetKeplerovyRovnice(M: number, e: number){
        const MAX_ITERATIONS = 1000;
        const TOLERANCE = 0.001 * Math.PI / 180;
      
        let E = M + e * Math.sin(M);
        let i = 0;
      
        while (Math.abs(E - M - e * Math.sin(E)) > TOLERANCE && i < MAX_ITERATIONS) {
          E = E - (E - M - e * Math.sin(E)) / (1 - e * Math.cos(E));
          i++;
        }
      
        return E;
      }

    private vypocetRadiusuASkutecneAnomalie(M: number, e: number, a: number): [number, number] {
        const E = this.vypocetKeplerovyRovnice(M, e);
        const xv = a * (Math.cos(E) - e);
        const yv = a * Math.sqrt(1 - e * e) * Math.sin(E);
        const v = Math.atan2(yv, xv);
        const r = Math.sqrt(xv * xv + yv * yv);
        return [r, v];
      }

    public vypocetPozicePlanety(planeta: string, numPoints: number): {planetaryPosition: Vector3, planetaryOrbitsPoints: Vector3[]} {
        const orbitalniPrvkyPlanety: IPlaneta = this.orbitalniPrvky[planeta];
        // const [vzdalenost, skutecnaAnomalie] = this.vypocetRadiusuASkutecneAnomalie(orbitalniPrvkyPlanety.M, orbitalniPrvkyPlanety.e, orbitalniPrvkyPlanety.a)

        const positions: Vector3[] = [];
        for (let i = 0; i < numPoints; i++) {
            const trueAnomaly = (i / numPoints) * 2 * Math.PI;
            const [vzdalenost, skutecnaAnomalie] = this.vypocetRadiusuASkutecneAnomalie(trueAnomaly, orbitalniPrvkyPlanety.e, orbitalniPrvkyPlanety.a);
    
            const cosN: number = Math.cos(this.toRadians(orbitalniPrvkyPlanety.N));
            const cosvw: number = Math.cos(skutecnaAnomalie + this.toRadians(orbitalniPrvkyPlanety.w));
            const sinN: number = Math.sin(this.toRadians(orbitalniPrvkyPlanety.N));
            const sinvw: number = Math.sin(skutecnaAnomalie + this.toRadians(orbitalniPrvkyPlanety.w));
            const cosi: number = Math.cos(this.toRadians(orbitalniPrvkyPlanety.i));
            const sini: number = Math.sin(this.toRadians(orbitalniPrvkyPlanety.i));
    
            const xh = vzdalenost * (cosN * cosvw - sinN * sinvw * cosi);
            const yh = vzdalenost * (sinN * cosvw + cosN * sinvw * cosi);
            const zh = vzdalenost * (sinvw * sini);
            const position = new Vector3(yh, zh, xh);
            positions.push(position);
        }
        positions.push(positions[0])
    
        return {planetaryPosition: positions[0], planetaryOrbitsPoints: positions};
    }
}