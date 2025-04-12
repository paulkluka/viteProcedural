import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import { AdvancedDynamicTexture, Slider, TextBlock, Control } from "@babylonjs/gui";
import { NodeGeometry } from "@babylonjs/core/Meshes/Node/nodeGeometry";
import "@babylonjs/node-geometry-editor";
import { Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, Mesh, MeshBuilder, VertexBuffer, StandardMaterial, Color3, Material, VertexData, AssetsManager, TextFileAssetTask } from "@babylonjs/core";

class App {
    private nodeGeometry: NodeGeometry | null = null;
    private mesh: Mesh | null = null;
    private widthBlock: any = null;
    private seatHeightBlock: any = null;

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

                    // Position the mesh in the scene
                    if (this.mesh) {
                        this.mesh.position = new Vector3(1, 0, 0);
                        scene.addMesh(this.mesh);
                    }

                    if (this.mesh && !this.mesh.material) {
                        const defaultMaterial = new StandardMaterial("defaultMat", scene);
                        defaultMaterial.diffuseColor = new Color3(1, 0, 0); // Bright red
                        this.mesh.material = defaultMaterial;
                    }

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

        // Create slider
        const slider0 = new Slider();
        slider0.minimum = 0.1;
        slider0.maximum = 2;
        slider0.value = 0.5; // Initial value matching initial width
        slider0.height = "20px";
        slider0.width = "200px";
        slider0.color = "white";
        slider0.background = "black";
        slider0.top = "20px";
        slider0.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        slider0.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        
        // Add value display text
        const valueText0 = new TextBlock();
        valueText0.text = "Width: " + slider0.value.toFixed(2);
        valueText0.color = "white";
        valueText0.height = "20px";
        valueText0.top = "40px";
        valueText0.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        valueText0.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;

        // Add slider and text to screen
        advancedTexture.addControl(slider0);
        advancedTexture.addControl(valueText0);

        // Update width when slider changes
        slider0.onValueChangedObservable.add((value) => {
            let name = scene.getMeshByName("MyNodeMesh");
            name.dispose();
            if (this.widthBlock && this.nodeGeometry ) {
                this.nodeGeometry.onBuildObservable.addOnce(() => { // Wait for build to finish, just in case
                    const mesh = this.nodeGeometry.createMesh("MyNodeMesh");
                });
                console.log("Updating width to:", value);
                this.widthBlock.value = value;
                this.nodeGeometry.build(); // Rebuild the geometry
                //this.nodeGeometry.updateMesh(this.mesh);
                valueText0.text = "Width: " + value.toFixed(2);
            } else {
                console.log("Cannot update width - missing components:", {
                    widthBlock: !!this.widthBlock,
                    nodeGeometry: !!this.nodeGeometry,
                    mesh: !!this.mesh
                });
            }
        });

        // Create slider
        const slider1 = new Slider();
        slider1.minimum = 0.3;
        slider1.maximum = 1;
        slider1.value = 0.5; // Initial value matching initial width
        slider1.height = "20px";
        slider1.width = "200px";
        slider1.color = "white";
        slider1.background = "black";
        slider1.top = "60px";
        slider1.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        slider1.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        
        // Add value display text
        const valueText1 = new TextBlock();
        valueText1.text = "seat height: " + slider1.value.toFixed(2);
        valueText1.color = "white";
        valueText1.height = "20px";
        valueText1.top = "20px";
        valueText1.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        valueText1.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;

        // Add slider and text to screen
        advancedTexture.addControl(slider1);
        advancedTexture.addControl(valueText1);

        // Update width when slider changes
        slider1.onValueChangedObservable.add((value) => {
            let name = scene.getMeshByName("MyNodeMesh");
            name.dispose();
            if (this.seatHeightBlock && this.nodeGeometry ) {
                this.nodeGeometry.onBuildObservable.addOnce(() => { // Wait for build to finish, just in case
                    const mesh = this.nodeGeometry.createMesh("MyNodeMesh");
                });
                console.log("Updating seat height to:", value);
                this.seatHeightBlock.value = value;
                this.nodeGeometry.build(); // Rebuild the geometry
                //this.nodeGeometry.updateMesh(this.mesh);
                valueText1.text = "seat height: " + value.toFixed(2);
            } else {
                console.log("Cannot update seat height - missing components:", {
                    seatHeightBlock: !!this.seatHeightBlock,
                    nodeGeometry: !!this.nodeGeometry,
                    mesh: !!this.mesh
                });
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