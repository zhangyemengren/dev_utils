import { Checkbox, Input, Radio, RadioGroup, Divider } from "@nextui-org/react";

export default function Options({
    projects,
    selectedProjects,
    setSelectedProjects,
    isSelectAll,
    setIsSelectAll,
    isExact,
    setIsExact,
    pkgName,
    pkgVersion,
    setPkgName,
    setPkgVersion,
    pkgNameErr,
    setPkgNameErr,
    installMode,
    setInstallMode,
    registry,
    setRegistry,
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
                <Checkbox
                    size="sm"
                    isSelected={isExact}
                    onValueChange={setIsExact}
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
                        onValueChange={setPkgName}
                        isInvalid={!!pkgNameErr}
                        errorMessage={pkgNameErr}
                        onFocus={() => {
                            setPkgNameErr("");
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
                        onValueChange={setPkgVersion}
                    />
                </div>
            </div>
            <Divider className="my-4" />
            <div>
                <RadioGroup
                    label="install flag"
                    orientation="horizontal"
                    size="sm"
                    value={installMode}
                    onValueChange={setInstallMode}
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
                    onValueChange={setRegistry}
                />
                <Input
                    size="sm"
                    variant="underlined"
                    type="text"
                    label="npm registry"
                    value={registry}
                    onValueChange={setRegistry}
                />
            </div>
        </div>
    );
}
