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
          <Route path="/" element={
            <div className='landingPage'>
              <h1>
                Examen Web2 : Patrimoine Economique
              </h1>
              <div className="author">
                <hr />
                <p>
                  STD23006-ANDRIAMANDRESY KENNY UNITY
                </p>
              </div>
              <footer>
                <svg xmlns="http://www.w3.org/2000/svg" style={{ transform: 'rotate(180deg) translateY(-3px)' }} viewBox="0 0 1000 100" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="grad1" x1="80%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{ stopColor: 'rgb(17, 0, 255)', stopOpacity: 1 }} />
                      <stop offset="100%" style={{ stopColor: 'pink', stopOpacity: 1 }} />
                    </linearGradient>
                    <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{ stopColor: 'pink', stopOpacity: 1 }} />
                      <stop offset="100%" style={{ stopColor: 'rgb(17, 0, 255)', stopOpacity: 1 }} />
                    </linearGradient>
                  </defs>
                  <path fill="url(#grad1)" opacity="1" d="M473,67.3c-203.9,88.3-263.1-34-320.3,0C66,119.1,0,59.7,0,59.7V0h1000v59.7 c0,0-62.1,26.1-94.9,29.3c-32.8,3.3-62.8-12.3-75.8-22.1C806,49.6,745.3,8.7,694.9,4.7S492.4,59,473,67.3z" />
                  <path fill="url(#grad2)" opacity="0.66" d="M734,67.3c-45.5,0-77.2-23.2-129.1-39.1c-28.6-8.7-150.3-10.1-254,39.1 s-91.7-34.4-149.2,0C115.7,118.3,0,39.8,0,39.8V0h1000v36.5c0,0-28.2-18.5-92.1-18.5C810.2,18.1,775.7,67.3,734,67.3z" />
                  <path fill="url(#grad1)" d="M766.1,28.9c-200-57.5-266,65.5-395.1,19.5C242,1.8,242,5.4,184.8,20.6C128,35.8,132.3,44.9,89.9,52.5C28.6,63.7,0,0,0,0 h1000c0,0-9.9,40.9-83.6,48.1S829.6,47,766.1,28.9z" />
                </svg>
              </footer>
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
