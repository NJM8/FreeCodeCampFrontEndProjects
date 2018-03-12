document.addEventListener('DOMContentLoaded', function(){
  const search = document.querySelector('#getQuery');
  const tabs = document.querySelectorAll('.tabLink');
  const tabContents = document.querySelectorAll('.tabContent');

  function getQuery(query) {
    const request = new Request(`https://en.wikipedia.org/w/api.php?action=opensearch&search=${query}&limit=10&origin=*`);
    fetch(request).then(function(response){
      return response.json().then(function(data){
				console.log(data);
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

  function showTab(event){
    const currentTab = document.querySelector('.center');
    const currentTabId = currentTab.id.substr(currentTab.id.length - 1);
    const thisTabId = this.id;
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
        if ((index + 1) < currentTabId && (index+ 1) > thisTabId){
          console.log(tab);
          tab.classList.add('slide-right');
          tab.classList.remove('slide-left');
        }
      })
    }
    thisTabContent.classList.add('center');
  }

  search.addEventListener('click', getInput);
  search.addEventListener('keyup', function(event){
    if (event.keyCode === 13) {
      getInput();
    }
  }); 

  tabs.forEach(tab => tab.addEventListener('click', showTab));

})