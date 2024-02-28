import { Checkbox, Input, Radio, RadioGroup, Divider } from "@nextui-org/react";
import { ModelContext, DispatchContext } from "@/app/page";
import { useContext } from "react";

export default function Options() {
    const {
        updateDependency: {
            projects,
            selectedProjects,
            isSelectAll,
            isExact,
            pkgName,
            pkgVersion,
            pkgNameErr,
            installMode,
            registry,
            npmPath,
        },
    } = useContext(ModelContext);
    const dispatch = useContext(DispatchContext);

    return (
        <div>
            <div className="flex space-x-4 flex-wrap items-center">
                <Checkbox
                    size="sm"
                    isSelected={isSelectAll}
                    isIndeterminate={
                        selectedProjects.length > 0 &&
                        selectedProjects.length < projects.length
                    }
                    onValueChange={(v) => {
                        dispatch({
                            type: "updateDependency",
                            payload: {
                                isSelectAll: v,
                                selectedProjects: v
                                    ? projects.map((i) => i.path)
                                    : [],
                            },
                        });
                    }}
                >
                    全选
                </Checkbox>
                <Checkbox
                    size="sm"
                    isSelected={isExact}
                    onValueChange={(v) => {
                        dispatch({
                            type: "updateDependency",
                            payload: {
                                isExact: v,
                            },
                        });
                    }}
                >
                    固定版本
                </Checkbox>
                <div className="w-24">
                    <Input
                        size="sm"
                        variant="underlined"
                        type="text"
                        placeholder="请输入包名"
                        value={pkgName}
                        onValueChange={(v) => {
                            dispatch({
                                type: "updateDependency",
                                payload: {
                                    pkgName: v,
                                },
                            });
                        }}
                        isInvalid={!!pkgNameErr}
                        errorMessage={pkgNameErr}
                        onFocus={() => {
                            dispatch({
                                type: "updateDependency",
                                payload: {
                                    pkgNameErr: "",
                                },
                            });
                        }}
                    />
                </div>
                <div className="w-24">
                    <Input
                        size="sm"
                        variant="underlined"
                        type="text"
                        placeholder="请输入版本"
                        value={pkgVersion}
                        onValueChange={(v) => {
                            dispatch({
                                type: "updateDependency",
                                payload: {
                                    pkgVersion: v,
                                },
                            });
                        }}
                    />
                </div>
            </div>
            <Divider className="my-2" />
            <div>
                <RadioGroup
                    label="install flag"
                    orientation="horizontal"
                    size="sm"
                    value={installMode}
                    onValueChange={(v) => {
                        dispatch({
                            type: "updateDependency",
                            payload: {
                                installMode: v,
                            },
                        });
                    }}
                >
                    <Radio value="default">default</Radio>
                    <Radio value="prod">prod</Radio>
                    <Radio value="dev">dev</Radio>
                    <Radio value="optional">optional</Radio>
                </RadioGroup>
            </div>
            <Divider className="my-4" />
            <div>
                <Input
                    size="sm"
                    variant="underlined"
                    type="text"
                    label="npm registry"
                    value={registry}
                    onValueChange={(v) => {
                        dispatch({
                            type: "updateDependency",
                            payload: {
                                registry: v,
                            },
                        });
                    }}
                />
                <Input
                    size="sm"
                    variant="underlined"
                    type="text"
                    label="npm path"
                    value={npmPath}
                    onValueChange={(v) => {
                        dispatch({
                            type: "updateDependency",
                            payload: {
                                npmPath: v,
                            },
                        });
                    }}
                />
            </div>
        </div>
    );
}
