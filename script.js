// DOM Elements selection
const ageCalcForm = document.querySelector('form');
const inputContainers = document.querySelectorAll('.form-group');
const dayInput = document.getElementById('day');
const monthInput = document.getElementById('month');
const yearInput = document.getElementById('year');
const submitBtn = document.querySelector('form button');
const yearsScore = document.querySelector('.years .dashes');
const monthsScore = document.querySelector('.months .dashes');
const daysScore = document.querySelector('.days .dashes');

// Array of inputs elements to loop over
const inputs = [dayInput, monthInput, yearInput];

// Object containing inputs initial state
const inputsState = {
    day: true,
    month: true,
    year: true
};

// Prevent users from typing more characters than allowed by input maxLength or invalid characters
const charactersLimiter = inputEl => {
    const validCaracters = /[0-9]/;

    if (!validCaracters.test(inputEl.value)) {
        inputEl.value = '';
    }

    if (inputEl.value.length > inputEl.maxLength) {
        inputEl.value = inputEl.value.slice(0, inputEl.maxLength);
    }
};

inputs.forEach(input => input.addEventListener('input', () => charactersLimiter(input)));

// Remove elements and classes added to inputs parent element
const resetInputs = () => {
    inputContainers.forEach(container => {
        const errorMessageEl = container.querySelector('p');

        container.contains(errorMessageEl) && errorMessageEl.remove();

        container.classList.contains('error') && container.classList.remove('error');
    });
};

// Append p element and add classes to inputs parent element to show error messages
const showErrorMessage = (container, text) => {
    let errorMessageEl = container.querySelector('p');

    if (container.contains(errorMessageEl)) {
        errorMessageEl.textContent = text;
    } else {
        errorMessageEl = document.createElement('p');
        errorMessageEl.textContent = text;
        container.appendChild(errorMessageEl);
    }

    container.classList.add('error');
};

// Check empty inputs
const checkForEmptyInputs = () => {
    inputs.forEach((input, i) => {
        if (input.value  === '') {
            for (const [idx, key] of Object.keys(inputsState).entries()) {
                if (idx === i) {
                    inputsState[key] = false;
                }
            }

            showErrorMessage(input.parentElement, 'This field is required');
        }
    });
};

// Check invalid day and month inputs
const checkForInvalidDayMonth = () => {
    const standardMonths = ['04', '06', '09', '11'];

    if (+dayInput.value > 31) {
        showErrorMessage(dayInput.parentElement, 'Must be a valid day');
        inputsState.day = false;
    }

    if (+monthInput.value > 12) {
        showErrorMessage(monthInput.parentElement, 'Must be a valid month');
        inputsState.month = false;
    }

    for (let month = 0; month < standardMonths.length; month++) {
        if (monthInput.value === standardMonths[month] && +dayInput.value > 30) {
            showErrorMessage(dayInput.parentElement, 'Must be a valid day');
            inputsState.day = false;
            break;
        }
    }

    if (monthInput.value === '02' && +dayInput.value > 28) {
        showErrorMessage(dayInput.parentElement, 'Must be a valid day');
        inputsState.day = false;
        return;
    }
};

// Check invalid year input
const checkForInvalidYear = () => {
    if (+yearInput.value > 2177) {
        showErrorMessage(yearInput.parentElement, 'Must be a valid year');
        inputsState.year = false;
    }
};

// Validate whole form
const validateWholeForm = () => {
    // Convert values from inputsState object into an array,
    // then check if every array value is false
    const isFalse = Object.values(inputsState).every(state => state === false);

    if (isFalse) {
        resetInputs();
        showErrorMessage(dayInput.parentElement, 'Must be a valid date');
        inputContainers[1].classList.add('error');
        inputContainers[2].classList.add('error');
    }
};

// Animate Score Display
const animateScore = (input, el) => {
    // Convert values from inputsState object into an array,
    // then check if every array value is false
    const isTrue = Object.values(inputsState).every(state => state === true);

    if (isTrue) {
        let targetNumber = input.value;
        let currentNumber = 0;
        let animationStartTime;
    
        if (targetNumber.length === 4) {
            targetNumber = Number(targetNumber.split('').slice(-2).join(''));
        }
    
        const updateCounter = timestamp =>{
            if (!animationStartTime) {
                animationStartTime = timestamp;
            }
    
            const elapsedTime = timestamp - animationStartTime;
    
            if (elapsedTime >= 90) {
                currentNumber++;
    
                el.textContent = currentNumber < 10 ? `0${currentNumber}` : currentNumber;
    
                animationStartTime = timestamp;
            }
    
            if (currentNumber < targetNumber) {
                requestAnimationFrame(updateCounter);
            }
        }
    
        requestAnimationFrame(updateCounter);
    }
};

const checkForInvalidInputs = () => {
    checkForInvalidDayMonth();
    checkForInvalidYear();
};

const validateForm = () => {
    checkForEmptyInputs();
    checkForInvalidInputs();
    validateWholeForm();
};

const animateScores = () => {
    animateScore(dayInput, daysScore);
    animateScore(monthInput, monthsScore);
    animateScore(yearInput, yearsScore);
};

const ageDisplay = e => {
    e.preventDefault();
    resetInputs();
    validateForm();
    animateScores();
    inputsState.day = true;
    inputsState.month = true;
    inputsState.year = true;
};

ageCalcForm.addEventListener('submit', ageDisplay);