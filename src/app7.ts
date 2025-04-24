import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import { Engine, Scene, ArcRotateCamera, Vector4, Vector3, HemisphericLight, Mesh, MeshBuilder, VertexBuffer } from "@babylonjs/core";

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
        var scene = new Scene(engine);

        // Create camera with position (1, 1, 0) and target at origin
        var camera: ArcRotateCamera = new ArcRotateCamera("Camera", 0, Math.PI / 2, 3, Vector3.Zero(), scene);
        camera.position = new Vector3(-1, 1, -2);
        camera.setTarget(Vector3.Zero());
        camera.attachControl(canvas, true);
        var light1: HemisphericLight = new HemisphericLight("light1", new Vector3(1, 1, 0), scene);

        const c_ground = MeshBuilder.CreateGround("ground", {width: 2, height: 2}, scene);

        //Shape profile in XY plane
        const myShape = [
            new Vector3(0, 0, 0),
            new Vector3(1, 0, 0),
            new Vector3(1, 1, 0),
            new Vector3(0.5, 1, 0),
            new Vector3(0.5, 1.5, 0),
            new Vector3(0, 1.5, 0),
        ];

        const myPath = [
            new Vector3(0, 0, 0),
            new Vector3(0, 0, 2),
            //new Vector3(0.5, 0, 2.5),
            new Vector3(1, 0, 3),
            new Vector3(3, 0, 3),
        ];

        const extrusion = MeshBuilder.ExtrudeShape("star", {shape: myShape, closeShape: true, path: myPath, cap: Mesh.CAP_ALL, sideOrientation: Mesh.DOUBLESIDE}, scene);		

        //If no colors add colors to sphere
        var colors = extrusion.getVerticesData(VertexBuffer.ColorKind);
        if(!colors) {
            // Get the number of vertices
            const positions = extrusion.getVerticesData(VertexBuffer.PositionKind);
            const vertexCount = positions ? positions.length / 3 : 0;
            
            // Create a Float32Array with red color (1,0,0,1) for each vertex
            colors = new Float32Array(vertexCount * 4);
            for(let i = 0; i < vertexCount; i++) {
                colors[i * 4] = 1;     // R
                colors[i * 4 + 1] = 0; // G
                colors[i * 4 + 2] = 0; // B
                colors[i * 4 + 3] = 1; // A
            }
        }

        extrusion.setVerticesData(VertexBuffer.ColorKind, colors); 




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

        //actively resize the canvas
        window.addEventListener('resize', function() {
            engine.resize()
        });
    

    }
}
new App();
