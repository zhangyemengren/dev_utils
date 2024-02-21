"use client";

// import Greet from "./greet";
import { useEffect, createContext, useReducer } from "react";
import SideBar from "../components/sidebar";
import Playground from "../components/playground";

export default function Home() {
    const [state, dispatch] = useReducer(modelReducer, initialState, undefined);
    useEffect(() => {
        const mql = window.matchMedia("(prefers-color-scheme: dark)");
        if (mql.matches) {
            document.documentElement.classList.add("dark");
        }
        mql.addEventListener("change", (e) => {
            if (e.matches) {
                document.documentElement.classList.add("dark");
            } else {
                document.documentElement.classList.remove("dark");
            }
        });
    }, []);
    return (
        <main className="flex">
            <ModelContext.Provider value={state}>
                <DispatchContext.Provider value={dispatch}>
                    <SideBar />
                    <Playground />
                </DispatchContext.Provider>
            </ModelContext.Provider>
        </main>
    );
}
const initialState = {};
function modelReducer(state, action) {
    switch (action.type) {
        case "update":
            return { ...state, ...action.payload };
        default:
            return state;
    }
}

export const ModelContext = createContext(initialState);
export const DispatchContext = createContext((p) => p);
