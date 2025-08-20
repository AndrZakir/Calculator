/* eslint-env browser, es2021 */
/* eslint "prettier/prettier": ["error", {
    "singleQuote": true,
    "semi": true,
    "trailingComma": "es5",
    "tabWidth": 4
}] */

// const path = require('path');
// const HtmlWebpackPlugin = require('html-webpack-plugin');
// const TerserPlugin = require('terser-webpack-plugin');

// module.exports = {
//     mode: 'production', // включает оптимизации по умолчанию
//     entry: './main.js', // js файл
//     output: {
//         filename: 'bundle.[contenthash].js',
//         path: path.resolve(__dirname, 'dist'),
//         clean: true, // очистка dist перед сборкой
//     },
//     module: {
//         rules: [
//             {
//                 test: /\.js$/i,
//                 exclude: /node_modules/,
//                 use: ['babel-loader'],
//             },
//         ],
//     },
//     plugins: [
//         new HtmlWebpackPlugin({
//             template: './index.html',
//             minify: {
//                 collapseWhitespace: true,
//                 removeComments: true,
//                 removeRedundantAttributes: true,
//                 removeEmptyAttributes: true,
//                 minifyJS: true, // минифицирует встроенный js
//                 minifyCSS: true, // минифицирует встроенный css в html
//             },
//         }),
//     ],
//     optimization: {
//         minimize: true,
//         minimizer: [
//             new TerserPlugin({
//                 extractComments: false,
//                 terserOptions: {
//                     compress: {
//                         drop_console: true, // удаляет console.log
//                     },
//                 },
//             }),
//         ],
//     },
//     devtool: false, // без source map для максимальной оптимизации
// };

// Object values
const calculator = {
    displayValue: '0',
    firstOperand: null,
    waitingForSecondOperand: false,
    operator: null,
};

// Update Display
const updateDisplay = () => {
    const display = document.querySelector('.screen')
    display.value = calculator.displayValue;
};

updateDisplay();

// Light mode
const themeToggleBtn = document.querySelector('.theme-toggle');

themeToggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
});

// Keys pressing
const keys = document.querySelector('.buttons')
keys.addEventListener('click', (event) => {
    const {target} = event;
    if (!target.matches('button')) {
        return;
    }

    if (target.classList.contains('operator')) {
        handleOperator(target.value);
        updateDisplay();
        return;
    }

    if (target.classList.contains('decimal')) {
        inputDecimal(target.value);
        updateDisplay();
        return;
    }

    if(target.classList.contains('allClear')) {
        resetCalculator();
        updateDisplay();
        return;
    }

    if (target.classList.contains('percent')) {
        handlePercent(target.value);
        updateDisplay();
        return;
    }

    if (target.classList.contains('plusMinus')) {
        toggleSign();
        updateDisplay();
        return;
    }

    inputDigit(target.value);
    updateDisplay();
});


// Input digit
const inputDigit = (digit) => {
    const { displayValue, waitingForSecondOperand } = calculator;

    if (waitingForSecondOperand === true) {
        calculator.displayValue = digit;
        calculator.waitingForSecondOperand = false
    }   else {
        calculator.displayValue = displayValue === '0' ? digit : displayValue + digit;
    }
};

// Input Decimal
const inputDecimal = (dot) => {
    if (calculator.waitingForSecondOperand === true) {
        calculator.displayValue = '0.';
        calculator.waitingForSecondOperand = false;
        return;
    }
    if (!calculator.displayValue.includes(dot)) {
        calculator.displayValue += dot;
    }
};

// Handle Operator
const handleOperator = (nextOperator) => {
    const {firstOperand, displayValue, operator} = calculator;
    const inputValue = parseFloat(displayValue);

    if (operator && calculator.waitingForSecondOperand) {
        calculator.operator = nextOperator;
        return;
    }
    if (firstOperand == null && !isNaN(inputValue)) {
        calculator.firstOperand = inputValue;
    } else if (operator) {
        const result = calculate (firstOperand, inputValue, operator)

        calculator.displayValue = `${parseFloat(result.toFixed(7))}`;
        calculator.firstOperand = result;
    }
    
    calculator.waitingForSecondOperand = true;
    calculator.operator = nextOperator;
};

// Handle Percent
const handlePercent = () => {
    const { firstOperand, displayValue, operator } = calculator;
    let inputValue = parseFloat(displayValue);

    if (isNaN(inputValue)) return;

    if (firstOperand !== null && operator) {
        inputValue = (firstOperand * inputValue) / 100;
    } else {
        inputValue = inputValue / 100;
    }

    calculator.displayValue = `${parseFloat(inputValue.toFixed(7))}`;
};

// Toggle Sign
const toggleSign = () => {
    if (calculator.displayValue === '0' || calculator.displayValue === 'Error') {
        return;
    }

    calculator.displayValue = (parseFloat(calculator.displayValue) * -1).toString();
};

// Calculation logic
const calculate = (firstOperand, secondOperand, operator) => {
    if (operator === '+') {
        return firstOperand + secondOperand;
    } else if (operator === '-') {
        return firstOperand - secondOperand;
    } else if (operator === '*') {
        return firstOperand * secondOperand;
    } else if (operator === '/') {
        if (secondOperand === '0') {
            return 'Error';
        }
        return firstOperand / secondOperand;
    }
    return secondOperand;
};


// Reset calculator
const resetCalculator = () => {
    calculator.displayValue = '0';
    calculator.firstOperand = null;
    calculator.waitingForSecondOperand = false;
    calculator.operator = null;
};