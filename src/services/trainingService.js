import axios from 'axios'

const BASE_URL = 'https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api'

const getTrainings = async () => {
  const response = await axios.get(`${BASE_URL}/gettrainings`)
  return response.data
}

const addTraining = async (training) => {
  const response = await axios.post(`${BASE_URL}/trainings`, training)
  return response.data
}

const deleteTraining = async (id) => {
  await axios.delete(`${BASE_URL}/trainings/${id}`)
}

export default { getTrainings, addTraining, deleteTraining }