let newName = await checkName()

// connect to server
 function getName() {
     return new Promise((resolve, reject) => {
         fetch(`/name`, {
             method: 'GET',
             headers: {
             'Content-Type': 'application/json'
             }
         })
         .then(response => {
           console.log(response);
           return response.json();})
         .then(data => {
             console.log('Name Success:', data);
             resolve(data)
         })
         .catch((error) => {
             console.error('Name Error:', error);
             resolve(error)
        })
    });
}


async function checkName() {
    let test = await getName()
    if (test.message) {
        return 
    }
}