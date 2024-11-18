async function registerUser(data: any) {
  const res = await fetch(`${import.meta.env.VITE_AUTH_SERVER_BASE_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error('User could not be created');
  }
  console.log('user created: ', JSON.stringify(data));
  return true;
}

export default registerUser;
