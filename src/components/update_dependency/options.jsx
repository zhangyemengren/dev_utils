import { Checkbox, Input, Radio, RadioGroup, Divider } from "@nextui-org/react";

export default function Options({
    projects,
    selectedProjects,
    setSelectedProjects,
    isSelectAll,
    setIsSelectAll,
    versionMode,
    setVersionMode,
}) {
    return (
        <div className="py-4">
            <div className="flex space-x-4 flex-wrap items-center">
                <Checkbox
                    size="sm"
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
                <div className="w-24">
                    <Input
                        size="sm"
                        variant="underlined"
                        type="text"
                        placeholder="请输入包名"
                    />
                </div>
                <div className="w-24">
                    <Input
                        size="sm"
                        variant="underlined"
                        type="text"
                        placeholder="请输入版本"
                    />
                </div>
            </div>
            <Divider className="my-4" />
            <div>
                <RadioGroup
                    orientation="horizontal"
                    size="sm"
                    value={versionMode}
                    onValueChange={setVersionMode}
                >
                    <Radio value="minor">主版本</Radio>
                    <Radio value="patch">修订版本</Radio>
                    <Radio value="exact">精确版本</Radio>
                </RadioGroup>
            </div>
        </div>
    );
}
