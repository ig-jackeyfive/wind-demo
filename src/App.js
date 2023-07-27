import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SearchBox from './views/SearchBox';
import SearchList from './views/SearchList';
import './App.css'

const App = () => {
  return (
    <Router>
      <div className="App">
        <h1>全球企业库</h1>
        <Routes>
          <Route path="/" element={<SearchBox />} />
          <Route path="/searchlist" element={<SearchList />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
