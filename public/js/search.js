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
                } else if (store === 'walmart') {
                    console.log(data);
                    displayWalmartResults(data);
                } else {
                    displayEbayResults(data);
                }
            })
            .catch(err => console.log(err));
    }

    function displayWalmartResults(data) {
        const resultDiv = document.querySelector('#walmart');
        const ul = document.createElement('ul');
        resultDiv.appendChild(ul);

        const walmartResults = data.items;
        walmartResults.forEach(function (element) {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.setAttribute('href', element.productUrl);
            li.appendChild(a);
            ul.appendChild(li);

            const img = document.createElement('img');
            img.setAttribute('src', element.imageEntities[0].thumbnailImage);
            a.appendChild(img);
            const h2 = document.createElement('h2');
            const titleText = document.createTextNode(element.name);
            h2.appendChild(titleText);
            a.appendChild(h2);

            const p = document.createElement('p');
            const priceText = document.createTextNode('Price: $' + element.salePrice + ' USD');
            p.appendChild(priceText);
            a.appendChild(p);
        });
    }

    function displayEbayResults(data) {
        const resultDiv = document.querySelector('#ebay');
        const ul = document.createElement('ul');
        resultDiv.appendChild(ul);

        const ebayResults = data.findItemsByKeywordsResponse[0].searchResult[0].item;
        console.log(ebayResults);
        ebayResults.forEach(function (element) {
            const li = document.createElement('li');
            const a = document.createElement('a');
            //a.setAttribute('href', element.productUrl);
            li.appendChild(a);
            ul.appendChild(li);

            const img = document.createElement('img');
            img.setAttribute('src', element.galleryURL[0]);
            li.appendChild(img);
            // const h2 = document.createElement('h2');
            // const titleText = document.createTextNode(element.name);
            // h2.appendChild(titleText);
            // li.appendChild(h2);

            // const p = document.createElement('p');
            // const priceText = document.createTextNode('Price: $' + element.salePrice + ' USD');
            // p.appendChild(priceText);
            // li.appendChild(p);
        })
    };
};