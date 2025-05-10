import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
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
        var scene = new Scene(engine);

        var camera: ArcRotateCamera = new ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 3, Vector3.Zero(), scene);
        camera.attachControl(canvas, true);
        var light1: HemisphericLight = new HemisphericLight("light1", new Vector3(1, 1, 0), scene);



	//create sphere
	const c_sphere = MeshBuilder.CreateSphere("Sphere",{});


// custom mesh creation
	var customMesh = new Mesh("custom", scene);

	// left hand system - counter clockwise 
	var positions = [
		0, 0, 0,
		-1, 0, 0,
		0, 0, -1, 
		-1, 0, 0,
		-1, 0, -1,
		0, 0, -1, 
		0, 1, -1, 
		0, 0, 0, 
		0, 0, -1, 
	];
	var indices = [0, 1, 2, 3, 4, 5, 6, 7, 8];

	var vertexData = new VertexData();

	vertexData.positions = positions;
	vertexData.indices = indices;

	vertexData.applyToMesh(customMesh);


	var mat = new StandardMaterial("mat", scene);
	customMesh.material = mat;





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
