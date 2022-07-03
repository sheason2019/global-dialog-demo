// 暴露给用户的接口
export interface IGlobalDialog {
  uuid: string;
  title: React.ReactNode;
  content: React.ReactNode;
  open: boolean;
  extra: any;
}

// Confirm Dialog
export interface IGlobalConfirmDialogState extends IGlobalDialog {
  type: "confirm";
  extra: {
    resolver: (v: boolean) => void;
  }
}

export interface IGlobalNormalDialogState extends IGlobalDialog {
  type: "normal";
}

export type DialogStateToProps<T extends IGlobalDialog> = Omit<
  T,
  "uuid" | "type"
> & {
  onClose: () => void;
};

// 所有Dialog类型的组合
export type GlobalDialogTypeCompose = IGlobalConfirmDialogState | IGlobalNormalDialogState;
