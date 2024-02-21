"use client";

import Greet from "./greet";
import styles from "./page.module.css";
import {useEffect} from "react";

export default function Home() {
    useEffect(() => {
        const mql = window.matchMedia('(prefers-color-scheme: dark)');
        if (mql.matches){
            document.documentElement.classList.add('dark');
        }
        mql.addEventListener("change", e => {
            if (e.matches) {
                // 转变为深色模式
                document.documentElement.classList.add('dark');
            } else {
                // 转变为浅色模式
                document.documentElement.classList.remove('dark');
            }
        });
    }, []);
    return (
        <main>
            <Greet />
        </main>
    );
}
