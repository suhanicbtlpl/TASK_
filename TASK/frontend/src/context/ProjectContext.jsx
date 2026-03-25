import React, { createContext, useContext, useState, useEffect } from 'react';

const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {
    const [selectedProjectId, setSelectedProjectId] = useState(() => {
        return localStorage.getItem('selectedProjectId') || '';
    });

    useEffect(() => {
        if (selectedProjectId) {
            localStorage.setItem('selectedProjectId', selectedProjectId);
        } else {
            localStorage.removeItem('selectedProjectId');
        }
    }, [selectedProjectId]);

    const selectProject = (projectId) => {
        setSelectedProjectId(projectId);
    };

    const clearProject = () => {
        setSelectedProjectId('');
    };

    return (
        <ProjectContext.Provider value={{ selectedProjectId, selectProject, clearProject }}>
            {children}
        </ProjectContext.Provider>
    );
};

export const useProject = () => {
    const context = useContext(ProjectContext);
    if (!context) {
        throw new Error('useProject must be used within a ProjectProvider');
    }
    return context;
};
