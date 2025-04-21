import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import { AdvancedDynamicTexture, Slider, TextBlock, Control, Rectangle } from "@babylonjs/gui";
import { NodeGeometry } from "@babylonjs/core/Meshes/Node/nodeGeometry";
import "@babylonjs/node-geometry-editor";
import { Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, Mesh, MeshBuilder, VertexBuffer, StandardMaterial, Color3, Material, VertexData, AssetsManager, TextFileAssetTask } from "@babylonjs/core";

class App {
    private nodeGeometry: NodeGeometry | null = null;
    private mesh: Mesh | null = null;
    private widthBlock: any = null;
    private seatHeightBlock: any = null;
    private arLegDiameterBlock: any = null;

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

        // Create a ground mesh
        const ground = MeshBuilder.CreateGround("ground", {width: 2, height: 2}, scene);

	// create material for the chair
	const defaultMaterial = new StandardMaterial("defaultMat", scene);
	defaultMaterial.diffuseColor = new Color3(1, 0, 0); // Bright red

        // Load Node Geometry from your NGE snippet
        setTimeout(async () => {
            try {
                // Create an instance of the AssetsManager
                const assetsManager = new AssetsManager(scene);

                // Add a TextFileAssetTask to load the JSON file
                const jsonTask = assetsManager.addTextFileTask("chairNgeTask", "chair-nge.json");

                // On success, parse the JSON and create the NodeGeometry
                jsonTask.onSuccess = (task) => {
                    const jsonData = JSON.parse(task.text);
                    this.nodeGeometry = NodeGeometry.Parse(jsonData, scene);
//                  * NGE issue: https://playground.babylonjs.com/?BabylonToolkit#QG6YUM#13
//                  * createMesh method doesn't generate the mesh
//                  * created bjs forum post: https://forum.babylonjs.com/t/node-geometry-not-loaded-in-the-playground/57776
//                  * solution! https://playground.babylonjs.com/?BabylonToolkit#QG6YUM#19

//                  // Build the mesh from the node geometry
//                  console.log(this.nodeGeometry);
//                  this.mesh = this.nodeGeometry.createMesh("MyNodeMesh");
//                  this.nodeGeometry.build();
//                      console.log(this.mesh);
//                  this.nodeGeometry.updateMesh(this.mesh);
//                  this.nodeGeometry.edit;

                    // new solution: Build the mesh from the node geometry
                    this.nodeGeometry.onBuildObservable.addOnce(() => { // Wait for build to finish, just in case
                        const mesh = this.nodeGeometry.createMesh("MyNodeMesh");

                      //const defaultMaterial = new StandardMaterial("defaultMat", scene);
                      //defaultMaterial.diffuseColor = new Color3(1, 0, 0); // Bright red
                        scene.getMeshByName("MyNodeMesh").material = defaultMaterial;

                        console.log(this.mesh);
                    });

                    console.log(this.nodeGeometry);
                    console.log("nge json: " + jsonData);
                    console.log("NodeGeometry loaded successfully from JSON");

                    // Access and modify specific inputs (blocks) in the node geometry
                    this.widthBlock = this.nodeGeometry.getBlockByName("chair_width");
                    console.log("Width block:", this.widthBlock);

                    // Access and modify specific inputs (blocks) in the node geometry
                    this.seatHeightBlock = this.nodeGeometry.getBlockByName("seat_height");
                    console.log("seat height block:", this.seatHeightBlock);

                    if (this.widthBlock) {
                        this.widthBlock.value = 0.5;  // Set initial width value
                        console.log("Initial width value set to:", this.widthBlock.value);
                    }

                    // Access and modify specific inputs (blocks) in the node geometry
                    this.arLegDiameterBlock = this.nodeGeometry.getBlockByName("ar_leg_diameter");
                    console.log("arm rest leg diameter block:", this.arLegDiameterBlock );

                    // Position the mesh in the scene
                    if (this.mesh) {
                        this.mesh.position = new Vector3(1, 0, 0);
                        scene.addMesh(this.mesh);
                    }

                  //if (this.mesh && !this.mesh.material) {
                  //    const defaultMaterial = new StandardMaterial("defaultMat", scene);
                  //    defaultMaterial.diffuseColor = new Color3(1, 0, 0); // Bright red
                  //    this.mesh.material = defaultMaterial;
                  //}

                    this.nodeGeometry.build(); // See doc here: "Please note that the geometry MAY not be ready until the onBuildObservable is raised."
                };

                // On error, log the error
                jsonTask.onError = (task, message, exception) => {
                    console.error("Error loading NodeGeometry from JSON:", message, exception);
                };

                // Load the assets
                assetsManager.load();
            } catch (error) {
                console.error("Error setting up AssetManager:", error);
            }
        });

        // Create GUI
        const advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI("UI");

        // Create container for controls
        const panel = new Rectangle("controlPanel");
        panel.width = "220px";
        panel.height = "600px";
        panel.thickness = 0;
        panel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
        panel.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
        advancedTexture.addControl(panel);

        // Create width slider
        const widthSlider = new Slider();
        widthSlider.minimum = 0.1;
        widthSlider.maximum = 2;
        widthSlider.value = 0.5;
        widthSlider.height = "20px";
        widthSlider.width = "200px";
        widthSlider.color = "white";
        widthSlider.background = "black";
        widthSlider.top = "20px";
        widthSlider.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        widthSlider.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        panel.addControl(widthSlider);
        
        // Add width value display text
        const widthText = new TextBlock();
        widthText.text = "Width: " + widthSlider.value.toFixed(2);
        widthText.color = "white";
        widthText.height = "20px";
      //widthText.top = "-10px";
      //widthText.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        widthText.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        panel.addControl(widthText);

        // Update width when slider changes
        widthSlider.onValueChangedObservable.add((value) => {
            const existingMesh = scene.getMeshByName("MyNodeMesh");
            if (existingMesh) {
                existingMesh.dispose();
            }
            
            if (this.widthBlock && this.nodeGeometry) {
                this.widthBlock.value = value;
                this.nodeGeometry.onBuildObservable.addOnce(() => {
                    const mesh = this.nodeGeometry.createMesh("MyNodeMesh");
                    if (mesh) {
                      //const defaultMaterial = new StandardMaterial("defaultMat", scene);
                      //defaultMaterial.diffuseColor = new Color3(1, 0, 0);
                        mesh.material = defaultMaterial;
                    }
                });
                this.nodeGeometry.build();
                widthText.text = "Width: " + value.toFixed(2);
            }
        });

        // Create height slider
        const heightSlider = new Slider();
        heightSlider.minimum = 0.2;
        heightSlider.maximum = 0.4;
        heightSlider.value = 0.5;
        heightSlider.height = "20px";
        heightSlider.width = "200px";
        heightSlider.color = "white";
        heightSlider.background = "black";
        heightSlider.top = "80px";
      //heightSlider.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        heightSlider.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        panel.addControl(heightSlider);
        
        // Add height value display text
        const heightText = new TextBlock();
        heightText.text = "Seat Height: " + heightSlider.value.toFixed(2);
        heightText.color = "white";
        heightText.height = "20px";
        heightText.top = "50px";
        heightText.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        heightText.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        panel.addControl(heightText);

        // Update height when slider changes
        heightSlider.onValueChangedObservable.add((value) => {
            const existingMesh = scene.getMeshByName("MyNodeMesh");
            if (existingMesh) {
                existingMesh.dispose();
            }
            
            if (this.seatHeightBlock && this.nodeGeometry) {
                this.seatHeightBlock.value = value;
                this.nodeGeometry.onBuildObservable.addOnce(() => {
                    const mesh = this.nodeGeometry.createMesh("MyNodeMesh");
                    if (mesh) {
                      //const defaultMaterial = new StandardMaterial("defaultMat", scene);
                      //defaultMaterial.diffuseColor = new Color3(1, 0, 0);
                        mesh.material = defaultMaterial;
                    }
                });
                this.nodeGeometry.build();
                heightText.text = "Seat Height: " + value.toFixed(2);
            }
        });

        // Create ar leg slider
        const arLegSlider = new Slider();
        arLegSlider.minimum = 0.08;
        arLegSlider.maximum = 0.25;
        arLegSlider.value = 0.25;
        arLegSlider.height = "20px";
        arLegSlider.width = "200px";
        arLegSlider.color = "white";
        arLegSlider.background = "black";
        arLegSlider.top = "140px";
      //arLegSlider.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        arLegSlider.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        panel.addControl(arLegSlider);
        
        // Add height value display text
        const arLegText = new TextBlock();
        arLegText.text = "arm rest leg diameter: " + arLegSlider.value.toFixed(2);
        arLegText.color = "white";
        arLegText.height = "20px";
        arLegText.top = "110px";
        arLegText.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        arLegText.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        panel.addControl(arLegText);

        // Update armrest leg when slider changes
        arLegSlider.onValueChangedObservable.add((value) => {
            const existingMesh = scene.getMeshByName("MyNodeMesh");
            if (existingMesh) {
                existingMesh.dispose();
            }
            
            if (this.arLegDiameterBlock && this.nodeGeometry) {
                this.arLegDiameterBlock.value = value;
                this.nodeGeometry.onBuildObservable.addOnce(() => {
                    const mesh = this.nodeGeometry.createMesh("MyNodeMesh");
                    if (mesh) {
                      //const defaultMaterial = new StandardMaterial("defaultMat", scene);
                      //defaultMaterial.diffuseColor = new Color3(1, 0, 0);
                        mesh.material = defaultMaterial;
                    }
                });
                this.nodeGeometry.build();
                arLegText.text = "arm rest leg Height: " + value.toFixed(2);
            }
        });





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

        // Delay the start of the render loop by 3 seconds
        setTimeout(() => {
            // run the main render loop
            engine.runRenderLoop(() => {
                scene.render();
            });
        }, 1000); // 1000 milliseconds = 3 seconds
    }
}
// This line creates a new instance of the App class, which initializes the 3D scene
// with a canvas, camera, lights, GUI controls and starts the render loop
new App();
