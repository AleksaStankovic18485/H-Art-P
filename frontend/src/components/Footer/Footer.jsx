import React from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'
import { Link } from 'react-router-dom'
import {useTranslation} from "react-i18next"

const Footer = ({ type }) => {
 const [t] = useTranslation("global");

    return (
        <div className='footer' id='footer'>
            <div className="footer-content">
                <div className="footer-content-left">
                    <h1 className='logo'>H-ART</h1>
                    <p>{t("footer_desc")}</p>
                        <div className="footer-social-icons">
                        <img src={assets.facebook_icon} alt="" />
                        <img src={assets.twitter_icon} alt="" />
                        <img src={assets.linkedin_icon} alt="" />
                    </div>
                </div>
                <div className="footer-content-center">
                    <h2>{t('company')}</h2>
                    <ul>
                        
                        <li>{type === '/' ? <a href="#">{t("home")}</a> : <Link to='/#hero'>{t("home")}</Link>}</li>
                        <li><Link to="collection">{t('collection')}</Link></li> 
                        <li>{type === '/' ? <a href="#hot">{t("hot")}</a> : <Link to='/#hot'>{t("hot")}</Link>}</li>
                        <li>{type === '/' ? <a href="#about">{t("about")}</a> : <Link to='/#about'>{t("about")}</Link>}</li>
                    </ul>

                </div>


                <div className="footer-content-right">
                    <h2>{t('get_in_touch')}</h2>
                    <ul>
                        <li>+1-212-456-7890</li>
                        <li>contact@hart.com</li>
                    </ul>

                </div>
            </div>
            <hr />
            <p className="footer-copyright">
                Copyright 2024 &copy; H-Art.com - {t("all_rights")}.
            </p>
        </div>
    )
}

export default Footer