"use strict"
window.onload = function () {

    let input = document.querySelector('#input');
    // clear input field on page reload
    (function clearInput() {
        input.value = '';
    })();

    // set default store API request option
    let store = 'walmart';

    // listen for screen changes
    if (matchMedia) {
        // get screen size 
        const mq = window.matchMedia("(min-width: 800px)");
        mq.addListener(widthChange);
        widthChange(mq);
    }
    // on screen width change, change default request option
    function widthChange(mq) {
        if (mq.matches) {
            store = 'all';
        } else {
            store = 'walmart';
        }
    }

    // set a store option depending on user's choice
    (function setStoreOption() {
        const options = document.querySelectorAll('.option');
        for (let i = 0; i < options.length; i++) {
            // change store option on click
            options[i].addEventListener('click', function (e) {
                e.preventDefault();
                store = this.text.toLowerCase();
                console.log(store);
            })
        }
    })();

    const searchBtn = document.querySelector('.search-btn');
    searchBtn.addEventListener('click', function (e) {
        e.preventDefault();
        // build a query from input
        let query = `/${store}?search=${input.value}`
        console.log(query);
        sendQuery(query);
    });

    // fetch a request to a given url
    // and receive a response
    function sendQuery(endPoint) {
        const request = new Request(endPoint, {
            headers: {
                "Content-Type": "application/json; charset=utf-8"
            }
        });

        fetch(request).then(function (res) {
                return res.json();
            })
            .then(function (data) {
                // console.log(data);
                if (store === 'all') {
                data.forEach(element => {
                    console.log(JSON.parse(element));
                });
            } else {

            }
            })
            .catch(err => console.log(err));
    }

    
};