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
                    console.log(this.nodeGeometry);
                    console.log(jsonData);
                    //console.log("NodeGeometry loaded successfully from JSON");

                    // Access and modify specific inputs (blocks) in the node geometry
                    this.widthBlock = this.nodeGeometry.getBlockByName("chair_width");
                    console.log("Width block:", this.widthBlock);

                    if (this.widthBlock) {
                        this.widthBlock.value = 0.5;  // Set initial width value
                        console.log("Initial width value set to:", this.widthBlock.value);
                    }

                    // Build the mesh from the node geometry
                    this.nodeGeometry.build();
                    console.log(this.nodeGeometry);
                    this.mesh = this.nodeGeometry.createMesh("MyNodeMesh");
                    console.log(this.mesh);
                    this.nodeGeometry.updateMesh(this.mesh);
                    this.nodeGeometry.edit;

                    // Position the mesh in the scene
                    if (this.mesh) {
                        this.mesh.position = new Vector3(0, 0, 0);
                        scene.addMesh(this.mesh);
                    }

                    if (this.mesh && !this.mesh.material) {
                        const defaultMaterial = new StandardMaterial("defaultMat", scene);
                        defaultMaterial.diffuseColor = new Color3(1, 0, 0); // Bright red
                        this.mesh.material = defaultMaterial;
                    }
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
        const slider = new Slider();
        slider.minimum = 0.1;
        slider.maximum = 10;
        slider.value = 0.5; // Initial value matching initial width
        slider.height = "20px";
        slider.width = "200px";
        slider.color = "white";
        slider.background = "black";
        slider.top = "20px";
        slider.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        slider.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        
        // Add value display text
        const valueText = new TextBlock();
        valueText.text = "Width: " + slider.value.toFixed(2);
        valueText.color = "white";
        valueText.height = "20px";
        valueText.top = "40px";
        valueText.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        valueText.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;

        // Add slider and text to screen
        advancedTexture.addControl(slider);
        advancedTexture.addControl(valueText);

        // Update width when slider changes
        slider.onValueChangedObservable.add((value) => {
            if (this.widthBlock && this.nodeGeometry && this.mesh) {
                console.log("Updating width to:", value);
                this.widthBlock.value = value;
                this.nodeGeometry.build(); // Rebuild the geometry
                this.nodeGeometry.updateMesh(this.mesh);
                valueText.text = "Width: " + value.toFixed(2);
            } else {
                console.log("Cannot update width - missing components:", {
                    widthBlock: !!this.widthBlock,
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