import { describe, it, expect, vi, beforeEach } from "vitest";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Contacts from "../src/Contacts";
import { fetchDataGet } from "../src/helpers/fetchData";

vi.mock("../src/helpers/fetchData", () => ({
    fetchDataGet: vi.fn(),
}));

const firstname = "Test";
const lastname = "User";
const username = "TestUser"
const createDummyContact = (id ,firstname, lastname, username)=>{
    return {
        id,
        username,
        profile: {
            firstname,
            lastname,
            image: "default-img",
        }
    }
}
let dummyContacts = []
describe("Contacts component", ()=>{
    beforeEach(()=>{
        dummyContacts = []
        global.fetch = vi.fn();
    })

    test("displays 'Loading Contacts...' when waiting for server", async() => {
        await act(async()=>{
            await fetchDataGet.mockResolvedValue( new Promise(() => {}))
            render(<Contacts />)
        })
        expect(screen.getByText(/Loading Contacts.../i)).toBeVisible();
    })
    test("displays contact showing first name last name and username", async () => {
        for(let i = 0; i < 1; i++){
            dummyContacts.push(createDummyContact(i, firstname, lastname, username + `${i}`))
        }
        await act(async()=>{
            await fetchDataGet.mockResolvedValue(dummyContacts)
            render(<Contacts />)
        })
        expect(screen.getByText(dummyContacts[0].profile.firstname + " " + dummyContacts[0].profile.lastname)).toBeVisible();
        expect(screen.getByText("@" + dummyContacts[0].username)).toBeVisible();
        
    })
    test("renders multiple contacts", async () => {
        for (let i = 0; i < 3; i++) {
            dummyContacts.push(createDummyContact(i, firstname, lastname, username + `${i}`));
        }
        await act(async () => {
            await fetchDataGet.mockResolvedValue(dummyContacts);
            render(<Contacts />);
        });
        dummyContacts.forEach(contact => {
            expect(screen.getByText(`@${contact.username}`)).toBeVisible();
        });
    });
    test("displays 'no contacts found' ", async () => {

        await act(async()=>{
            await fetchDataGet.mockResolvedValue(dummyContacts)
            render(<Contacts />)
        })
        expect(screen.getByText(/no contacts found/i)).toBeVisible();

    })
    test("renders profile image for each contact", async () => {
        dummyContacts.push(createDummyContact(1, firstname, lastname, username + "1"));
        await act(async () => {
            await fetchDataGet.mockResolvedValue(dummyContacts);
            render(<Contacts />);
        });
        const img = screen.getByAltText("profile image");
        expect(img).toBeVisible();
        expect(img).toHaveAttribute("src", "default-img");
    });
    test("displays error", async () => {
        const error = new Error("Network error");
        await act(async () => {
            await fetchDataGet.mockRejectedValue(error);
            render(<Contacts />);
        });
        expect(screen.getByText(/an error occurred/i)).toBeVisible();
        expect(screen.getByText(/network error/i)).toBeVisible();
    })
    test("clicking message calls createChat and updates conversation", async () => {
        dummyContacts.push(createDummyContact(1, firstname, lastname, username + "1"));
        const setRight = vi.fn();
        const setConversation = vi.fn();
        await act(async () => {
            await fetchDataGet.mockResolvedValue(dummyContacts);
            render(<Contacts setRight={setRight} setConversation={setConversation} />);
        });
        const messageButton = await screen.findByRole("button", { name: "Message" });
        expect(messageButton).toBeVisible();
        await userEvent.click(messageButton);
        // setRight should be called twice (true then false)
        expect(setRight).toHaveBeenCalledWith(true);
        expect(global.fetch).toHaveBeenCalledWith(
            expect.stringContaining("/api/chat/"),
            expect.objectContaining({
                method: "post",
                body: JSON.stringify({ recipientId: 1 }),
            })
        );

    });



})