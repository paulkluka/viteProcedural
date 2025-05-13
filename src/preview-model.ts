import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import { GridMaterial } from '@babylonjs/materials/Grid';
import { Engine, Scene, AxesViewer, ArcRotateCamera, Color4, Color3, Vector4, Vector3, HemisphericLight, Mesh, MeshBuilder, StandardMaterial, VertexBuffer, MeshDebugPluginMaterial, MeshDebugMode, DynamicTexture } from "@babylonjs/core";
import { Cube01 } from "./assets/Cube01";
import { Fa_Idle } from "./assets/Fa-Idle";
import { Gallery_Small } from "./environments/Gallery_Small";

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
	scene.clearColor = new Color3( .4, .5, .5);

// Create camera with position (1, 1, 0) and target at origin
        var camera: ArcRotateCamera = new ArcRotateCamera("Camera", 0, Math.PI / 2, 3, Vector3.Zero(), scene);
//      camera.position = new Vector3(0, 3, -0.1); // top view
//      camera.position = new Vector3(0, 2, -2); // top view/front
        camera.position = new Vector3(2, 2, -2); // side/top view/front
        camera.setTarget(new Vector3(0, 0.3, 0));
        camera.attachControl(canvas, true);
	camera.wheelPrecision = 30; // Set zoom sensitivity, Higher = slower zoom (default is 3) 
        var light1: HemisphericLight = new HemisphericLight("light1", new Vector3(1, 1, 0), scene);




/*\\\\\\\\\\\
\\\\\\\\\\\\\\\\\\\\\\
\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
put your model creation code below this line \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\*/
	
	// create a cube mesh from external script: src/assets/cube01.ts
	const c_cube = Cube01.CreateCube(scene);
	console.log(c_cube.name);

	// import a frame avatar mesh from external script: src/assets/fa-idle.ts
	Fa_Idle.FrameAvatarIdle(scene).then(c_fa_idle => {
		console.log(c_fa_idle.name);
	});

	// import a gallery_small environment from external script: src/environment/gallery_small.ts
	Gallery_Small.GallerySmall(scene).then(c_gallery_small => {
		console.log(c_gallery_small.name);
	});







/* end your model creation code above this line ///////////////////////////////////////////////////////////////////
//////////////////////////////////////
//////////////////////
///////////*/
 




// Enable wireframe debug display on all meshes
        // Modify mesh's geometry to prepare for TRIANGLES mode in plugin
        for (const mesh of scene.meshes) {
		MeshDebugPluginMaterial.PrepareMeshForTrianglesAndVerticesMode(mesh);
        }

        // Add plugin to all materials
        for (const material of scene.materials) {
            const plugin = new MeshDebugPluginMaterial(material, {
                mode: MeshDebugMode.TRIANGLES, wireframeTrianglesColor: new Color3(0, 0.5, 0),
            });
        }


// create wireframe grid
	// option 1: material
	var defaultGridMaterial = new GridMaterial("default", scene);
	defaultGridMaterial.majorUnitFrequency = 5;
	defaultGridMaterial.gridRatio = 0.5;

	// option 2: Create a wireframe material
        const wireframeMaterial = new StandardMaterial("wireframeMaterial", scene);
        wireframeMaterial.wireframe = true; // Enable wireframe mode

	// object
	const c_grid_size = 10
        const c_grid = MeshBuilder.CreateGround("grid", {width: c_grid_size, height: c_grid_size, subdivisions: c_grid_size * 2}, scene);
	//c_grid.material = defaultGridMaterial; // option 1
	c_grid.material = wireframeMaterial; // option 2

        // create a unit box to validate the grid sizing
        //const c_cube = MeshBuilder.CreateBox("cube");
        //c_cube.material = wireframeMaterial; // assign wireframeMaterial if needed

// create axes display after the wireframe material
	// https://doc.babylonjs.com/toolsAndResources/utilities/World_Axes/
	// https://doc.babylonjs.com/typedoc/classes/BABYLON.Debug.AxesViewer
	// https://playground.babylonjs.com/#T8UQTA
	//new AxesViewer(scene, 0.5);
	const c_Axes = new AxesViewer(scene, 0.5);


// enable inspector by default
	scene.debugLayer.show({
		embedMode:true
	});
	  
// hide/show the Inspector
        window.addEventListener("keydown", (ev) => {
            // Shift+Ctrl+Alt+I
            if (ev.shiftKey && ev.ctrlKey && ev.altKey && ev.keyCode === 73) {
                if (scene.debugLayer.isVisible()) {
                    scene.debugLayer.hide();
                } else {
                  //scene.debugLayer.show();
                    // combine the inspector with the outliner: https://forum.babylonjs.com/t/show-scene-explorer-on-right-side-without-inspection/13719 
		    // api: https://doc.babylonjs.com/typedoc/interfaces/BABYLON.IInspectorOptions
		    scene.debugLayer.show({
			embedMode:true
		    });
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
