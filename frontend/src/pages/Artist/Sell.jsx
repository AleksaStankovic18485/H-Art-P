import React,{useEffect} from 'react';
import './Sell.css';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    useCreateAuctionMutation,
    useUploadAuctionImageMutation,
} from '../../redux/api/auctionApiSlice';
import { toast } from "react-toastify";
import { useSelector } from 'react-redux';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ReactFlagsSelect from "react-flags-select";
import { getCode, getName } from 'country-list';

import {useTranslation} from "react-i18next"

const Sell = () => {

    useEffect(() => {
        window.scrollTo(0, 100); 
    }, []);

    const [t] = useTranslation("global");

    const {userInfo} = useSelector(state=>state.login);

    const [image, setImage] = useState("");
    const [name, setName] = useState("");
    
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("Painting");
    const [subcategory, setSubcategory] = useState("");
    const [dimensions, setDimensions] = useState("");
    const [country, setCountry] = useState("");
    const [aucEnds, setAucEnds] = useState(""); 
    const [imageUrl, setImageUrl] = useState(null);

    const navigate = useNavigate();

    const [uploadAuctionImage, {isLoading: loadingUploadImage}] = useUploadAuctionImageMutation();
    const [createAuction,{ isLoading: loadingCreateAuction }] = useCreateAuctionMutation();

    const categories = ['Painting', 'Cubism', 'Expressionism', 'Sculpture', 'Abstract', 'Handicrafts', 'Ceramics'];


    const handleSubmit = async (e) => {
        e.preventDefault();

        const currentDateTime = new Date().toISOString();
    
        if (new Date(aucEnds) <= new Date(currentDateTime)) {
            toast.error("Auction end time must be after the start time.");
            return;
        }

        console.log("Country:"+country)
    
        try {
            const auctionData = new FormData();
            auctionData.append("image", image);
            auctionData.append("name", name);
            auctionData.append("artist", userInfo._id);
            auctionData.append("price", price);
            auctionData.append("category", category);
            auctionData.append("subcategory", subcategory);
            auctionData.append("dimensions", dimensions);
            auctionData.append("country", country);
            auctionData.append("auc_start", currentDateTime);
            auctionData.append("auc_ends", aucEnds);

            const { data } = await createAuction(auctionData);

            if (data?.error) {
                toast.error("Auction create failed. Try Again.");
            } else {
                navigate("/");
            }
        } catch (error) {
            console.error(error);
            toast.error("Auction create failed. Try Again.");
        }
    };

    const uploadFileHandler = async (e) => {
        const formData = new FormData();
        formData.append("image", e.target.files[0]);

        try {
            const res = await uploadAuctionImage(formData).unwrap();
            toast.success(res.message);
            setImage(res.image);
            setImageUrl(res.image);
        } catch (error) {
            toast.error(error?.data?.message || error.error);
        }
    };

    return (
        <div className="sell">
            <div className="sell-container">
                
                <div className="sell-content">
                    <div className="sell-title">{t('create_auction')}</div>

                    {imageUrl && (
                        <div className="sell-image-preview">
                            <img
                                src={imageUrl}
                                alt="auction"
                                className="sell-preview-image"
                            />
                        </div>
                    )}

                    <div className="sell-upload-section">
                        <label className="sell-upload-label">
                            {image ? t('change_image') : loadingUploadImage? t('uploading') : t('upload_image')}
                            <input
                                type="file"
                                name="image"
                                accept="image/*"
                                onChange={uploadFileHandler}
                                className="hidden"
                            />
                        </label>
                    </div>

                    <div className="sell-form-section">
                        <div className="sell-form-row">
                            <div className="sell-form-group">
                                <label htmlFor="name">{t('name')}</label> <br />
                                <input
                                    type="text"
                                    className="sell-input"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <div className="sell-form-group">
                                <label htmlFor="price">{t('sell_price')}</label> <br />
                                <input
                                    type="number"
                                    className="sell-input"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="sell-form-row">
    
                            <div className="sell-form-group">
                                <label htmlFor="dimensions">{t('dimensions')}</label> <br />
                                <input
                                    type="text"
                                    className="sell-input"
                                    value={dimensions}
                                    onChange={(e) => setDimensions(e.target.value)}
                                   
                                />
                            </div>

                            <div className="sell-form-group">
                                <label htmlFor="country">{t('country')}</label> <br />
                                <ReactFlagsSelect
                                    selected={getCode(country)}
                                    onSelect={(code) => setCountry(getName(code))}
                                    searchable
                        
                                />
                            </div>
                    
                        </div>
                        <div className="sell-form-row">
                        <div className="sell-form-group">
                            <label htmlFor="aucEnds">{t('auction_ends')}</label>
                            <DatePicker
                                selected={aucEnds}
                                onChange={(date) => setAucEnds(date)}
                                showTimeSelect
                                dateFormat="Pp"
                                placeholderText={t('select_date')}
                                className="sell-input"
                            />
                        </div>
                        </div>

                        <div className="sell-form-row sell-category-section">
                        <div className="sell-form-group">
                        <label htmlFor="category" className="sell-category-label">
                        {t('category')}
                        </label>
                        <select
                            className="sell-category-select"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            {categories?.map((c, index) => (
                                <option key={index} value={c}>
                                    {c}
                                </option>
                            ))}
                        </select>
                        </div>
                        <div className='sell-form-group'>
                            <label htmlFor="subcategory">
                            {t('subcategory')}
                            </label>
                            <input
                                type="text"
                                className="sell-input"
                                value={subcategory}
                                onChange={(e) => setSubcategory(e.target.value)}
                            />
                            </div>
                        </div>
                        

                        <button
                            onClick={handleSubmit}
                            className="sell-submit-button"
                            disabled={loadingCreateAuction}
                        >
                            {t('submit')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sell;
