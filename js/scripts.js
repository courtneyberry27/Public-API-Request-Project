/************************** 
 * GLOBAL VARIABLES
 ***************************/
const body = document.querySelector('body');
const api = "https://randomuser.me/api/?results=12&nat=gb,us";
const galleryDiv = document.getElementById('gallery');
const searchContainer = document.querySelector('.search-container');

/************************** 
 * FETCH DATA FUNCTIONS
 ***************************/
//FETCHDATA FUNCTION FOR BASIC FORMAT OF FETCH API
function fetchData(url) {
    return fetch(url)
        .then(checkStatus)
        .then(response => response.json())
        .catch(error => console.log('There was a problem fetching the data!', error))
}

//CHECKS IF REJECTED OR RESOLVED
function checkStatus(response) {

    if (response.ok) {
        return Promise.resolve(response);
    } else {
        return Promise.reject(new Error(response.statusText()));
    }
}

//USES FETCHDATA TO REQUEST API INFO
fetchData(api)
    .then(data => generateUsers(data.results))
    .then(createSearch);

/************************** 
 *USER CARD DISPLAY SECTION
 ***************************/
function generateUsers(data) {
    data.map((user, i) => {
        const userDiv = document.createElement('div');

        //APPEND AND GIVE ELEMENT QUALITIES
        galleryDiv.appendChild(userDiv);
        userDiv.className = "card";

        //DYNAMIC HTML FOR USER CARD
        userDiv.innerHTML =
            `<div class="card-img-container">
          <img class="card-img" src=${user.picture.large} alt="profile picture">
       </div>
       <div class="card-info-container">
         <h3 id="name" class="-name cap">${user.name.first} ${user.name.last}</h3>
         <p class="card-text">${user.email}</p>
         <p class="card-text cap">${user.location.city}, ${user.location.state}</p>
				</div>`;

        //EVENT LISTENER
        userDiv.addEventListener('click', (e) => {
            e.target = createModal(data, i);
        });
    }).join(''); //REMOVE COMMAS FOR FINAL DISPLAY

    return data;
}

/************************** 
 * MODAL SECTION
 ***************************/
function createModal(data, i) {
    const user = data[i];
    let bday = user.dob.date;
    let dob = bday.split("T")[0];
    let year = dob.slice(0, 4);
    let month = dob.slice(5, 7);
    let day = dob.slice(8, 10);
    dob = `${month}/${day}/${year}` //correct bday format
    const modalDiv = document.createElement('div');
    body.appendChild(modalDiv);
    modalDiv.className = "modal-container";

    //SETTING UP DYNAMIC HTML
    modalDiv.innerHTML =
        `<div class="modal">
    <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
     <div class="modal-info-container">
       <img class="modal-img" src=${user.picture.large} alt="profile picture">
        <h3 id="name" class="modal-name cap">${user.name.first} ${user.name.last}</h3>
        <p class="modal-text">${user.email}</p>
        <p class="modal-text cap">${user.location.city}</p>
        <hr>
        <p class="modal-text">${user.cell}</p>
        <p class="modal-text">${user.location.street.number} ${user.location.street.name}, ${user.location.city}, ${user.location.state} ${user.location.postcode}</p>
        <p class="modal-text">Birthday: ${dob}</p>
              </div>`;


    //CLOSE BUTTON EVENT LISTENER AND CREATION
    const closeBtn = document.getElementById("modal-close-btn");

    closeBtn.addEventListener('click', (event) => {
        modalDiv.remove();
    });

    //BUTTON SECTION FOR NEXT AND PREVIOUS
    const btnDiv = document.createElement('div');
    btnDiv.className = "modal-btn-container";
    modalDiv.appendChild(btnDiv);

    btnDiv.innerHTML =
        `<button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
     <button type="button" id="modal-next" class="modal-next btn">Next</button>`;

    const next = document.getElementById("modal-next");
    const previous = document.getElementById("modal-prev");

    //NEXT/PREVIOUS BUTTON FUNCTIONALITY
    if (data[i + 1] != null) {
        next.style.display = " ";
    } else {
        next.style.display = "none";
    }

    if (data[i - 1] != null) {
        previous.style.display = " ";
    } else {
        previous.style.display = "none";
    }

    //EVENT LISTENERS FOR NAV BUTTONS          
    next.addEventListener('click', (e) => {
        modalDiv.remove();
        createModal(data, i + 1);
    });

    previous.addEventListener('click', (e) => {
        modalDiv.remove();
        createModal(data, i - 1);
    });

}

/************************** 
 * SEARCHBAR SECTION
 ***************************/
function createSearch() {
    const searchForm = document.createElement('form');
    searchForm.action = '#';
    searchForm.method = 'get';
    //DYNAMIC HTML FOR SEARCH BAR AND SUBMIT BTN
    searchForm.innerHTML =
        `<input type="search" id="search-input" class="search-input" placeholder="Search...">
   <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">`;
    searchContainer.appendChild(searchForm);

    const userCards = document.querySelectorAll('.card');
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-submit');

    function compare(search, names) {
        let searchValue = search.value;
        let inputString = searchValue.toString().toLowerCase();

        //LOOP TO SEE IF MATCHES AND DISPLAYS IF IT DOES
        for (let i = 0; i < names.length; i += 1) {
            let name = names[i].querySelector('h3');
            let nameString = name.textContent.toString().toLowerCase();
            let matching = nameString.indexOf(inputString);

            if (matching != (-1)) {
                names[i].style.display = '';
            } else {
                names[i].style.display = 'none';
            }
        }

    }

    //EVENT LISTENERS
    searchBtn.addEventListener('click', (e) => {
        e.target.preventDefault();
        compare(searchInput, userCards);
    });

    //DYNAMIC SEARCH FOR DISPLAYING RESULTS AS YOU ENTER CHARACTERS
    searchInput.addEventListener('keyup', () => {
        compare(searchInput, userCards);
    });

}
