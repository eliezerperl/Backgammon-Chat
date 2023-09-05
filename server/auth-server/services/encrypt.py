import bcrypt

def encrpt_pass(password):
    hashed = bcrypt.hashpw(password, bcrypt.gensalt())
    return hashed

def check_pass(originalPassword, hashedPass):
    return bcrypt.checkpw(originalPassword, hashedPass)