// create a cube mesh 
import { Scene, MeshBuilder, Vector4, Color3, Vector3, StandardMaterial, Texture, } from "@babylonjs/core";
// create the class
export class Cube01 {
	// create the method
	static CreateCube(scene: Scene): void {
		
		// base mesh: define some parameters
        	const c_cubeSize = 0.25;
        	const c_cubeHeight = 1;
        	const c_cubeGroundSnap = (c_cubeSize * 0.5) * c_cubeHeight;

		// map the uv of each faces of the box
		const c_faceUV = [];
		c_faceUV[0] = new Vector4(0.0, 0.0, 1.0, c_cubeHeight); //rear face
		c_faceUV[1] = new Vector4(0.0, 0.0, 1.0, c_cubeHeight); //front face
		c_faceUV[2] = new Vector4(0.0, 0.0, c_cubeHeight, 1.0); //right side
		c_faceUV[3] = new Vector4(0.0, 0.0, c_cubeHeight, 1.0); //left side
		c_faceUV[4] = new Vector4(0.0, 0.0, 1.0, 1.0); //top side
		c_faceUV[5] = new Vector4(0.0, 0.0, 1.0, 1.0); //bottom side

        	// cube mesh creation using the parameters
        	const c_cube = MeshBuilder.CreateBox("base", { faceUV: c_faceUV, size: c_cubeSize }, scene);
        	c_cube.scaling = new Vector3(1, c_cubeHeight, 1);
        	c_cube.position = new Vector3(0, c_cubeGroundSnap, 0);
        	//c_cube.rotation = new Vector3(0, Math.PI * 0.25, 0);// for debugging
        	console.log(c_cubeGroundSnap);

		// final touch
		c_cube.bakeCurrentTransformIntoVertices()//reset the transform

		// set material
		const c_cube_mat = new StandardMaterial("c_cube_mat", scene)
        	c_cube_mat.diffuseColor = new Color3(0.5, 0.7, 0.7)
        	c_cube_mat.specularPower = 6
        	c_cube_mat.emissiveColor = new Color3(.5, .5, .5) // for debugging the diffuse texture

		// checker board debug texture
		c_cube_mat.diffuseTexture = new Texture("https://www.babylonjs-playground.com/environment/ground.jpg");

		// assign material
        	c_cube.material = c_cube_mat
		
        	return c_cube; // for the purpose of using a variable to capture the output of this class
	}
}
