import { useState } from "react";
import { Textarea, Button } from "@nextui-org/react";
import { invoke } from "@tauri-apps/api/tauri";

export default function TextImport() {
    const [value, setValue] = useState("");

    const handleClick = () => {
        invoke("import_by_html", { value })
            .then((result) => {
                console.log(result);
            })
            .catch(console.error);
    };

    return (
        <div>
            <Textarea
                value={value}
                onChange={(e) => {
                    setValue(e.target.value);
                }}
                placeholder="添加wiki片段"
                // className="w-full"
            />
            <Button onClick={handleClick}>导入</Button>
        </div>
    );
}
