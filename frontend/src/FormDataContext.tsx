import React, { createContext, useState, ReactNode } from 'react';

interface FormData {
    first_name: string;
    last_name: string;
    phone_number: string;
    email: string;
    role: string;
    username: string;
    avatar_url: string;
}

interface TeamMember extends FormData {
    id: number;
}

interface FormDataContextProps {
    formData: FormData;
    setFormData: React.Dispatch<React.SetStateAction<FormData>>;
    teamMembers: TeamMember[];
    setTeamMembers: React.Dispatch<React.SetStateAction<TeamMember[]>>;
}

const defaultFormData: FormData = {
    first_name: '',
    last_name: '',
    phone_number: '',
    email: '',
    role: '',
    username: '',
    avatar_url: ''
};

export const FormDataContext = createContext<FormDataContextProps | undefined>(undefined);

export const FormDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [formData, setFormData] = useState<FormData>(defaultFormData);
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

    return (
        <FormDataContext.Provider value={{ formData, setFormData, teamMembers, setTeamMembers }}>
            {children}
        </FormDataContext.Provider>
    );
};
