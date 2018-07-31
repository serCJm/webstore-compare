"use strict"
window.onload = function() {
    const searchBtn = document.querySelector('.search-btn');
    searchBtn.addEventListener('click', function(e) {
        e.preventDefault();
        sendQuery('/walmart')
    });

    function sendQuery(endPoint) {
        fetch(endPoint).then(function(res) {
            return res.json();
        })
        .then(function(data) {
            console.log(data);
        })
        .catch(err => console.log(err));
    }
};