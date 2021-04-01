import './App.css';
import { useState, useMemo, useEffect } from 'react'
import logo from './logo.svg';
import sortIcon from './sort.svg'

function App() {

  
  const defaultAvatar = 'https://www.flaticon.com/svg/vstatic/svg/362/362007.svg?token=exp=1617025914~hmac=7d517bb50203cd6676718abba464967f'
  const [balance, setBalance] = useState(Number(localStorage.getItem('balance')) || 89.99)
  const [slots, setSlots] = useState([,'Just play',])
  const [results, setResults] = useState([])
  const [sorted, setSorted] = useState({byId: false, byDate: false})
  const [currentUser, setCurrentUser] = useState({name: localStorage.getItem('name'), avatar: localStorage.getItem('photo') || defaultAvatar})

function openRules(){
  let overlay = document.getElementById('overlay'),
      modal = document.querySelector('.modal')
  modal.classList.add('active')
  overlay.classList.add('active')
}

function closeRules() {
  let overlay = document.getElementById('overlay'),
      modal = document.querySelector('.modal')
  modal.classList.remove('active')
  overlay.classList.remove('active')
}

  const login = currentUser.name ? 
    <div>
      <p>{currentUser.name}</p>
      <button onClick={() => setCurrentUser({name: null, avatar: defaultAvatar})}>Logout</button>
    </div> :
    <div>
      <p>Guest</p>
      <button onClick={() => openRules()}>Login</button>
    </div>
  
  const submit = (e) => {
    e.preventDefault()
    setCurrentUser({
      name: e.target[0].value,
      avatar: e.target[1].value ? URL.createObjectURL(e.target[1].files[0]) : defaultAvatar
    })
    
    closeRules()
  }
  localStorage.setItem('name', currentUser.name)
  localStorage.setItem('photo', currentUser.avatar)
  useEffect(() => document.querySelector('form').reset(), [submit])

  function showGame(){
    document.querySelector('.game').classList.toggle('hidden')
    document.querySelector('.startBtn').classList.toggle('hidden')
  }

  function play(){
    const random = () => Math.ceil(Math.random()*9)
    let r1 = random(),
        r2 = random(),
        r3 = random()
    setSlots([r1, r2, r3])

    if(r1 === 7 && r2 === 7 && r3 === 7){
      setBalance(prev => prev - 1 + 10) 
    }
      else if(r1 === r2 && r1 === r3){
        setBalance(prev => prev - 1 + 5)
      }
      else if(r2 === r1 || r2 === r3){
        setBalance(prev => prev - 1 + 0.5)
      }
      else setBalance(prev => prev - 1)
  }
  function jackpot(){
    setSlots([7, 7, 7])
    setBalance(prev => prev - 1)
  }

  console.log(balance)
  const uploadToLocalStorage = useMemo(() => localStorage.setItem('balance', balance), [balance])

  let date = new Date()
  const counter = useMemo(() => {
    setResults(prev => [
      {
        slots: slots,
        id: Date.now().toString().slice(-4), 
        displayedDate: `${date.getHours()} : ${date.getMinutes()} : ${date.getSeconds()}`,
        date
      }, ...prev])}, [slots])
  
  
  function sort(attribute){
    if(attribute === 'id') {
    setResults(results => results.sort((a, b) => sorted.byId ? b.id - a.id : a.id - b.id))
    setSorted(prev => ({...prev, byId: !prev.byId}))
    }
    if(attribute === 'date') {
      setResults(results => results.sort((a, b) => sorted.byDate ? b.date - a.date : a.date - b.date))
      setSorted(prev => ({...prev, byDate: !prev.byDate}))
    }
  }

  let resultsTable = results.map(r => 
    <tr>
      <td>{r.id}</td>
      <td>{r.slots[0]}</td>
      <td>{r.slots[1]}</td>
      <td>{r.slots[2]}</td>
      <td>{r.displayedDate}</td>
    </tr>
  )

  return (
    <div className="App">
      <header>
        <img className='logo' src={logo}></img>
        <div className='info'>
          <p className='balance'>{balance.toFixed(2)}$</p>
          <img className='avatar' src={currentUser.avatar}></img>
          {login}
        </div>
      </header>
      <content>
        <button className='startBtn' onClick={showGame}>Lets play</button>
        <div className='game hidden'>
          <nums>
            {slots[0]} {slots[1]} {slots[2]} 
          </nums>
          <div className='gameBtns'>
            <button onClick={play}>Play</button>
            <button onClick={jackpot}>Jackpot</button>
            <button onClick={showGame}>Finish game</button>
          </div>
        </div>

        <table>
          <caption>Results</caption>
          <tr>
            <th>Id <img src={sortIcon} onClick={() => sort('id')}></img></th>
            <th colspan="3">Slots</th>
            <th>Time <img src={sortIcon} onClick={() => sort('date')}></img></th>
          </tr>
          {resultsTable}
        </table>
      </content>
      <footer>
        <img src={logo}></img>
        <p>
          Copyright © 2021 777 Slots Company S.L. All rights reserved.
        </p>
      </footer>
      <div className="modal">
        <form onSubmit={(e) => submit(e)}>
          <input className="field" type="text" required minlength="3" id="name" placeholder="Your name"></input>
          <input type="file" id="img" name="img" accept="image/*"></input>
          <input className="formBtn" type="submit" value="Submit"></input>
        </form>
      </div>
      <div id="overlay" onClick={() => closeRules()}></div>
    </div>
  );
}

export default App;
