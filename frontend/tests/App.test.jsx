import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "../src/App.jsx";
import { BrowserRouter } from "react-router";

describe("App component", () => {
    it("renders correct heading", () => {
        render(<App />, { wrapper: BrowserRouter });
        expect(screen.getByRole("heading").textContent).toMatch(/Odin Messenger/i);
    });
});

