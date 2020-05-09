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

export { asyncPost, asyncGet }
