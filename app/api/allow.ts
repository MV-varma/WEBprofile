import axios from "axios"
import { ContactType } from "../_types/contact"

const API_URL = "http://localhost:3001"

export const getAllow = async (userID: string) => {
    const response =await axios.get(`${API_URL}/contact?userID=${userID}`)
    return response.data
}

export const createAllow = async (contact : ContactType) => {
    const response =await axios.post(`${API_URL}/contact`, contact)
    return response.data
}
 
export const updateAllow = async (email : string) => {
    const response =await axios.put(`${API_URL}/contact/${email}`)
    return response.data
}

export const deleteAllow = async (email : string) => {
    const response =await axios.delete(`${API_URL}/contact/${email}`)
    return response.data
}

