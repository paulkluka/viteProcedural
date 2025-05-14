* **vite / typscript / babylonjs project setup info:**
    * the goal of this project setup is allow for procedural modeling using babylonjs scripts
    * project setup method is based on:
        * https://doc.babylonjs.com/guidedLearning/usingVite#maintenance-and-updates
            * this guide is for detail explanation of why using vite for setup and building the project
            * but the actual project setup follows the guide below: 
                * https://youtu.be/e6EkrLr8g_o?si=BAnYzl8-x41NhIZN&t=169:
                * this video does a better job of not duplicating the node_module folder where the vite and bjs engine code is stored

* **installation:**
    * prerequisite:
        * install node.js to have npm if you don't have it already
        * install git as well
    * choose a local work path example: /d/work/Projects/ (windows-> d:\work\Projects\)
        * open a bash terminal to that path, or use any other git clone method of your choice
        * git clone https://github.com/LLVir/ll-vite-bjs-test.git
        * install vite project files in the repo: 
            * npm create vite@latest
                * for the project name, choose the git repo name that we just cloned: ll-vite-bjs-test
                * choose the project types:
                    * vanilla
                    * typescript
        * install vite build tools:
            * cd into the repo: example-> cd /d/work/Projects/ll-vite-bjs-test
            * npm install
                * will add a node_modules folder and put the build tools there
        * install babylonjs inside the repo path: example-> /d/work/Projects/ll-vite-bjs-test
            * npm i -D @babylonjs/core
            * npm i -D @babylonjs/inspector (other babylonjs modules)
                * this will add the packages into the node_modules folder
                * for other bjs modules check out this url for the names: https://doc.babylonjs.com/setup/frameworkPackages/npmSupport
    * to run the web server: 
        * type the this command at the base folder of the project -> npm run dev
        * press h for help
        * press o to launch a browser to preview the project
            * this will run the index.html file, located in the base folder of the project, in your browser

* **project structure:** 
    * this repo is in early development and the files listed below will be subjected to improvements and changes over time
    * as mentioned, the project setup is geared towards procedural modeling using babylonjs framework
    * the project code listed below is structured to provide an environment to preview the results the procedural modeling code
        * it offers a way to write the modeling code in their own modularized fashion (separate files) that can be combined or ported to other projects
        * separate from the engine initiation and other auxiliary code that helps you visualize your creation, but has nothing to do with the creation itself
    * index.html
        * this is the file the browser loads when you do a npm run dev to start a local server
        * this file will load the preview-model.ts starter script
            * you may change the code here to start your own script
    * src/preview-model.ts
        * similar to the stuff you would write in the bjs playground
        * but for our purpose, this script serve to preview our procedural modeling scripts
        * this file starts the babylonjs engine and setup up the camera and lights
        * it contains code to show the inspector
        * adds some helper objects to visualize the scene (grid, axis, wireframe display)
        * here you can call in your own modularized procedural modeling scripts
    * src/environments/*.ts
        * this is a place for scripts that imports an environment glb file as a reference for your procedural modeling creation 
        * gallery_small.ts provides an environment that is ported from FrameVR for scale reference
        * feel free to put your own procedural environment scripts here
    * src/assets/*.ts
        * this is a place for your procedural modeling scripts
        * cube01.ts - this simple script calls the bjs MeshBuilder class to make a unit cube, but later position it on the ground with the pivot set to the bottom face of the cube
            * you can change the l_cubeSize variable to resize the cube upon creation
        * fa-idle.ts - if you need a Frame avatar for scale reference, you can call this script inside the preview-model.ts
        * abstract01.ts - this is a script that creates an abstract prop
            * you can follow the code here to create your own procedural modeling script that can be referenced into other scripts


* **development workflow:**
    * the vite project setup is good for offline babylonjs development
        * you can use your favorite IDE/text editor (cursor, windsurf, vscode, vim, etc) to edit your code
        * you can ask the ai inside your code editor of choice to analyze your code base and produce code snippets for you
    * vite allows your code to be automatically run in the browser by the vite dev server - closest equivalent is like coding in a bjs playground, but locally
        * code something
        * save the file
        * see the update in the browser
        * rinse and repeat
    * team collaboration using git
        * use git to push and share your code on the github repo with the rest of the team
        * similar to working with the frame code
        * can modularize useful code snippets into classes and reference them in other files
            * bjs playground is more of a single self-contained file - not very good for write once and reuse the code somewhere else
        * use git branch early in the process to work independently and avoid conflicts
            * git clone the project to your local computer
            * create a git branch with your name and the date of the branch creation, and push the branch to the remote github repo like so:
                * git checkout -b larry-20250508
                * git push origin larry-20250508
            * the remote repo now has your branch and is tracked to the local branch that is under your name
            * try to add and modify your own files rather than modifying existing files that you got from the main branch
                * this would allow changes in the main branch to have an easier time to merge into your own branch if you want to get updates from it
            * do all your coding/testing/git-push/pull inside your branch, which would be independent from other collaborators
        * should you ever want to review and incorporate other people's contributions:
            * you can git pull, git checkout their branch, copy their code snippets
            * switch back to your branch and paste the code into your work for testing
            * commit your new work back into your branch and push
        * for features that are deemed beneficial to the whole team and are worthy of pushing to the main branch:
            * like a procedural asset that everyone uses as reference or a utility/function that everyone needed to use
            * make sure you have committed and pushed your work into your branch first then go through the steps below:
            * step1:
                * switch to main:
                    * command: git checkout main 
                * get the latest updates from the remote main branch:
                    * command: git pull origin main
            * step2:
                * create a new PR branch off main:
                    * use a PR- prefix follow by your name and date and description
                        * example: git checkout -b PR-larry-20250513-feature-update
            * step3:
                * copy only specific files from your own branch to this new PR branch:
                    * example: git checkout larry-20250508 -- path/to/file.ts
            * step4:
                * git add the new files 
                * commit and push upstream to the remote repo
            * step5:
                * go to https://github.com/LLVir/bjs-vite-procedural-environment
                * find your PR branch near the top of the page
                * do a compare & pull request
                * ensure your PR is set to merge into main
                * set the reviewer
                * write a description
                * create pull request
                * notify the reviewer for review


