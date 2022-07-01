import "./App.css";
import { Box, Button, Stack } from "@mui/material";
import useGlobalDialog, { GlobalDialogRoot } from "./global-alert-dialog";

function App() {
  const GlobalDialog = useGlobalDialog();

  const handleOpenConfirmDialog = async () => {
    const res = await GlobalDialog.confirm({
      title: "ConfirmDialogTitle",
      content,
    });
    console.log(res);
  };
  const handleOpenNormalDialog = () => {
    GlobalDialog.normal({ title: "NormalDialogTitle", content });
  };

  const content = (
    <Box sx={{ textAlign: "center" }}>
      <Stack spacing={1}>
        <Button variant="contained" onClick={handleOpenConfirmDialog}>
          OPEN CONFIRM DIALOG
        </Button>
        <Button variant="contained" onClick={handleOpenNormalDialog}>
          OPEN NORMAL DIALOG
        </Button>
      </Stack>
    </Box>
  );

  return (
    <>
      <GlobalDialogRoot />
      {content}
    </>
  );
}

export default App;
