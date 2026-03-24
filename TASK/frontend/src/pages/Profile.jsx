import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/api';

import ProfileHeader from '../components/profile/ProfileHeader';
import ProfileInfoForm from '../components/profile/ProfileInfoForm';
import SecurityForm from '../components/profile/SecurityForm';

const Profile = () => {
    const { user, setUser } = useAuth();
    const [loading, setLoading] = useState(false);
    
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        mobileNumber: user?.mobileNumber || '',
    });

    const [passwords, setPasswords] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const [preview, setPreview] = useState(user?.profilePhoto ? `http://localhost:5000${user.profilePhoto}` : null);
    const [file, setFile] = useState(null);

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        const data = new FormData();
        data.append('name', formData.name);
        data.append('mobileNumber', formData.mobileNumber);
        if (file) {
            data.append('profilePhoto', file);
        }

        try {
            const res = await authService.updateProfile(data);
            alert('Profile updated successfully');
            setUser(prev => ({ ...prev, ...res }));
            
            // Sync local storage
            const currentUser = JSON.parse(localStorage.getItem('user'));
            localStorage.setItem('user', JSON.stringify({ ...currentUser, name: res.name, profilePhoto: res.profilePhoto }));
        } catch (error) {
            alert(error.response?.data?.message || error.message || 'Update failed');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (passwords.newPassword !== passwords.confirmPassword) {
            return alert('Passwords do not match');
        }
        setLoading(true);
        try {
            await authService.changePassword({
                oldPassword: passwords.oldPassword,
                newPassword: passwords.newPassword
            });
            alert('Password changed successfully');
            setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            alert(error.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-12 animate-in fade-in duration-500">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Personal Profile</h1>
                <p className="text-slate-500">Manage your identity and security settings</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Sidebar */}
                <div className="md:col-span-1">
                    <ProfileHeader 
                        user={user} 
                        preview={preview} 
                        onPhotoChange={handlePhotoChange} 
                    />
                </div>

                {/* Forms */}
                <div className="md:col-span-2 space-y-6">
                    <ProfileInfoForm 
                        formData={formData} 
                        setFormData={setFormData}
                        onSubmit={handleProfileUpdate}
                        loading={loading}
                    />

                    <SecurityForm 
                        passwords={passwords}
                        setPasswords={setPasswords}
                        onSubmit={handlePasswordChange}
                        loading={loading}
                    />
                </div>
            </div>
        </div>
    );
};

export default Profile;
