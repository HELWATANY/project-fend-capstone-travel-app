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
    cityNameEl.innerHTML = cityName;
    hideElement('loader');
  }

}

async function handleDepartDateChange (event) {
  const { value } = event.target;
  const departingDateEl = document.getElementById('departingDate');
  departingDateEl.innerHTML = '';

  if (value) {
    let selectedDate = new Date(value);
    departingDateEl.innerHTML = selectedDate.toLocaleDateString();
  }
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
    country = countryEl.options[countryEl.selectedIndex];
  }

  if (!cityEl.value) {
    alert('City Is Required!');
    return;
  } else {
    city = cityEl.options[cityEl.selectedIndex];
  }

  const tripInfo = {
    date,
    country,
    city,
    weather,
    image
  };

  ls.set('tripInfo', tripInfo);
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
      cancelTrip.addEventListener('click', () => {
        tripInfo = {
          country: '',
          city: '',
          date: '',
          image: '',
          weather: ''
        };
      });
    }

  });
})();
