import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { BrowserRouter } from "react-router";
import userEvent from "@testing-library/user-event";
import HomeLayout from "../src/HomeLayout";
import { fetchDataPost, fetchDataGet } from "../src/helpers/fetchData";

vi.mock("../src/Profile", () => ({
    default: vi.fn(() => <h2>Profile</h2>)
}))
vi.mock("../src/MessagesList", () => ({
    default: vi.fn(() => <h2>Messages</h2>)
}))
vi.mock("../src/Contacts", () => ({
    default: vi.fn(() => <h2>Contacts</h2>)
}))
vi.mock("../src/Conversation", () => ({
    default: vi.fn(() => <h2>Conversation</h2>)
}))


vi.mock("../src/helpers/fetchData.js", () => ({
    fetchDataPost: vi.fn(),
    fetchDataGet: vi.fn(),
})
)
vi.mock("../src/Logout", () => ({
    default: vi.fn(() => <div><button>Log Out</button></div>)
})
)

describe("Home Layout", () => {
    beforeEach(() => {
        localStorage.clear();
        vi.clearAllMocks();
    })
    it("renders error page with no JWT in local storage", () => {
        render(<HomeLayout />)
        expect(screen.getByRole("heading", { name: "An error occurred" }))

    })
    it("renders profile and messages list", () => {

        fetchDataPost.mockResolvedValue("dummy-jwt");
        localStorage.setItem("jwt", "dummy-jwt")
        render(<HomeLayout />, { wrapper: BrowserRouter })
        expect(screen.getByRole("button", { name: "View Contacts" })).toBeVisible()
        expect(screen.getByRole("button", { name: "View Conversation" })).toBeVisible()

        expect(screen.getByRole("heading", { name: "Welcome," })).toBeVisible()
        expect(screen.getByRole("heading", { name: "Profile" })).toBeVisible()
        expect(screen.getByRole("heading", { name: "Messages" })).toBeVisible()
    })
    test("toggling 'View Contacts' displays contacts page then Profile", async () => {
        const user = userEvent.setup()
        fetchDataPost.mockResolvedValue("dummy-jwt");
        localStorage.setItem("jwt", "dummy-jwt")
        render(<HomeLayout />, { wrapper: BrowserRouter })

        const contactsButton = screen.getByRole("button", { name: "View Contacts" })
        await user.click(contactsButton);

        expect(screen.getByRole("heading", { name: "Contacts" })).toBeVisible()

        const profileButton = screen.getByRole("button", { name: "View Profile" });
        await user.click(profileButton);

        expect(screen.getByRole("heading", { name: "Profile" })).toBeVisible()
    })
    test("toggling 'View Conversation' displays conversation page then messages list", async () => {
        const user = userEvent.setup()
        fetchDataPost.mockResolvedValue("dummy-jwt");
        localStorage.setItem("jwt", "dummy-jwt")
        render(<HomeLayout />, { wrapper: BrowserRouter })

        const contactsButton = screen.getByRole("button", { name: "View Conversation" })
        await user.click(contactsButton);

        expect(screen.getByRole("heading", { name: "Conversation" })).toBeVisible()

        const profileButton = screen.getByRole("button", { name: "View Messages" });
        await user.click(profileButton);

        expect(screen.getByRole("heading", { name: "Messages" })).toBeVisible();
    })
})