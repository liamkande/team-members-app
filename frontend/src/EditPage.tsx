import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FormDataContext } from './FormDataContext';

const EditPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const context = useContext(FormDataContext);
    if (!context) {
        throw new Error("EditPage must be used within a FormDataProvider");
    }

    const { formData, setFormData, teamMembers, setTeamMembers } = context;
    const [errors, setErrors] = useState({
        first_name: '',
        last_name: '',
        phone_number: '',
        email: '',
        role: ''
    });

    const navigate = useNavigate();

    useEffect(() => {
        fetchTeamMember();
    }, []);

    const fetchTeamMember = async () => {
        if (process.env.NODE_ENV === 'production') {
            // Read from local storage in production
            const savedTeamMembers = localStorage.getItem('teamMembers');
            if (savedTeamMembers) {
                const teamMembersArray = JSON.parse(savedTeamMembers);
                const member = teamMembersArray.find((member: any) => member.id === id || member.email === id);
                if (member) {
                    setFormData(member);
                }
            }
        } else {
            // Fetch from backend in development
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/team-members/${id}/`);
                setFormData(response.data);
            } catch (error) {
                console.error('Error fetching team member:', error);
            }
        }
    };

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePhoneNumber = (phoneNumber: string) => {
        const phoneRegex = /^[0-9]{10}$/;
        return phoneRegex.test(phoneNumber);
    };

    const validateName = (name: string) => {
        const nameRegex = /^[A-Za-z]+$/;
        return nameRegex.test(name) && name.length >= 2 && name.length <= 50;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
        setErrors(prevState => ({
            ...prevState,
            [name]: value ? '' : `${name.replace('_', ' ')} is required`
        }));
    };

    const handleRoleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            role: value
        }));
        setErrors(prevState => ({
            ...prevState,
            role: value ? '' : 'Role is required'
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const newErrors = {
            first_name: validateName(formData.first_name) ? '' : 'Invalid first name',
            last_name: validateName(formData.last_name) ? '' : 'Invalid last name',
            email: validateEmail(formData.email) ? '' : 'Invalid email address',
            phone_number: validatePhoneNumber(formData.phone_number) ? '' : 'Invalid phone number',
            role: formData.role ? '' : 'Role is required'
        };

        setErrors(newErrors);

        const hasErrors = Object.values(newErrors).some(error => error);
        if (hasErrors) {
            return;
        }

        try {
            if (process.env.NODE_ENV === 'production') {
                // Update local storage in production
                const savedTeamMembers = localStorage.getItem('teamMembers');
                if (savedTeamMembers) {
                    const teamMembersArray = JSON.parse(savedTeamMembers);
                    const updatedTeamMembers = teamMembersArray.map((member: any) =>
                        member.id === id || member.email === id ? formData : member
                    );
                    localStorage.setItem('teamMembers', JSON.stringify(updatedTeamMembers));
                    setTeamMembers(updatedTeamMembers);
                }
            } else {
                // Update backend in development
                await axios.put(`http://127.0.0.1:8000/api/team-members/${id}/`, formData);
            }
            navigate('/');
            console.log('Team member updated successfully');
        } catch (error) {
            console.error('Error updating team member:', error);
        }
    };

    const handleDelete = async () => {
        try {
            if (process.env.NODE_ENV === 'production') {
                // Delete from local storage in production
                const savedTeamMembers = localStorage.getItem('teamMembers');
                if (savedTeamMembers) {
                    const teamMembersArray = JSON.parse(savedTeamMembers);
                    const updatedTeamMembers = teamMembersArray.filter((member: any) =>
                        member.id !== id && member.email !== id
                    );
                    localStorage.setItem('teamMembers', JSON.stringify(updatedTeamMembers));
                    setTeamMembers(updatedTeamMembers);
                }
            } else {
                // Delete from backend in development
                await axios.delete(`http://127.0.0.1:8000/api/team-members/${id}/`);
            }
            console.log('Team member deleted successfully');
            navigate('/');
        } catch (error) {
            console.error('Error deleting team member:', error);
        }
    };

    return (
        <div className='card-container'>
            <div className='card-header'>
                <div className='title-text'>Edit Team Member</div>
                <div className='sub-text'>Edit contact info, location, and role.</div>
            </div>
            <form onSubmit={handleSubmit}>
                <div className='input-container'>
                    <hr/>
                    <div className='sub-title-text'>Info</div>
                    <input className='input-field' type="text" name="first_name" value={formData.first_name}
                           onChange={handleChange}
                           placeholder="First Name" required/>
                    {errors.first_name && <div className="error-text">{errors.first_name}</div>}
                    <input className='input-field' type="text" name="last_name" value={formData.last_name}
                           onChange={handleChange}
                           placeholder="Last Name" required/>
                    {errors.last_name && <div className="error-text">{errors.last_name}</div>}
                    <input className='input-field' type="email" name="email" value={formData.email}
                           onChange={handleChange} placeholder="Email"
                           required/>
                    {errors.email && <div className="error-text">{errors.email}</div>}
                    <input className='input-field' type="tel" name="phone_number" value={formData.phone_number}
                           onChange={handleChange}
                           placeholder="Phone Number" required/>
                    {errors.phone_number && <div className="error-text">{errors.phone_number}</div>}
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
                    {errors.role && <div className="error-text">{errors.role}</div>}
                </div>
                <div className='card-footer' style={{ justifyContent: 'space-between' }}>
                    <button className='delete-button' type="button" onClick={handleDelete}>Delete</button>
                    <button className='save-button' type="submit">Save</button>
                </div>
            </form>
        </div>
    );
};

export default EditPage;