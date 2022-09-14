import { Snackbar, Alert, IconButton } from '@mui/material'
import { Close } from '@mui/icons-material'

const AlertInfo = ({ open, onClose, value }) => {
    const action = (
        <>
            <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={onClose}
            >
                <Close fontSize="small" />
            </IconButton>
        </>
    );

    return (
        <Snackbar
            open={open}
            autoHideDuration={6000}
            onClose={onClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            action={action}
        >
            <Alert onClose={onClose} severity="info" sx={{ width: '100%' }}>
                {value}
            </Alert>
        </Snackbar>
    )
}

export default AlertInfo;