import { useState, useEffect, useRef } from "react";
import {
    Input,
    Button,
    CheckboxGroup,
    Checkbox,
    Divider,
} from "@nextui-org/react";
import { invoke } from "@tauri-apps/api/tauri";
import Options from "./options";

const URL_VALIDATION_TIMEOUT = 500;

export default function UpdateDependency() {
    const [url, setUrl] = useState("");
    const [urlErr, setUrlErr] = useState("");
    const [projects, setProjects] = useState([]);
    const [selectedProjects, setSelectedProjects] = useState([]);
    const [isSelectAll, setIsSelectAll] = useState(false);
    const [versionMode, setVersionMode] = useState("minor");
    const timer = useRef(null);
    const onValueChange = (value) => {
        setUrl(value);
        setUrlErr(false);
    };

    const getProjects = async (url) => {
        try {
            const result = await invoke("get_dirs", { url });
            if (result.length < 1) {
                setUrlErr("路径错误或项目为空");
            }
            setProjects(result);
            setSelectedProjects(result.map((i) => i.path));
            setIsSelectAll(true);
        } catch (e) {
            setUrlErr("调用get_dirs失败");
        }
    };
    const submit = async () => {
        try {
            const result = await invoke("update_dependency", {
                payload: {
                    projects: selectedProjects,
                    versionMode,
                },
            });
            console.log(result);
        } catch (e) {
            console.error(e);
        }
    };
    useEffect(() => {
        clearTimeout(timer.current);
        if (!url) {
            setProjects([]);
            return;
        }
        timer.current = setTimeout(() => {
            getProjects(url);
        }, URL_VALIDATION_TIMEOUT);
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
                    onFocus={() => setUrlErr("")}
                />
            </div>
            {projects.length > 0 && (
                <div>
                    <Options
                        projects={projects}
                        selectedProjects={selectedProjects}
                        setSelectedProjects={setSelectedProjects}
                        isSelectAll={isSelectAll}
                        setIsSelectAll={setIsSelectAll}
                        versionMode={versionMode}
                        setVersionMode={setVersionMode}
                    />
                    <Divider className="mb-4" />
                    <div>
                        <CheckboxGroup
                            size="sm"
                            value={selectedProjects}
                            onValueChange={(v) => {
                                setSelectedProjects(v);
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
                        >
                            更新依赖
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
