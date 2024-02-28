import { useContext } from "react";
import { ModelContext } from "@/app/page";
import TextImport from "@/components/text_import";
import UpdateDependency from "@/components/update_dependency";
import GitOperation from "@/components/git_operation";
import UrlComponent from "@/components/url";
import JsonComponent from "@/components/json";

export default function Playground() {
    const state = useContext(ModelContext);

    return (
        <div className="grow p-4 flex flex-col">
            <div className="flex items-center gap-3 rounded-medium border-small border-divider p-4">
                <p>Playground</p>
                <p>选择的项目是{state.menuItem}</p>
            </div>
            <div className="grow flex w-full mt-4 p-4 flex-col gap-4 rounded-medium border-small border-divider">
                {renderMenuItem(state.menuItem)}
            </div>
        </div>
    );
}

function renderMenuItem(item) {
    switch (item) {
        case "textImport":
            return <TextImport />;
        case "updateDependency":
            return <UpdateDependency />;
        case "gitOperation":
            return <GitOperation />;
        case "url":
            return <UrlComponent />;
        case "json":
            return <JsonComponent />;
        default:
            return null;
    }
}
