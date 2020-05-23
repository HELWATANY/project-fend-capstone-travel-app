import {asyncGet, asyncPost, formatDate, hideElement, ls, showElement} from './utils';

async function handleCountrySelect(event) {
  const { value } = event.target;
  let cityEl = document.getElementById('city');
  cityEl.innerHTML = ''; // clear all options
  cityEl.disabled = true;

  let countryNameEl = document.getElementById('countryName');
  countryNameEl.innerHTML = ''

  let cityNameEl = document.getElementById('cityName');
  cityNameEl.innerHTML = ''

  let tripImgEl = document.getElementById('tripImg');
  tripImgEl.setAttribute('src', 'https://via.placeholder.com/640x640.png?text=Image');

  let weatherInfo = document.getElementById('weatherInfo');
  weatherInfo.innerHTML = '';

  const fragment = document.createDocumentFragment();

  if (value) {
    // display loader
    showElement('loader');

    // get country's cities
    const { geonames } = await asyncPost('http://localhost:8081/cities', {id: value});

    // filler option
    const fillerOptionElement = document.createElement('option');
    fillerOptionElement.setAttribute('value', '');
    fillerOptionElement.innerHTML = 'Please Select A City';
    fragment.appendChild(fillerOptionElement);

    if (geonames) {
      geonames.forEach(city => {
        const optionElement = document.createElement('option');
        optionElement.setAttribute('value', `${city.lat},${city.lng}`);
        optionElement.innerHTML = city.name;
        fragment.appendChild(optionElement);
      });
    }

    countryNameEl.innerHTML = event.target.options[event.target.selectedIndex].text;
    // hide loader
    hideElement('loader');
    cityEl.disabled = false;
  } else {
    const optionElement = document.createElement('option');
    optionElement.setAttribute('value', '');
    optionElement.innerHTML = 'Please Select A Country First';
    fragment.appendChild(optionElement);
  }

  cityEl.appendChild(fragment);
}

async function handleCitySelect (event) {
  const { value } = event.target;

  let cityNameEl = document.getElementById('cityName');
  cityNameEl.innerHTML = ''

  let weatherInfo = document.getElementById('weatherInfo');
  weatherInfo.innerHTML = '';

  let tripImgEl = document.getElementById('tripImg');
  tripImgEl.setAttribute('src', 'https://via.placeholder.com/640x640.png?text=Image');


  if (value) {
    // display loader
    showElement('loader');
    let cityName = event.target.options[event.target.selectedIndex].text;
    cityNameEl.innerHTML = cityName;
    const latLng = value.split(',');

    // get country's cities
    const { data } = await asyncPost('http://localhost:8081/weather', {
      lat: latLng[0],
      lon: latLng[1]
    });

    if (data) {
      let weatherData = data[data.length - 1];
      weatherInfo.innerHTML = `High: ${weatherData.high_temp}, Low: ${weatherData.low_temp} <br />
      ${weatherData.weather.description}`;
    }

    const imageRes = await asyncPost('http://localhost:8081/image', {q: cityName.replace(/ /g,"+")});

    if (imageRes && imageRes.total > 0) {
      let imageData = imageRes.hits[0];
      tripImgEl.setAttribute('src', imageData.webformatURL);
    }

    // hide loader
    hideElement('loader');
  }

}

async function handleDepartDateChange (event) {
  const { value } = event.target;
  const departingDateEl = document.getElementById('departingDate');
  departingDateEl.innerHTML = '';

  const countdown = document.getElementById('countdown');
  countdown.innerHTML = ''

  if (value) {
    let selectedDate = new Date(value);
    departingDateEl.innerHTML = selectedDate.toLocaleDateString();
    countdown.innerHTML = `${calculateCountDown(value)}`;
  }
}

function calculateCountDown(date) {
  let currentDate = new Date();
  let travelDate = new Date(date);
  return Math.floor((Date.UTC(travelDate.getFullYear(), travelDate.getMonth(), travelDate.getDate()) - Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()) ) /(1000 * 60 * 60 * 24));
}

function handleSaveTrip () {
  let date = document.getElementById('departDate').value;
  let countryEl = document.getElementById('country');
  let country = '';
  let cityEl = document.getElementById('city');
  let city = ''
  let weather = document.getElementById('weatherInfo').innerHTML;
  let image = document.getElementById('tripImg').src;

  if (!date) {
    alert('Departing Date Is Required!');
    return;
  }

  if (!countryEl.value) {
    alert('Country Is Required!');
    return;
  } else {
    country = countryEl.options[countryEl.selectedIndex].text;
  }

  if (!cityEl.value) {
    alert('City Is Required!');
    return;
  } else {
    city = cityEl.options[cityEl.selectedIndex].text;
  }

  const tripInfo = {
    date,
    country,
    city,
    weather,
    image
  };

  let myTrips = ls.get('my_trips', []);
  myTrips.push(tripInfo);
  ls.set('my_trips', myTrips);

  handleCloseModal();
  setTimeout(() => {
    handleMyTripsRender();
  }, 900);
}

function handleAddTrip() {
  showElement('modal');
}

function handleCloseModal() {
  hideElement('modal');

  setTimeout(() => {
    let departDateEl = document.getElementById('departDate');
    departDateEl.value = '';

    let departingDateEl = document.getElementById('departingDate');
    departingDateEl.innerHTML = '';

    let countryEl = document.getElementById('country');
    countryEl.selectedIndex = 0

    let countryNameEl = document.getElementById('countryName');
    countryNameEl.innerHTML = '';

    let cityEl = document.getElementById('city');
    cityEl.innerHTML = ''; // clear all options
    cityEl.disabled = true;

    let cityNameEl = document.getElementById('cityName');
    cityNameEl.innerHTML = '';

    let tripImgEl = document.getElementById('tripImg');
    tripImgEl.setAttribute('src', 'https://via.placeholder.com/640x640.png?text=Image');

    let weatherInfo = document.getElementById('weatherInfo');
    weatherInfo.innerHTML = '';

    const fragment = document.createDocumentFragment();

    const optionElement = document.createElement('option');
    optionElement.setAttribute('value', '');
    optionElement.innerHTML = 'Please Select A Country First';
    fragment.appendChild(optionElement);
    cityEl.appendChild(fragment);
  }, 850);
}

function handleMyTripsRender () {
  const tripsContainer = document.getElementById('myTrips');
  tripsContainer.innerHTML = '';
  const fragment = document.createDocumentFragment();
  const myTrips = ls.get('my_trips', []);
  if (myTrips.length > 0) {
    myTrips.forEach((trip, index) => {
      let tripDate = new Date(trip.date);
      let tripCountdown = calculateCountDown(trip.date);
      let template = `
      <div class="trip-img">
          <img src="${trip.image}" />
        </div>
      <div class="trip-info">
        <h2>
          My Trip To: <spna>${trip.city}</spna>, <span>${trip.country}</span> <br />
        </h2>
        <h2>
          Departing: <span>${tripDate.toLocaleDateString()}</span>
        </h2>
        <p class="info-text">
          <span class="title">my trip is</span>
          <span class="info">
              <span>${tripCountdown}</span> days away!
            </span>
        </p>
        <p class="info-text">
          <span class="title">Typical weather for then is: </span>
        </p>
        <p class="info-text">
          <span class="info">${trip.weather}</span>
        </p>
        <button data-index="${index}" class="button primary outline delete-trip">Delete</button>
      </div>
    `;
      let tripContainer = document.createElement('div');
      tripContainer.className = 'trip-info-wrapper';
      tripContainer.innerHTML = template;
      fragment.appendChild(tripContainer);
    });

    tripsContainer.appendChild(fragment);

    let deleteButtons = document.getElementsByClassName('delete-trip');
    for (let i = 0; i < deleteButtons.length; i++) {
      deleteButtons[i].addEventListener('click', handleDeleteTrip);
    }
  } else {
    tripsContainer.innerHTML = `
      <div id="tripFiller" class="trip-filler active">
        <h1>Start Adding Trips To List It Here!</h1>
      </div>
  `;
  }
}

function handleDeleteTrip(event) {
  let tripIndex = event.target.getAttribute('data-index');
  let myTrips = ls.get('my_trips');
  if (tripIndex > -1) {
    myTrips.splice(tripIndex, 1);
  }
  ls.set('my_trips', myTrips);
  handleMyTripsRender();
}

export const events = (() => {
  window.addEventListener('load', async () => {
    let currentDate = new Date();
    let countries = [];
    let countryEl = document.getElementById('country');
    let cityEl = document.getElementById('city');
    let departDateEl = document.getElementById('departDate');
    let tripForm = document.getElementById('tripForm');
    let saveTrip = document.getElementById('save');
    let cancelTrip = document.getElementById('cancel');
    let addNewTrip = document.getElementById('addNewTrip')
    let closeModal = document.getElementById('closeModal');


    // Check for trips list
    if (!ls.get('my_trips')) {
      ls.set('my_trips', []);
    } else {
      handleMyTripsRender();
    }

    // Check for countries cache
    if (!ls.get('countries')) {
      const { geonames } = await asyncGet('http://localhost:8081/countries');
      if (geonames) {
        countries = [...geonames];
        ls.set('countries', geonames);
      }
    } else {
      countries = ls.get('countries');
    }

    if (countries && countryEl) {
      const fragment = document.createDocumentFragment();
      countries.forEach(country => {
        const optionElement = document.createElement('option');
        optionElement.setAttribute('value', country.geonameId);
        optionElement.innerHTML = country.countryName;
        fragment.appendChild(optionElement);
      });

      countryEl.appendChild(fragment);
    }

    if (countryEl) {
      countryEl.addEventListener('change', handleCountrySelect);
    }

    if (cityEl) {
      cityEl.addEventListener('change', handleCitySelect);
    }

    if (departDateEl) {
      departDateEl.setAttribute('min', formatDate(currentDate));
      departDateEl.addEventListener('change', handleDepartDateChange);
    }

    if (tripForm) {
      tripForm.addEventListener('submit', (e) => {
        e.preventDefault();
      })
    }

    if (saveTrip) {
      saveTrip.addEventListener('click', handleSaveTrip);
    }

    if (cancelTrip) {
      cancelTrip.addEventListener('click', handleCloseModal);
    }

    if (closeModal) {
      closeModal.addEventListener('click', handleCloseModal);
    }

    if (addNewTrip) {
      addNewTrip.addEventListener('click', handleAddTrip);
    }

  });
})();
