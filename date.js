// module.exports.getDate = getDate;
// module.exports.getDay = getDay;

exports.getDate = function(){
    const today = new Date();
    
    const options = {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour24: "true"
    }

    return today.toLocaleDateString("EN-UK", options);  
}

exports.getDay = function(){
    const today = new Date();
    
    const options = {
        weekday: "long"
    }

    return today.toLocaleDateString("EN-UK", options);
}