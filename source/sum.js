const fs = require('fs');
const https = require('https');



//Second Task starting from clear_smaller.txt
const filepath = 'clear_smaller.txt';
const fileContents = fs.readFileSync(filepath, 'utf-8');

const digitRegex = /\d/g; // regular expression to match all digits
const digits = fileContents.match(digitRegex) || []; // get all digits from the file
const sum = digits.reduce((acc, curr) => acc + parseInt(curr), 0); // calculate the sum of all digits
console.log(`Sum of digits: ${sum}`);


//Third Task starting from clear_smaller.txt

const vowelRegex = /[aeiou]/gi; // regular expression to match all vowels
const vowelSounds = fileContents.match(vowelRegex) || []; // get all vowel sounds from the file
const vowelValues = {
    a: 2,
    e: 4,
    i: 8,
    o: 16,
    u: 32,
};
const vowelsum = vowelSounds.reduce((acc, curr) => acc + vowelValues[curr.toLowerCase()], 0); // calculate the sum of all vowel sounds
console.log(`Sum of vowel sounds: ${vowelsum}`);

//4th Task starting from clear_smaller.txt
//a
// Split the text into sentences
const sentences = fileContents.split(/[.!?]/);
// Calculate the sum of digits for each sentence
const sums = sentences.map((sentence) => {
    const digits = sentence.match(/\d/g);
    if (digits) {
        return digits.reduce((sum, digit) => sum + parseInt(digit), 0);
    } else {
        return 0;
    }
});
// Sort the sums in descending order and take the top 10
const largestSums = sums.sort((a, b) => b - a).slice(0, 10);
// Find the indices of the largest sums in the original array
const indices = largestSums.map((sum) => sums.indexOf(sum));
// Sort the largest sums in the order of their occurrence in the text and subtract the index
const sortedSums = largestSums.sort((a, b) => indices[largestSums.indexOf(a)] - indices[largestSums.indexOf(b)])
    .map((sum, i) => sum - i);
console.log(sortedSums);



//4th-B
const asciiChars = sortedSums.map((value) => String.fromCharCode(value));
console.log(asciiChars);


//4th-c
const options = {
    key: fs.readFileSync('./localhost.key'),
    cert: fs.readFileSync('./localhost.crt')
};

const server = https.createServer(options, (req, res) => {
    // Calculate the solution word
    const solutionWord = "y,w,k,j,B,6,#,,,";

    // Set the response headers
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Cache-Control', 'no-cache');

    // Set the response status code and body
    res.statusCode = 200;
    res.end(solutionWord);
});

// Start the server on port 443
server.listen(443, () => {
    console.log('Server listening on port 443');
});

