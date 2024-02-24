"use client";
import { useContext } from "react";
import { Listbox, ListboxItem } from "@nextui-org/react";
import { Icon } from "@iconify-icon/react";
import { DispatchContext } from "@/app/page";
import "./index.css";

export default function SideBar() {
    const dispatch = useContext(DispatchContext);

    return (
        <div className="w-48 p-4 border-r-1 border-divider">
            <Listbox
                selectionMode="single"
                aria-label="Actions"
                itemClasses={{
                    base: "custom-listbox-item",
                }}
                onAction={(key) => {
                    dispatch({
                        type: "update",
                        payload: {
                            menuItem: key,
                        },
                    });
                }}
            >
                <ListboxItem
                    key="textImport"
                    startContent={
                        <Icon
                            icon="material-symbols:text-snippet-outline"
                            width={20}
                        />
                    }
                >
                    文案导入
                </ListboxItem>
                <ListboxItem
                    key="updateDependency"
                    startContent={
                        <Icon
                            icon="material-symbols:deployed-code-update-outline"
                            width={20}
                        />
                    }
                >
                    更新依赖
                </ListboxItem>
                <ListboxItem
                    key="mergeBranch"
                    startContent={
                        <Icon icon="material-symbols:call-merge" width={20} />
                    }
                >
                    合并分支
                </ListboxItem>
            </Listbox>
        </div>
    );
}
