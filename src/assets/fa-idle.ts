// import the fa-proportion-idle.glb
import { SceneLoader } from '@babylonjs/core/Loading/sceneLoader';
import '@babylonjs/loaders/glTF';
import { Scene, StandardMaterial, Material, Color3, } from "@babylonjs/core";

// create the class
export class Fa_Idle {
	// create the method
	static FrameAvatarIdle(scene: Scene): void {
		const c_fa_idle = []
		SceneLoader.ImportMesh("", "./", "fa-proportion-idle.glb", scene, function(newMeshes){
			const c_fa_idle_root = newMeshes[0];
			c_fa_idle = newMeshes[0].getChildMeshes()[0];
			console.log(c_fa_idle.name);
		});

		// set material - not working yet - need to loop through all the childmeshes and assign the same material - probably dispose all materials from the glb file
////////	const c_fa_mat = new StandardMaterial("FrameAvatarMaterial", scene)
////////	c_fa_mat.diffuseColor = new Color3(0.5, 0.7, 0.7)
////////	c_fa_mat.specularPower = 6
////////	c_fa_mat.emissiveColor = new Color3(.5, .5, .5) // for debugging the diffuse texture

////////	//assign material
////////	c_fa_mat.material = c_fa_mat
		
        	return c_fa_idle; // for the purpose of using a variable to capture the output of this class
	}
}
