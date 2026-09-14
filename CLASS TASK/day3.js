// //*****************Asynchronous js using asynch/await*************/////
// async function test(){
//     console.log("2:message");
//     await console.log("3:message");
//     console.log("4:message");

// }
// console.log("1:message")
// test()
// console.log("5:message") 
//create promises that resolve with Assignment submitted
// and print using then(), reject with submission falied
//async function that display user data 
//class practice question:async function that display user data
//async function for data json data fetch
async function data() {
    await console.log("2:message");
    const response=fetch("./students.json");
    console.log(response.status);
    const std=await response.json();
    return std;
    await console.log("3:message");
    console.log("4:message");
}
console.log("1:message")
data()
    .then((std) => {
        console.log(res);
    }).catch((err) => {
        console.log(error);
    });