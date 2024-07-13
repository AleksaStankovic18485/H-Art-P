import React from 'react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useSettingsMutation } from '../../redux/api/usersApiSlice';
import { setCredentials } from '../../redux/features/login/loginSlice';
import './UserSettings.css';
import {useTranslation} from "react-i18next"

const UserSettings = () => {
    const [t] = useTranslation("global");
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');

    const { userInfo } = useSelector((state) => state.login);

    const [updateProfile, { isLoading: loadingUpdateProfile }] = useSettingsMutation();
    const [updatePassword, { isLoading: loadingUpdatePassword }] = useSettingsMutation();

    useEffect(() => {
        window.scrollTo(0, 100); 
    }, []);

    useEffect(() => {
        setFirstName(userInfo.firstName);
        setLastName(userInfo.lastName);
        setUserName(userInfo.userName);
        setEmail(userInfo.email);
    }, [userInfo]);

    const dispatch = useDispatch();

    const submitProfileHandler = async (e) => {
        e.preventDefault();
        try {
            const res = await updateProfile({
                _id: userInfo._id,
                firstName,
                lastName,
                email,
                userName                
            }).unwrap();
            dispatch(setCredentials({ ...res }));
            toast.success('Profile updated successfully');
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    };

    const submitPasswordHandler = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmNewPassword) {
            toast.error('New passwords do not match');
        } else {
            try {
                const res = await updatePassword({
                    _id: userInfo._id,
                    password: newPassword,
                }).unwrap();
                toast.success('Password updated successfully');
            } catch (err) {
                toast.error(err?.data?.message || err.error);
            }
        }
    };

    return (
        <div className="user-settings">
            <div className="user-settings-container">
                <div className="user-settings-form-container">
                    <h2>{t('update_profile')}</h2>
                    <form onSubmit={submitProfileHandler}>
                        <div>
                            <label>{t('first_name')}</label>
                            <input
                                type="text"
                                placeholder={t('enter_first_name')}
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                        </div>
                        <div>
                            <label>{t('last_name')}</label>
                            <input
                                type="text"
                                placeholder={t('enter_last_name')}
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                        </div>
                        <div>
                            <label>{t('username')}</label>
                            <input
                                type="text"
                                placeholder={t('enter_username')}
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                            />
                        </div>
                        <div>
                            <label>{t('email_address')}</label>
                            <input
                                type="email"
                                placeholder={t('enter_email')}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="user-settings-submit-container">
                            <button type="submit" disabled={loadingUpdateProfile}>
                                {loadingUpdateProfile?t('updating_profile'):t('update_profile')}
                            </button>
                        </div>
                    </form>
                </div>
                <div className="user-settings-form-container">
                    <h2>{t('update_password')}</h2>
                    <form onSubmit={submitPasswordHandler}>

                        <div>
                            <label>{t('new_password')}</label>
                            <input
                                type="password"
                                placeholder={t('enter_new_password')}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </div>
                        <div>
                            <label>{t('confirm_new_password')}</label>
                            <input
                                type="password"
                                placeholder={t('enter_confirm_password')}
                                value={confirmNewPassword}
                                onChange={(e) => setConfirmNewPassword(e.target.value)}
                            />
                        </div>
                        <div className="user-settings-submit-container">
                            <button type="submit" disabled={loadingUpdatePassword}>
                                {loadingUpdatePassword? t('updating_password') : t('update_password')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UserSettings;
