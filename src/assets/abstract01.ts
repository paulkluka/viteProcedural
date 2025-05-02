// create an abstract prop
import { Scene, MeshBuilder, Mesh, Vector3 } from "@babylonjs/core";

// create the class
export class Abstract01 {
	// create the method
	static createAbstract(scene: Scene): void {
        	// base mesh: define some parameters
        	const c_baseSize = 0.25;
        	const c_baseHeight = 0.5;
        	const c_baseGroundSnap = (c_baseSize * 0.5) * c_baseHeight;
        	// base mesh creation using the parameters
        	const box = MeshBuilder.CreateBox("base", { size: c_baseSize }, scene);
        	box.scaling = new Vector3(1, c_baseHeight, 1);
        	box.position = new Vector3(0, c_baseGroundSnap, 0);
        	console.log(c_baseGroundSnap);

        	// extruded shape
        	//Shape profile in XY plane with offset - it won't work with other planes
        	const offset = new Vector3(0, 0, 0);
        	//const offset = new Vector3(-0.5, 0, -0.5);
		const pfw = 2;//profile width
		const pfh = 1;//profile depth
        	const c_shape = [
        	    new Vector3(0, 0, 0).add(offset),
        	    new Vector3(pfw, 0, 0).add(offset),
        	    new Vector3(pfw, pfh, 0).add(offset),
        	    new Vector3(0, pfh, 0).add(offset),
        	];
        	// path  1. all numbers are positive integers 2. seems to only work on the XZ plane
        	const c_path = [
        	    new Vector3(3, 0, 0),
        	    new Vector3(4, 0, 2),
        	    new Vector3(5, 0, 4),
        	    new Vector3(4, 0, 8),
        	    new Vector3(2, 0, 9),
        	    new Vector3(0, 0, 4),
        	    new Vector3(1, 0, 0),
  		];

		const myScale = function(i, distance) {
			var scale = 1;
			return scale;
		};
	    
		const myRotation = function(i, distance) {
			return 0;	
		};
  		const c_extruded = MeshBuilder.ExtrudeShapeCustom("extruded", {shape: c_shape, path: c_path, scaleFunction: myScale, rotationFunction: myRotation, closePath: true, closeShape: true});
//		const c_extruded = MeshBuilder.ExtrudeShape("extruded", {shape: c_shape, path: c_path, closeShape: true, cap: Mesh.CAP_ALL, sideOrientation: Mesh.DOUBLESIDE}, scene);

		const c_xtsize = c_baseSize * 0.1;
		c_extruded.rotation.x = -Math.PI/2;//rotate 90 degree upright on x
		c_extruded.scaling = new Vector3(c_xtsize, c_xtsize, c_xtsize);
		c_extruded.position = new Vector3(-0.07, 0.2, 0);
		
        	//return box; // for the purpose of using a variable to capture the output of this class
		return c_extruded;
	}
}
