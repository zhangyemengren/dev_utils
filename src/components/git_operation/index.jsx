import { Button, Divider } from "@nextui-org/react";
import { invoke } from "@tauri-apps/api/tauri";
import { DispatchContext, ModelContext } from "@/app/page";
import { useContext } from "react";
import Workspace from "@/components/common/workspace";

export default function MergeBranch() {
    const {
        updateDependency: {
            projects,
            selectedProjects,
            isExact,
            pkgName,
            pkgVersion,
            installMode,
            isLoading,
            registry,
            npmPath,
        },
    } = useContext(ModelContext);
    const dispatch = useContext(DispatchContext);

    return (
        <div>
            <Workspace namespace="gitOperation" />
            <Divider className="mt-4" />
            {projects.length > 0 && (
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
            )}
        </div>
    );
}
