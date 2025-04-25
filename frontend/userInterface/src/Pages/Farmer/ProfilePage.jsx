// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { ToastContainer, toast } from 'react-toastify';
// import { FaCamera } from 'react-icons/fa';
// import '../../Styles/UserProfile.css';

// const UserProfile = () => {
//     const [profile, setProfile] = useState({
//         name: '',
//         email: '',
//         location: '',
//         mobile_number: '',
//         profile_image_url: '',
//     });
//     const [imagePreview, setImagePreview] = useState(null);
//     const [file, setFile] = useState(null);
//     const userID = localStorage.getItem('userID');
//     const baseURL = 'http://localhost:3000';

//     useEffect(() => {
//         if (userID) {
//             fetchProfile();
//         } else {
//             toast.error('User ID is missing.');
//         }
//     }, [userID]);

//     const fetchProfile = async () => {
//         try {
//             const res = await axios.get(`${baseURL}/farmer/profile/${userID}`);
//             setProfile(res.data.user);
//             setImagePreview(res.data.user.profile_image_url);
//         } catch (err) {
//             toast.error('Failed to load profile.');
//         }
//     };

//     const handleChange = (e) => {
//         const { name, value, files } = e.target;
//         if (name === 'profile_image') {
//             setFile(files[0]);
//             setImagePreview(URL.createObjectURL(files[0]));
//         } else {
//             setProfile({ ...profile, [name]: value });
//         }
//     };

//     const handleUpdate = async (e) => {
//         e.preventDefault();
//         const formData = new FormData();
//         for (const key in profile) {
//             formData.append(key, profile[key]);
//         }
//         if (file) {
//             formData.append('profile_image', file);
//         }

//         try {
//             await axios.put(`${baseURL}/farmer/updateProfile/${userID}`, formData);
//             toast.success('Profile updated successfully!');
//             fetchProfile();
//         } catch (err) {
//             toast.error('Failed to update profile.');
//         }
//     };

//     return (
//         <div className="user-profile-container modern-theme">
//             <ToastContainer />
//             <div className="profile-card">
//                 <div className="profile-header">
//                     <h2>My Profile</h2>
//                 </div>
//                 <form onSubmit={handleUpdate} className="profile-form">
//                     <div className="avatar-section">
//                         <div className="avatar-wrapper">
//                             <img
//                                 src={imagePreview ? `${baseURL}${imagePreview}` : '/default-avatar.png'}
//                                 alt="Profile"
//                                 className="profile-avatar"
//                             />
//                             <label htmlFor="upload-photo" className="upload-icon">
//                                 <FaCamera />
//                                 <input
//                                     type="file"
//                                     name="profile_image"
//                                     id="upload-photo"
//                                     onChange={handleChange}
//                                     accept="image/*"
//                                     hidden
//                                 />
//                             </label>
//                         </div>
//                     </div>

//                     <div className="input-group">
//                         <label>Name</label>
//                         <input type="text" name="name" value={profile.name} onChange={handleChange} required />
//                     </div>

//                     <div className="input-group">
//                         <label>Email</label>
//                         <input type="email" name="email" value={profile.email} onChange={handleChange} required />
//                     </div>

//                     <div className="input-group">
//                         <label>Location</label>
//                         <input type="text" name="location" value={profile.location} onChange={handleChange} />
//                     </div>

//                     <div className="input-group">
//                         <label>Mobile Number</label>
//                         <input type="text" name="mobile_number" value={profile.mobile_number} onChange={handleChange} />
//                     </div>

//                     <button type="submit" className="update-btn">Update Profile</button>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default UserProfile;


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { FaCamera, FaEdit } from 'react-icons/fa';
import '../../Styles/UserProfile.css';

const UserProfile = () => {
    const [profile, setProfile] = useState({
        name: '',
        email: '',
        location: '',
        mobile_number: '',
        profile_image_url: '',
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [file, setFile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const userID = localStorage.getItem('userID');
    const baseURL = 'http://localhost:3000';

    useEffect(() => {
        if (userID) {
            fetchProfile();
        } else {
            toast.error('User ID is missing.');
        }
    }, [userID]);

    const fetchProfile = async () => {
        try {
            const res = await axios.get(`${baseURL}/farmer/profile/${userID}`);
            setProfile(res.data.user);
            setImagePreview(res.data.user.profile_image_url);
        } catch (err) {
            toast.error('Failed to load profile.');
        }
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'profile_image') {
            setFile(files[0]);
            setImagePreview(URL.createObjectURL(files[0]));
        } else {
            setProfile({ ...profile, [name]: value });
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        for (const key in profile) {
            formData.append(key, profile[key]);
        }
        if (file) {
            formData.append('profile_image', file);
        }

        try {
            await axios.put(`${baseURL}/farmer/updateProfile/${userID}`, formData);
            toast.success('Profile updated successfully!');
            setIsEditing(false);
            fetchProfile();
        } catch (err) {
            toast.error('Failed to update profile.');
        }
    };

    const toggleEdit = () => {
        setIsEditing(!isEditing);
        if (file) {
            setFile(null);
            setImagePreview(profile.profile_image_url);
        }
    };

    return (
        <div className="user-profile-container">
            <ToastContainer />
            <div className="profile-card">
                <div className="profile-header">
                    <h2>My Profile</h2>
                    <button
                        type="button"
                        onClick={toggleEdit}
                        className="edit-toggle-btn"
                    >
                        <FaEdit /> {isEditing ? 'Cancel' : 'Edit Profile'}
                    </button>
                </div>
                <form onSubmit={handleUpdate} className="profile-form">
                    <div className="avatar-section">
                        <div className="avatar-wrapper">
                            <img
                                src={imagePreview ? `${baseURL}${imagePreview}` : '/default-avatar.png'}
                                alt="Profile"
                                className="profile-avatar"
                            />
                            {isEditing && (
                                <label htmlFor="upload-photo" className="upload-icon">
                                    <FaCamera />
                                    <input
                                        type="file"
                                        name="profile_image"
                                        id="upload-photo"
                                        onChange={handleChange}
                                        accept="image/*"
                                        hidden
                                    />
                                </label>
                            )}
                        </div>
                    </div>

                    <div className="input-row">
                        <div className="input-group">
                            <label>Name</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="name"
                                    value={profile.name}
                                    onChange={handleChange}
                                    required
                                />
                            ) : (
                                <p className="profile-value">{profile.name || 'Not set'}</p>
                            )}
                        </div>
                        <div className="input-group">
                            <label>Email</label>
                            {isEditing ? (
                                <input
                                    type="email"
                                    name="email"
                                    value={profile.email}
                                    onChange={handleChange}
                                    required
                                />
                            ) : (
                                <p className="profile-value">{profile.email || 'Not set'}</p>
                            )}
                        </div>
                    </div>

                    <div className="input-row">
                        <div className="input-group">
                            <label>Location</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="location"
                                    value={profile.location}
                                    onChange={handleChange}
                                />
                            ) : (
                                <p className="profile-value">{profile.location || 'Not set'}</p>
                            )}
                        </div>
                        <div className="input-group">
                            <label>Mobile Number</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="mobile_number"
                                    value={profile.mobile_number}
                                    onChange={handleChange}
                                />
                            ) : (
                                <p className="profile-value">{profile.mobile_number || 'Not set'}</p>
                            )}
                        </div>
                    </div>

                    {isEditing && (
                        <button type="submit" className="update-btn">Save Changes</button>
                    )}
                </form>
            </div>
        </div>
    );
};

export default UserProfile;