
import './App.css'
import CreatureInitiativeItem from './components/creatureInitiativeItem'

function App() {

  return (
    <>
        <section id="center">
          <ul id="initiative-list">
            <li><CreatureInitiativeItem id={1} name="Goblin" initiative={10} initiativeModifier={2} maxHp={20} /></li>
            <li><CreatureInitiativeItem id={1} name="Goblin" initiative={10} initiativeModifier={2} maxHp={20} /></li>
            <li><CreatureInitiativeItem id={1} name="Goblin" initiative={10} initiativeModifier={2} maxHp={20} /></li>
          </ul>
        </section>
    </>
  )
}

export default App
