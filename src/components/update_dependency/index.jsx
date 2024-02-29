import { useContext } from "react";
import { Button, Divider } from "@nextui-org/react";
import { invoke } from "@tauri-apps/api/tauri";
import { ModelContext, DispatchContext } from "@/app/page";
import Workspace from "@/components/common/workspace";
import Options from "./options";

export default function UpdateDependency() {
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
            await invoke("update_dependency", {
                payload: {
                    projects: selectedProjects,
                    isExact,
                    pkgName,
                    pkgVersion,
                    installMode,
                    registry,
                    npmPath,
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

    return (
        <div>
            <Workspace namespace="updateDependency" />
            <Divider className="mt-4" />
            {projects.length > 0 && (
                <>
                    <Options />
                    <Divider className="mb-4" />
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
                </>
            )}
        </div>
    );
}
