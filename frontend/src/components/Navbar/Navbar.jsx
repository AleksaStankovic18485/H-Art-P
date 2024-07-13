import React, { useState, useEffect } from 'react';
import './Navbar.css';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useLogoutMutation } from '../../redux/api/usersApiSlice';
import { logout } from '../../redux/features/login/loginSlice';
import { useTranslation } from 'react-i18next';
import { assets } from '../../assets/assets.js';

const Navbar = ({ type, setShowLogin }) => {
    const [t, i18n] = useTranslation("global");
    const { userInfo } = useSelector(state => state.login);
    const messages = [t("free_shipping"), t("available_now")];
    const [currentMessage, setCurrentMessage] = useState(0);
    const [navbarChange, setNavbarChange] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const dispatch = useDispatch();
    const [logoutApiCall] = useLogoutMutation();
    const location = useLocation();

    const handleChangeLanguage = (lang) => {
        i18n.changeLanguage(lang);
    };

    const logoutHandler = async () => {
        try {
            await logoutApiCall().unwrap();
            dispatch(logout());
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentMessage((prevMessage) => (prevMessage + 1) % messages.length);
        }, 3000);

        return () => clearInterval(intervalId);
    }, [messages.length]);

    useEffect(() => {
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        document.body.classList.toggle('popup-open', isMobileMenuOpen);
        return () => {
            document.body.classList.remove('popup-open');
        };
    }, [isMobileMenuOpen]);


    useEffect(() => {
        const hash = location.hash;
        if (hash) {
            const element = document.querySelector(hash);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }, [location]);

    const changeBackground = () => {
        if (type === '/' && window.scrollY > 200)
            setNavbarChange(true);
        else
            setNavbarChange(false);
    };
    window.addEventListener('scroll', changeBackground);

    const handleResize = () => {
        if (window.innerWidth > 768) { // ili granica koju želiš za desktop veličinu
            setIsMobileMenuOpen(false);
        }
    };

    const toggleMobileMenu = (callback) => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
        if (typeof callback === 'function') {
            callback();
        }
    };

    return (
        <div className={type === '/' ? '' : 'nothome'}>
            <div className="announcement-bar">
                {messages.map((message, index) => (
                    <p key={index} className={index === currentMessage ? 'active' : ''}>
                        {message}
                    </p>
                ))}
                <div className="change-language">
                    <span className={`flag-icon flag-icon-gb ${i18n.language === 'en' ? 'selected' : ''}`} onClick={() => handleChangeLanguage("en")}></span>
                    <span className={`flag-icon flag-icon-rs ${i18n.language === 'rs' ? 'selected' : ''}`} onClick={() => handleChangeLanguage("rs")}></span>
                </div>
            </div>
            <div className={navbarChange ? "navbar active" : "navbar"}>
                <div className="navbar-left">
                    {type === '/' ? <a href="#">{t("home")}</a> : <Link to='/'>{t("home")}</Link>}
                    <Link to='/collection'>{t("collection")}</Link>
                    {type === '/' ? <a href="#about">{t("about")}</a> : <Link to='/#about'>{t("about")}</Link>}
                </div>

                <div className='navbar-logo'>
                    {type === '/' ? <a className='logo' href="#">H-ART</a> : <Link to='/' className='logo'>H-ART</Link>}
                </div>

                <div className='navbar-right'>
                    {type === '/' ? <a href="#hot">{t("hot")}</a> : <Link to='/#hot'>{t("hot")}</Link>}
                    <a href="#footer">{t("contact")}</a>
                    {userInfo ? (
                        <>
                            <div className="navbar-dropdown-parent">
                                <a href="javascript:;">{userInfo.userName}</a>
                                <ul className='navbar-dropdown'>
                                    {userInfo.isAdmin && (
                                        <>
                                            <li>
                                                <Link to="/admin/userlist">{t("users")}</Link>
                                            </li>
                                            <li>
                                                <Link to="/admin/dashboard">{t("dashboard")}</Link>
                                            </li>
                                        </>
                                    )}
                                    <li>
                                        <Link to="/userprofile">{t("profile")}</Link>
                                    </li>
                                    {userInfo.isArtist && (
                                        <li>
                                            <Link to="/artist/sell">{t("sell")}</Link>
                                        </li>
                                    )}
                                    <li>
                                        <Link to="/orderlist">{t("orders")}</Link>
                                    </li>
                                    <li>
                                        <Link to="/usersettings">{t("settings")}</Link>
                                    </li>
                                    <li onClick={logoutHandler}>
                                        <a href="javascript:;">{t("logout")}</a>
                                    </li>
                                </ul>
                            </div>
                        </>
                    ) : <a href="javascript:;" onClick={() => setShowLogin(true)}>{t("account")}</a>}
                </div>

                <div className={`navbar-toggle ${isMobileMenuOpen ? 'open' : ''}`} onClick={toggleMobileMenu}>
                    ☰
                </div>
            </div>

            <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''} ${navbarChange ? 'active' : ''}`}>
                <div className='close-mobile-menu'>
                    <img onClick={toggleMobileMenu} src={assets.cross_icon} alt="" />

                </div>
                {type === '/' ? <a onClick={toggleMobileMenu} href="#">{t("home")}</a> : <Link to='/' onClick={toggleMobileMenu} >{t("home")}</Link>}
                <Link to="/collection" onClick={toggleMobileMenu}>{t("collection")}</Link>
                
                
                {userInfo ?
                    <>
                        <Link to="/userprofile" onClick={toggleMobileMenu}>{t("profile")}</Link>
                        {userInfo.isAdmin && (
                            <>
                                <Link to="/admin/userlist" onClick={toggleMobileMenu}>{t("users")}</Link>
                                <Link to="/admin/dashboard" onClick={toggleMobileMenu}>{t("dashboard")}</Link>
                            </>
                        )}

                        {userInfo.isArtist && (
                            <Link to="/artist/sell" onClick={toggleMobileMenu}>{t("sell")}</Link>
                        )}

                        <Link to="/orderlist" onClick={toggleMobileMenu}>{t("orders")}</Link>
                        <Link to="/usersettings" onClick={toggleMobileMenu}>{t("settings")}</Link>
                    </> :
                   
                    <></>
                }
                    {type === '/' ? <a href="#hot" onClick={toggleMobileMenu}>{t("hot")}</a> : <Link to='/#hot' onClick={toggleMobileMenu}>{t("hot")}</Link>}
                    {type === '/' ? <a href="#about" onClick={toggleMobileMenu}>{t("about")}</a> : <Link to='/#about' onClick={toggleMobileMenu}>{t("about")}</Link>}
                    <a href="#footer" onClick={toggleMobileMenu}>{t("contact")}</a> 
                {userInfo? <a href="javascript:;" onClick={logoutHandler}>{t("logout")}</a> :  <a href="javascript:;" onClick={() => toggleMobileMenu(() => setShowLogin(true))}>{t("account")}</a>}

            </div>
        </div>
    )
}

export default Navbar;
