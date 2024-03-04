import { Button, Divider, Radio, RadioGroup } from "@nextui-org/react";
import { invoke } from "@tauri-apps/api/tauri";
import { DispatchContext, ModelContext } from "@/app/page";
import { useContext } from "react";
import Workspace from "@/components/common/workspace";

export default function MergeBranch() {
    const {
        projects,
        selectedProjects,
        gitOperation: { isLoading },
    } = useContext(ModelContext);
    const dispatch = useContext(DispatchContext);

    const submit = async () => {
        try {
            await invoke("git_workflow", {
                payload: {
                    projects: selectedProjects,
                    mode: "merge",
                    config: {
                        needPush: false,
                        // executeBranch: "branch-3",
                        mergeBranch: undefined,
                        commitMessage: undefined,
                        cherryPickCommit: undefined,
                    },
                },
            });
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div>
            <Workspace />
            <Divider className="mt-4" />
            {projects.length > 0 && (
                <div>
                    <div>
                        <RadioGroup
                            size="sm"
                            label="install flag"
                            orientation="horizontal"
                        >
                            <Radio value="merge">合并分支</Radio>
                            <Radio value="rebase">变基</Radio>
                        </RadioGroup>
                    </div>
                    <div>
                        <Button
                            onClick={submit}
                            isDisabled={selectedProjects.length < 1}
                            color="primary"
                            size="sm"
                            fullWidth
                            isLoading={isLoading}
                        >
                            执行
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
