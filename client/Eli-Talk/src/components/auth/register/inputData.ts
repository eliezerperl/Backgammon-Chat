const inputs : any[] = [
    {
        id: 1,
        name: "name",
        type: "text",
        placeholder: "Name",
        errorMessage: "Name should be 3-16 characters and not have any speacial characters.",
        label: "Name",
        pattern: "^[A-Za-z0-9]{3,16}$",
        required: true
    },    {
        id: 2,
        name: "email",
        type: "email",
        placeholder: "Email",
        errorMessage: "Email needs to be valid.",
        label: "Email",
        pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$",
        required: true

    },    {
        id: 3,
        name: "password",
        type: "text",
        placeholder: "Password",
        errorMessage: "Password should be 8-20 characters, and should include 1 number, 1 letter and 1 special character",
        label: "Password",
        pattern: "^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}",
        required: true

    },    {
        id: 4,
        name: "comfirmPassword",
        type: "text",
        placeholder: "Comfirm Password",
        errorMessage: "Passwords don't match.",
        label: "Comfirm Password",
        pattern: "^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}",
        required: true

    }
]

export default inputs;