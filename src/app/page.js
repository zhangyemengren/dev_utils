"use client";

import { useEffect, createContext, useReducer } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import SideBar from "@/components/sidebar";
import Playground from "@/components/playground";
import Menu from "@/components/menu";

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
        invoke("close_splashscreen");
    }, []);
    return (
        <main className="h-full">
            <ModelContext.Provider value={state}>
                <DispatchContext.Provider value={dispatch}>
                    <Menu />
                    <div className="flex min-h-full">
                        <SideBar />
                        <Playground />
                    </div>
                </DispatchContext.Provider>
            </ModelContext.Provider>
        </main>
    );
}
const initialState = {
    menuItem: undefined,
    workspaceUrl: "/Users/zhangchi/personal/tests",
    workspaceUrlErr: "",
    projects: [],
    selectedProjects: [],
    isSelectAll: false,
    updateDependency: {
        isExact: false,
        pkgName: "",
        pkgVersion: "",
        pkgNameErr: "",
        installMode: "default",
        isLoading: false,
        registry: "https://registry.npmmirror.com",
        npmPath: "/usr/local/bin",
    },
    gitOperation: {
        isLoading: false,
        mode: "commit",
        needPush: false,
    },
};
function modelReducer(state, action) {
    switch (action.type) {
        case "update":
            return { ...state, ...action.payload };
        case "updateDependency":
        case "gitOperation":
            return {
                ...state,
                [action.type]: {
                    ...state[action.type],
                    ...action.payload,
                },
            };

        default:
            return state;
    }
}

export const ModelContext = createContext(initialState);
export const DispatchContext = createContext((p) => p);
