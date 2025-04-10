import express from 'express';
export const register = async (req, res) => {
    express.send("Register endpoint");
}
export const login = async (req, res) => {
    express.send("Login endpoint");
}
export const logout = async (req, res) => {
    express.send("Logout endpoint");
}