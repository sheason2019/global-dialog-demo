import { useState } from "react";
import { atom, useRecoilState } from "recoil";
import ConfirmDialog from "./confirm-dialog";
import NormalDialog from "./normal-dialog";
import {
  GlobalDialogTypeCompose,
  IGlobalDialog,
  IGlobalConfirmDialogState,
  IGlobalNormalDialogState,
} from "./typings";

// 使用Recoil进行全局控制
const globalAlertDialogState = atom<GlobalDialogTypeCompose[]>({
  key: "common/global-alert-dialog",
  default: [],
});

// 把GlobalDialogTypeCompose中的type路由到指定的渲染器
const DIALOG_MAP = {
  confirm: ConfirmDialog,
  normal: NormalDialog,
} as const;

export const GlobalDialogRoot = () => {
  // 需要渲染的Dialogs
  const [dialogs, setDialogs] = useRecoilState(globalAlertDialogState);
  // 需要关闭的Dialogs
  const [closingSet, setClosingSet] = useState<{
    [T in string]: number | undefined;
  }>({});

  const handleRemoveDialog = (dialog: GlobalDialogTypeCompose) => {
    // 首先关闭Dialog，避免影响到Dialog关闭时的动画
    setClosingSet((closingSet) => ({ ...closingSet, [dialog.uuid]: 1 }));
    // 使用回调方式移除已被标记的Object
    const timer = setTimeout(() => {
      setClosingSet((closingSet) => ({
        ...closingSet,
        [dialog.uuid]: undefined,
      }));
      setDialogs((dialogs) => dialogs.filter((item) => item !== dialog));
    }, 1000);
    // Effect return，避免出现空setState警告
    return () => clearTimeout(timer);
  };

  return (
    <>
      {dialogs.map((dialog) => {
        const Render = DIALOG_MAP[dialog.type];

        return (
          <Render
            key={dialog.uuid}
            onClose={() => handleRemoveDialog(dialog)}
            open={!closingSet[dialog.uuid]}
            {...dialog}
          />
        );
      })}
    </>
  );
};

// 注入UUID作为每个Dialog的标识符
const fillUuid = (props: Omit<IGlobalDialog, "uuid">): IGlobalDialog => ({
  ...props,
  uuid: crypto.randomUUID(),
});
// 注入ConfirmProps所需的内容
const fillConfirmProps = (
  props: IGlobalDialog,
  resolver: (val: boolean) => void
): IGlobalConfirmDialogState => ({
  ...props,
  type: "confirm",
  extra: {
    resolver,
  },
});
// 注入NormalProps所需的内容
const fillNormalProps = (props: IGlobalDialog): IGlobalNormalDialogState => ({
  ...props,
  type: "normal",
});

// 提供react hook调用全局Dialog接口
const useGlobalDialog = () => {
  const [_dialogs, setDialogs] = useRecoilState(globalAlertDialogState);
  const Controller = {
    confirm: (val: Omit<IGlobalDialog, "uuid">) => {
      let resolver = null;
      const asyncResult = new Promise<boolean>((res) => {
        resolver = res;
      });
      if (resolver === null) {
        throw new Error("获取resolver失败");
      }
      const dialog = fillConfirmProps(fillUuid(val), resolver);
      setDialogs((dialogs) => [...dialogs, dialog]);

      return asyncResult;
    },
    normal: (val: Omit<IGlobalDialog, "uuid">) => {
      const dialog = fillNormalProps(fillUuid(val));
      setDialogs((dialogs) => [...dialogs, dialog]);
    },
  };
  return Controller;
};

export default useGlobalDialog;
