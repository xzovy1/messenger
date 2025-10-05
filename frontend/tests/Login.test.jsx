import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Login from "../src/Login.jsx";
import { BrowserRouter } from "react-router";
import userEvent from "@testing-library/user-event";

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router", async () => {
    const actual = await vi.importActual("react-router");
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

// Mock fetchDataPost
vi.mock("../src/helpers/fetchData", () => ({
    fetchDataPost: vi.fn(),
}));

import { fetchDataPost } from "../src/helpers/fetchData.js";

function setup() {
    return {
        user: userEvent.setup(),
        ...render(<Login />, { wrapper: BrowserRouter }),
    };
}

describe("Login component", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
    });

    it("renders login form", () => {
        setup();
        expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /log in/i })).toBeInTheDocument();
    });

    it("shows loading indicator when submitting", async () => {
        fetchDataPost.mockImplementation(() => new Promise(() => { })); // never resolves
        const { user } = setup();
        await user.type(screen.getByLabelText(/username/i), "testuser");
        await user.type(screen.getByLabelText(/password/i), "testpass");
        fireEvent.submit(screen.getByRole("form"))
        expect(await screen.findByText("Loading...")).toBeVisible();
    });

    it("navigates to /home and stores jwt on successful login", async () => {
        fetchDataPost.mockResolvedValue("fake-jwt-token");
        const { user } = setup();
        await user.type(screen.getByLabelText(/username/i), "testuser");
        await user.type(screen.getByLabelText(/password/i), "testpass");
        fireEvent.submit(screen.getByRole("form"));
        await waitFor(() => {
            expect(localStorage.getItem("jwt")).toBe("fake-jwt-token");
            expect(mockNavigate).toHaveBeenCalledWith("/home");
        });
    });

    it("shows error message on failed login", async () => {
        fetchDataPost.mockRejectedValue(new Error("HTTP error: Status 403"));
        const { user } = setup();
        await user.type(screen.getByLabelText(/username/i), "baduser");
        await user.type(screen.getByLabelText(/password/i), "badpass");
        fireEvent.submit(screen.getByRole("form"));
        expect(await screen.findByText(/incorrect username or password/i)).toBeInTheDocument();
    });

    it("shows generic error message for other errors", async () => {
        fetchDataPost.mockRejectedValue(new Error("Network error"));
        const { user } = setup();
        await user.type(screen.getByLabelText(/username/i), "baduser");
        await user.type(screen.getByLabelText(/password/i), "badpass");
        fireEvent.submit(screen.getByRole("form"));
        expect(await screen.findByText(/network error/i)).toBeInTheDocument();
    });
});