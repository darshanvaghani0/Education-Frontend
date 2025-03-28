export const BASE_URL = 'https://education-771144557380.us-central1.run.app';

export const get = async (endpoint, params = {}) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const url = `${BASE_URL}${endpoint}?${queryString}`
    console.log('Request URL:', url.toString());

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    console.log(endpoint, ' api res : ', data)
    return data
  } catch (error) {
    console.error('Error in GET request:', error);
  }
};

export const deleteApi = async (endpoint, params = {}) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const url = `${BASE_URL}${endpoint}?${queryString}`
    console.log('Request URL:', url.toString());

    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    console.log(endpoint, ' api res : ', data)
    return data
  } catch (error) {
    console.error('Error in DELETE request:', error);
  }
};


export const post = async (endpoint, params = {}) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const url = `${BASE_URL}${endpoint}?${queryString}`
    console.log('Request URL:', url.toString());

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    console.log(endpoint, ' api res : ', data)
    if (response.ok) {
      return { 'status': 'success', 'data': data }
    } else {
      return { 'status': 'failure', 'data': data }
    }
  } catch (error) {
    console.error('Error in GET request:', error);
  }
};

export const postRequest = async (endpoint, body = {}) => {
  try {
    const urlEncodedData = new URLSearchParams();
    for (let key in body) {
      if (body.hasOwnProperty(key)) {
        urlEncodedData.append(key, body[key]);
      }
    }
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: urlEncodedData.toString(),
    });

    const data = await response.json();
    console.log(endpoint, ' api res : ', data)
    return data
  } catch (error) {
    console.error('Error in POST request:', error);
  }
};

export const uploadImage = async (endpoint, params, imageUri) => {
  try {
    if (!imageUri) {
      throw new Error('No image provided for upload.');
    }
    const fileName = imageUri.split('/').pop();
    const fileType = fileName?.split('.').pop()?.toLowerCase() || 'jpeg';
    const formData = new FormData();
    formData.append('file', {
      uri: imageUri,
      name: fileName || 'image.jpeg',
      type: `image/${fileType}`,
    });

    const queryString = new URLSearchParams(params).toString();
    const url = `${BASE_URL}${endpoint}?${queryString}`
    console.log('Request URL:', url.toString());

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      body: formData,
    });

    const data = await response.json();
    console.log(endpoint, 'API Response:', data);

    if (response.ok) {
      return { status: 'success', data };
    } else {
      return { status: 'failure', data };
    }
  } catch (error) {
    console.error('Error uploading image:', error);
  }
};



export const postApi = async (endpoint, body = {}) => {
  try {
    console.log(`${BASE_URL}${endpoint}`)
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    console.log(endpoint, ' api res : ', data)
    return data
  } catch (error) {
    console.error('Error in POST request:', error);
  }
};