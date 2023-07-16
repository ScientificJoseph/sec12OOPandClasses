class DOMHelper { // called from connectSwithchButton() in ProjectItem
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

class Component { // base class for attach and detach
    constructor(hostElementId, insertBefore = false) { //parameters received from Tooltip super constructor if any where false can be overwritten
        if(hostElementId) { // check to see if it is set
            this.hostElement = document.getElementById(hostElementId); // if id is passed host elemnet id is used by attach method to determine where tooltip dialog will appear
        } else {
            this.hostElement = document.body; // used if null is received from super constuctor call when ToolTip is extended. attach method terinary operator will be false and this.element will appear before the end of the body of the document  
        }
        this.insertBefore = insertBefore //default is false. true if true is passed to constructor
    }
    detach(){ 
        if (this.element) {
            this.element.remove() // refers to the element stored in attach method
            // this.element.parentElement.removeChild(this.element) //older browser support
        } 
    }

    attach() { // called from showMoreInfoHandler method in ProjectItem .determines where toolTip dialog will appear based on parameter status.
        // document.body.append(this.element)
        this.hostElement.insertAdjacentElement(this.insertBefore ? 'afterbegin' : 'beforeend', this.element) //if arguments recieved to constructor call when toolTip extends component this wdill detemin where tooltip dialog will appear. if none are received the toolTip dialog will appear before the end of the document body
        console.log(this.insertBefore)
    }

}

class Tooltip extends Component{
    constructor(closeNotifierFunction) { //function parameter received on instatiation in ProjectItem showMoreInfoHandler(). Ensures that a toolTtip dialog box status is not active.
        super(); // can be used to pass parameters to Component constructor that will determin where toolTip dialog will appear
        // super('active-projects', true); 
        this.closeNotifier = closeNotifierFunction;
        this.create(); // calls create method on instantiation to create toolTip dialog element
    }

    closeTooltip = () => {// when using arrow functions this refers to the class automatically on function being called. no need to bind call to this
        this.detach(); // removes toolTip
        this.closeNotifier() //calls method passed to constructor on instatiation that sets hasActiveToolTip value to false when tooltip is closed allowing another toolTip dialog to be displayed if neccessary
    }

    create() {
        const tooltipElement = document.createElement('div') // div for tooltip element
        tooltipElement.className = 'card';
        tooltipElement.textContent = 'Beyond fun, this project is pure Bliss!' 
        tooltipElement.addEventListener('click', this.closeTooltip) // adds eventListener to div and calls closeToolTip on click to remove the toolTip and set hascActive to false. binding is not needed to to close tool tip being an arrow function 
        this.element = tooltipElement // The methods detach and attach extended from Component use this to remove or determine where the tooltip dialog will apear
    }

}

class Projectitem {
    hasActiveToolTip = false; // set up to see if item already has an active toolTip

    constructor(id, updateProjectListFunction, type) { // parameters receivved from ProjectList constructor on ProjectItem instatiation
        this.id = id;
        this.updateProjectListHandler = updateProjectListFunction;
        this.connectMoreInfoButton();
        this.connectSwithchButton(type);
    }

    showMoreInfoHandler() { // called whem nore info Btn is clicked
        if (this.hasActiveToolTip) { //stops addition toolTip project information dialog from being added if it is already present
            return;
        }
        const tooltip = new Tooltip(() => { //creates toolTip object. On instantiation passes anonomous function to the constructor that when called sets the value of hasActiveTooltip to false when toolTip is closed
            this.hasActiveToolTip = false;
        })
        tooltip.attach();  //calls attatch method in Tooltip extended Class Component object that determsines where tooltip dialog will appear 
        this.hasActiveToolTip = true; // sets tooltip element status to active to ensure that that clicking More Info Btn won't add another toolTip.
    }
   
    connectMoreInfoButton(){ //connects to more info Button
        const projectItemElement = document.getElementById(this.id);
        const moreInfoBtn = projectItemElement.querySelector('button:first-of-type')
        moreInfoBtn.addEventListener('click', this.showMoreInfoHandler); //adds eventListtener to More Info Btn. calls method whe clicked
    }

    connectSwithchButton(type) { //type received from call to functiom
        const projectItemElement = document.getElementById(this.id);
        let switchBtn = projectItemElement.querySelector('button:last-of-type');
        switchBtn = DOMHelper.clearEventListeners(switchBtn) // passes button to DOMHelper static method to clear any pre-existing eventListeners
        switchBtn.textContent = type ==='active' ? 'Finish' : 'Activate'; //changes the tect when active/finished status changes
        switchBtn.addEventListener('click', this.updateProjectListHandler.bind(null, this.id))//received from update. calls switchProject on click then switchHandler/addProject is invoked.
    }

    update(updateProjectListFn, type) { //received on call from addProject in ProjectList
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
        project.update(this.switchProject.bind(this), this.type)//calls update method in ProjectItem and passes swithcProject method. reaches out to project we get as argument. used as defined in class App for newInstance. type lets it know which list its in(important for updateing buttom txt)
    }

    switchProject(projectId) { //passed to ProjectItem constructor then to eventListener / getrs projectTd from eventListener passes to addProject
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
