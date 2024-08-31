import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './header';
import CreatePossessionPage from './create'; 
import './App.css';
import PossessionT from './Possession/Possession';
import Patrimoine from './Patrimoine/Patrimoine';


function App() {
  
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
        <Route path="/patrimoine" element={<Patrimoine />} />
          <Route path="/possession" element={<PossessionT />} />
          <Route path="/possession/create" element={<CreatePossessionPage />} />
          <Route path="/" element={<div>Page d'accueil</div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
