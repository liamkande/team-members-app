import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const AddTeamMemberForm: React.FC = () => {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        phone_number: '',
        email: '',
        role: '',
        username: '',
        avatar_url: ''
    })
    const navigate = useNavigate()

    const handleRoleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target
        setFormData(prevState => ({
            ...prevState,
            role: value
        }))
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            formData.username = formData.email // sets the username to the email
            formData.avatar_url = `https://avatars.githubusercontent.com/u/23286067?v=4` // manually adds the avatar_url feel free to change it and collect it from the user
            await axios.post('http://127.0.0.1:8000/api/team-members/', formData)

            setFormData({
                first_name: '',
                last_name: '',
                phone_number: '',
                email: '',
                role: '',
                username: '',
                avatar_url: ''
            })
            navigate('/')
        } catch (error) {
            console.error('Error adding team member:', error)
        }
    }

    return (
        <div className='card-container'>
            <div className='card-header'>
                <div className='title-text'>Add a Team Member</div>
                <div className='sub-text'>Set email, location, and role.</div>
            </div>
            <form onSubmit={handleSubmit}>
                <div className='input-container'>
                    <hr/>
                    <div className='sub-title-text'>Info</div>
                    <input className='input-field' type="text" name="first_name" value={formData.first_name}
                           onChange={handleChange}
                           placeholder="First Name" required/>
                    <input className='input-field' type="text" name="last_name" value={formData.last_name}
                           onChange={handleChange}
                           placeholder="Last Name" required/>
                    <input className='input-field' type="email" name="email" value={formData.email}
                           onChange={handleChange} placeholder="Email"
                           required/>
                    <input className='input-field' type="tel" name="phone_number" value={formData.phone_number}
                           onChange={handleChange}
                           placeholder="Phone Number" required/>
                </div>
                <div className="radio-container">
                    <div className='sub-title-text'>Role</div>
                    <div className='radio-items'>
                        <div style={formData.role === 'regular' ? {color: 'black'} : {color: 'grey'}}>Regular - Can't
                            delete members
                        </div>
                        <input type="radio" name="role" value="regular" checked={formData.role === 'regular'}
                               onChange={handleRoleChange}/>
                    </div>
                    <div className='radio-items'>
                        <div style={formData.role === 'admin' ? {color: 'black'} : {color: 'grey'}}>Admin - Can delete
                            members
                        </div>
                        <input type="radio" name="role" value="admin" checked={formData.role === 'admin'}
                               onChange={handleRoleChange}/>
                    </div>
                </div>
                {/*<input type="url" name="avatar_url" value={formData.avatar_url} onChange={handleChange}*/}
                {/*       placeholder="Avatar URL" required/>*/}
                <div className='card-footer' style={{  justifyContent: 'flex-end'}}>
                    <button className='save-button' type="submit">Save</button>
                </div>
            </form>
        </div>
    )
}

export default AddTeamMemberForm
