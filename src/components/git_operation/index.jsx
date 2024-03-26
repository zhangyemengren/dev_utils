import { Button, Divider, Radio, RadioGroup, Checkbox } from "@nextui-org/react";
import { invoke } from "@tauri-apps/api/tauri";
import { DispatchContext, ModelContext } from "@/app/page";
import { useContext } from "react";
import Workspace from "@/components/common/workspace";

export default function MergeBranch() {
    const {
        projects,
        selectedProjects,
        gitOperation: { isLoading, mode, needPush, results },
    } = useContext(ModelContext);
    const dispatch = useContext(DispatchContext);

    const submit = async () => {
        try {
            dispatch({
                type: "gitOperation",
                payload: {
                    isLoading: true,
                },
            });
            const res = await invoke("git_workflow", {
                payload: {
                    projects: selectedProjects,
                    mode,
                    config: {
                        needPush,
                        // executeBranch: "branch-3",
                        mergeBranch: undefined,
                        commitMessage: undefined,
                        cherryPickCommit: undefined,
                    },
                },
            });
            const arr = Object.entries(res.data);
            console.log(arr);
            dispatch({
                type: "gitOperation",
                payload: {
                    isLoading: false,
                    results: arr,
                },
            });
        } catch (e) {
            console.error(e);
            dispatch({
                type: "gitOperation",
                payload: {
                    isLoading: false,
                },
            });
        }
    };

    return (
        <div>
            <Workspace />
            <Divider className="my-4" />
            {projects.length > 0 && (
                <div>
                    <div>
                        <RadioGroup
                            size="sm"
                            label="模式"
                            orientation="horizontal"
                            value={mode}
                            onValueChange={(v) => {
                                dispatch({
                                    type: "gitOperation",
                                    payload: {
                                        mode: v,
                                    },
                                });
                            }}
                        >
                            <Radio value="commit">提交</Radio>
                            <Radio value="merge">合并</Radio>
                            <Radio value="cherryPick">樱桃采摘</Radio>
                            <Radio value="rebase">变基</Radio>
                        </RadioGroup>
                    </div>
                    <Divider className="my-4" />
                    <div>
                        <Checkbox
                            size="sm"
                            isSelected={needPush}
                            onValueChange={(v) => {
                                dispatch({
                                    type: "gitOperation",
                                    payload: {
                                        needPush: v,
                                    },
                                });
                            }}
                        >
                            推送远端
                        </Checkbox>
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
                            执行
                        </Button>
                    </div>
                    {
                        results.length > 0 && results.map((item, index) => {
                            return (
                                <div key={index}>
                                    <Divider className="my-4" />
                                    <div>
                                        <div>{item[0]}</div>
                                        {
                                            item[1].map((i, idx) => {
                                                return (
                                                    <div key={idx}>
                                                        <div>{i.work_flow}</div>
                                                        <div>{i.status}</div>
                                                        <div>{i.message}</div>
                                                    </div>
                                                );
                                            })
                                        }
                                    </div>
                                </div>
                            );
                        })
                    }
                </div>
            )}
        </div>
    );
}
