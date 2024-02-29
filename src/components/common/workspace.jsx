import { Checkbox, CheckboxGroup, Divider, Input } from "@nextui-org/react";
import { DispatchContext, ModelContext } from "@/app/page";
import { useContext, useEffect, useRef } from "react";
import { invoke } from "@tauri-apps/api/tauri";

const URL_VALIDATION_TIMEOUT = 500;

export default function Workspace({ namespace }) {
    const timer = useRef(null);
    const {
        [namespace]: { url, urlErr, projects, selectedProjects },
    } = useContext(ModelContext);
    const dispatch = useContext(DispatchContext);

    const getProjects = async (url) => {
        try {
            const result = await invoke("get_dirs", { url });
            if (result.length < 1) {
                dispatch({
                    type: namespace,
                    payload: {
                        urlErr: "路径错误或项目为空",
                    },
                });
            }
            dispatch({
                type: namespace,
                payload: {
                    projects: result,
                    selectedProjects: result.map((i) => i.path),
                    isSelectAll: true,
                },
            });
        } catch (e) {
            dispatch({
                type: namespace,
                payload: {
                    urlErr: "调用get_dirs失败",
                },
            });
        }
    };

    useEffect(() => {
        clearTimeout(timer.current);
        if (!url) {
            dispatch({
                type: namespace,
                payload: {
                    projects: [],
                },
            });
            return;
        }
        timer.current = setTimeout(() => {
            getProjects(url);
        }, URL_VALIDATION_TIMEOUT);
        return () => {
            clearTimeout(timer.current);
        };
    }, [url]);

    return (
        <>
            <div>
                <Input
                    size="sm"
                    variant="bordered"
                    type="text"
                    label="工作区路径"
                    value={url}
                    isInvalid={!!urlErr}
                    errorMessage={urlErr}
                    onValueChange={(v) => {
                        console.log(namespace, "namespace");
                        dispatch({
                            type: namespace,
                            payload: {
                                url: v,
                                urlErr: false,
                            },
                        });
                    }}
                    onFocus={() => {
                        dispatch({
                            type: namespace,
                            payload: {
                                urlErr: "",
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
                                        type: namespace,
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
