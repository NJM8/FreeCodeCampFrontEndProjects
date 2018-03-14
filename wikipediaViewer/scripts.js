document.addEventListener('DOMContentLoaded', function(){
  const search = document.querySelector('#getQuery');
  const tabLinksContainer = document.querySelector('#tabLinks');
  const tabLink = document.querySelectorAll('.tabLink');
  const tabContent = document.querySelectorAll('.tabContent');
  const iframes = document.querySelectorAll('iframe');

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
        //   tabLinksContainer.appendChild(newTab);

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
    if (currentTabId === thisTabId) {
      return;
    }
    const thisTabContent = document.querySelector(`#tabContent${thisTabId}`);
    
    currentTab.classList.remove('center');

    if (thisTabId > currentTabId) {
      currentTab.classList.add('slide-left');
      thisTabContent.classList.remove('slide-right');
      tabContent.forEach((tab, index) => {
        if ((index + 1) > currentTabId && (index + 1) < thisTabId){
          tab.classList.add('slide-left');
          tab.classList.remove('slide-right');
        }
      })
    } else {
      currentTab.classList.add('slide-right');
      thisTabContent.classList.remove('slide-left');
      tabContent.forEach((tab, index) => {
        if ((index + 1) < currentTabId && (index + 1) > thisTabId){
          tab.classList.add('slide-right');
          tab.classList.remove('slide-left');
        }
      })
    }
    thisTabContent.classList.add('center');
  }

  function showTab(event){
    tabLink.forEach(tab => tab.classList.remove('selected'));
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

  function setTabContentHeight(){
    const tabLinksBottom = tabLinksContainer.getBoundingClientRect().bottom;
    const windowHeight = document.body.clientHeight;
    iframes.forEach(iframe => {
      iframe.setAttribute('height', windowHeight - tabLinksBottom);
    });
  }

  search.addEventListener('click', getInput);
  search.addEventListener('keyup', function(event){
    if (event.keyCode === 13) {
      getInput();
    }
  }); 

  tabLink.forEach(tab => tab.addEventListener('mouseenter', showHover));
  tabLink.forEach(tab => tab.addEventListener('mouseout', removeHover));

  tabLink.forEach(tab => tab.addEventListener('click', function(event){
    showPage(event);
    showTab(event);
  }));

  window.addEventListener('resize', setTabContentHeight);

  setTabContentHeight()

});
