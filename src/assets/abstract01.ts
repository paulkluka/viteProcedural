// create an abstract prop
import { Scene, MeshBuilder, Mesh, Vector4, Color3, Vector3, Curve3, StandardMaterial, Texture, NoiseProceduralTexture} from "@babylonjs/core";
import { MarbleProceduralTexture } from "@babylonjs/procedural-textures/marble";
// create the class
export class Abstract01 {
	// create the method
	static createAbstract(scene: Scene): void {
        	// base mesh: define some parameters
        	const c_baseSize = 0.25;
        	const c_baseHeight = 0.5;
        	const c_baseGroundSnap = (c_baseSize * 0.5) * c_baseHeight;

		// map the uv of each faces of the box
		const c_faceUV = [];
		c_faceUV[0] = new Vector4(0.0, 0.0, 1.0, c_baseHeight); //rear face
		c_faceUV[1] = new Vector4(0.0, 0.0, 1.0, c_baseHeight); //front face
		c_faceUV[2] = new Vector4(0.0, 0.0, 1.0, c_baseHeight); //right side
		c_faceUV[3] = new Vector4(0.0, 0.0, 1.0, c_baseHeight); //left side
		c_faceUV[4] = new Vector4(0.0, 0.0, 1.0, 1.0); //top side
		c_faceUV[5] = new Vector4(0.0, 0.0, 1.0, 1.0); //bottom side

        	// base mesh creation using the parameters
        	const c_base = MeshBuilder.CreateBox("base", { faceUV: c_faceUV, size: c_baseSize }, scene);
        	c_base.scaling = new Vector3(1, c_baseHeight, 1);
        	c_base.position = new Vector3(0, c_baseGroundSnap, 0);
        	console.log(c_baseGroundSnap);

        	// extruded shape
        	//Shape profile in XY plane with offset - it won't work with other planes
        	//const offset = new Vector3(0, 0, 0);
        	const offset = new Vector3(0, 0, 0);
		const pfw = 4;//profile width
		const pfh = 0.4;//profile height
        	const c_shape = [
        	    new Vector3(0, 0, 0).add(offset),
        	    new Vector3(pfw, 0, 0).add(offset),
        	    new Vector3(pfw, pfh, 0).add(offset),
        	    new Vector3(0, pfh, 0).add(offset),
        	];
		// curve path on the XZ plane - https://playground.babylonjs.com/#1AU0M4#18
		const cd = 9//depth
		const cw = 4//width
		const c_catmullRom = Curve3.CreateCatmullRomSpline(
			[
				new Vector3(cw/2, -1, cd),//top
				new Vector3(0, -2, cd/2+1),//left
				new Vector3(1, 1, cd/2),//left1
				new Vector3(cw/2 , 0, 0),//bottom
				new Vector3(cw+2, -2, cd/2-2),//right
				new Vector3(cw+2, 2, cd/2),//right1
				new Vector3(cw, 0, cd/2+2),//right2
			],
			5,
			true);

		// https://playground.babylonjs.com/#00JR7Z
		const c_path = c_catmullRom.getPoints()

		const catmullRomSpline = Mesh.CreateLines("catmullRom", c_catmullRom.getPoints(), scene);

		const myScale = function(i, distance) {
			var scale = 1;
			return scale;
		};
	    
		const myRotation = function(i, distance) {
			return 0;	
		};
  		const c_extruded = MeshBuilder.ExtrudeShapeCustom("extruded", {shape: c_shape, path: c_path, scaleFunction: myScale, rotationFunction: myRotation, closePath: true, closeShape: true});
//		const c_extruded = MeshBuilder.ExtrudeShape("extruded", {shape: c_shape, path: c_path, closeShape: true, cap: Mesh.CAP_ALL, sideOrientation: Mesh.DOUBLESIDE}, scene);

		const c_xtsize = c_baseSize * 0.15;
		c_extruded.rotation.x = -Math.PI/2;//rotate 90 degree upright on x
		c_extruded.scaling = new Vector3(c_xtsize, c_xtsize, c_xtsize);
		c_extruded.position = new Vector3(-0.07, 0.26, 0);


// final touch
		// merge meshes
		// https://doc.babylonjs.com/features/featuresDeepDive/mesh/mergeMeshes/
		// https://playground.babylonjs.com/#INZ0Z0#5
		const c_mesh = Mesh.MergeMeshes([c_base, c_extruded])
		c_mesh.bakeCurrentTransformIntoVertices()//reset the transform

		// set material
		const c_mesh_mat = new StandardMaterial("c_mesh_mat", scene)
		c_mesh_mat.diffuseTexture = new Texture("https://www.babylonjs-playground.com/textures/lava/lavatile.jpg");
		// procedural textures
        	const c_procTxr = new NoiseProceduralTexture("perlin", 256, scene);
        	c_procTxr.octaves = 5
        	c_procTxr.level = 0.21
        	c_procTxr.persistence = 1.3
        	c_procTxr.animationSpeedFactor = 0
//      	const c_procTxr = new MarbleProceduralTexture("marble", 256, scene);
//      	c_procTxr.numberOfTilesHeight = 3
//      	c_procTxr.numberOfTilesWidth = 3
//      	c_procTxr.amplitude = 9.0
//      	c_procTxr.jointColor = new Color3(0.72, 0.72, 0.72)
        	c_mesh_mat.diffuseTexture = c_procTxr


        	c_mesh_mat.diffuseColor = new Color3(0.5, 0.7, 0.7)
        	c_mesh_mat.specularPower = 6
        	c_mesh.material = c_mesh_mat
		
        	return c_mesh; // for the purpose of using a variable to capture the output of this class
	}
}
