async function Connect(token: string) {
	try {
		const res = await fetch("http://localhost:5555/getonline", {
		  method: "POST",
		  headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		  },
		});
	
		if (!res.ok) {
		  // If the response status is not okay, throw an Error
		  throw new Error("Could not connect");
		}
	
		// If the response is okay, parse the JSON and return it
		return await res.json();
	  } catch (error) {
		// Handle any errors that occurred during the fetch or JSON parsing
		console.error("An error occurred:", error);
		throw error; // Re-throw the error to be handled by the caller if needed
	  }
	}

export default Connect;