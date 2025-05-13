// create a cube mesh 
import { Scene, MeshBuilder, Vector4, Color3, Vector3, StandardMaterial, Texture, } from "@babylonjs/core";
// create the class
export class Cube01 {
	// create the method
	static CreateCube(scene: Scene): void {
		
		// define some parameters
        	let l_cubeSize = 1;
        	let l_cubeHeight = 1;
        	let l_cubeGroundSnap = (l_cubeSize * 0.5) * l_cubeHeight;

		// map the uv of each faces of the box
		let l_faceUV = [];
		l_faceUV[0] = new Vector4(0.0, 0.0, 1.0, l_cubeHeight); //rear face
		l_faceUV[1] = new Vector4(0.0, 0.0, 1.0, l_cubeHeight); //front face
		l_faceUV[2] = new Vector4(0.0, 0.0, l_cubeHeight, 1.0); //right side
		l_faceUV[3] = new Vector4(0.0, 0.0, l_cubeHeight, 1.0); //left side
		l_faceUV[4] = new Vector4(0.0, 0.0, 1.0, 1.0); //top side
		l_faceUV[5] = new Vector4(0.0, 0.0, 1.0, 1.0); //bottom side

        	// cube mesh creation using the parameters
        	let l_cube = MeshBuilder.CreateBox("cube", { faceUV: l_faceUV, size: l_cubeSize }, scene);
        	l_cube.scaling = new Vector3(1, l_cubeHeight, 1);
        	l_cube.position = new Vector3(0, l_cubeGroundSnap, 0);
        	//l_cube.rotation = new Vector3(0, Math.PI * 0.25, 0);// for debugging
        	//console.log(l_cubeGroundSnap);

		// final touch
		l_cube.bakeCurrentTransformIntoVertices()//reset the transform

		// set material
		let l_cube_mat = new StandardMaterial("l_cube_mat", scene)
        	l_cube_mat.diffuseColor = new Color3(0.5, 0.7, 0.7)
        	l_cube_mat.specularPower = 6
        	l_cube_mat.emissiveColor = new Color3(.5, .5, .5) // for debugging the diffuse texture

		// checker board debug texture
		l_cube_mat.diffuseTexture = new Texture("https://www.babylonjs-playground.com/environment/ground.jpg");

		// assign material
        	l_cube.material = l_cube_mat
		
        	return l_cube; // for the purpose of using a variable to capture the output of this class
	}
}
