import { Chip, TableHead } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import { createStyles, makeStyles, Theme, useTheme } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import WarningIcon from '@material-ui/icons/Warning';
import React from 'react';
import { IntlShape } from 'react-intl';
import { messages } from '../../../../src/messages';
import { BrandsItemType, IDialogStateBrands } from '../../../shared';
import ListOptions from './ListOptions';
import SettingsIcon from '@material-ui/icons/Settings';

interface Props {
  marksList: BrandsItemType[];
  removeElement: (id: string) => void;
  intl: IntlShape;
  setDialogState: React.Dispatch<React.SetStateAction<IDialogStateBrands>>;
}

const useStyles1 = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexShrink: 0,
      marginLeft: theme.spacing(2.5)
    }
  })
);

interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onChangePage: (event: React.MouseEvent<HTMLButtonElement>, newPage: number) => void;
}

function TablePaginationActions(props: TablePaginationActionsProps) {
  const classes = useStyles1();
  const theme = useTheme();
  const { count, page, rowsPerPage, onChangePage } = props;

  const handleFirstPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onChangePage(event, 0);
  };

  const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onChangePage(event, page - 1);
  };

  const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onChangePage(event, page + 1);
  };

  const handleLastPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <div className={classes.root}>
      <IconButton onClick={handleFirstPageButtonClick} disabled={page === 0} aria-label="first page">
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </div>
  );
}

const useStyles2 = makeStyles({
  table: {
    minWidth: 500
  }
});

function UploadBrandsTable(props: Props) {
  const { marksList, removeElement, setDialogState, intl } = props;
  const classes = useStyles2();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, marksList.length - page * rowsPerPage);

  const handleChangePage = (_event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="custom pagination table">
        <TableHead>
          <TableRow>
            <TableCell>
              <Chip label="Name" />
            </TableCell>
            <TableCell align="right">
              <Chip label="Keywords" />
            </TableCell>
            <TableCell align="right">
              <Chip label="SiteTitle" />
            </TableCell>
            <TableCell align="right">
              <Chip label="Text" />
            </TableCell>
            <TableCell align="right">
              <Chip label="Active" />
            </TableCell>
            <TableCell align="right">
              <Chip label="MenuHome" />
            </TableCell>
            <TableCell align="right">
              <SettingsIcon />
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(rowsPerPage > 0
            ? marksList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : marksList
          ).map((row: BrandsItemType) => (
            <TableRow
              key={`item-${row.name}-${Math.random()
                .toString(36)
                .substring(7)}`}
            >
              <TableCell component="th" scope="row">
                <span className="mr4">{row.name}</span>
                {row.isDuplicate ? (
                  <Chip
                    variant="default"
                    size="small"
                    icon={<WarningIcon />}
                    label={intl.formatMessage(messages.brandsDuplicateState)}
                    color="secondary"
                  />
                ) : null}
              </TableCell>
              <TableCell align="right">{row.keywords}</TableCell>
              <TableCell align="right">{row.siteTitle}</TableCell>
              <TableCell align="right">{row.text}</TableCell>
              <TableCell align="right">{JSON.stringify(row.active)}</TableCell>
              <TableCell align="right">{JSON.stringify(row.menuHome)}</TableCell>
              <TableCell align="right">
                <ListOptions {...{ brand: row, removeElement, setDialogState }} />
              </TableCell>
            </TableRow>
          ))}
          {emptyRows > 0 && (
            <TableRow style={{ height: 53 * emptyRows }}>
              <TableCell colSpan={6} />
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
              colSpan={3}
              count={marksList.length}
              rowsPerPage={rowsPerPage}
              page={page}
              SelectProps={{
                inputProps: { 'aria-label': 'rows per page' },
                native: true
              }}
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
}

export default UploadBrandsTable;
