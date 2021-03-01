import axios from 'axios';

const API = process.env.VUE_APP_API || 'api';

async function postOrders(body) {
  try {
    const response = await axios.post(`${API}/orders`, body); return response.status;
  } catch (error) {
    throw new Error(error);
  }
}

export { postOrders as default };
