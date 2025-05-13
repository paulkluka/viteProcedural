// import the fa-proportion-idle.glb
import { SceneLoader } from '@babylonjs/core/Loading/sceneLoader';
import '@babylonjs/loaders/glTF';
import { Scene, StandardMaterial, Material, Color3, Vector3, AbstractMesh } from "@babylonjs/core";

// create the class
export class Fa_Idle {
	// create the method
	static FrameAvatarIdle(scene: Scene): Promise<AbstractMesh> {
		return new Promise((resolve) => {
			SceneLoader.ImportMesh("", "./", "fa-proportion-idle.glb", scene, function(newMeshes){
				let rootMesh = newMeshes[0];
				rootMesh.name += "frameAvatarIdle"; //rename the root to be unique from other imported assets
				
				let l_scaling = 0.95;
				rootMesh.scaling = new Vector3(l_scaling, l_scaling, l_scaling);
				
				console.log(rootMesh.name);
				resolve(rootMesh);
			});
		});
	}
}
