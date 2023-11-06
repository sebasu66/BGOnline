


let show=false;
function toggleMenu() {
    //animate the menu containner
    //from shape swauerd, big zise and transparent to a small
    //circle in the bottom right corner opacity 1
    //in 0,1s

    //get the menu container
    let menuContainer = document.getElementById("menuContainer");
    //get the menu button
    if(!show){
        menuContainer.style.transform = "scale(1)";
        menuContainer.style.opacity = "1";
        show=true;
        //morph to a circle
        menuContainer.style.borderRadius = "50%";
        menuContainer.style.width = "50px";
        menuContainer.style.height = "50px";
        menuContainer.style.margin = "0px";
        menuContainer.style.padding = "0px";
        menuContainer.style.border = "0px";
        menuContainer.style.backgroundColor = "rgba(0,0,0,0.5)";
    }else{
        menuContainer.style.transform = "scale(0.1)";
        menuContainer.style.opacity = "0.1";
        show=false;
        //morph to a circle
        menuContainer.style.borderRadius = "50%";
        menuContainer.style.width = "50px";
        menuContainer.style.height = "50px";
        menuContainer.style.margin = "0px";
        menuContainer.style.padding = "0px";
        menuContainer.style.border = "0px";
        menuContainer.style.backgroundColor = "rgba(0,0,0,0.5)";
    }

  }
  
  var items = document.querySelectorAll("#menuContainer > div");
  items.forEach(item => {
    
    item.addEventListener('click', (event) => {
      event.target.style.transform = "scale(1.2)";
      setTimeout(() => event.target.style.transform = "", 500);
    });
  });
  
