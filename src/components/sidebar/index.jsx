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
                            width={18}
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
                            width={18}
                        />
                    }
                >
                    更新依赖
                </ListboxItem>
                <ListboxItem
                    key="gitOperation"
                    startContent={
                        <Icon icon="material-symbols:call-merge" width={18} />
                    }
                >
                    GIT操作
                </ListboxItem>
                <ListboxItem
                    key="url"
                    startContent={
                        <Icon icon="material-symbols:link" width={18} />
                    }
                >
                    URL
                </ListboxItem>
                <ListboxItem
                    key="json"
                    startContent={<Icon icon="codicon:json" width={18} />}
                >
                    JSON
                </ListboxItem>
            </Listbox>
        </div>
    );
}
