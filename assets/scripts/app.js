class Tooltip {}

class Projectitem {
    constructor(id) {
        this.id = id;
        this.connectMoreInfoButton();
        this.connectSwithchButton();
        // console.log(id)
    }
   
    connectMoreInfoButton(){

    }

    connectSwithchButton() {
        const projectItemElement = document.getElementById(this.id);
        const switchBtn = projectItemElement.querySelector('button:last-of-type');
        // console.log(switchBtn);
        switchBtn.addEventListener('click', this.addto.bind(this))
    }

    addto() {
        App.addProductToCart(this.id)//calls static addProductToCart() in App where addProduct() is called & receives prod instances 
    }

}



class ProjectList {
    projects = []
   
    constructor(type) {
        const prjItems = document.querySelectorAll(`#${type}-projects li`);
        for (const prjItem of prjItems) {
            this.projects.push(new Projectitem(prjItem.id))   
        }
        // console.log(this.projects)
    }



    addProject() {

    }

    switchProject(projectId) {
        const projectIndex = this.projects.findIndex(p => p.id === projectId)
        const here = this.projects.splice(projectIndex, 1);
        // this.projects = this.projects.filter(p = p.id !== projectId);
        console.log(here)
        return projectIndex
    }
}

class App {
    static meth;
 
    static init() {
        const activeProjectList = new ProjectList('active');
        this.meth = activeProjectList
        console.log(activeProjectList)

        const finishedProjectList = new ProjectList('finished');
        // this.meth = finishedProjectList
        console.log(finishedProjectList)
    }

    static addProductToCart(eyed) { //static method receives product from call of event listener in ProducItem addToCart()
        // console.log(eyed)
        this.meth.switchProject(eyed)//calls addProduct method from this.cart and passes product to addProduct method in ShoppingCart
       
    }


}

App.init();