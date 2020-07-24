import '../styles/index.scss';

import { tarifs } from './constants';

let payments = [];
let payment = {};

const companies = document.getElementById('companies');
const totalSum = document.getElementById('total-sum');
const nodeList = document.querySelectorAll('#companies .left__company');
const savePaymentsCheck = document.querySelectorAll('form.right__payments input');
const formForPay = document.querySelector('form.right__payments');
const transactionsList = document.querySelector('ul.transactions__list');
const meters = document.getElementById('meters');
const previous = document.getElementById('previous');
const current = document.getElementById('current');
const currentOnDate = document.getElementById('payment');
const form = document.querySelector('.center__form');
const formSummaryList = document.querySelector('ul.form__summary-list');
const title = document.getElementById('payment_title');
const desc = document.getElementById('payment_desc');


window.onload = function() {
    try {
        getLocalStorage();
        payments.forEach((item) => {
            setTotalSum(item.total);
            setCheckbox(item.id);
            setTemplate(item);
        });
    } catch ({message}) {
        console.error(message);
    }
};

companies.onclick = (event) => {
    clearField();

    nodeList.forEach((item) => {
        item.removeAttribute('style');
    });

    const id = event.target.getAttribute('data-id');
    const element = document.querySelector(`[data-id=${id}]`);
    element.style = "background-color: #ccc;";
    title.innerText = event.target.innerText;
    payment.id = id;
};

meters.onchange = (event) => {
    const { value } = event.target;
    payment.meterId = value;
};

previous.oninput = (event) => {
    const { value } = event.target;
    payment.previous = value;
};

current.oninput = (event) => {
    const { value } = event.target;
    payment.current = value;
};

currentOnDate.oninput = (event) => {
    const { value } = event.target;
    payment.currentOnDate = value;
};

form.onsubmit = (e) => {
    e.preventDefault();

    try {
        savePayment();
        setTotalSum(payment.total);
        setCheckbox(payment.id);
        clearField();
        setLocalStorage();
    } catch ({message}) {
        console.error(message);
    }
};

formForPay.onsubmit = (e) => {
    e.preventDefault();
    let template = '';

    payments.forEach((item) => {
        console.log(`${ item.id } оплачено`);
        template += `<li class="list__item">${ upperCaseFirst(item.id) }: Successful payment</li>`;
    });

    setTimeout(function () {
        transactionsList.insertAdjacentHTML('afterbegin', template);
        clearAll();
    }, 1000);

};

form.onreset = (e) => {
    e.preventDefault();
    clearAll();
};

const clearField = () => {
    payment = {};
    meters.value = '';
    previous.value = '';
    current.value = '';
    currentOnDate.value = '';

    nodeList.forEach((item) => {
        item.removeAttribute('style');
    });
};

const clearAll = () => {
    clearCheckbox();
    clearField();

    const list = document.querySelectorAll('ul.form__summary-list li:not(.list__total)');
    list.forEach((item) => {
        item.remove();
    });

    payments = [];
    totalSum.innerText = '0.00';
    localStorage.removeItem('payments');
};

const setCheckbox = (id) => {
    const element = document.querySelector(`[data-name=${id}]`);
    element.setAttribute('checked', 'checked');
};

const clearCheckbox = () => {
    savePaymentsCheck.forEach((item) => {
        item.removeAttribute('checked');
    });
};

const setTotalSum = (total) => {
    if(!total) {
        throw new Error('Param total is required');
    }

    let sum = Number(totalSum.innerText);
    sum = sum + total;
    totalSum.innerText = sum.toFixed(2);
};

const savePayment = () => {
    const { current,  previous, id } = payment;

    if(!id) {
        throw new Error('Fill Available payment');
    }

    if(!previous) {
        throw new Error('Fill previous meter');
    }

    if(!current) {
        throw new Error('Fill current meter');
    }

    if(!meters.value) {
        throw new Error('Select meter');
    }

    payment.total = (current - previous) * tarifs[id];
    payments.push(payment);

    setTemplate(payment);
};

const upperCaseFirst = (str) => {
    if(typeof str === 'string' ) {
        return str[0].toUpperCase() + str.slice(1);
    }

    return `Param ${str} should be a string`;
};

const setLocalStorage = () => {
    localStorage.setItem("payments", JSON.stringify(payments));
};

const getLocalStorage = () => {
    const store = localStorage.getItem('payments');
    payments = store ? JSON.parse(store) : [];
};

const setTemplate = (payment) => {
    const template =
        `<li class="list__item">
            <p><span class="list__item-label">${ payment.meterId }</span>
              <span class="price">$ <b>${ payment.total }</b></span>
            </p>
        </li>`;

    formSummaryList.insertAdjacentHTML('afterbegin', template);
};
