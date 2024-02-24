import { useState, useEffect, useRef } from "react";
import { Input, Button, CheckboxGroup, Checkbox } from "@nextui-org/react";
import { invoke } from "@tauri-apps/api/tauri";

const URL_VALIDATION_TIMEOUT = 500;

export default function UpdateDependency() {
    const [url, setUrl] = useState("");
    const [urlErr, setUrlErr] = useState("");
    const [projects, setProjects] = useState([]);
    const [selectedProjects, setSelectedProjects] = useState([]);
    const [isSelectAll, setIsSelectAll] = useState(false);
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
    console.log(projects);
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
                    <div className="py-4 flex space-x-4">
                        <span className="text-medium">请选择项目</span>
                        <Checkbox
                            isSelected={isSelectAll}
                            isIndeterminate={
                                selectedProjects.length > 0 &&
                                selectedProjects.length < projects.length
                            }
                            onValueChange={(v) => {
                                setIsSelectAll(v);
                                setSelectedProjects(
                                    v ? projects.map((i) => i.path) : [],
                                );
                            }}
                        >
                            全选
                        </Checkbox>
                    </div>
                    <CheckboxGroup
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
            )}
        </div>
    );
}
