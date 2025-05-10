import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/core/Meshes/Builders/sphereBuilder";
import { Mesh } from "@babylonjs/core/Meshes/mesh";



import { SceneLoader } from '@babylonjs/core/Loading/sceneLoader';
import '@babylonjs/loaders/glTF';

import { Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, Mesh, MeshBuilder, VertexBuffer } from "@babylonjs/core";

class App {
    constructor() {
        // create the canvas html element and attach it to the webpage
        var canvas = document.createElement("canvas");
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        canvas.id = "gameCanvas";
        document.body.appendChild(canvas);

        // initialize babylon scene and engine
        var engine = new Engine(canvas, true);
        var scene = new Scene(engine)

        var camera: ArcRotateCamera = new ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, -4, Vector3.Zero(), scene);
        camera.attachControl(canvas, true);
        var light1: HemisphericLight = new HemisphericLight("light1", new Vector3(1, 1, 0), scene);


        SceneLoader.ImportMesh("Suzanne", "./", "monkey.glb", scene, function(newMeshes){
            let monkey = newMeshes[0];
            monkey.scaling = new Vector3(0.5, 0.5, 0.5); // Scale it down to reasonable size
            monkey.position = new Vector3(0, 0, 0); // Position at center
        });

        const monkey = scene.getMeshByName("Suzanne");
        /*
        //If no colors add colors to sphere
        var colors = monkey.getVerticesData(BABYLON.VertexBuffer.ColorKind);
        if(!colors) {
            colors = [];

            var positions = monkey.getVerticesData(BABYLON.VertexBuffer.PositionKind);

            for(var p = 0; p < positions.length / 3; p++) {
                colors.push(Math.random(), Math.random(), Math.random(), 1);
            }
        }

        monkey.setVerticesData(BABYLON.VertexBuffer.ColorKind, colors);*/

        var sphere = MeshBuilder.CreateSphere("sphere", {diameter:1, updatable: true}, scene);
        sphere.position = new Vector3(1, 0, 0);

        //If no colors add colors to sphere
        var colors = sphere.getVerticesData(VertexBuffer.ColorKind);
        if(!colors) {
            colors = [];
    
            var positions = sphere.getVerticesData(VertexBuffer.PositionKind);
    
            for(var p = 0; p < positions.length / 3; p++) {
                colors.push(Math.random(), Math.random(), Math.random(), 1);
            }
        }
    
        sphere.setVerticesData(VertexBuffer.ColorKind, colors);




        // hide/show the Inspector
        window.addEventListener("keydown", (ev) => {
            // Shift+Ctrl+Alt+I
            if (ev.shiftKey && ev.ctrlKey && ev.altKey && ev.keyCode === 73) {
                if (scene.debugLayer.isVisible()) {
                    scene.debugLayer.hide();
                } else {
                    scene.debugLayer.show();
                }
            }
        });

        // run the main render loop
        engine.runRenderLoop(() => {
            scene.render();
        });
    }
}
new App();
