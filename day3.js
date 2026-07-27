//*****************Asynchronous js using asynch/await*************/////
async function test(){
    console.log("2:message");
    await console.log("3:message");
    console.log("4:message");

}
console.log("1:message")
test()
console.log("5:message") 


//create promises that resolve with Assignment submitted  */
// and print using then(), reject with submission falied