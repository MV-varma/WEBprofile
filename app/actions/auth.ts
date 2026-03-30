"use server"
import { redirect } from "next/navigation"
import { UserType } from "../_types/user"
import { deleteSession, setSession } from "../_lib/session"
import * as fs from "fs"
import * as path from "path"
import crypto from "crypto"

const dataPath = path.join(process.cwd(), "app/_data/contact.json")

function getUsers() {
    const data = fs.readFileSync(dataPath, "utf-8")
    const parsed = JSON.parse(data)
    return parsed.users || []
}

async function hashPassword(password: string, salt: string): Promise<string> {
    return new Promise((resolve, reject) => {
        crypto.pbkdf2(password, salt, 100000, 64, 'sha256', (err, derivedKey) => {
            if (err) reject(err);
            resolve(derivedKey.toString('hex'));
        });
    });
}

async function verifyPassword(password: string, hash: string, salt: string): Promise<boolean> {
    const hashedInput = await hashPassword(password, salt);
    return crypto.timingSafeEqual(Buffer.from(hashedInput, 'hex'), Buffer.from(hash, 'hex'));
}

export const loginAction = async (formData: FormData) => {
    const email = String(formData.get("email"))
    const password = String(formData.get("password"))
    
    try {
        const users = getUsers()
        const user = users.find((u: any) => u.email === email)
        const isMatch = user ? await verifyPassword(password, user.password, user.salt) : false
        
        if( !user || !isMatch){
            return { error: "Invalid credentials" }
        }
        
        
        //set user in cookie
        await setSession(user)
    } catch (error) {
        console.error("Login error:", error)
        return { error: error instanceof Error ? error.message : "Login failed" }
    }
    
    redirect("/Home")
}


export const signupAction = async (formData: FormData) => {
    const email = String(formData.get("email"))
    const password = String(formData.get("password"))
    const name = String(formData.get("name"))

    const salt = generateSalt()
    const hashedPassword = await hashPassword(password, salt)
    
    try {
        const users = getUsers()
        
        // Check if user already exists
        if(users.find((u: any) => u.email === email)){
            return { error: "Email already in use" }
        }
        
        // Create new user
        const newUser = {
            id: Math.max(...users.map((u: any) => u.id || 0), 0) + 1,
            name,
            email,
            password: hashedPassword,
            salt: salt,
            username: name.toLowerCase().replace(/\s/g, "_")
        }
        
        users.push(newUser)
        
        // Save to file
        const data = JSON.parse(fs.readFileSync(dataPath, "utf-8"))
        data.users = users
        fs.writeFileSync(dataPath, JSON.stringify(data, null, 2))
        
        //set user in cookie
        await setSession(newUser)
    } catch (error) {
        console.error("Signup error:", error)
        return { error: error instanceof Error ? error.message : "Signup failed" }
    }
    
    redirect("/Login")
}

const generateSalt = ()=> {
    return crypto.randomBytes(16).toString("hex").normalize()
}

export const logoutAction = async ()=>{
    await deleteSession()
    redirect("/Login")

}