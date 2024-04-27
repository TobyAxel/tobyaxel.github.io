// Main site

function changePage(id) {
    var selections = document.querySelectorAll('nav a');
    var pages = document.querySelectorAll('main .page');
    
    selections.forEach(function(selection) {
        selection.style.fontSize = "35px";
        selection.style.color = "rgb(75, 75, 75)";
    });

    pages.forEach(function(page) {
        page.style.display = "none";
    });
    
    document.getElementById(id).style.fontSize = "50px";
    document.getElementById(id).style.color = "black";
    document.getElementById(id+"_page").style.display = "flex";
}

changePage("home");