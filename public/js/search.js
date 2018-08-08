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
                for (let option of options) {
                    if (option.classList.contains('option-active')) {
                        option.classList.toggle('option-active');
                    }
                }
                this.classList.toggle('option-active');
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
                console.log(data);
                // display ebay results
                if (store === 'ebay') {
                    displayEbayResults(data);
                    // display walmart results
                } else if (store === 'walmart') {
                    displayWalmartResults(data);
                    // if option set to all
                    // display results for all
                } else {
                    displayWalmartResults(JSON.parse(data[0]));
                    displayEbayResults(JSON.parse(data[1]));
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
            a.setAttribute('href', element.viewItemURL[0]);
            li.appendChild(a);
            ul.appendChild(li);

            const img = document.createElement('img');
            img.setAttribute('src', element.galleryURL[0]);
            a.appendChild(img);
            const h2 = document.createElement('h2');
            const titleText = document.createTextNode(element.title[0]);
            h2.appendChild(titleText);
            a.appendChild(h2);

            const p = document.createElement('p');
            const priceText = document.createTextNode('Price: $' + element.sellingStatus[0].currentPrice[0].__value__ + ' USD');
            p.appendChild(priceText);
            a.appendChild(p);
        })
    };

    // animate help button
    const menuIcon = document.querySelector('.tooltip-help');
    menuIcon.addEventListener('click', function () {
        let menuLines = document.querySelectorAll('.burg');
        for (let line of menuLines) {
            if (line.classList.contains('animate') || line.classList.contains('reverse')) {
                line.classList.toggle('animate');
                line.classList.toggle('reverse');
            } else {
                line.classList.toggle('animate');
            }
        }
    });
};