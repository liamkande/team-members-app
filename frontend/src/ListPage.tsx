import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FormDataContext } from './FormDataContext';

const ListPage: React.FC = () => {
    const context = useContext(FormDataContext);
    const navigate = useNavigate();

    if (!context) {
        throw new Error("ListPage must be used within a FormDataProvider");
    }

    const { teamMembers, setTeamMembers } = context;

    useEffect(() => {
        fetchTeamMembers()
            .then(r => console.log('Team members fetched'));
    }, []);

    const fetchTeamMembers = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/team-members/');
            setTeamMembers(response.data);
        } catch (error) {
            console.error('Error fetching team members:', error);
        }
    };

    return (
        <div className='card-container'>
            <div className='card-nav' onClick={() => navigate('/add')}>+</div>
            <div className='card-header'>
                <div className='title-text'>Team Members</div>
                <div className='sub-text'>You have {teamMembers.length} team members</div>
                <br />
                <br />
            </div>
            {teamMembers.map(member => (
                <div className='card-list' key={member.id}>
                    <div className='card-item' onClick={() => navigate(`/edit/${member.id}`)}>
                        <img className='avatar' src={member.avatar_url} alt={member.first_name} />
                        <div className='card-info'>
                            {member.role === 'admin' ? (
                                <div className='main-text'>{member.first_name} {member.last_name} ({member.role})</div>
                            ) : (
                                <div className='main-text'>{member.first_name} {member.last_name}</div>
                            )}
                            <div className={'sub-text'}>{member.phone_number}</div>
                            <div className='sub-text'>{member.email}</div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ListPage;
