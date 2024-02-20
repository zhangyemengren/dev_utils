"use client";

import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { Button } from "@nextui-org/button";

export default function Greet() {
    const [greeting, setGreeting] = useState("");

    useEffect(() => {
        invoke("greet", { name: "Next.js" })
            .then((result) => setGreeting(result))
            .catch(console.error);
    }, []);

    // Necessary because we will have to use Greet as a component later.
    return (
        <div className="text-red-400">
            {greeting}
            <h1 className="text-3xl font-bold underline">Hello world!</h1>
            <div>
                <Button>Click me</Button>
            </div>
        </div>
    );
}
