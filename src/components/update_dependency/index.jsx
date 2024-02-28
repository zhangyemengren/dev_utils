import { useEffect, useRef, useContext } from "react";
import {
    Input,
    Button,
    CheckboxGroup,
    Checkbox,
    Divider,
} from "@nextui-org/react";
import { invoke } from "@tauri-apps/api/tauri";
import { ModelContext, DispatchContext } from "@/app/page";
import Options from "./options";

const URL_VALIDATION_TIMEOUT = 500;

export default function UpdateDependency() {
    const {
        updateDependency: {
            url,
            urlErr,
            projects,
            selectedProjects,
            isExact,
            pkgName,
            pkgVersion,
            installMode,
            isLoading,
            registry,
        },
    } = useContext(ModelContext);
    const dispatch = useContext(DispatchContext);

    const timer = useRef(null);
    const onValueChange = (value) => {
        dispatch({
            type: "updateDependency",
            payload: {
                url: value,
                urlErr: false,
            },
        });
    };

    const getProjects = async (url) => {
        try {
            const result = await invoke("get_dirs", { url });
            if (result.length < 1) {
                dispatch({
                    type: "updateDependency",
                    payload: {
                        urlErr: "路径错误或项目为空",
                    },
                });
            }
            dispatch({
                type: "updateDependency",
                payload: {
                    projects: result,
                    selectedProjects: result.map((i) => i.path),
                    isSelectAll: true,
                },
            });
        } catch (e) {
            dispatch({
                type: "updateDependency",
                payload: {
                    urlErr: "调用get_dirs失败",
                },
            });
        }
    };
    const submit = async () => {
        try {
            if (!pkgName) {
                dispatch({
                    type: "updateDependency",
                    payload: {
                        pkgNameErr: "包名不能为空",
                    },
                });
                return;
            }
            dispatch({
                type: "updateDependency",
                payload: {
                    isLoading: true,
                },
            });
            const result = await invoke("update_dependency", {
                payload: {
                    projects: selectedProjects,
                    isExact,
                    pkgName,
                    pkgVersion,
                    installMode,
                    registry,
                },
            });
            dispatch({
                type: "updateDependency",
                payload: {
                    isLoading: false,
                },
            });
        } catch (e) {
            console.error(e);
            dispatch({
                type: "updateDependency",
                payload: {
                    isLoading: false,
                },
            });
        }
    };
    useEffect(() => {
        clearTimeout(timer.current);
        if (!url) {
            dispatch({
                type: "updateDependency",
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
        <div>
            <div>
                <Input
                    size="sm"
                    variant="bordered"
                    type="text"
                    label="工作区路径"
                    value={url}
                    isInvalid={!!urlErr}
                    errorMessage={urlErr}
                    onValueChange={onValueChange}
                    onFocus={() => {
                        dispatch({
                            type: "updateDependency",
                            payload: {
                                urlErr: "",
                            },
                        });
                    }}
                />
            </div>
            {projects.length > 0 && (
                <div>
                    <Options />
                    <Divider className="mb-4" />
                    <div>
                        <CheckboxGroup
                            size="sm"
                            value={selectedProjects}
                            onValueChange={(v) => {
                                dispatch({
                                    type: "updateDependency",
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
                    <Divider className="my-4" />
                    <div>
                        <Button
                            onClick={submit}
                            isDisabled={selectedProjects.length < 1}
                            color="primary"
                            size="sm"
                            fullWidth
                            isLoading={isLoading}
                        >
                            更新依赖
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
