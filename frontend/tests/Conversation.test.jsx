import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import {fetchDataGet, fetchDataPost} from "../src/helpers/fetchData";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Conversation from "../src/Conversation";

describe("Conversation component", () => {

    vi.mock("../src/helpers/fetchData", () => ({
        fetchDataGet: vi.fn(),
    }))

    it("displays loading", async() => {
        fetchDataGet.mockResolvedValue(new Promise(()=>{})); 
        render(<Conversation conversation={{id: 1}} user={{username: "TestUser"}} messagesCount={null}/>)
        expect(screen.getByText(/loading/i)).toBeVisible()
    })
    it("displays no conversation message", () => {
        
        fetchDataGet.mockResolvedValue(new Promise(()=>{})); 
        render(<Conversation conversation={{}} user={{username: "TestUser"}} messagesCount={0}/>)
        expect(screen.getByText(/no conversation selected/i)).toBeVisible()
    })
    it("displays error message", async () => {
        await act(async() => {
            await fetchDataGet.mockRejectedValue(new Error("test error")); 
            render(<Conversation conversation={{id: 1}} user={{username: "TestUser"}} messagesCount={1}/>)
        })
        expect(screen.getByText(/test error/i)).toBeVisible()
    })
    it("displays no messages", async () => {
        await act(async () => {
            await fetchDataGet.mockResolvedValue({});
            render(<Conversation conversation={{id: 1, recipient: {username: "recipient"}, sender: {username: "sender"}}} user={{username: 'test'}} messagesCount={0}/>)
        })
        expect(screen.getByText(/no messages/i)).toBeVisible()
    })
    it("displays conversation", async () => {
        const user = {
            username: "testSender"
        }
        const conversation = {
            id: 1,
            recipient: "testRecipient",
            sender: user.username,
        }
        const messages = [
            {
                id: 0,
                body: "first message",
                sender: {
                    username: user.username
                },
                recipient: {
                    username: "testRecipient"
                }
            }, 
            {
                id: 1,
                body: "second message",
                sender: {
                    username: "testRecipient"
                },
                recipient: {
                    username: user.username
                }
            },
        ]
        await act(async() => {
            await fetchDataGet.mockResolvedValue(messages)
            render(<Conversation conversation={conversation} user={user} messagesCount={messages.length}/>)
        })

        expect(screen.getByText(/first message/i)).toBeVisible();
        expect(screen.getByText(/second message/i)).toBeVisible();
    })

})