import { FC, useEffect, useState } from "react";
import ConfirmDialog from "./confirm-dialog";
import NormalDialog from "./normal-dialog";
import ObservableDataSource from "./observable-data-source";
import {
  GlobalDialogTypeCompose,
  IGlobalDialog,
  IGlobalConfirmDialogState,
  IGlobalNormalDialogState,
} from "./typings";

// 把GlobalDialogTypeCompose中的type路由到指定的渲染器
const DIALOG_MAP = {
  confirm: ConfirmDialog,
  normal: NormalDialog,
} as const;

export const GlobalDialogRoot = () => {
  // 需要渲染的Dialogs
  const [dialogs, setDialogs] = useState<GlobalDialogTypeCompose[]>(
    ObservableDataSource.value
  );

  useEffect(() => {
    const key = ObservableDataSource.subscribe(setDialogs);
    return () => {
      ObservableDataSource.unSubscribe(key);
    };
  }, []);

  const handleRemoveDialog = (dialog: GlobalDialogTypeCompose) => {
    // 获取数据源的值
    const value = ObservableDataSource.value;
    // 首先关闭Dialog，避免影响到Dialog关闭时的动画
    const nextDialog = { ...dialog, open: false };
    ObservableDataSource.setValue(
      value.map((item) => (item === dialog ? nextDialog : item))
    );
    // 使用回调方式移除已被标记的Object
    const timer = setTimeout(() => {
      // 在延时后重新获取数据源的值
      const value = ObservableDataSource.value;
      ObservableDataSource.setValue(value.filter((item) => item !== dialog));
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
            {...dialog}
          />
        );
      })}
    </>
  );
};

// 注入UUID作为每个Dialog的标识符
const fillGlobalDialog = (
  props: Omit<IGlobalDialog, "uuid" | "open" | "extra">
): IGlobalDialog => ({
  ...props,
  extra: {},
  open: true,
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
  const Controller = {
    confirm: (val: Omit<IGlobalDialog, "uuid">) => {
      const dialogs = ObservableDataSource.value;
      const setDialogs = ObservableDataSource.setValue;
      let resolver = null;
      const asyncResult = new Promise<boolean>((res) => {
        resolver = res;
      });
      if (resolver === null) {
        throw new Error("获取resolver失败");
      }
      const dialog = fillConfirmProps(fillGlobalDialog(val), resolver);
      setDialogs([...dialogs, dialog]);

      return asyncResult;
    },
    normal: (val: Omit<IGlobalDialog, "uuid">) => {
      const dialogs = ObservableDataSource.value;
      const setDialogs = ObservableDataSource.setValue;
      const dialog = fillNormalProps(fillGlobalDialog(val));
      setDialogs([...dialogs, dialog]);
    },
  };
  return Controller;
};

export default useGlobalDialog;
