// import the gallery_small.glb
import { SceneLoader } from '@babylonjs/core/Loading/sceneLoader';
import '@babylonjs/loaders/glTF';
import { Scene, StandardMaterial, Material, Color3, Vector3, AbstractMesh } from "@babylonjs/core";

// create the class
export class Gallery_Small {
	// create the method
	static GallerySmall(scene: Scene): Promise<AbstractMesh> {
		return new Promise((resolve) => {
			SceneLoader.ImportMesh("", "./", "gallery_small.glb", scene, function(newMeshes){
				let rootMesh = newMeshes[0];
				rootMesh.name += "gallerySmall"; //rename the root to be unique from other imported assets
				
				console.log(rootMesh.name);
				resolve(rootMesh);
			});
		});
	}
}
