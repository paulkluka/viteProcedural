# ll-vite-bjs-test
test vite + babylonjs project




* vite / typscript / babylonjs project setup:
    *** project setup method based on https://youtu.be/e6EkrLr8g_o?si=BAnYzl8-x41NhIZN&t=169:
        * install node.js
        * choose a local path example: /d/work/Projects/
            * open a bash terminal to that path
            * git clone https://github.com/LLVir/ll-vite-bjs-test.git
            * install vite project files in the repo: 
                * npm create vite@latest
                    * for the project name, choose the git repo: ll-vite-bjs-test
                    * choose the project types:
                        * vanilla
                        * typescript
            * install vite build tools:
                * cd into the repo example: /d/work/Projects/ll-vite-bjs-test
                * npm install
                    * will add a node_modules folder and put the build tools there
            * install babylonjs inside the repo path - example: /d/work/Projects/ll-vite-bjs-test
                * npm i -D @babylonjs/core
                * npm i -D @babylonjs/inspector (other babylonjs modules)
                    * will add the packages into the node_modules folder
                    * for other bjs modules: https://doc.babylonjs.com/setup/frameworkPackages/npmSupport
        * to run the web server: 
            * npm run dev
            * press h for help
            * press o to launch a browser to preview the project
