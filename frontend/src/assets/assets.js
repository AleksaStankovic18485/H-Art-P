import hero_bg1 from './hero_imgs/hero_bg1.jpg'
import hero_bg2 from './hero_imgs/hero_bg2.jpg'
import hero_bg3 from './hero_imgs/hero_bg3.jpg'
import hero_bg4 from './hero_imgs/hero_bg4.jpg'
import category_1 from './category_imgs/rsz_category_1.jpg'
import category_2 from './category_imgs/rsz_category_2.jpg'
import category_3 from './category_imgs/rsz_category_3.jpg'
import category_4 from './category_imgs/rsz_category_4.jpg'
import category_5 from './category_imgs/rsz_category_5.jpg'
import category_6 from './category_imgs/rsz_category_6.jpg'
import category_7 from './category_imgs/rsz_category_7.jpg'
import auctions_img1 from './auctions_imgs/auctions_img1.jpg'
import auctions_img2 from './auctions_imgs/auctions_img2.jpg'
import auctions_img3 from './auctions_imgs/auctions_img3.jpg'
import auctions_img4 from './auctions_imgs/auctions_img4.jpg'
import auctions_img5 from './auctions_imgs/auctions_img5.jpg'
import auctions_img6 from './auctions_imgs/auctions_img6.jpg'
import auctions_img7 from './auctions_imgs/auctions_img7.jpg'
import auctions_img8 from './auctions_imgs/auctions_img8.jpg'
import auctions_img9 from './auctions_imgs/auctions_img9.jpg'
import auctions_img10 from './auctions_imgs/auctions_img10.jpg'
import auctions_img11 from './auctions_imgs/auctions_img11.jpg'
import auctions_img12 from './auctions_imgs/auctions_img12.jpg'
import auctions_img13 from './auctions_imgs/auctions_img13.jpg'

import right_arrow from './right_arrow.png'
import cross_icon from './cross_icon.png'
import facebook_icon from './facebook_icon.png'
import twitter_icon from './twitter_icon.png'
import linkedin_icon from './linkedin_icon.png'
 


//niz za kategorije
export const assets = {
    hero_bg1,
    hero_bg2,
    hero_bg3,
    hero_bg4,
    right_arrow,
    cross_icon,
    facebook_icon,
    twitter_icon,
    linkedin_icon
}

export const category_list = [
    {
        category_name: "Painting",
        category_image: category_1
    },
    {
        category_name: "Cubism",
        category_image: category_2
    },
    {
        category_name: "Expressionism",
        category_image: category_3
    },
    {
        category_name: "Abstract",
        category_image: category_4
    },
    {
        category_name: "Sculpture",
        category_image: category_5
    },
    {
        category_name: "Ceramics",
        category_image: category_6
    },
    {
        category_name: "Handicrafts",
        category_image: category_7
    }
]

export const auctions_list = [
    {
        _id: "1",
        name: "Creepy Pie",
        image: auctions_img1,
        price: 1200,
        artist: "Michael Poopin",
        category: "Painting",
        subcategory: "Oil on Canvas",
        dimensions:"40 W x 50 H x 2 D cm",
        country:{
            name:"Bosnia",
            code: "ba"
        },
        auc_start: new Date(2024, 3, 20, 19, 0),
        auc_ends: new Date(2024, 4, 10, 19, 0)
    },
    {
        _id: "2",
        name: "Boston Crab",
        image: auctions_img2,
        price: 2400,
        artist: "Alabi McGadaffi",
        category: "Abstract",
        subcategory: "Oil on Canvas",
        dimensions:"40 W x 50 H x 2 D cm",
        country:{
            name:"Iran",
            code: "ir"
        },
        auc_start: new Date(2024, 3, 20, 17, 0),
        auc_ends: new Date(2024, 4, 12, 17, 0)
    }, {
        _id: "3",
        name: "Guillotine",
        image: auctions_img3,
        price: 1600,
        artist: "Napolenko Dokolenko",
        category: "Painting",
        subcategory: "Oil on Canvas",
        dimensions:"40 W x 50 H x 2 D cm",
        country:{
            name:"Serbia",
            code: "rs"
        },
        auc_start: new Date(2024, 3, 20, 18, 0),
        auc_ends: new Date(2024, 4, 16, 18, 0)
    },{
        _id: "4",
        name: "Blast",
        image: auctions_img4,
        price: 600,
        artist: "Lorema Ipsuma",
        category: "Abstract",
        subcategory: "Oil on Canvas",
        dimensions:"40 W x 50 H x 2 D cm",
        country:{
            name:"Israel",
            code: "il"
        },
        auc_start: new Date(2024, 3, 20, 18, 0),
        auc_ends: new Date(2024, 4, 14, 23, 0),
    },{
        _id: "5",
        name: "Zoi Zoi",
        image: auctions_img5,
        price: 3400,
        artist: "Angel Philipovson",
        category: "Expressionism",
        subcategory: "Oil on Canvas",
        dimensions:"40 W x 50 H x 2 D cm",
        country:{
            name:"Romania",
            code: "ro"
        },
        auc_start: new Date(2024, 3, 20, 18, 0),
        auc_ends: new Date(2024, 4, 15, 22, 0),
    },{
        _id: "6",
        name: "BlueRu",
        image: auctions_img6,
        price: 150,
        artist: "Dana Black",
        category: "Abstract",
        subcategory: "Oil on Canvas",
        dimensions:"40 W x 50 H x 2 D cm",
        country:{
            name:"United States",
            code: "us"
        },
        auc_start: new Date(2024, 3, 20, 18, 0),
        auc_ends: new Date(2024, 4, 11, 17, 0),
    },{
        _id: "7",
        name: "Venezia",
        image: auctions_img7,
        price: 2000,
        artist: "Pedro B. Morales",
        category: "Painting",
        subcategory: "Oil on Canvas",
        dimensions:"40 W x 50 H x 2 D cm",
        country:{
            name:"Spain",
            code: "es"
        },
        auc_start: new Date(2024, 3, 20, 18, 0),
        auc_ends: new Date(2024, 4, 10, 15, 0),
    },{
        _id: "8",
        name: "JockoXX",
        image: auctions_img8,
        price: 250,
        artist: "Chhavi Naidu",
        category: "Handicrafts",
        subcategory: "Ornamental stones",
        dimensions:"20 W x 30 H x 4 D cm",
        country:{
            name:"India",
            code: "in"
        },
        auc_start: new Date(2024, 3, 20, 18, 0),
        auc_ends: new Date(2024, 4, 10, 15, 25),
    },{
        _id: "9",
        name: "BorDom",
        image: auctions_img9,
        price: 450,
        artist: "Alabi McGadaffi",
        category: "Abstract",
        subcategory: "Oil on Canvas",
        dimensions:"40 W x 50 H x 2 D cm",
        country:{
            name:"Iran",
            code: "ir"
        },
        auc_start: new Date(2024, 3, 20, 18, 0),
        auc_ends: new Date(2024, 4, 12, 13, 0),
    },{
        _id: "10",
        name: "Carno Mask",
        image: auctions_img10,
        price: 180,
        artist: "Violet Bordun",
        category: "Handicrafts",
        subcategory: "Mask Making",
        dimensions:"10 W x 20 H x 2 D cm",
        country:{
            name:"Sweden",
            code: "se"
        },
        auc_start: new Date(2024, 3, 20, 18, 0),
        auc_ends: new Date(2024, 4, 12, 16, 0),
    },{
        _id: "11",
        name: "Platebo",
        image: auctions_img11,
        price: 30,
        artist: "Joe M. Diaz",
        category: "Ceramics",
        subcategory: "Plate making",
        dimensions:"10 W x 20 H x 2 D cm",
        country:{
            name:"United States",
            code: "us"
        },
        auc_start: new Date(2024, 3, 20, 18, 0),
        auc_ends: new Date(2024, 4, 14, 15, 0),
    },{
        _id: "12",
        name: "Hoblura",
        image: auctions_img12,
        price: 80,
        artist: "Ronnie M. Diaz",
        category: "Ceramics",
        subcategory: "Mug making",
        dimensions:"10 W x 8 H x 8 D cm",
        country:{
            name:"Mexico",
            code: "mx"
        },
        auc_start: new Date(2024, 3, 20, 18, 0),
        auc_ends: new Date(2024, 4, 9, 12, 0),
    },{
        _id: "13",
        name: "OM God",
        image: auctions_img13,
        price: 4500,
        artist: "Natar Hasbullros",
        category: "Sculpture",
        subcategory: "Divine Sculpture",
        dimensions:"50 W x 80 H x 34 D cm",
        country:{
            name:"Greece",
            code: "gr"
        },
        auc_start: new Date(2024, 3, 20, 18, 0),
        auc_ends: new Date(2024, 4, 15, 14, 0),
    }
]
    
