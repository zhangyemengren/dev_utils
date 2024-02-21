import { useContext } from "react";
import { ModelContext } from "@/app/page";

export default function Playground() {
    const state = useContext(ModelContext);

    return (
        <div>
            playground
            <p>选择的项目是{state.menuItem}</p>
        </div>
    );
}
