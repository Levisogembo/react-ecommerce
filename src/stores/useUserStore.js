import { create } from 'zustand'
import {graphqlInstance } from '../lib/axios'
import { toast } from 'react-hot-toast'

export const useUserStore = create((set, get) => ({
    user: null,
    token: null,
    loading: false,
    checkingAuth: true,

    signup: async ({ lastName, firstName, email, password, confirmPassword }) => {
        set({ loading: false })
        if (password !== confirmPassword) {
            return toast.error("passwords do not match")
        }

        if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/i.test(password)) {
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
            const res = await graphqlInstance.post('', { query: mutation, variables })
            // GraphQL errors come back as 200 — manually throw them
            if (res.data.errors) {
                toast.error(res.data.errors[0].message)
            }
            //console.log(res.data);
            set({ user: res.data.data.createUser, loading: false })
            toast.success("Account created successfully")

        } catch (error) {
            set({ loading: false })
            //console.log("error obj", error);
            //alert(error)
            const message = error.errors?.[0]?.message || "Error in signup";
            toast.error(message)
        }
    },

    login: async ({ email, password }) => {
        //console.log(email);

        set({ loading: true })
        //create graphql mutations
        const mutation = `
            mutation Login($loginInput: localInput!){
                login(loginInput: $loginInput)
            }
        `
        const variables = {
            loginInput: { email, password }
        }
        try {

            const res = await graphqlInstance.post('', { query: mutation, variables })
            // GraphQL errors come back as 200 — manually throw them
            if (res.data.errors) {
                toast.error(res.data.errors[0].message)
            }
            const token = res.data.data.login
            localStorage.setItem('token', token)

            //decode user token
            const decodedToken = JSON.parse(atob(token.split('.')[1]))
            //console.log(decodedToken);
            set({ user: decodedToken, token, loading: false })
            toast.success("Logged in successfully")


        } catch (error) {
            set({ loading: false })
            //console.log("error obj", error);
            //alert(error)
            const message = error.errors?.[0]?.message || "Error in login";
            //toast.error(message)
        }
    },

    checkAuth: async () => {
        const token = localStorage.getItem('token')
        if (!token) {
            set({ user: null, token: null, checkingAuth: false })
        }
        try {
            const decoded = JSON.parse(atob(token.split('.')[1]))
            const isExpired = decoded.exp * 1000 < Date.now()

            if (isExpired) {
                localStorage.removeItem('token')
                set({ user: null, token: null, checkingAuth: false })
                return
            }
            set({ user: decoded, token, checkingAuth: false })
        } catch (error) {
            localStorage.removeItem('token')
            set({ user: null, token: null, checkingAuth: false })
        }
    },

    logout: async () => {
        const mutation = `
            mutation Logout {
                logout {
                    success
                    message
                }
            }
        `
        try {
            const res = await graphqlInstance.post('', { query: mutation })
            if (res.data.errors) {
                toast.error(res.data.errors[0].message)
            }
            localStorage.removeItem('token')
            set({ user: null, token: null })
            toast.success("Logged out successfully")
        } catch (error) {
            const message = error.errors?.[0]?.message || "Error logging out";
            toast.error(message)
        }

    },

    googleRedirect: async () => {
        const params = new URLSearchParams(window.location.search)
        const token = params.get('token')

        if(!token) return

        localStorage.setItem('token',token)

        const decoded = JSON.parse(atob(token.split('.')[1]))
        set({user:decoded,token})

        //remove the token from the url
        window.history.replaceState({}, '', '/')

        toast.success('Logged in with google successfully')
    }

}))