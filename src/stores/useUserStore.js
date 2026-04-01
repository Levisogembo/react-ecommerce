import { create } from 'zustand'
import axios from '../lib/axios'
import { toast } from 'react-hot-toast'

export const useUserStore = create((set, get) => ({
    user: null,
    loading: false,
    checkingAuth: true,

    signup: async ({ lastName, firstName, email, password, confirmPassword }) => {
        set({ loading: false })
        if (password !== confirmPassword) {
            return toast.error("passwords do not match")
        }

        if(!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/i.test(password)){
            return toast.error("Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, 1 special character, and be at least 8 characters long")
        }
        //create graphql mutations
        const mutation = `
            mutation CreateUser($userInput: createUserInput!){
                createUser(userInput:$userInput){
                    userId
                    firstName
                    lastName
                    email
                }
            }
        `
        const variables = {
            userInput: { firstName, lastName, email, password, confirmPassword }
        }
        try {
            const res = await axios.post('', { query: mutation, variables })
            // GraphQL errors come back as 200 — manually throw them
            if (res.data.errors) {
                toast.error(res.data.errors[0].message)
            }
            //console.log(res.data);
            set({ user: res.data.data.createUser, loading: false })

        } catch (error) {
            set({ loading: false })
            //console.log("error obj", error);
            //alert(error)
            const message = error.errors?.[0]?.message || "Error in signup";
            toast.error(message)
        }
    }
}))