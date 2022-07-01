import { FC } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { DialogStateToProps, IGlobalNormalDialogState } from "./typings";

const NormalDialog: FC<DialogStateToProps<IGlobalNormalDialogState>> = ({
  open,
  onClose,
  title,
  content,
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent dividers>{content}</DialogContent>
      <DialogActions>
        <Button onClick={onClose}>确定</Button>
      </DialogActions>
    </Dialog>
  );
};

export default NormalDialog;
