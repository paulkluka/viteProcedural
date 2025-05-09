* vite / typscript / babylonjs project setup info:
    * project setup method is based on:
        * https://doc.babylonjs.com/guidedLearning/usingVite#maintenance-and-updates
            * this guide is for detail explanation of why using vite for setup and building the project
            * but the actual project setup follows the guide below: 
                * https://youtu.be/e6EkrLr8g_o?si=BAnYzl8-x41NhIZN&t=169:
                * this video does a better job of not duplicating the node_module folder where the vite and bjs engine code is stored

* installation:
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

    * wip: explain index.html and app.ts



* development workflow:
    * the vite project setup is good for offline babylonjs development
        * you can use your favorite IDE/text editor (cursor, windsurf, vscode, vim, etc) to edit your code
        * you can ask the ai inside your code editor of choice to analyze your code base and produce code snippets for you
    * vite allows your code to be automatically run in the browser by the vite dev server - closes equivalent is like coding in a bjs playground, but locally
        * code something
        * save the file
        * see the update in the browser
        * rinse and repeat
    * team collaboration: this works with the git workflow mentality
        * use git to push and share your code on a github repo with the rest of the team
        * similar to working with the frame code
        * can modularize useful codes snippets into classes and extend them into other files
            * bjs playground is more of a single self-contained file - not very good for write once and reuse the code somewhere else
        * can take advantages of git branches and PRs
        * to avoid some of git workflow pitfalls in the beginning:
            * for anyone that had cloned the project to their local computer and wants to start working
                * create a git branch with your name and the date of the branch creation and push the branch to the remote github repo:
                    * git checkout -b larry-20250508
                    * git push origin larry-20250508
            * create a folder with your name under the base folder of the project
            * do all your coding/testing/git-push/pull inside your folder and branch - which would be independent from other folk's work
        * should you ever want to review and incorporate other people's contributions:
            * you can git pull, git checkout their branch, copy their code snippets
            * switch back to your branch and paste the code into your own work for testing
            * commit your new work back into your own branch and push
            * other people can continue to update their project with git without your work conflicting with theirs
            * and will only see your work when their choose to checkout your branch
        * for features that are deemed beneficial to the whole team and is worthy to push to the main branch:
            * push your own work into your own branch first
            * duplicate only the files that are yours and that you want to incorporate as a PR to be merged into main
            * git pull - to get the latest update first and avoid merge conflicts later
            * git checkout main (to switch to the main branch)
            * move those duplicate files outside of your own named folder and put them in the right project location (example: vite-bjs-project/src/)
            * update and test your file path references to make sure the new files work with the existing project
            * create a PR branch for the changes: 
                * PR naming suggestion: add 'PR' prefix follow by your name and date and description if needed
                    * example: git checkout -b PR-larry-20250508-add-debug-feature
                    * git add <your new files>
                    * git commit
                    * git push upstream the PR branch
            * create a PR tracker on github.com with select reviewers and notify the person(s) for review
            * reviewer can approval and merge the changes into the main branch for future git pulls to the project
