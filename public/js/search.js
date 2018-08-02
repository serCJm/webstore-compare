"use strict"
window.onload = function () {

    let input = document.querySelector('#input');
    // clear input field on page reload
    (function clearInput() {
        input.value = '';
    })();

    const searchBtn = document.querySelector('.search-btn');
    searchBtn.addEventListener('click', function (e) {
        e.preventDefault();
        // build a query from input
        let query = `/walmart?search=${input.value}`
        console.log(query);
        sendQuery(query);
    });

    // fetch a request to a given url
    // and receive a response
    function sendQuery(endPoint) {
        const request = new Request(endPoint, {headers: {
            "Content-Type": "application/json; charset=utf-8"
        }});

        fetch(request).then(function (res) {
                return res.json();
            })
            .then(function (data) {
                console.log(data);
            })
            .catch(err => console.log(err));
    }
};