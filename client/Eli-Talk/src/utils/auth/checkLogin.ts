import setLocalItem from "../sessionStorage/setLocalItem";

async function checkLogin(data : any) {
  try {
    const res = await fetch('http://127.0.0.1:5000/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });
        if (!res.ok){
          throw new Error("Did not login");
        }
        const userData = await res.json();
        setLocalItem('jwtToken', userData["token"])
        setLocalItem('Id', userData["id"])
        setLocalItem('Name', userData["name"])
        setLocalItem('Email', userData['email'])
        setLocalItem('Authenticated', 'true')
        setLocalItem('Connected', 'false')
        
        const rerouteRes = await fetch('http://127.0.0.1:5000/home', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${userData["token"]}`
          }
        })
        if (!rerouteRes.ok){
          throw new Error("Error rerouting to homepage")
        }
        else return true;
        
      } catch (error) {
        console.log(error)
        return false;
      }
      
    }
    
    export default checkLogin;
