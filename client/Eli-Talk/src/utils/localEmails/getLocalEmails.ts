function GetLocalEmails() {
    const emails: string | null = localStorage.getItem("loginEmails")
    if (emails) {
        return JSON.parse(emails);
    }
}

export default GetLocalEmails;