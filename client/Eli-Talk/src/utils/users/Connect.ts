async function Connect(token: string) {
    const res = await fetch("http://localhost:5555/getonline", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});
			if (!res.ok) {
				return new Error("Could not connect");
			}
            return await res.json();
}

export default Connect;