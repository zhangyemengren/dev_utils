import { useContext } from "react";
import { ModelContext } from "@/app/page";
import TextImport from "../text_import";

export default function Playground() {
    const state = useContext(ModelContext);

    return (
        <div className="grow">
            playground
            <p>选择的项目是{state.menuItem}</p>
            {renderMenuItem(state.menuItem)}
        </div>
    );
}

function renderMenuItem(item) {
    switch (item) {
        case "textImport":
            return <TextImport />;
        default:
            return null;
    }
}
