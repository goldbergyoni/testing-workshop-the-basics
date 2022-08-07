let index=0;
const createEvent=(temperature,category)=>{
    return {
        temperature,
        name: `insert-to-db-test${index}`,
        color: "Green",
        weight: "80 gram",
        status: "active",
        category
    }
}
module.exports={
    createEvent
}