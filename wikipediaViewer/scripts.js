document.addEventListener('DOMContentLoaded', function(){
  const search = document.querySelector('#getQuery');
  const tabContainer = document.querySelector('#tabLinks');
  const tabLinks = document.querySelectorAll('.tabLink');
  const tabContents = document.querySelectorAll('.tabContent');

  function getQuery(query) {
    const request = new Request(`https://en.wikipedia.org/w/api.php?action=opensearch&search=${query}&limit=10&origin=*`);
    fetch(request).then(function(response){
      return response.json().then(function(data){
				// data.forEach((page, index) => {
        //   let newTab = document.createElement('li');
        //   newTab.classList.add('tabLink');
        //   if (index === 0) {
        //     newtab.classList.add('selected');
        //   }
        //   newTab.id = `${index}`;
        //   newTab.textContent = page[index];
        //   tabContainer.appendChild(newTab);

        //   let newTabContent = document.createElement('div');

        // })
      })
    }).catch(error => {
      console.log(error);
    })
  }

  function getInput(event){
    event.preventDefault();
    let query = document.querySelector('#query').value;
    getQuery(query);
  }

  function showPage(event){
    const currentTab = document.querySelector('.center');
    const currentTabId = currentTab.id.substr(currentTab.id.length - 1);
    const thisTabId = event.target.id;
    console.log(thisTabId);
    if (currentTabId === thisTabId) {
      return;
    }
    const thisTabContent = document.querySelector(`#tabContent${thisTabId}`);
    
    currentTab.classList.remove('center');

    if (thisTabId > currentTabId) {
      currentTab.classList.add('slide-left');
      thisTabContent.classList.remove('slide-right');
      tabContents.forEach((tab, index) => {
        if ((index + 1) > currentTabId && (index + 1) < thisTabId){
          console.log(tab);
          tab.classList.add('slide-left');
          tab.classList.remove('slide-right');
        }
      })
    } else {
      currentTab.classList.add('slide-right');
      thisTabContent.classList.remove('slide-left');
      tabContents.forEach((tab, index) => {
        if ((index + 1) < currentTabId && (index + 1) > thisTabId){
          console.log(tab);
          tab.classList.add('slide-right');
          tab.classList.remove('slide-left');
        }
      })
    }
    thisTabContent.classList.add('center');
  }

  function showTab(event){
    tabLinks.forEach(tab => tab.classList.remove('selected'));
    event.target.classList.remove('hover');
    event.target.classList.add('selected');
  }

  function showHover(event){
    if (this.classList.contains('selected')) {
      return;
    } else {
      this.classList.add('hover');
    }
  }

  function removeHover(event){
    if (this.classList.contains('hover')) {
      this.classList.remove('hover');
    }
  }

  search.addEventListener('click', getInput);
  search.addEventListener('keyup', function(event){
    if (event.keyCode === 13) {
      getInput();
    }
  }); 

  tabLinks.forEach(tab => tab.addEventListener('mouseenter', showHover));
  tabLinks.forEach(tab => tab.addEventListener('mouseout', removeHover));

  tabLinks.forEach(tab => tab.addEventListener('click', function(event){
    showPage(event);
    showTab(event);
  }));

  const tabLinksBottom = tabContainer.getBoundingClientRect().bottom;
  tabContents.forEach(tabContent => tabContent.style.top = tabLinksBottom);

})