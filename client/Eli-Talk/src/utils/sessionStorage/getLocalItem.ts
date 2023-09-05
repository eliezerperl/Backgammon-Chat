function getLocalItem(name: string) {

  const item = sessionStorage.getItem(name);
  return item
    
  }

export default getLocalItem;