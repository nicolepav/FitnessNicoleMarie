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
    
		let fetched = await getName();
		console.log(fetched.message);	// the name
		let newname = fetched.message;

		let nameSpan = document.getElementById("username");
		nameSpan.textContent = newname + "!";

    if (test.message) {
        return 
    }

		return newname;
}