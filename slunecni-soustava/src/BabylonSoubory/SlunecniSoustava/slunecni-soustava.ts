/* eslint-disable @typescript-eslint/ban-ts-comment */
import {Scene, Engine, PointLight, Color3, MeshBuilder, StandardMaterial, Texture, Mesh, ArcRotateCamera, CubeTexture, PhotoDome, LinesMesh, AbstractMesh } from "@babylonjs/core";
import { GlowLayer } from "@babylonjs/core/Layers";
import { Scalar, Vector3 } from "@babylonjs/core/Maths";
import { IPlaneta } from "./planeta.interface";
import { IStartScene } from "./start-scene.interface";
//@ts-ignore
import sunTextureUrl from '../../assets/sun/2k_sun.jpg'


// import hvezdnaOloha_px from '../../assets/skybox/hvezdnaObloha_px.jpg';
// import hvezdnaOloha_py from '../../assets/skybox/hvezdnaObloha_py.jpg';
// import hvezdnaOloha_pz from '../../assets/skybox/hvezdnaObloha_pz.jpg';
// import hvezdnaOloha_nx from '../../assets/skybox/hvezdnaObloha_nx.jpg';
// import hvezdnaOloha_ny from '../../assets/skybox/hvezdnaObloha_ny.jpg';
// import hvezdnaOloha_nz from '../../assets/skybox/hvezdnaObloha_nz.jpg';
//@ts-ignore
import starDomeUrl from '../../assets/starmap_4k.jpg'
import { ObjezneDrahyPlanet } from "./objezne-drahy.model";
import { colorCorrectionPixelShader } from "babylonjs/Shaders/colorCorrection.fragment";
import { Color4 } from "babylonjs";


export class SlunecniSoustava {

    private scene: Scene;
    private engine: Engine;
    private objezneDrahy:ObjezneDrahyPlanet = new ObjezneDrahyPlanet;
    private planety: Mesh[] = [];

    constructor(private canvas: HTMLCanvasElement){
        this.engine = new Engine(this.canvas, true)
        this.scene = this.CreateScene(this.engine);
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        window.addEventListener("resize", () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            this.engine.resize();
          });
        this.engine.runRenderLoop(() => {

            this.resizePlanety();
            this.scene.render();
        })
    }

    private CreateScene(engine: Engine): Scene {
        const startScene = this.createStartScene(engine);
        return startScene.scene;

    }

    private createStartScene(engine: Engine): IStartScene  {
        const scene: Scene = new Scene(engine);
        const camAlpha = 0,
            camBeta = 1,
            camDist = 1000,
            camTarget = new Vector3(0, 0, 0);
        this.setupEnvironment(scene);
        const slunce = this.createSlunce(scene);    
        const kamera = new ArcRotateCamera("kamera1", camAlpha, camBeta, camDist, camTarget, scene);
        kamera.useAutoRotationBehavior = true;
        kamera.autoRotationBehavior!.idleRotationSpeed = 0.05;
        kamera.autoRotationBehavior!.idleRotationSpinupTime = 5000;
        kamera.autoRotationBehavior!.idleRotationWaitTime = 2000;



        const planety = this.populatePlanetarySystem(scene);
        kamera.attachControl(true);
    
        // const spinAnim = createSpinAnimation();
        // star.animations.push(spinAnim);
        // scene.beginAnimation(star, 0, 60, true);
    
        const glowLayer = new GlowLayer("glowLayer", scene);
    
        planety.forEach(p => {
            glowLayer.addExcludedMesh(p);
            // p.animations.push(spinAnim);
            scene.beginAnimation(p, 0, 60, true, Scalar.RandomRange(0.1, 3));
        });

        const startScene: IStartScene = {scene: scene, slunce: slunce, planety: planety, kamera: kamera}
        
        return startScene;
    }

    private setupEnvironment(scene: Scene) {
        // const skybox = MeshBuilder.CreateBox("skyBox", { size: 2000 }, scene);
        // const skyboxMaterial = new StandardMaterial("skyBox", scene);

        // const skyboxTexture = CubeTexture.CreateFromImages(
        //     [hvezdnaOloha_px, hvezdnaOloha_py, hvezdnaOloha_pz, hvezdnaOloha_nx, hvezdnaOloha_ny, hvezdnaOloha_nz],
        //     scene
        //   );
        // skyboxMaterial.backFaceCulling = false;
        // skyboxMaterial.reflectionTexture = skyboxTexture;
        // skyboxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
        // skyboxMaterial.diffuseColor = new Color3(0, 0, 0);
        // skyboxMaterial.specularColor = new Color3(0, 0, 0);
        // skyboxMaterial.infiniteDistance = 
        // skybox.material = skyboxMaterial;

        const photoDome = new PhotoDome("testdome", starDomeUrl, {size: 10000}, scene);
         
    }

    private createSlunce(scene: Scene): Mesh {
        const starDiam = 695700/100000;
        const star = MeshBuilder.CreateSphere("star", { diameter: starDiam, segments: 128 }, scene);
        const mat = new StandardMaterial("starMat", scene);
        mat.backFaceCulling = true;
        star.material = mat;
        mat.emissiveColor = new Color3(.4, .4, .2);
        mat.diffuseTexture = new Texture(sunTextureUrl, scene);
        mat.diffuseTexture.level = 2;
        const light = new PointLight("starLight", Vector3.Zero(), scene);
        light.parent = star;
        light.intensity = 1;
        light.diffuse = new Color3(.98, .9, 1);
        light.specular = new Color3(1, 0.9, 0.5);
        return star;
    }

    private populatePlanetarySystem(scene: Scene): Mesh[] {
        const planetaryInfo = this.objezneDrahy.orbitalniPrvky;
        const orbity: LinesMesh[] = []
        for (const pkey in planetaryInfo) {
            const planeta = planetaryInfo[pkey];
            this.planety.push(this.createPlanet(planeta, scene));
            orbity.push(this.createOrbit(planeta, scene));
        }
        return this.planety;
    }

    private createPlanet(opts: IPlaneta, scene: Scene) {
        const modelPlanety = MeshBuilder.CreateSphere(opts.nazev, { diameter: 1 }, scene);

        const material = new StandardMaterial(modelPlanety.name + "-mat", scene);
        material.diffuseColor = material.specularColor = opts.color;
        material.specularPower = 0;
        // if (opts.rocky === true) {
        //     material.bumpTexture = new Texture("textures/rockn.png", scene);
        //     material.diffuseTexture = new Texture("textures/rock.png", scene);
        // }
        // else {
        //     material.diffuseTexture = new Texture("textures/distortion.png", scene);
        // }
    
        modelPlanety.material = material;
        modelPlanety.position = this.objezneDrahy.vypocetPozicePlanety(opts.nazev, 100).planetaryPosition;
    
        // modelPlanety.orbitOptions = opts;
        // modelPlanety.orbitAnimationObserver = createAndStartOrbitAnimation(modelPlanety, scene);
        modelPlanety.billboardMode = AbstractMesh.BILLBOARDMODE_ALL;
    
        return modelPlanety;
    }

    private createOrbit(opts: IPlaneta, scene: Scene): LinesMesh{
        const numPoints = 100;
        const points: Vector3[] = this.objezneDrahy.vypocetPozicePlanety(opts.nazev, numPoints).planetaryOrbitsPoints;
        const colors: Color4[] = [];
        for (let index = 0; index <= numPoints; index++) {
            colors.push(opts.color.toColor4(1))
        }

        debugger
        
        const line: LinesMesh = MeshBuilder.CreateLines(opts.nazev + "Orbit", {
          points: points, colors: colors
        }, scene);
        return line;
    }

    private resizePlanety(): void {
        for (const planeta of this.planety) {
            const cameraPosition: Vector3 = this.scene.getCameraByName("kamera1")!.position
            planeta.scaling.setAll(0.01 * Vector3.Distance(cameraPosition, Vector3.Zero()))
        }
    }


}