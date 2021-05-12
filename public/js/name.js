// keep this, it just calls the update function
let callFunc = await greetByName()

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


async function greetByName() {
    
		let fetched = await getName();
		console.log(fetched.message);	// the name
		let newname = fetched.message;

		let nameSpan = document.getElementById("username");
		nameSpan.textContent = newname + "!";

    if (fetched.message) {
        return 
    }

		return newname;
}