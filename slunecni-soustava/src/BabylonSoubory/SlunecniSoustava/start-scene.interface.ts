import {Scene, Mesh, ArcRotateCamera} from '@babylonjs/core';

export interface IStartScene {
    scene: Scene,
    slunce: Mesh,
    planety: Mesh[],
    kamera: ArcRotateCamera
}