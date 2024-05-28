import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import AddPage from './AddPage'
import EditPage from './EditPage'
import ListPage from './ListPage'
import { FormDataProvider } from './FormDataContext'

function App() {
    return (
        <FormDataProvider>
            <Router>
                <div className="App">
                    <Routes>
                        <Route path="/" element={<ListPage />} />
                        <Route path="/add" element={<AddPage />} />
                        <Route path="/edit/:id" element={<EditPage />} />
                    </Routes>
                </div>
            </Router>
        </FormDataProvider>
    )
}

export default App
