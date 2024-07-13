export const calculateTimeLeft = (endTime) => {
    const difference = new Date(endTime) - new Date();
    let timeLeft = {};

    if (difference > 0) {
        timeLeft = {
            total:difference,
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60)
        };
    }
    else{
        timeLeft = {
            total: 0 
        }   
        
    }

    return timeLeft;
};


export const formatTime = (value) => {
    return value < 10 ? `0${value}` : value;
};