class User {

    name?: string
    email: string
    password: string

    constructor(
        public e: string,
        public pass: string, 
        public n?: string, )
        {
            if (n){
                this.name = n;
            }
            this.email = e;
            this.password = pass
        }

}
export default User;