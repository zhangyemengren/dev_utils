"use client";
import { useContext } from "react";
import { Listbox, ListboxItem } from "@nextui-org/listbox";
import { DispatchContext } from "@/app/page";

export default function SideBar() {
    const dispatch = useContext(DispatchContext);

    return (
        <div className="w-[200px]">
            <Listbox
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
                <ListboxItem key="textImport">菜单1</ListboxItem>
                <ListboxItem key="copy">菜单2</ListboxItem>
                <ListboxItem key="edit">菜单3</ListboxItem>
                <ListboxItem
                    key="delete"
                    className="text-danger"
                    color="danger"
                >
                    危险操作
                </ListboxItem>
            </Listbox>
        </div>
    );
}
