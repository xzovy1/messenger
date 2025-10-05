import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "../src/App.jsx";
import Login from "../src/Login.jsx";
import { BrowserRouter, MemoryRouter, Routes, Route } from "react-router";
import userEvent from "@testing-library/user-event";


function setup(jsx) {
    return {
        user: userEvent.setup(),
        ...render(jsx, { wrapper: BrowserRouter })
    }
}

const mockNavigate = vi.fn();
vi.mock("react-router", async () => {
    const actual = await vi.importActual("react-router");
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});
describe('App component', () => {
    it("renders correct heading", () => {
        setup(<App />)
        expect(screen.getByRole("heading").textContent).toMatch(/Odin Messenger/i);
    });
    it("renders Login and Signup buttons", () => {
        setup(<App />)
        expect(screen.getByRole("button", { name: "Log in" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Sign up" })).toBeInTheDocument()
    })
    test("calls login", async () => {
        const { user } = setup(<App />)
        const button = screen.getByRole("button", { name: "Log in" })
        await user.click(button);
        expect(mockNavigate).toBeCalledTimes(1);
        expect(mockNavigate).toHaveBeenCalledWith("/auth/log-in")
    })
    test("calls signup", async () => {
        const { user } = setup(<App />)
        const button = screen.getByRole("button", { name: "Sign up" })
        await user.click(button);
        expect(mockNavigate).toBeCalledTimes(2);
        expect(mockNavigate).toHaveBeenCalledWith("/auth/sign-up")
    })
})
