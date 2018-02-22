const https = require('https');

const reservedWords = [
    'break',
    'case',
    'catch',
    'class',
    'const',
    'continue',
    'debugger',
    'default',
    'delete',
    'do',
    'else',
    'export',
    'extends',
    'finally',
    'for',
    'function',
    'if',
    'import',
    'in',
    'instanceof',
    'new',
    'return',
    'super',
    'switch',
    'this',
    'throw',
    'try',
    'typeof',
    'var',
    'void',
    'while',
    'with',
    'yield'
];
const punctuation = ',:.;{}()[]\'"=<>*/+-&^';
let reservedWordsCount = [];
let wordsCount = 0;
let symbolsCont = [];


function countWords(text) {
    text.split(/[\s*\.\,\;\+?!\#\|:\-\/\\\[\]\(\)\{\}$%&="'<>]/).map(function (k, v) {
        if (reservedWords.indexOf(k) >= 0) {
            if (reservedWordsCount.some((element) => element.word === k)) {
                reservedWordsCount.map((element) => {
                    if (element.word === k) {
                        element.count++;
                    }
                });
            } else {
                reservedWordsCount.push({
                    word: k,
                    count: 1
                });
            }
        }
        wordsCount++;
    });
}

function countSymbols(text) {
    for (let i = 0; i < text.length; i++) {
        if (symbolsCont.some((element) => element.symbol === text[i])) {
            symbolsCont.map((element) => {
                if (element.symbol === text[i]) {
                    element.count++;
                }
            });
        } else {
            symbolsCont.push({
                symbol: text[i],
                count: 1
            });
        }
    }
}

console.log('Getting file');
https.get('https://code.jquery.com/jquery-3.3.1.min.js', (res) => {
    res.setEncoding('utf8');
    let rawData = '';
    res.on('data', (chunk) => {
        rawData += chunk;
    });
    res.on('end', () => {
        console.log('File lenght', rawData.length);
        console.log('Counting words');
        countWords(rawData);
        reservedWordsCount = reservedWordsCount.sort(function(a, b) {
            if (a.count > b.count) {
                return -1;
            }
            if (a.count < b.count) {
                return 1;
            }
            return 0;
        }).map(function(element) {
            element.rate = element.count / wordsCount;
            return element;
        });
        console.log(reservedWordsCount);

        console.log('Counting symbols');
        countSymbols(rawData);
        symbolsCont = symbolsCont.sort(function(a, b) {
            if (a.count > b.count) {
                return -1;
            }
            if (a.count < b.count) {
                return 1;
            }
            return 0;
        }).map(function(element) {
            element.rate = element.count / rawData.length;
            return element;
        });
        console.log(symbolsCont);
    });

}).on('error', (e) => {
    console.error(e);
});