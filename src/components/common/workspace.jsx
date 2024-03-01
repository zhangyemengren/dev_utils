import { Checkbox, CheckboxGroup, Divider, Input } from "@nextui-org/react";
import { DispatchContext, ModelContext } from "@/app/page";
import { useContext, useEffect, useRef } from "react";
import { invoke } from "@tauri-apps/api/tauri";

const URL_VALIDATION_TIMEOUT = 500;

export default function Workspace() {
    const timer = useRef(null);
    const { workspaceUrl, workspaceUrlErr, projects, selectedProjects } =
        useContext(ModelContext);
    const dispatch = useContext(DispatchContext);

    const getProjects = async (url) => {
        try {
            const result = await invoke("get_dirs", { url });
            if (result.length < 1) {
                dispatch({
                    type: "update",
                    payload: {
                        workspaceUrlErr: "路径错误或项目为空",
                    },
                });
            }
            dispatch({
                type: "update",
                payload: {
                    projects: result,
                    selectedProjects: result.map((i) => i.path),
                    isSelectAll: true,
                },
            });
        } catch (e) {
            dispatch({
                type: "update",
                payload: {
                    workspaceUrlErr: "调用get_dirs失败",
                },
            });
        }
    };

    useEffect(() => {
        clearTimeout(timer.current);
        if (!workspaceUrl) {
            dispatch({
                type: "update",
                payload: {
                    projects: [],
                },
            });
            return;
        }
        timer.current = setTimeout(() => {
            getProjects(workspaceUrl);
        }, URL_VALIDATION_TIMEOUT);
        return () => {
            clearTimeout(timer.current);
        };
    }, [workspaceUrl]);

    return (
        <>
            <div>
                <Input
                    size="sm"
                    variant="bordered"
                    type="text"
                    label="工作区路径"
                    value={workspaceUrl}
                    isInvalid={!!workspaceUrlErr}
                    errorMessage={workspaceUrlErr}
                    onValueChange={(v) => {
                        dispatch({
                            type: "update",
                            payload: {
                                workspaceUrl: v,
                                workspaceUrlErr: "",
                            },
                        });
                    }}
                    onFocus={() => {
                        dispatch({
                            type: "update",
                            payload: {
                                workspaceUrlErr: "",
                            },
                        });
                    }}
                />
            </div>
            <div>
                {projects.length > 0 && (
                    <div>
                        <Divider className="my-4" />
                        <div>
                            <CheckboxGroup
                                size="sm"
                                value={selectedProjects}
                                onValueChange={(v) => {
                                    dispatch({
                                        type: "update",
                                        payload: {
                                            selectedProjects: v,
                                        },
                                    });
                                }}
                            >
                                {projects.map((i) => {
                                    return (
                                        <Checkbox key={i.name} value={i.path}>
                                            {i.name}
                                        </Checkbox>
                                    );
                                })}
                            </CheckboxGroup>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
