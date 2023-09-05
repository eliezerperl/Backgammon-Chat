

async function registerUser(data : any) {
    const res = await fetch('http://127.0.0.1:5000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      if (!res.ok){
        throw new Error("User could not be created")
      }
      console.log("user created: ", JSON.stringify(data))
      return true;
    };


export default registerUser;