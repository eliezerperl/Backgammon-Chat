function getSavedEmails(email: string) {

    const localEmails: string | null = localStorage.getItem("loginEmails");

    if (localEmails){
        const listOfEmails: string[] = JSON.parse(localEmails);
        if (!listOfEmails.includes(email)){
            localStorage.setItem("loginEmails", JSON.stringify([...listOfEmails, email]));
            return;
        }
    }
    else {
        localStorage.setItem("loginEmails", JSON.stringify([email]));
        return;
    }
}

export default getSavedEmails;