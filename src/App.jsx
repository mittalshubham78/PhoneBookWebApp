import { useState, useEffect } from 'react'
import axios from 'axios'
import phoneBookService from './services/persons'
//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'
//import './App.css'

const Persons = ({person, clickToDelete}) => {
    return (
        <li>
            <div>
                {person.name}
                <button onClick = {clickToDelete}>delete</button>
            </div>
            <p>pno - {person.PhoneNo} </p>
        </li>
    )
}

const Filter = ({persons}) => {
      const [searchName, setSearchName] = useState('')

      const searchResults = persons.filter(function(person) {
        if(searchName.length > 0) {
            let newSearch = searchName.trim()
            let str = person.name.substring(0, newSearch.length).toLowerCase()
            return str === newSearch.toLowerCase()
        }
        return false
      })

    return (
    <div>
        <p>search with name: <input value = {searchName} onChange = {(event) => setSearchName(event.target.value)} /></p>
        <h2>Search Result</h2>
        <ul>
            {searchResults.map(person => <li key = {person.id}><div>{person.name}</div><p>pno - {person.PhoneNo}</p></li>)}
        </ul>
    </div>
    )
}




function App() {
  const [count, setCount] = useState(0)
  const [persons, setPersons] = useState([])

  const [newPerson, setNewPerson] = useState('')
  const [newPhoneNo, setNewPhoneNo] = useState('')

  const addPerson = (event) => {
    event.preventDefault()
    const personObject = {
        name: newPerson,
        PhoneNo: newPhoneNo,
    }

    if(newPerson.length <= 2){
        alert('Minimum Needed 3 characters')
    } else {
        let personToCheck = persons.find(person => person.name === newPerson)
        let isNewPerson = !persons.includes(personToCheck)
        if(newPhoneNo.length == 10 && /^\d+$/.test(newPhoneNo)==true) {
            if(isNewPerson){
                phoneBookService.create(personObject)
                .then(serverResponse => {
                    console.log(serverResponse)
                    setPersons(persons.concat(serverResponse))
                })
            } else {
                if(window.confirm(`${personToCheck.name} is already in phonebook, replace old number with new one`)) {
                    phoneBookService.update(personToCheck.id, personObject)
                    .then(serverResponse => {
                        console.log(serverResponse)
                        setPersons(persons.map(person => (person.id!=personToCheck.id) ? person : serverResponse))
                    })
                } else {
                    console.log(`cancel update for ${personToCheck.name}`)
                }
            }
        } else {
            alert(`Enter valid Phone Number of 10 digits`)
        }
    }

    setNewPerson('')
    setNewPhoneNo('')
  }

  useEffect(() => {
    phoneBookService.getAll()
    .then(initialPhoneBook => {
        setPersons(initialPhoneBook)
    })
  }, [])

  const handleDelete = id => {
    const person = persons.find(person => person.id == id)
    if(window.confirm(`Delete ${person.name}`)) {
        phoneBookService.deletePerson(person.id)
        setPersons(persons.filter(person => person.id!=id))
    } else {
        console.log("cancel delete operation")
    }
  }

  return (
    <div>
        <h2>PhoneBook</h2>
        <Filter persons = {persons} />
        <h2>add new person</h2>
        <form onSubmit = {addPerson}>
            <p>name: <input value = {newPerson} onChange = {(event) => setNewPerson(event.target.value)} /></p>
            <p>phoneNo: <input value = {newPhoneNo} onChange = {(event) => setNewPhoneNo(event.target.value)} /></p>
            <button type = 'submit' >add</button>
        </form>
        <h2>Numbers</h2>
            <ul>
                {persons.map(person => <Persons key = {person.id} person = {person} clickToDelete = {() => {handleDelete(person.id)}} />)}
            </ul>
    </div>
  )
}

export default App
