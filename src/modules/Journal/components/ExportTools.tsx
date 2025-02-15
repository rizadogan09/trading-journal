import React from 'react';
import {
  Box,
  Button,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  FormControlLabel,
  Checkbox,
  Typography
} from '@mui/material';
import { 
  FileDownload as FileDownloadIcon,
  PictureAsPdf as PdfIcon,
  TableChart as ExcelIcon
} from '@mui/icons-material';

interface ExportOptions {
  includeScreenshots: boolean;
  includeNotes: boolean;
  dateRange: boolean;
  includeStatistics: boolean;
}

const ExportTools = ({ onExport }: { onExport: (format: string, options: ExportOptions) => void }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [showOptions, setShowOptions] = React.useState(false);
  const [exportFormat, setExportFormat] = React.useState<string>('');
  const [options, setOptions] = React.useState<ExportOptions>({
    includeScreenshots: true,
    includeNotes: true,
    dateRange: false,
    includeStatistics: true
  });

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleFormatSelect = (format: string) => {
    setExportFormat(format);
    setShowOptions(true);
    handleClose();
  };

  const handleExport = () => {
    onExport(exportFormat, options);
    setShowOptions(false);
  };

  return (
    <>
      <Button
        variant="outlined"
        startIcon={<FileDownloadIcon />}
        onClick={handleClick}
      >
        Exportieren
      </Button>
      
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={() => handleFormatSelect('pdf')}>
          <PdfIcon sx={{ mr: 1 }} /> Als PDF exportieren
        </MenuItem>
        <MenuItem onClick={() => handleFormatSelect('excel')}>
          <ExcelIcon sx={{ mr: 1 }} /> Als Excel exportieren
        </MenuItem>
      </Menu>

      <Dialog open={showOptions} onClose={() => setShowOptions(false)}>
        <DialogTitle>Export Optionen</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <FormControl component="fieldset">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={options.includeScreenshots}
                    onChange={(e) => setOptions({ ...options, includeScreenshots: e.target.checked })}
                  />
                }
                label="Screenshots einschließen"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={options.includeNotes}
                    onChange={(e) => setOptions({ ...options, includeNotes: e.target.checked })}
                  />
                }
                label="Notizen einschließen"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={options.dateRange}
                    onChange={(e) => setOptions({ ...options, dateRange: e.target.checked })}
                  />
                }
                label="Nur aktueller Zeitraum"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={options.includeStatistics}
                    onChange={(e) => setOptions({ ...options, includeStatistics: e.target.checked })}
                  />
                }
                label="Statistiken einschließen"
              />
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowOptions(false)}>Abbrechen</Button>
          <Button onClick={handleExport} variant="contained">
            Exportieren
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ExportTools; 