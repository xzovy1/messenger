import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { MessagesList } from "../src/MessagesList.jsx";
import { MessagePreview } from "../src/MessagesList.jsx";
import {fetchDataGet, fetchDataPost} from "../src/helpers/fetchData";
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../src/helpers/fetchData", () => ({
    fetchDataGet: vi.fn(),
    fetchDataPost: vi.fn()
}));

const mockSetConversation = vi.fn();
const mockSetRight = vi.fn();
const mockSetMessagesCount = vi.fn();

const mockMessages = [
  {
    id: 1,
    users: [{ id: 2, username: "Alice" }],
    message: [
      { body: "Hello!", read: false, recipient_id: 3 }
    ]
  },
  {
    id: 2,
    users: [{ id: 3, username: "Bob" }],
    message: [
      { body: "Hi!", read: true, recipient_id: 2 }
    ]
  }
];

describe("MessagesList", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading state initially", async () => {
    fetchDataGet.mockReturnValue(new Promise(() => {}));
    render(
      <MessagesList
        setConversation={mockSetConversation}
        setRight={mockSetRight}
        messagesCount={0}
        setMessagesCount={mockSetMessagesCount}
      />
    );
    expect(screen.getByText(/Loading messages/i)).toBeInTheDocument();
  });

  it("renders error state", async () => {
    fetchDataGet.mockRejectedValue(new Error("Network error"));
    render(
      <MessagesList
        setConversation={mockSetConversation}
        setRight={mockSetRight}
        messagesCount={0}
        setMessagesCount={mockSetMessagesCount}
      />
    );
    await waitFor(() =>
      expect(screen.getByText(/An error occurred: Network error/i)).toBeInTheDocument()
    );
  });

  it("renders no messages", async () => {
    fetchDataGet.mockResolvedValue([]);
    render(
      <MessagesList
        setConversation={mockSetConversation}
        setRight={mockSetRight}
        messagesCount={0}
        setMessagesCount={mockSetMessagesCount}
      />
    );
    await waitFor(() =>
      expect(screen.getByText(/No messages/i)).toBeInTheDocument()
    );
    expect(
      screen.getByText(/To start a conversation, go to contacts/i)
    ).toBeInTheDocument();
  });

  it("renders messages and MessagePreview", async () => {
    fetchDataGet.mockResolvedValue(mockMessages);
    render(
      <MessagesList
        setConversation={mockSetConversation}
        setRight={mockSetRight}
        messagesCount={2}
        setMessagesCount={mockSetMessagesCount}
      />
    );
    await waitFor(() =>
      expect(screen.getByText("Messages")).toBeInTheDocument()
    );
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
    expect(screen.getByText("Hello!")).toBeInTheDocument();
    expect(screen.getByText("Hi!")).toBeInTheDocument();
  });

  it("calls openMessage when Open button is clicked", async () => {
    fetchDataGet.mockResolvedValue(mockMessages);
    render(
      <MessagesList
        setConversation={mockSetConversation}
        setRight={mockSetRight}
        messagesCount={2}
        setMessagesCount={mockSetMessagesCount}
      />
    );
    await waitFor(() => screen.getAllByText("Open"));
    fireEvent.click(screen.getAllByText("Open")[0]);
    expect(mockSetConversation).toHaveBeenCalledWith({
      id: 1,
      recipient: { id: 2, username: "Alice" },
    });
    expect(mockSetRight).toHaveBeenCalledWith(true);
  });

  it("calls deleteMessage and setMessagesCount when Delete button is clicked", async () => {
    fetchDataGet.mockResolvedValue(mockMessages);
    fetchDataPost.mockResolvedValue({});
    render(
      <MessagesList
        setConversation={mockSetConversation}
        setRight={mockSetRight}
        messagesCount={2}
        setMessagesCount={mockSetMessagesCount}
      />
    );
    await waitFor(() => screen.getAllByText("Delete"));
    fireEvent.click(screen.getAllByText("Delete")[0]);
    await waitFor(() =>
      expect(fetchDataPost).toHaveBeenCalledWith(
        "http://127.0.0.1:8000/api/chat/1",
        "delete",
        JSON.stringify({ id: 1 })
      )
    );
    expect(mockSetMessagesCount).toHaveBeenCalled();
  });

  it("MessagePreview shows italic for unread message not sent by recipient", async() => {
    await act(async() => {

        render(
            <MessagesList
            setConversation={mockSetConversation}
            setRight={mockSetRight}
            messagesCount={1}
            setMessagesCount={mockSetMessagesCount}
            />
        );
         render(
            <MessagePreview
            message={{ body: "Test", read: false, recipient_id: 3 }}
            recipient={2}
            />
        );
    })
    expect(screen.getByText("Test").tagName).toBe("I");
  });

  it("MessagePreview shows plain text for read message", () => {
    const { getByText } = render(
      <MessagePreview
        message={{ body: "Read", read: true, recipient_id: 2 }}
        recipient={2}
      />
    );
    expect(getByText("Read").tagName).toBe("DIV");
  });

  it("MessagePreview shows 'No message' when message is null", async() => {
    render(
        <MessagePreview message={null} recipient={2} />
    );
    await act(async () => {

    })
    screen.debug();
    expect(screen.getByText("No message")).toBeInTheDocument();
  });
});