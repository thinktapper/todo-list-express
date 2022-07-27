// assigning elements from html to variables to interact with
const deleteBtn = document.querySelectorAll('.fa-trash')
const item = document.querySelectorAll('.item span')
const itemCompleted = document.querySelectorAll('.item span.completed')

// adding event listeners to all of the delete buttons
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})
// adding event listeners to all of the items that are incomplete
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})
// adding event listeners to all of the items that are complete
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})

// Send a request to delete an item
async function deleteItem(){
    // Assign which item to be deleted to a variable
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        // Fetch request with item information for deletion
        const response = await fetch('deleteItem', {
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
        // Assign response from server to data variable
        const data = await response.json()
        console.log(data)
        // Refreshes the page after receiving a response
        location.reload()

    }catch(err){
        console.log(err)
    }
}

// Make a put request for marking an item complete
async function markComplete(){
    // Determine item to mark complete
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        // Send request to server with the item selected for completion
        const response = await fetch('markComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        // Receives response from server
        const data = await response.json()
        console.log(data)
        // Refreshes the page after receiving a response
        location.reload()

    }catch(err){
        console.log(err)
    }
}

// Make a put request for marking an item incomplete
async function markUnComplete(){
    // Determine item to mark incomplete
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        // Send request to server with the item selected for incompletion
        const response = await fetch('markUnComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        // Receives response from server
        const data = await response.json()
        console.log(data)
        // Refreshes the page after receiving a response
        location.reload()

    }catch(err){
        console.log(err)
    }
}