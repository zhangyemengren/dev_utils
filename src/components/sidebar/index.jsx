"use client";
import { useContext } from "react";
import { Listbox, ListboxItem } from "@nextui-org/react";
import { Icon } from "@iconify-icon/react";
import { DispatchContext } from "@/app/page";

export default function SideBar() {
    const dispatch = useContext(DispatchContext);

    return (
        <div className="w-[200px]">
            <Listbox
                selectionMode="single"
                aria-label="Actions"
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
                <ListboxItem key="copy">菜单2</ListboxItem>
            </Listbox>
        </div>
    );
}
