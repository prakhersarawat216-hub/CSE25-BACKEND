// function in javascript
// synchronous function
// console.log("basic java script function known as synchronous function");
// function hello() {
//     console.log("this js function");
// }
// hello();
// console.log("synchronous javascript");
//Asynchronous Javascript
//arrow function
//variable:var,let and const
//Syntax : () => {}
    const hello=() => {
        console.log("asynch function");
        setTimeout(() => {
            console.log("A");
        }, 2000);
    }
    hello();
    console.log("B");