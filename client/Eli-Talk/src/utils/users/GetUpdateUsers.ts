async function GetUpdateUsers(token: string)  {
    const res = await fetch("http://localhost:5555/home/allusers", {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!res.ok) {
        return new Error("Could not get all users");
    }
    return res.json();
};

export default GetUpdateUsers;