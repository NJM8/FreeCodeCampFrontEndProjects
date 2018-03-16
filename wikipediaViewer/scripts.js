document.addEventListener('DOMContentLoaded', function(){
  const search = document.querySelector('#getQuery');
  const randomSearch = document.querySelector('#getRandomQuery');
  const messageContainer = document.querySelector('#messageContainer');
  const message = document.querySelector('#message');
  const tabsContainer = document.querySelector('#tabs');
  const tabLinksContainer = document.querySelector('#tabLinks');
  const tabContentsContainer = document.querySelector('#tabContents');
  let tabLink;
  let tabContent;
  let iframes;
  let iframeSources = [];

  function showiframes(){
    setTimeout(() => {
      iframes.forEach(iframe => iframe.style.opacity = 1);
      removeMessage();
    }, 3000);
  }

  function setiframeSrc(){
    iframes.forEach((iframe, index) => {
      iframe.setAttribute('src', `${iframeSources[index]}`);
    });
  }

  function displayMessage(string){
    removeMessage();
    setTimeout(() => {
      message.textContent = string;
      messageContainer.style.opacity = 1;
    }, 400);
    
  }
  
  function removeMessage(){
    messageContainer.style.opacity = 0;
  }

  function createNewTabLink(name, index){
    let newTab = document.createElement('div');
    newTab.classList.add('tabLink');
    if (index === 0) {
      newTab.classList.add('selected');
    }
    newTab.id = `${index}`;
    newTab.textContent = name;
    tabLinksContainer.appendChild(newTab);
  }

  function createNewTabContent(name, description, url, index){
    let newTabContent = document.createElement('div');
    newTabContent.classList.add('tabContent');
    (index === 0) ? newTabContent.classList.add('center'): newTabContent.classList.add('slide-right');
    newTabContent.id = `tabContent${index}`;

    let newDescriptionContainer = document.createElement('div');
    newDescriptionContainer.classList.add('tabDescriptionContainer');
    
    let newDescription = document.createElement('p');
    newDescription.classList.add('tabDescription');
    newDescription.textContent = description || 'No description available';

    newDescriptionContainer.appendChild(newDescription);
    
    let newiframe = document.createElement('iframe');
    iframeSources.push(url);

    let newVisitPage = document.createElement('a');
    newVisitPage.classList.add('visitPage');
    newVisitPage.setAttribute('target', '_blank');
    newVisitPage.setAttribute('rel', 'noopener');
    newVisitPage.setAttribute('href', `${url}`);
    newVisitPage.textContent = 'Visit this page on Wikipedia';

    newTabContent.appendChild(newDescriptionContainer);
    newTabContent.appendChild(newiframe);
    newTabContent.appendChild(newVisitPage);

    tabContentsContainer.appendChild(newTabContent);
  }

  function showResults(){
    displayMessage('Loading pages from wikipedia');
    setTimeout(() => {
      tabsContainer.style.opacity = 1;
    }, 600);
    setTimeout(() => {
      setiframeSrc();
    }, 1000);
  }

  function getRandomQuery(){
    removeResults();
    displayMessage('Let\'s see what we can find.');
    
    const request = new Request('https://api.wordnik.com/v4/words.json/randomWords?limit=1&api_key=087c20e93577cfed4f10000525a09c1bceb25388be80f712d');

    fetch(request).then(function(response){
        return response.json().then(function(data){
          setTimeout(() => {
            getQuery(data[0].word);
          }, 1000);
        })
      }).catch(error => {
        displayMessage('Sorry there was an error or no results from your query, try searching again!');
        console.log(error);
      })
  }

  function getQuery(query) {
    const request = new Request(`https://en.wikipedia.org/w/api.php?action=opensearch&search=${query}&limit=8&origin=*`);
    fetch(request).then(function(response){
      return response.json().then(function(data){
        if (data[1].length === 0) {
          throw Error('No search results');
        }
        for (let i = 0; i < 8; i++) {
          if (data[1][i].length === 0) {
            return;
          }
          createNewTabLink(data[1][i], i);
          createNewTabContent(data[1][i], data[2][i], data[3][i], i);
        }
      })
      .then(() => {
        tabLink = document.querySelectorAll('.tabLink');
        tabContent = document.querySelectorAll('.tabContent');
        iframes = document.querySelectorAll('iframe');
        iframes[0].onload = showiframes();
        setTabContentHeight();
        tabLink.forEach(tab => tab.addEventListener('mouseenter', showHover));
        tabLink.forEach(tab => tab.addEventListener('mouseout', removeHover));

        tabLink.forEach(tab => tab.addEventListener('click', function(event){
          showPage(event);
          showTab(event);
        }));
        window.addEventListener('resize', setTabContentHeight);
        showResults();
      })
    }).catch(error => {
      displayMessage('Sorry there was an error or no results from your query, try searching again!');
      console.log(error);
    })
  }

  function removeResults(){
    if (tabLink && tabContent) {
      iframeSources = [];
      tabsContainer.style.opacity = 0;
      setTimeout(() => {
        while (tabLinksContainer.firstChild) {
          tabLinksContainer.removeChild(tabLinksContainer.firstChild);
        }
        while (tabContentsContainer.firstChild) {
          tabContentsContainer.removeChild(tabContentsContainer.firstChild);
        }
      }, 1000)
    }
  }

  function getInput(event){
    event.preventDefault();
    displayMessage('Let\'s see what we can find.');
    removeResults();
    let query = document.querySelector('#query');
    let value = query.value;
    setTimeout(() => {
      getQuery(value);
    }, 1000);
    query.value = '';
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
        if (index > currentTabId && index < thisTabId){
          tab.classList.add('slide-left');
          tab.classList.remove('slide-right');
        }
      })
    } else {
      currentTab.classList.add('slide-right');
      thisTabContent.classList.remove('slide-left');
      tabContent.forEach((tab, index) => {
        if (index < currentTabId && index > thisTabId){
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
    const descriptions = document.querySelectorAll('.tabDescriptionContainer');
    tabContentsContainer.setAttribute('height', windowHeight - tabLinksBottom);
    iframes.forEach((iframe, index) => {
      const descriptionHeight = descriptions[index].getBoundingClientRect().bottom;
      iframe.setAttribute('height', windowHeight - descriptionHeight);
    });
  }

  search.addEventListener('click', getInput);
  search.addEventListener('keyup', function(event){
    if (event.keyCode === 13) {
      getInput();
    }
  }); 

  randomSearch.addEventListener('click', getRandomQuery);
});
