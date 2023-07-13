class DOMHelper {
    static clearEventListeners(element) { //gets rid of old ebentListener for an element. called from connectSwithchButton
        const clonedElement = element.cloneNode(true) // makes deep clone of button
        element.replaceWith(clonedElement) // creates new button with a cleared clone of old one clearing event listeners
        return clonedElement; // returns the new button
    }

    static moveElement(elementId, newDestinationSelector) { // parameters received from addProduct 
        const element = document.getElementById(elementId);
        const destinationElement = document.querySelector(newDestinationSelector);
        destinationElement.append(element)
    }
}

class Tooltip {}

class Projectitem {
    constructor(id, updateProjectListFunction, type) { // swithcProject function receivved from ProjectList constructor on instatiation
        this.id = id;
        this.updateProjectListHandler = updateProjectListFunction;
        this.connectMoreInfoButton();
        this.connectSwithchButton(type);
    }
   
    connectMoreInfoButton(){

    }

    connectSwithchButton(type) { //type received from call to functiom
        const projectItemElement = document.getElementById(this.id);
        let switchBtn = projectItemElement.querySelector('button:last-of-type');
        switchBtn = DOMHelper.clearEventListeners(switchBtn) // passes button to function to clear any pre existing eventListener
        switchBtn.textContent = type ==='active' ? 'Finish' : 'Activate';
        switchBtn.addEventListener('click', this.updateProjectListHandler.bind(null, this.id))//calls switchProject on click then switchHandler/addProject is invoked
    }

    update(updateProjectListFn, type) { //received on call from addProject
        this.updateProjectListHandler = updateProjectListFn
        this.connectSwithchButton(type); ///passes type to  connectSwithchButton
    }
}

class ProjectList {
    projects = []
   
    constructor(type) {
        this.type = type;
        const prjItems = document.querySelectorAll(`#${type}-projects li`);
        for (const prjItem of prjItems) {
            this.projects.push(new Projectitem(prjItem.id, this.switchProject.bind(this),this.type)) //project we want to switch passed to ProjectItem Constructor then passed to eventlistener to call switchProject
        }
    }

    setSwitchHandlerFunction(switchHandlerFunction){ //gets called on instatiation and passed pointer to object functiion addProject
        this.switchHandler = switchHandlerFunction // switchHandler gets assigned pointer to the function addProject on instantiation - used by switchProject  
    
    }

    addProject(project) { // called in switchProject from switchHandler in the instance that will add project - gets passed projectId from swithcProject
        this.projects.push(project) //gets project from array
        DOMHelper.moveElement(project.id, `#${this.type}-projects ul`) //calls DOMHelper static method moveElemt and passes elementId and ul Id type of list item to be moved
        project.update(this.switchProject.bind(this), this.type)//reaches out to project we get as argument calls update method. used as defined for new instance. type lets it know which list its in(important for updateing buttom txt)
    }

    switchProject(projectId) { //passed to ProjectItem constructor then to eventListener / geyrs projectTd from eventListener passes to addProject
        // const projectIndex = this.projects.findIndex(p => p.id === projectId)
        // this.projects.splice(projectIndex, 1);
        this.switchHandler(this.projects.find(p => p.id === projectId)) // gets the project that we want to switch for addProject method to carry out. calls addProject from evenListner fireing switchProject
        this.projects = this.projects.filter(p => p.id !== projectId);
        
    }
}

class App {
 
    static init() {
        const activeProjectList = new ProjectList('active');
        const finishedProjectList = new ProjectList('finished');
        activeProjectList.setSwitchHandlerFunction(finishedProjectList.addProject.bind(finishedProjectList)); // calls SwitchHandlerFunction on instatiation, defines which objects addProduct method should be called by connecting/binding addProject from finishedProject. When switchProject is invoked on click switchHandler gets called invoking addProject method.
        finishedProjectList.setSwitchHandlerFunction(activeProjectList.addProject.bind(activeProjectList));
    }
}

App.init();
