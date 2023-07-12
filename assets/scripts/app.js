class Tooltip {}

class Projectitem {
    constructor(id, updateProjectListFunction) { // swithcProject function receivved from ProjectList constructor on instatiation
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
        switchBtn.addEventListener('click', this.updateProjectListHandler)//calls switchProject on click that calls switch handler that calls addProject
        // console.log(this.updateProjectListHandler)
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

    setSwitchHandlerFunction(switchHandlerFunction){ //gets called on instatiation and passed pointer to object functiion addProject
        // console.log(switchHandlerFunction)
        this.switchHandler = switchHandlerFunction // switchHandler gets assigned pointer to the function addProject on instantiation - used by switchProject  
        // console.log('called',this.switchHandler)
    }

    addProject() { // need to call in another instance - called in switchProject from switchHandler
        // console.log(this)
    }

    switchProject(projectId) { //passed to eventListener
        // console.log('received', this.switchHandler)
        // const projectIndex = this.projects.findIndex(p => p.id === projectId)
        // const here = this.projects.splice(projectIndex, 1);
        this.switchHandler(this.projects.find(p => p.id === projectId)) // = addProject
         console.log('received', this.switchHandler)
        // pass the project we want to switch - passes the switch handler to be switched to addProject calls addProject from evenListner fireing switchProject
        // console.log('received', this.switchHandler)
        this.projects = this.projects.filter(p => p.id !== projectId);
        
    }
}

class App {
 
    static init() {
        const activeProjectList = new ProjectList('active');
        // console.log(activeProjectList)
        const finishedProjectList = new ProjectList('finished');
        activeProjectList.setSwitchHandlerFunction(finishedProjectList.addProject.bind(finishedProjectList)); // on instatiation, binds addProject from finishedProjects. calls shf during instatiation and defines which objects addProduct method should be called when switchProject is invoked on click which calls switchHandler that calls addProject
        //  console.log(activeProjectList)
        finishedProjectList.setSwitchHandlerFunction(activeProjectList.addProject.bind(activeProjectList));
       
    }
}

App.init();
