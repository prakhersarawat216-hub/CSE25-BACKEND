//call back function
function hello(n1,n2,callback) {
    console.log("hello world");
callback();
}

let a=10;
let b=20;
console.log(hello(a,b));
function sayHi() {
    console.log("callback function");

}
sayHi();
function sayHello() {
    console.log("callback function");
}
sayHello();