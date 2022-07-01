import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { FC } from "react";
import { DialogStateToProps, IGlobalConfirmDialogState } from "./typings";

// ConfirmDialog组件
const ConfirmDialog: FC<DialogStateToProps<IGlobalConfirmDialogState>> = ({
  open,
  title,
  content,
  resolver,
  onClose,
}) => {
  const handleResove = (value: boolean) => {
    onClose();
    resolver(value);
  };
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent dividers>{content}</DialogContent>
      <DialogActions>
        <Button onClick={() => handleResove(false)}>取消</Button>
        <Button onClick={() => handleResove(true)}>确定</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
