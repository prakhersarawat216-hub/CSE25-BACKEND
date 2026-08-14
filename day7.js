import fs from "fs/promises"
const filename="student.txt";
async function createFile(){
try{
    await fs.writeFile(
        filename,
        "Name: Prakher sarawat\nEmail:prakhersarawat216@gmail.com,Bteach,CSE"
    );
    console.log("file created...");
}
catch(error){
    console.log("ERROR");
}
}