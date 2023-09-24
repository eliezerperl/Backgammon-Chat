function deleteLocalItem(name: string) {
    try {
        if (typeof sessionStorage !== 'undefined') {

          sessionStorage.removeItem(name);
          console.log(`Item "${name}" has been deleted from session storage.`);
        } else {
          console.error('Session storage is not supported by this browser.');
        }
      } catch (error) {
        console.error(`An error occurred while deleting item "${name}" from session storage: ${error}`);
      }
    }

export default deleteLocalItem;