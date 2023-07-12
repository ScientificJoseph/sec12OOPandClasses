class Tooltip {}

class Projectitem {
    constructor(id, updateProjectListFunction) { //receivved from ProjectList constructor
        this.id = id;
        this.updateProjectListHandler = updateProjectListFunction
        this.connectMoreInfoButton();
        this.connectSwithchButton();
    }
   
    connectMoreInfoButton(){

    }

    connectSwithchButton() {
        const projectItemElement = document.getElementById(this.id);
        const switchBtn = projectItemElement.querySelector('button:last-of-type');
        switchBtn.addEventListener('click', this.updateProjectListHandler)
        console.log(this.updateProjectListHandler)
    }

}

class ProjectList {
    projects = []
   
    constructor(type) {
        this.type = type;
        const prjItems = document.querySelectorAll(`#${type}-projects li`);
        for (const prjItem of prjItems) {
            this.projects.push(new Projectitem(prjItem.id, this.switchProject.bind(this)))    // calls switchProject - passed to eventlistener - project we want to switch passed to ProjectItem Constructor for eventlistener
        }
        // console.log(this.projects)
    }

    setSwitchHandlerFunction(switchHandlerFunction){ //gets called on instatiation and gets passed pointer to object functiion calling addProject
        this.switchHandler = switchHandlerFunction // pointer at the function calling add project - used by switchProject  
    }

    addProject() { // need to call in another instance - called from switchProject
        console.log(this)
    }

    switchProject(projectId) {
        // const projectIndex = this.projects.findIndex(p => p.id === projectId)
        // const here = this.projects.splice(projectIndex, 1);
        this.switchHandler(this.projects.find(p => p.id === projectId)) // pass the project we want to switch - passes the switch handler to be switched = calls addProject
        this.projects = this.projects.filter(p => p.id !== projectId);
        
    }
}

class App {
 
    static init() {
        const activeProjectList = new ProjectList('active');
        const finishedProjectList = new ProjectList('finished');
        activeProjectList.setSwitchHandlerFunction(finishedProjectList.addProject.bind(finishedProjectList)); // calls shf and defines which function should be called when we call switchHadler
        finishedProjectList.setSwitchHandlerFunction(activeProjectList.addProject.bind(activeProjectList));
    }
}

App.init();