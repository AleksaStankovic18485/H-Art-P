import React from 'react'
import './About.css'
import {useTranslation} from "react-i18next"

const About = () => {

  const [t] = useTranslation("global");

  return (
    <div className='about' id='about'>
        <h1>{t('services_we_provide')}</h1>
        <p>{t('innovative')}</p>

        <div className='about-content-box'>
            <div className='about-card'>
                <i className='bx bx-bar-chart-alt bx-md'></i>
                <h2>{t('online_art')}</h2>
                <p>
                {t('aboutdesc1')}
                </p>
            </div>

            <div className='about-card'>
                <i className='bx bx-laptop bx-md'></i>
                <h2>{t('artist_showcasing')}</h2>
                <p>
                {t('aboutdesc2')}
                </p>
            </div>

            <div className='about-card'>
                <i className='bx bx-paint bx-md'></i>
                <h2>{t('collection_enrichment')}</h2>
                <p>
                {t('aboutdesc3')}
                </p>
            </div>

            <div className='about-card'>
                <i className='bx bx-mail-send bx-md'></i>
                <h2>{t('custom_bidding')}</h2>
                <p>
                {t('aboutdesc4')}
                </p>
            </div>

            <div className='about-card'>
                <i className='bx bx-bar-chart bx-md'></i>
                <h2>{t('secure_transactions')}</h2>
                <p>
                {t('aboutdesc5')}
                </p>
            </div>

            <div className='about-card'>
                <i className='bx bx-line-chart bx-md'></i>
                <h2>{t('fast_bidding')}</h2>
                <p>
                {t('aboutdesc6')}
                </p>
            </div>

        </div>
    </div>
  )
}

export default About

    