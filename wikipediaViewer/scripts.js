document.addEventListener('DOMContentLoaded', function(){

  // initialize selectors for buttons and containers
  const search = document.querySelector('#getQuery');
  const randomSearch = document.querySelector('#getRandomQuery');
  const messageContainer = document.querySelector('#messageContainer');
  const message = document.querySelector('#message');
  const tabsContainer = document.querySelector('#tabs');
  const tabLinksContainer = document.querySelector('#tabLinks');
  const tabContentsContainer = document.querySelector('#tabContents');

  // initialize global variables 
  let searching = false;
  let tabLink;
  let tabContent;
  let iframes;
  let iframeSources = [];

  // funcion to animate in iframes after 3 seconds, this should be enough time for them to load. unfortunately detecting when the content has loaded to trigger the animation is difficult and unreliable. 
  function showiframes(){
    setTimeout(() => {
      iframes.forEach(iframe => iframe.style.opacity = 1);
      removeMessage();
      searching = false;
    }, 3000);
  }

  // set the src of each iframe from the iframeSources array, they will immediately start loading
  function setiframeSrc(){
    iframes.forEach((iframe, index) => {
      iframe.setAttribute('src', `${iframeSources[index]}`);
    });
  }

  // display message function to animate out the old message, set the text to the new message, and animate it in.
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

  // creates each tab link, if it is the first one adds the selected class for styling
  function createNewTabLink(name, index){
    let newTab = document.createElement('div');
    newTab.classList.add('tabLink');
    if (index === 0) {
      newTab.classList.add('selected');
    }
    // set the id to the index for linking to tab content and set the name to the page title of the wikipedia article
    newTab.id = `${index}`;
    newTab.textContent = name;
    tabLinksContainer.appendChild(newTab);
  }

  // create a new tab content panel
  function createNewTabContent(name, description, url, index){

    // first create the containing div, add tabContent class for styling
    let newTabContent = document.createElement('div');
    newTabContent.classList.add('tabContent');
    // if it is the first tab content set it to the center, otherwise slide it off to the right
    (index === 0) ? newTabContent.classList.add('center'): newTabContent.classList.add('slide-right');
    // set the id for linking to the tabLink
    newTabContent.id = `tabContent${index}`;

    // create a new div to hold the description of the tab content, this is the first paragraph of the wikipedia article
    let newDescriptionContainer = document.createElement('div');
    // add class for styling
    newDescriptionContainer.classList.add('tabDescriptionContainer');
    
    // create new description paragraph
    let newDescription = document.createElement('p');
    // add class for styling
    newDescription.classList.add('tabDescription');
    // set the description or default if there isn't one
    newDescription.textContent = description || 'No description available';

    // append the desciption to it's container
    newDescriptionContainer.appendChild(newDescription);
    
    // create new empty iframe
    let newiframe = document.createElement('iframe');
    newiframe.sandbox = '';
    // push the wikipedia url to the url array
    iframeSources.push(url);

    // create new visit page link
    let newVisitPage = document.createElement('a');
    // add class for styling
    newVisitPage.classList.add('visitPage');
    // set attributes to open in new page without tracking
    newVisitPage.setAttribute('target', '_blank');
    newVisitPage.setAttribute('rel', 'noopener');
    // set url to link to from url of wikipedia article
    newVisitPage.setAttribute('href', `${url}`);
    newVisitPage.textContent = 'Visit this page on Wikipedia';

    // append the new description, iframe, and visit page link to the tab content
    newTabContent.appendChild(newDescriptionContainer);
    newTabContent.appendChild(newiframe);
    newTabContent.appendChild(newVisitPage);

    // add the new tab content to the main content container
    tabContentsContainer.appendChild(newTabContent);
  }

  // runs after all the tabs and contents have been created, animates in the tabs with description and empty iframe, shows loading page from wikipedia message, then sets the iframe sources so they start loaded.
  function showResults(){
    displayMessage('Loading pages from wikipedia');
    setTimeout(() => {
      tabsContainer.style.opacity = 1;
    }, 600);
    setTimeout(() => {
      setiframeSrc();
    }, 1000);
  }

  // function to grab a random word for the wikipedia search
  function getRandomQuery(){
    // if already searching prevent multiple async calls
    if (searching) {
      console.log('stop');
      return;
    }
    searching = true;

    // remove current results and communicate with the user that we are searching
    removeResults();
    displayMessage('Let\'s see what we can find.');
    
    const request = new Request('https://api.wordnik.com/v4/words.json/randomWords?limit=1&api_key=087c20e93577cfed4f10000525a09c1bceb25388be80f712d');

    // fetch request from wordnik api
    fetch(request).then(function(response){
        return response.json().then(function(data){
          setTimeout(() => {
            // delay search for the random word to give old results time to animate out
            getQuery(data[0].word);
          }, 1000);
        })
      }).catch(error => {
        displayMessage('Sorry there was an error or no results from your query, try searching again!');
        removeResults();
        searching = false;        
        console.log(error);
      })
  }

  // search wikipedia for the users query
  function getQuery(query) {
    const request = new Request(`https://en.wikipedia.org/w/api.php?action=opensearch&search=${query}&limit=6&origin=*`);
    
    // fetch results, limited to 6 pages to keep it fast and simple to display
    fetch(request).then(function(response){
      return response.json().then(function(data){
        // no result found on wikipedia
        if (data[1].length === 0) {
          throw Error('No search results');
        }
        for (let i = 0; i < 6; i++) {
          // prevents empty tab contents from being created
          if (data[1][i] === undefined) {
            return;
          }
          // create a new link with the article title and index to keep link with tabContent
          createNewTabLink(data[1][i], i);
          // create a new tab content with title, description, src, and index to keep link to tabLink
          createNewTabContent(data[1][i], data[2][i], data[3][i], i);
        }
      })
      .then(() => {
        // after links and contents created
        // update selectors for links, content and iframes
        tabLink = document.querySelectorAll('.tabLink');
        tabContent = document.querySelectorAll('.tabContent');
        iframes = document.querySelectorAll('iframe');

        // add listener to first iframe, when it recieves it's url src this will fire the showiframes function
        iframes[0].onload = showiframes();
        // adjust the iframe content height and containing div height to the bottom of the description. Let the iframe scroll but not page
        setTabContentHeight();

        // add event listeners to tabLinks for hover styling
        tabLink.forEach(tab => tab.addEventListener('mouseenter', showHover));
        tabLink.forEach(tab => tab.addEventListener('mouseout', removeHover));

        // add event listener for click on each tabLink
        tabLink.forEach(tab => tab.addEventListener('click', function(event){
          // functions to slide tabcontent and change styling on clicked link
          showPage(event);
          showTab(event);
        }));

        // add listener to page for resize to recalculate tabContent height. Performance here is not great but it requires recalculating the iframe pages as well so this is expected. 
        window.addEventListener('resize', setTabContentHeight);

        // finally animate in the results
        showResults();
      })
    }).catch(error => {
      displayMessage('Sorry there was an error or no results from your query, try searching again!');
      removeResults();
      searching = false;
      console.log(error);
    })
  }

  // on new search we animate out the current results and remove them. Also remove iframeSources.
  function removeResults(){
    iframeSources = [];
    tabsContainer.style.opacity = 0;
    // delay to allow content to animate out
    setTimeout(() => {
      while (tabLinksContainer.firstChild) {
        tabLinksContainer.removeChild(tabLinksContainer.firstChild);
      }
      while (tabContentsContainer.firstChild) {
        tabContentsContainer.removeChild(tabContentsContainer.firstChild);
      }
    }, 1000);
  }

  // searches for query from input
  function getInput(event){
    event.preventDefault();
    // if we are already searching prevent stacked searches.
    if (searching) {
      return;
    }
    searching = true;
    // display message to indicate search taking place and remove current results if they exist
    displayMessage('Let\'s see what we can find.');
    removeResults();
    // get query text from input
    let query = document.querySelector('#query');
    let value = query.value;
    // delay search to allow old results to animate out
    setTimeout(() => {
      getQuery(value);
    }, 1000);
    // reset input
    query.value = '';
  }

  // function to slide tab content in based on tab link click
  function showPage(event){
    // get the currently displayed tab and it's id
    const currentTab = document.querySelector('.center');
    const currentTabId = currentTab.id.substr(currentTab.id.length - 1);
    // get the id of the tab clicked on
    const thisTabId = event.target.id;
    // if they are the same do nothing
    if (currentTabId === thisTabId) {
      return;
    }
    // get tabContent that matches the clicked tabLink
    const thisTabContent = document.querySelector(`#tabContent${thisTabId}`);
    
    // remove center class from currently displayed tab
    currentTab.classList.remove('center');

    // if the clicked tab has a higher id number
    if (thisTabId > currentTabId) {
      // move the current tab to the left
      currentTab.classList.add('slide-left');
      // remove slide right from clicked tab
      thisTabContent.classList.remove('slide-right');
      // for each tab inbetween slide them from right to left (this keep direction continuity when starting at 1, selecting tab 6, then tab 3)
      tabContent.forEach((tab, index) => {
        if (index > currentTabId && index < thisTabId){
          tab.classList.add('slide-left');
          tab.classList.remove('slide-right');
        }
      })
    } else {
      // else the clicked tab is a lower number, slide the current tab to the right
      currentTab.classList.add('slide-right');
      // remove slide left from clicked tab
      thisTabContent.classList.remove('slide-left');
      // for each tab inbetween slide them from left to right (this keep direction continuity when starting at 6, selecting tab 1, then tab 3)      
      tabContent.forEach((tab, index) => {
        if (index < currentTabId && index > thisTabId){
          tab.classList.add('slide-right');
          tab.classList.remove('slide-left');
        }
      })
    }
    
    // add center to the clicked tab to display it
    thisTabContent.classList.add('center');
  }

  // add selected class to clicked tabLink for styling
  function showTab(event){
    tabLink.forEach(tab => tab.classList.remove('selected'));
    event.target.classList.remove('hover');
    event.target.classList.add('selected');
  }

  // add hover styling to tabLink unless it is the selected tabLink
  function showHover(event){
    if (this.classList.contains('selected')) {
      return;
    } else {
      this.classList.add('hover');
    }
  }

  // remove hover styling on mouseout
  function removeHover(event){
    if (this.classList.contains('hover')) {
      this.classList.remove('hover');
    }
  }

  // sets the iframe and tabContent div heights
  function setTabContentHeight(){
    // get the bottom of the tabLinks
    const tabLinksBottom = tabLinksContainer.getBoundingClientRect().bottom;
    // get the total window height
    const windowHeight = document.body.clientHeight;
    // grab the descriptions
    const descriptions = document.querySelectorAll('.tabDescriptionContainer');
    // set the height of the tabContents to be the window minus the bottom of the tabLinks
    tabContentsContainer.setAttribute('height', windowHeight - tabLinksBottom);
    // set the iframes to be the height of the matching window minus its cooresponding description
    iframes.forEach((iframe, index) => {
      const descriptionHeight = descriptions[index].getBoundingClientRect().bottom;
      iframe.setAttribute('height', windowHeight - descriptionHeight);
    });
  }

  // add event listener to input for click and enter/return key press
  search.addEventListener('click', getInput);
  search.addEventListener('keyup', function(event){
    if (event.keyCode === 13) {
      getInput();
    }
  }); 

  // add event listener to random query button
  randomSearch.addEventListener('click', getRandomQuery);
});
