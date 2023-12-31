import axios from 'axios'
const baseUrl = 'http://localhost:3001/api/persons'

const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
}

const create = newPerson => {
    const request = axios.post(baseUrl, newPerson)
    return request.then(response => response.data)
}

const deletePerson = id => {
    const request = axios.delete(`${baseUrl}/${id}`)
    request.then(response => {
        console.log('delete success')
    })
    .catch(error => {
        console.log('delete fail')
    })
}

const update = (personObject) => {
    const request = axios.patch(`${baseUrl}/${personObject.id}`, personObject)
    return request.then(response => response.data)
}

export default {getAll, create, update, deletePerson}