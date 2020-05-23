// Async POST
const asyncPost = async (url = '', data = {}) => {

  const response = await fetch(url, {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data) // body data type must match "Content-Type" header
  });

  try {
    return await response.json() || await response;
  } catch (error) {
    console.log('error', error);
  }
};

// Async GET
const asyncGet = async (url = '') => {
  const request = await fetch(url);
  try {
    // Transform into JSON
    return await request.json();
  } catch (error) {
    console.log('error', error);
  }
};

// Localstorage
const ls = {
  get (key, notFoundVal = null) {
    if(typeof(Storage) !== 'undefined') {
      let val = localStorage.getItem(key);
      if (val) {
        try {
          JSON.parse(val);
        } catch (e) {
          return val;
        }
        return JSON.parse(val);
      } else {
        return notFoundVal
      }
    }
  },
  set (key, val) {
    if(typeof(Storage) !== 'undefined') {
      // check if array or object
      if (typeof(val) === 'object' && val !== null) {
        localStorage.setItem(key, JSON.stringify(val));
      } else {
        localStorage.setItem(key, val);
      }
    }
  },
  remove (key) {
    if(typeof(Storage) !== 'undefined') {
      localStorage.removeItem(key);
    }
  }
};

const showElement = (elementId, className = 'active') => {
  const el = document.getElementById(elementId);
  if (el) {
    el.classList.add(className);
  }
};

const hideElement = (elementId, className = 'active') => {
  const el = document.getElementById(elementId);
  if (el) {
    setTimeout(() => {
      el.classList.remove(className);
    }, 800);
  }
};

const formatDate= (date) => {
  let d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2)
    month = '0' + month;
  if (day.length < 2)
    day = '0' + day;

  return [year, month, day].join('-');
};

const calculateCountDown = (date) => {
  let currentDate = new Date();
  let travelDate = new Date(date);
  return Math.floor((Date.UTC(travelDate.getFullYear(), travelDate.getMonth(), travelDate.getDate()) - Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()) ) /(1000 * 60 * 60 * 24));
}

export {
  asyncPost,
  asyncGet,
  showElement,
  hideElement,
  formatDate,
  calculateCountDown,
  ls
}
