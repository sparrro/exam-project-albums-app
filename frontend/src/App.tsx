import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import StartPage from './Views/StartPage/StartPage';
import UserPage from './Views/UserPage/UserPage';
import AlbumPage from './Views/AlbumPage/AlbumPage';
import SearchPage from './Views/SearchPage/SearchPage';
import AddAlbumPage from './Views/AddAlbumPage/AddAlbumPage';
import NavMenu from './Components/NavMenu/NavMenu';



function App() {

  return (
    <main>
      <Router>
        <NavMenu/>
        <Routes>
          <Route path="/" element={<StartPage/>} />
          <Route path='/user/:username' element={<UserPage/>}/>
          <Route path='/album/:albumId' element={<AlbumPage/>}/>
          <Route path='/search' element={<SearchPage/>}/>
          <Route path='/add' element={<AddAlbumPage/>}/>
        </Routes>
      </Router>
    </main>
  )
}

export default App
