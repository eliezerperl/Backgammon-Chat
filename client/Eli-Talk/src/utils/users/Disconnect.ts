async function Disconnect(token: string) {
    const res = await fetch("http://localhost:5555/getoffline", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});
			if (!res.ok) {
				return new Error("Could not disconnect");
			}
            return await res.json();
}

export default Disconnect;