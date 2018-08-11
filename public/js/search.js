"use strict"
window.onload = function () {

    const input = document.querySelector('#input');
    const options = document.querySelectorAll('.option');
    // clear input field on page reload
    (function clearInput() {
        input.value = '';
    })();

    // set default store API request option
    let store = 'walmart';

    // set a store option depending on user's choice
    function setStoreOption() {
        for (let i = 0; i < options.length; i++) {
            // change store option on click
            options[i].addEventListener('click', modifyOptionClass);
        }
    };
    setStoreOption();

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
            for (let option of options) {
                // remove event listeners from options
                option.removeEventListener('click', modifyOptionClass);
                // disable option buttons
                if (option.classList.contains('option-active')) {
                    option.classList.toggle('option-active');
                }
                option.classList.add('option-inactive');
            }
        } else {
            store = 'walmart';
            setStoreOption();
            options[0].classList.add('option-active');
            for (let option of options) {
                if (option.classList.contains('option-inactive')) {
                    option.classList.remove('option-inactive');
                }

            }
        }
    }

    function modifyOptionClass() {
        for (let option of options) {
            if (option.classList.contains('option-active')) {
                option.classList.toggle('option-active');
            }
        }
        this.classList.toggle('option-active');
        store = this.text.toLowerCase();
        console.log(store);
    }

    const searchBtn = document.querySelector('.search-btn');
    searchBtn.addEventListener('click', function (e) {
        e.preventDefault();
        // remove previous search results
        let walmartResults = document.querySelector('#walmart');
        let ebayResults = document.querySelector('#ebay');
        if (walmartResults.firstChild) {
            walmartResults.removeChild(walmartResults.firstChild);
        } else if (ebayResults.firstChild) {
            ebayResults.removeChild(ebayResults.firstChild);
        }
        // display loader
        toggleLoader();
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
                // remove loader
                toggleLoader();
                console.log(store);
                console.log(data);
                // display ebay results
                if (store === 'ebay') {
                    console.log('shouldnt run');
                    displayEbayResults(data);
                // display walmart results
                } else if (store === 'walmart') {
                    console.log('shouldnt run');
                    displayWalmartResults(data);
                // if option set to all
                // display results for all
                } else {
                    let walmartData = JSON.parse(data[0]);
                    let ebayData = JSON.parse(data[1]);
                    displayWalmartResults(walmartData);
                    displayEbayResults(ebayData);
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
            a.classList.add('result-item');
            a.setAttribute('href', element.productUrl);
            a.setAttribute('target', '_blank');
            li.appendChild(a);
            ul.appendChild(li);

            const imgDiv = document.createElement('div');
            const img = document.createElement('img');
            imgDiv.classList.add('result-img');
            img.setAttribute('src', element.largeImage);
            img.setAttribute('width', 100);
            img.setAttribute('height', 100);
            imgDiv.appendChild(img);
            a.appendChild(imgDiv);
            const div = document.createElement('div');
            div.classList.add('result-text');
            const h2 = document.createElement('h2');
            h2.classList.add('result-title');
            const titleText = document.createTextNode(element.name);
            h2.appendChild(titleText);
            div.appendChild(h2);
            a.appendChild(div);

            const p = document.createElement('p');
            p.classList.add('result-price');
            const priceText = document.createTextNode('Price: $' + element.salePrice + ' USD');
            p.appendChild(priceText);
            div.appendChild(p);
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
            a.classList.add('result-item');
            a.setAttribute('href', element.viewItemURL[0]);
            a.setAttribute('target', '_blank');
            li.appendChild(a);
            ul.appendChild(li);

            const imgDiv = document.createElement('div');
            const img = document.createElement('img');
            imgDiv.classList.add('result-img');
            img.setAttribute('src', element.galleryURL[0]);
            img.setAttribute('width', 100);
            img.setAttribute('height', 100);
            imgDiv.appendChild(img);
            a.appendChild(imgDiv);
            const div = document.createElement('div');
            div.classList.add('result-text');
            const h2 = document.createElement('h2');
            h2.classList.add('result-title');
            const titleText = document.createTextNode(element.title[0]);
            h2.appendChild(titleText);
            div.appendChild(h2);
            a.appendChild(div);

            const p = document.createElement('p');
            p.classList.add('result-price');
            const priceText = document.createTextNode('Price: $' + element.sellingStatus[0].currentPrice[0].__value__ + ' USD');
            p.appendChild(priceText);
            div.appendChild(p);
        })
    };

    // animate help button
    const menuIcon = document.querySelector('.tooltip-help');
    menuIcon.addEventListener('click', function () {
        const menuLines = document.querySelectorAll('.burg');
        const modal = document.querySelector('#help-modal');
        for (let line of menuLines) {
            if (line.classList.contains('animate') || line.classList.contains('reverse')) {
                line.classList.toggle('animate');
                line.classList.toggle('reverse');
            } else {
                line.classList.toggle('animate');
            }
        }
        modal.classList.toggle('modal-inactive');
        modal.classList.toggle('modal-active');
    });

    // display/remove loader
    function toggleLoader() {
        const loader = document.querySelector('.loader');
        loader.classList.toggle('loader-active');
    }
};