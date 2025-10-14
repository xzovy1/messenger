import { describe, it, expect, vi, beforeEach, test, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import Signup from "../src/Signup.jsx";
import userEvent from "@testing-library/user-event";
import { fetchDataPost } from "../src/helpers/fetchData.js";

const mockNavigate = vi.fn();
vi.mock("react-router", async () => {
    const actual = await vi.importActual("react-router");
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

vi.mock("../src/helpers/fetchData", () => ({
    fetchDataPost: vi.fn(),
}));
const password = "TestUser@1"
const userInfo = {
    username: "TestUser",
    firstname: "Test",
    lastname: "User",
    password,
    "password-confirm": password,
    dob: "2000-01-01",
    bio: "Hey, I'm Test User."
}

describe("Signup Component", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    })

    it("renders signup form", () => {
        render(<Signup />)
        expect(screen.getByRole("heading", { name: "Create Account" })).toBeVisible()
        expect(screen.getByRole("form")).toBeVisible()
        expect(screen.getByLabelText(/username/i)).toBeRequired()
        expect(screen.getByLabelText(/^password/i)).toBeRequired()
        expect(screen.getByLabelText(/confirm password/i)).toBeRequired()
        expect(screen.getByLabelText(/first name/i)).toBeRequired()
        expect(screen.getByLabelText(/last name/i)).toBeRequired()
        expect(screen.getByLabelText(/birthday/i)).toBeRequired()
        expect(screen.getByLabelText(/about/i)).not.toBeRequired()
    })

    it("submits FormData on correctly filled form", async () => {

        const data = new FormData();
        data.set("password", userInfo.password);
        data.set("password-confirm", userInfo.password)
        const user = userEvent.setup();

        render(<Signup />)

        await user.type(screen.getByLabelText(/username/i), userInfo.username)
        await user.type(screen.getByLabelText(/^password/i), userInfo.password)
        await user.type(screen.getByLabelText(/confirm password/i), userInfo.password)
        await user.type(screen.getByLabelText(/first name/i), userInfo.firstname)
        await user.type(screen.getByLabelText(/last name/i), userInfo.lastname)
        await user.type(screen.getByLabelText(/birthday/i), userInfo.dob)
        await user.type(screen.getByLabelText(/about/i), userInfo.bio)

        fetchDataPost.mockResolvedValue(userInfo)
        fireEvent.submit(screen.getByRole("form"))
    })

    test("password and password-confirm must match", async () => {

        const user = userEvent.setup();

        render(<Signup />)

        await user.type(screen.getByLabelText(/username/i), userInfo.username)
        await user.type(screen.getByLabelText(/^password/i), userInfo.password)
        await user.type(screen.getByLabelText(/confirm password/i), "password")
        await user.type(screen.getByLabelText(/first name/i), userInfo.firstname)
        await user.type(screen.getByLabelText(/last name/i), userInfo.lastname)
        await user.type(screen.getByLabelText(/birthday/i), userInfo.dob)
        await user.type(screen.getByLabelText(/about/i), userInfo.bio)

        fetchDataPost.mockResolvedValue(userInfo)
        fireEvent.submit(screen.getByRole("form"))
        expect(screen.getByText(/passwords do not match/i)).toBeVisible()
    })
    test("date can't make age greater than 110 years", async () => {

        const user = userEvent.setup();

        const now = new Date().toISOString().split("T")[0].split("-")
        const age = 111
        const dates = now.map(value => parseInt(value))
        const testDate = new Date(`${dates[0] - (age + 1)}-${dates[1]}-${dates[2]}`).toISOString().split("T")[0]
        render(<Signup />)
        await act(async ()=>{
        await user.type(screen.getByLabelText(/birthday/i), testDate)
        await user.type(screen.getByLabelText(/username/i), userInfo.username)
        await user.type(screen.getByLabelText(/^password/i), userInfo.password)
        await user.type(screen.getByLabelText(/confirm password/i), userInfo["password-confirm"])
        await user.type(screen.getByLabelText(/first name/i), userInfo.firstname)
        await user.type(screen.getByLabelText(/last name/i), userInfo.lastname)
        await user.type(screen.getByLabelText(/about/i), userInfo.bio)

            await fetchDataPost.mockResolvedValue(testDate)
            fireEvent.submit(screen.getByRole("form"))
        })
        expect(screen.getByText(/invalid date range/i)).toBeVisible()

    })
    test("date can't make age less than 12 years", async () => {

        const user = userEvent.setup();
        const now = new Date().toISOString().split("T")[0].split("-")
        const age = 12
        const dates = now.map(value => parseInt(value))
        const testDate = new Date(`${dates[0] - age}-${dates[1]}-${dates[2] + 1}`).toISOString().split("T")[0]

        act(()=>{
            render(<Signup />)
        })
        
        await act(async ()=>{
            
            await user.type(screen.getByLabelText(/first name/i), userInfo.firstname)
            await user.type(screen.getByLabelText(/last name/i), userInfo.lastname)
            await user.type(screen.getByLabelText(/username/i), userInfo.username)
            await user.type(screen.getByLabelText(/birthday/i), testDate)
            await fetchDataPost.mockResolvedValue()
            fireEvent.submit(screen.getByRole("form"))
        })
        expect(screen.getByText(/invalid date range/i)).toBeVisible()

    })
    describe("username must not contain special characters like '!@#$%^&*()'/\;:'", ()=>{
        let user
        const setup = async ()=>{
            user = userEvent.setup()
            render(<Signup />)
            await user.type(screen.getByLabelText(/first name/i), userInfo.firstname)
            await user.type(screen.getByLabelText(/last name/i), userInfo.lastname)

        }
        const teardown = async () => {
            fireEvent.submit(screen.getByRole("form"))
            expect(screen.getByText(/username must only contain letters, numbers and be between 4 and 20 characters/i)).toBeVisible()
        }

        const illegalChars = '!@#$%^&*()/\;:|?.,><'
        for (const char of illegalChars){
                test(`username has ${char}`, async () => {
                await setup()
                await user.type(screen.getByLabelText(/username/i), `U${char}S3r`)
                await teardown()
            })
        }
    })
})