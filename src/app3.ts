import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/core/Meshes/Builders/sphereBuilder";
import { Mesh } from "@babylonjs/core/Meshes/mesh";



import { SceneLoader } from '@babylonjs/core/Loading/sceneLoader';
import '@babylonjs/loaders/glTF';

import { Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, Mesh, MeshBuilder, VertexBuffer, StandardMaterial, Color3, Material, VertexData } from "@babylonjs/core";

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

        
        // test material
        const c_mat = new StandardMaterial("material", scene);
        c_mat.diffuseColor = new Color3(1, .5, .5); // Red color using Color3


        // load the glb file
        SceneLoader.ImportMesh("Suzanne", "./", "monkey.glb", scene, function(newMeshes){
            let monkeyRoot = newMeshes[0];//this returns the name "__root__", not the child mesh Suzanne!
            monkeyRoot.scaling = new Vector3(0.5, 0.5, 0.5); // Scale it down to reasonable size
            monkeyRoot.position = new Vector3(0, 0, 0); // Position at center
            let monkey = newMeshes[0].getChildMeshes()[0];
            console.log(monkey.name);

            let positions = monkey.getVerticesData(VertexBuffer.PositionKind);
            let indices = monkey.getIndices();
            let normals = monkey.getVerticesData(VertexBuffer.NormalKind);
            
            // Create green colors array
            let colors = [];
            if (positions) {
                for(let p = 0; p < positions.length / 3; p++) {
                    //colors.push(1, 1, 0, 1); // RGBA for green

            // assign a vertical gradient to the mesh using the y position value as the color for the vertices
                    const y = positions[p * 3 + 1]; // Get y position value
                    const yMin = -0.5; // Sphere diameter is 1, so y ranges from -0.5 to 0.5
                    const yMax = 0.5;
                    const normalizedY = (y - yMin) / (yMax - yMin); // Normalize to 0-1 range
    //              const g = 2.2;//gamma
                    const g = 1;//gamma
                    const f = Math.pow(normalizedY, g); // Apply gamma correction
                    colors.push(f, f, f, 1);

                }
            }

            // Apply vertex data
            let vertexData = new VertexData();
            vertexData.positions = positions;
            vertexData.indices = indices;
            vertexData.normals = normals;
            vertexData.colors = colors;
            vertexData.applyToMesh(monkey);
        });



//      if(monkey){
//          console.log("yes");
//      }
//      else{
//          console.log("no");
//      }

//      if(monkey){
//          console.log(monkey);
//      }

        

 //      const monkey = scene.getMeshByName("Suzanne");
       
//       //If no colors add colors to sphere
//       var colors = monkey.getVerticesData(VertexBuffer.ColorKind);
//       if(!colors) {
//           colors = [];
 
//           var positions = monkey.getVerticesData(VertexBuffer.PositionKind);
 
//           for(var p = 0; p < positions.length / 3; p++) {
//               colors.push(Math.random(), Math.random(), Math.random(), 1);
//           }
//       }
 
//       monkey.setVerticesData(VertexBuffer.ColorKind, colors);




        // test material for sphere
        const c_sphereMat = new StandardMaterial("sphereMat", scene);
        c_sphereMat.diffuseColor= new Color3(0, 0, 0);
        c_sphereMat.emissiveColor = new Color3(1, 1, 1);

        const sphere = MeshBuilder.CreateSphere("sphere", {diameter:1, updatable: true}, scene);
        sphere.position = new Vector3(1, 1, 0);

        //If no colors add colors to sphere
        var colors = sphere.getVerticesData(VertexBuffer.ColorKind);
        if(!colors) {
            colors = [];
    
            var positions = sphere.getVerticesData(VertexBuffer.PositionKind);
    
            // assign a vertical gradient to the mesh using the y position value as the color for the vertices
            for(var p = 0; p < positions.length / 3; p++) {
                const y = positions[p * 3 + 1]; // Get y position value
                const yMin = -0.5; // Sphere diameter is 1, so y ranges from -0.5 to 0.5
                const yMax = 0.5;
                const normalizedY = (y - yMin) / (yMax - yMin); // Normalize to 0-1 range
//              const g = 2.2;//gamma
                const g = 1;//gamma
                const f = Math.pow(normalizedY, g); // Apply gamma correction
                colors.push(f, f, f, 1);
            }
        }
        sphere.setVerticesData(VertexBuffer.ColorKind, colors);
        sphere.material = c_sphereMat;




        var box = MeshBuilder.CreateBox("box", {size: 1}, scene);
        box.material = c_mat;



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
