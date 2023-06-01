module.exports = function getFormattedDate(date) {
    let day = date.getDate();
    day = day < 10 ? '0' + day.toString() : day.toString();
    let month = date.getMonth() + 1;
    month = month < 10 ? '0' + month.toString() : month.toString();
    let year = date.getFullYear();

    let hours = date.getHours();
    hours = hours < 10 ? '0' + hours.toString() : hours.toString();
    let minutes = date.getMinutes();
    minutes = minutes < 10 ? '0' + minutes.toString() : minutes.toString();

    const formattedDate = `${day}-${month}-${year} | ${hours}:${minutes}`;
    return formattedDate;
}