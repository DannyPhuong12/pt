import axios from 'axios'

const BASE_URL = 'https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api'

const getCustomers = async () => {
  const response = await axios.get(`${BASE_URL}/customers`)
  return response.data._embedded.customers.map((c) => ({
    ...c,
    id: c._links.self.href.split('/').pop(),
    href: c._links.self.href,
  }))
}

const addCustomer = async (customer) => {
  const response = await axios.post(`${BASE_URL}/customers`, customer)
  return response.data
}

const updateCustomer = async (href, customer) => {
  const response = await axios.put(href, customer)
  return response.data
}

const deleteCustomer = async (href) => {
  await axios.delete(href)
}

export default { getCustomers, addCustomer, updateCustomer, deleteCustomer }