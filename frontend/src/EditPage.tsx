import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'

interface TeamMember {
    id: number
    first_name: string
    last_name: string
    phone_number: string
    email: string
    role: string
    avatar_url?: string
}

const EditPage: React.FC = () => {
    const { id } = useParams<{ id: string }>()
    const [formData, setFormData] = useState<TeamMember>({
        id: 0,
        first_name: '',
        last_name: '',
        phone_number: '',
        email: '',
        role: '',
        avatar_url: '',
    })

    const navigate = useNavigate()

    useEffect(() => {
        fetchTeamMember()
    }, [])

    const fetchTeamMember = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/team-members/${id}/`)
            setFormData(response.data)
        } catch (error) {
            console.error('Error fetching team member:', error)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }))
    }

    const handleRoleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target
        setFormData(prevState => ({
            ...prevState,
            role: value
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await axios.put(`http://127.0.0.1:8000/api/team-members/${id}/`, formData)
            navigate('/')
            console.log('Team member updated successfully')
        } catch (error) {
            console.error('Error updating team member:', error)
        }
    }

    const handleDelete = async () => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/team-members/${id}/`)
            console.log('Team member deleted successfully')
        } catch (error) {
            console.error('Error deleting team member:', error)
        }
    }

    return (
        <div className='card-container'>
            <div className='card-header'>
                <div className='title-text'>Edit Team Member</div>
                <div className='sub-text'>Edit contact info, location, and role.</div>
            </div>
            <form onSubmit={() => navigate('/')}>
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
                <div className='card-footer' style={formData.role === 'admin' ? {justifyContent: 'space-between'} : {justifyContent: 'flex-end'}}>
                    {formData.role === 'admin' &&
                        <button className='delete-button' onClick={handleDelete}>Delete</button>
                    }
                    <button className='save-button' onClick={handleSubmit}>Save</button>
                </div>
            </form>
        </div>
    )
}

export default EditPage
