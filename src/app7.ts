import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import { GridMaterial } from '@babylonjs/materials/Grid';
import { Engine, Scene, AxesViewer, ArcRotateCamera, Color4, Color3, Vector4, Vector3, HemisphericLight, Mesh, MeshBuilder, StandardMaterial, VertexBuffer, MeshDebugPluginMaterial, MeshDebugMode, DynamicTexture } from "@babylonjs/core";

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
        camera.setTarget(Vector3.Zero());
        camera.attachControl(canvas, true);
        var light1: HemisphericLight = new HemisphericLight("light1", new Vector3(1, 1, 0), scene);

//      const c_box = MeshBuilder.CreateBox("Box", {size: 0.1}, scene)

//      var box_colors = c_box.getVerticesData(VertexBuffer.ColorKind);
//      if(!box_colors) {
//          // Get the number of vertices
//          let positions = c_box.getVerticesData(VertexBuffer.PositionKind);
//          let vertexCount = positions ? positions.length / 3 : 0;
//          
//          // Create a Float32Array with red color (1,0,0,1) for each vertex
//          box_colors = new Float32Array(vertexCount * 4);
//          for(let i = 0; i < vertexCount; i++) {
//              box_colors[i * 4] = 0;     // R
//              box_colors[i * 4 + 1] = 1; // G
//              box_colors[i * 4 + 2] = 0; // B
//              box_colors[i * 4 + 3] = 1; // A
//          }
//      }
//      c_box.setVerticesData(VertexBuffer.ColorKind, box_colors);

// create l-shape sofa mesh
        //Shape profile in XY plane with offset
        const offset = new Vector3(-0.5, -0.5, 0);
        const myShape = [
            new Vector3(0, 0, 0).add(offset),
            new Vector3(1, 0, 0).add(offset),
            new Vector3(1, 0.5, 0).add(offset),
            new Vector3(0.5, 0.5, 0).add(offset),
            new Vector3(0.5, 1, 0).add(offset),
            new Vector3(0, 1, 0).add(offset),
        ];
	  
	// path
        const myPath = [
            new Vector3(0, 0, 0),
            new Vector3(0, 0, 2),
            new Vector3(0.35, 0, 2.6), //90 degree angle
            new Vector3(1, 0, 3),
            new Vector3(3, 0, 3),
        ];

	// create the mesh
        const extrusion = MeshBuilder.ExtrudeShape("sofa", {shape: myShape, closeShape: true, path: myPath, cap: Mesh.CAP_ALL, sideOrientation: Mesh.DOUBLESIDE}, scene);		

        extrusion.scaling = new Vector3(0.25, 0.25, 0.25);
        extrusion.position = new Vector3(0.125, 0.125, 0);

        // vertex id function: https://playground.babylonjs.com/#VKBJN#6
        function makeTextPlane(text: string, color: string, size: number, scene: Scene) {
            var dynamicTexture = new DynamicTexture("DynamicTexture", 50, scene, true);
            dynamicTexture.hasAlpha = true;
            dynamicTexture.drawText(text, 5, 40, "bold 36px Arial", color, "transparent", true);
            var plane = MeshBuilder.CreatePlane("TextPlane_" + text, {size: size}, scene);
            var mat = new StandardMaterial("TextPlaneMaterial_" + text, scene);
            mat.backFaceCulling = true;
            mat.specularColor = new Color3(0, 0, 0);
            mat.emissiveColor = new Color3(1, 1, 1);
            mat.diffuseTexture = dynamicTexture;
            plane.material = mat;
            return plane;
        }

        // Helper to compare positions with a tolerance for floating point errors
        function arePositionsEqual(a: Vector3, b: Vector3, epsilon = 1e-6) {
            return (
                Math.abs(a.x - b.x) < epsilon &&
                Math.abs(a.y - b.y) < epsilon &&
                Math.abs(a.z - b.z) < epsilon
            );
        }

        // Deduplicate positions
        const positions = extrusion.getVerticesData(VertexBuffer.PositionKind);
        const uniquePositions: Vector3[] = [];
        if (positions) {
            for (let i = 0; i < positions.length; i += 3) {
                const pos = new Vector3(positions[i], positions[i+1], positions[i+2]);
                if (!uniquePositions.some(existing => arePositionsEqual(existing, pos))) {
                    uniquePositions.push(pos);
                }
            }
        }

        // Label only the unique corners
        uniquePositions.forEach((pos, idx) => {
            // Convert local position to global position
            const globalPos = Vector3.TransformCoordinates(pos, extrusion.getWorldMatrix());
            const textPlane = makeTextPlane(idx.toString(), "white", 0.1, scene);
            textPlane.position = globalPos;
            textPlane.billboardMode = 7;
        });

//      //If no colors add colors to sphere
//      var ext_colors = extrusion.getVerticesData(VertexBuffer.ColorKind);
//      if(!ext_colors) {
//          // Get the number of vertices
//          const positions = extrusion.getVerticesData(VertexBuffer.PositionKind);
//          const vertexCount = positions ? positions.length / 3 : 0;
//          
//          // Create a Float32Array with red color (1,0,0,1) for each vertex
//          ext_colors = new Float32Array(vertexCount * 4);
//          for(let i = 0; i < vertexCount; i++) {
//              ext_colors[i * 4] = 1;     // R
//              ext_colors[i * 4 + 1] = 0; // G
//              ext_colors[i * 4 + 2] = 0; // B
//              ext_colors[i * 4 + 3] = 1; // A
//          }
//      }

//      extrusion.setVerticesData(VertexBuffer.ColorKind, ext_colors); 

	// show debug info:
        extrusion.showBoundingBox = true;

	// Create a material
        const sofaMaterial = new StandardMaterial("sofaMaterial", scene);
        sofaMaterial.diffuseColor = new Color3(0.8, 0.5, 0.5);
        sofaMaterial.specularColor = new Color3(0.1, 0.1, 0.1);
//      sofaMaterial.wireframe = true; // Enable wireframe mode
        extrusion.material = sofaMaterial;

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
        const c_grid = MeshBuilder.CreateGround("grid", {width: 2, height: 2, subdivisions: 4}, scene);
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
