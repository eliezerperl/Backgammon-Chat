async function Disconnect(token: string) {
    try {
		const res = await fetch("http://localhost:5555/getoffline", {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${token}`,
						},
					});
					if (!res.ok) {
						throw new Error("Could not disconnect");
					}
		            return await res.json();
	} catch (error) {
		console.error("An error occurred:", error);
		throw error;
	}
}

export default Disconnect;