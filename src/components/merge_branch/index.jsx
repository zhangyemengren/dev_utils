import { Button } from "@nextui-org/react";
import { invoke } from "@tauri-apps/api/tauri";

export default function MergeBranch() {
    const test1 = async () => {
        const result = await invoke("test1");
        console.log(result);
    };
    const test2 = async () => {
        const result = await invoke("test2");
        console.log(result);
    };
    const test3 = async () => {
        const result = await invoke("test3");
        console.log(result);
    };
    return (
        <div>
            <Button onClick={test1}>test1</Button>
            <Button onClick={test2}>test2</Button>
            <Button onClick={test3}>test3</Button>
        </div>
    );
}
