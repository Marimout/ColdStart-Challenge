import axios from 'axios';

const API = process.env.VUE_APP_API || 'api';

async function getPersonalizer() {
  try {
    const response = await fetch(`${API}/personalizer`);
    const personalizer = await response.json();

    console.log(personalizer);
    return personalizer;
  } catch (error) {
    throw new Error(error);
  }
}

async function postReward(eventId, value) {
  try {
    const reward = {
      eventId,
      value,
    };

    const response = await axios.post(`${API}/personalizer`, reward);

    return response.status;
  } catch (error) {
    throw new Error(error);
  }
}

export { getPersonalizer as default, postReward };
