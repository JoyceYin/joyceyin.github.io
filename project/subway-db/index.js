//Comment
// console.log('Hello World');

let name = 'JY';
console.log(name);

let interestRate=0.3;
interestRate = 1;
console.log(interestRate);

//Object
let person = {
	name:'JY',
	age:20
};

console.log(person);

//Dot Notation to change property
person.name='John';
console.log(person);

//Bracket Notation to cchange
person['name'] = 'Mary';
console.log(person);

//array
let selectedColors = ['red','blue'];
selectedColors[2] = 'green';
console.log(selectedColors);

selectedColors[3] = 1;
console.log(selectedColors);
console.log(selectedColors.length);

//Function
//do not need semicolon after function declaration
function greet(name, lastName) {
	console.log('Hello ' + name + ' ' + lastName);
}

greet('John','sth');
greet('Mary');

// calculating a value
function square(number) {
	return number*number;
}

let number = square(2);
console.log(number);