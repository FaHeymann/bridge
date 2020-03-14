import React from 'react';
// import logo from './logo.svg';
import './App.css';

import Venting from './components/Venting/Venting';
import OverdueTasks from './components/OverdueTasks/OverdueTasks';
import ShoppingList from './components/ShoppingList/ShoppingList';

import secrets from './secrets.json'

import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div className="Container">
      <div className="Tile" id="top-left">
        <OverdueTasks apiToken={secrets.API_TOKEN} />
      </div>
      <div className="Tile" id="top-right">
        <ShoppingList apiToken={secrets.API_TOKEN} />
      </div>
      <div className="Tile" id="bottom-left">
        <Venting apiToken={secrets.API_TOKEN} />
      </div>
      <div className="Tile" id="bottom-right">
      </div>
    </div>
  );
}

export default App;
