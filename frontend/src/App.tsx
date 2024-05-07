import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import AddPage from './AddPage'
import EditPage from './EditPage'
import ListPage from './ListPage'

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<ListPage />} />
                    <Route path="/add" element={<AddPage />} />
                    <Route path="/edit/:id" element={<EditPage />} />
                </Routes>
            </div>
        </Router>
    )
}

export default App
