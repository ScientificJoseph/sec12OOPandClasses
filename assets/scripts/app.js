class DOMHelper { // called in connectSwithchButton() in ProjectItem
    static clearEventListeners(element) { //gets rid of old ebentListener for an element. called from connectSwithchButton
        const clonedElement = element.cloneNode(true) // makes deep clone of button. Default value is false.
        element.replaceWith(clonedElement) // called in connectSwithchButton. Creates new button with a clone of old one clearing eventListener.
        return clonedElement; // returns the new button
    }

    static moveElement(elementId, newDestinationSelector) { // parameters of project to add received from addProject
        const element = document.getElementById(elementId); // id of element to be moved
        const destinationElement = document.querySelector(newDestinationSelector); //place where elemt will be moved
        destinationElement.append(element) // puts moved element in its place
    }
}

class Tooltip {
    constructor(closeNotifierFunction) { //function parameter received on instatiation in ProjectItem showMoreInfoHandler(). Ensures that a toolTtip is not active.
        this.closeNotifier = closeNotifierFunction;
    }

    closeTooltip = () => {// when using arrow functions this refers to the class automatically
        this.detach(); // removes toolTip
        this.closeNotifier() //received from constructor. sets hasactiveToolTip to false
    }

    detach(){ 
        this.element.remove()
        // this.element.parentElement.removeChild(this.element)
    }

    attach() {
        const tooltipElement = document.createElement('div')
        tooltipElement.className = 'card';
        tooltipElement.textContent = 'DUMDUM DUMMY' 
        tooltipElement.addEventListener('click', this.closeTooltip) //calls closeToolTip to remove the toolTip and set hascActive to false
        this.element = tooltipElement // enables the tooltip to be removed on click br refering the element to the closeToolTip method
        document.body.append(tooltipElement)

    }
}

class Projectitem {
    hasactiveToolTip = false; // set up to see if item already has an active toolTip

    constructor(id, updateProjectListFunction, type) { // parameters receivved from ProjectList constructor on ProjectItem instatiation
        this.id = id;
        this.updateProjectListHandler = updateProjectListFunction;
        this.connectMoreInfoButton();
        this.connectSwithchButton(type);
    }

    showMoreInfoHandler() {
        if (this.hasactiveToolTip) {
            return;
        }
        const tooltip = new Tooltip(() => { // called on instantiation to ensure that a toolTip is able to be aded
            this.hasactiveToolTip = false;
        })
        tooltip.attach(); // makes sure that clicking won't add another toolTip
        this.hasactiveToolTip = true;
    }
   
    connectMoreInfoButton(){
        const projectItemElement = document.getElementById(this.id);
        const moreInfoBtn = projectItemElement.querySelector('button:first-of-type')
        moreInfoBtn.addEventListener('click', this.showMoreInfoHandler);
    }

    connectSwithchButton(type) { //type received from call to functiom
        const projectItemElement = document.getElementById(this.id);
        let switchBtn = projectItemElement.querySelector('button:last-of-type');
        switchBtn = DOMHelper.clearEventListeners(switchBtn) // passes button to function to clear any pre-existing eventListeners
        switchBtn.textContent = type ==='active' ? 'Finish' : 'Activate'; //changes the tect when active/finished status changes
        switchBtn.addEventListener('click', this.updateProjectListHandler.bind(null, this.id))//received from update. calls switchProject on click then switchHandler/addProject is invoked.
    }

    update(updateProjectListFn, type) { //received on call from addProject
        this.updateProjectListHandler = updateProjectListFn //received from constructor. tied to addProject/switchProject
        this.connectSwithchButton(type); ///passes type to connectSwithchButton
    }
}

class ProjectList {
    projects = []
   
    constructor(type) { // type received on instantiation
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
        const activeProjectList = new ProjectList('active'); // type passed to constructor
        const finishedProjectList = new ProjectList('finished');
        activeProjectList.setSwitchHandlerFunction(finishedProjectList.addProject.bind(finishedProjectList)); // calls SwitchHandlerFunction on instatiation, defines which objects addProduct method should be called by connecting/binding addProject from finishedProject. When switchProject is invoked on click switchHandler gets called invoking addProject method.
        finishedProjectList.setSwitchHandlerFunction(activeProjectList.addProject.bind(activeProjectList));
    }
}

App.init();
