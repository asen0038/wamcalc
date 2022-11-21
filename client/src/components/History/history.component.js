// expandable table, select and sortZzz
// https://mui.com/material-ui/react-table/#complementary-projects

// export excel -- not yet applicable
// https://v4.mui.com/components/data-grid/export/

// Run useEffect Only Once
// https://css-tricks.com/run-useeffect-only-once/

// Data Grid column width to fill
// https://stackoverflow.com/questions/67970440/how-to-make-material-data-grid-width-to-fill-the-parent-component-in-react-js

import * as React from "react";
import PropTypes from "prop-types";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import Tooltip from "@mui/material/Tooltip";
import { visuallyHidden } from "@mui/utils";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import SemesterDataService from "../../services/semester.service";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
} from "@mui/x-data-grid";

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: "collapse",
    numeric: false,
    disablePadding: true,
    label: "",
  },
  {
    id: "name",
    numeric: false,
    disablePadding: true,
    label: "Semester",
  },
  {
    id: "result",
    numeric: true,
    disablePadding: false,
    label: "Average Result",
  },
  {
    id: "goal",
    numeric: true,
    disablePadding: false,
    label: "Average Goal",
  },
];

function EnhancedTableHead(props) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              "aria-label": "select all desserts",
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

function calc_result(row) {
  let mean = 0;
  row.uosList.forEach((uos) => {
    mean += uos.overall_mark;
  });
  mean = mean / row.uosList.length;
  return mean;
}

function calc_goal(row) {
  let goal = 0;
  row.uosList.forEach((uos) => {
    goal += uos.goal_mark;
  });
  goal = goal / row.uosList.length;
  return goal;
}

export default function EnhancedTable(props) {
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("result");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [open, setOpen] = React.useState([]);
  const [currentUser] = React.useState(props.currentUser);
  const [history, setHistory] = React.useState([]);
  const [alert, setAlert] = React.useState(false);

  React.useEffect(() => {
    if (currentUser) fetchHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchHistory = () => {
    SemesterDataService.getAll(currentUser.username).then((response) => {
      let semesters = response.data;
      let oldSemesters = [];
      if (semesters) {
        semesters.forEach((semester) => {
          if (!semester.current) {
            oldSemesters.push(semester);
          }
        });
        setHistory(oldSemesters);
      }
    });
  };

  const handleDelete = (event, selected) => {
    setAlert(false);
    let newHistory = [];

    history.forEach((h) => {
      // not exist in delete list -- add to new history
      if (selected.indexOf(h.name) === -1) {
        newHistory = newHistory.concat(JSON.parse(JSON.stringify(h)));
      } else {
        SemesterDataService.delete(h.id).then(() => {
          window.location.reload();
        });
      }
    });
    setSelected([]);
    setHistory(newHistory);
  };

  const handleAlertClose = () => {
    setAlert(false);
  };

  const handleAlertOpen = () => {
    setAlert(true);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = history.map((n) => n.name);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleOpen = (event, name) => {
    const openIndex = open.indexOf(name);
    let newOpen = [];
    // not exist in list, add
    if (openIndex === -1) {
      newOpen = newOpen.concat(open, name);
      // exist, delete by slicing
    } else if (openIndex === 0) {
      // -> beginning of the list, slice first one
      newOpen = newOpen.concat(open.slice(1));
      // -> end of the list, slice last one
    } else if (openIndex === open.length - 1) {
      newOpen = newOpen.concat(open.slice(0, -1));
      // -> middle of the list, slice head and tail and concatenate
    } else if (openIndex > 0) {
      newOpen = newOpen.concat(
        open.slice(0, openIndex),
        open.slice(openIndex + 1)
      );
    }

    setOpen(newOpen);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;
  const isOpen = (name) => open.indexOf(name) !== -1;
  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - history.length) : 0;

  const alertText = [
    "Are you sure to delete the following?",
    <br />,
    selected
      .map((s) => {
        return `${s}`;
      })
      .join(", "),
  ];

  return (
    <Box sx={{ width: "100%" }}>
      <Dialog
        open={alert}
        onClose={handleAlertClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Delete"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {alertText}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAlertClose}>Cancel</Button>
          <Button onClick={(event) => handleDelete(event, selected)} autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <Toolbar
          sx={{
            pl: { sm: 2 },
            pr: { xs: 1, sm: 1 },
            ...(selected.length > 0 && {
              bgcolor: (theme) =>
                alpha(
                  theme.palette.primary.main,
                  theme.palette.action.activatedOpacity
                ),
            }),
          }}
        >
          {selected.length > 0 ? (
            <Typography
              sx={{ flex: "1 1 100%" }}
              color="inherit"
              variant="subtitle1"
              component="div"
            >
              {selected.length} selected
            </Typography>
          ) : (
            <Typography
              sx={{ flex: "1 1 100%" }}
              variant="h6"
              id="tableTitle"
              component="div"
            >
              Performance History
            </Typography>
          )}

          {selected.length > 0 ? (
            <Tooltip title="Delete">
              <IconButton>
                <DeleteIcon onClick={handleAlertOpen} />
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip title="Filter list">
              <IconButton>{/* <FilterListIcon /> */}</IconButton>
            </Tooltip>
          )}
        </Toolbar>
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={"medium"}
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={history.length}
            />
            <TableBody>
              {stableSort(history, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.name);
                  const isItemOpen = isOpen(row.name);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <React.Fragment>
                      <TableRow
                        hover
                        // role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row.name}
                        selected={isItemSelected}
                        sx={{ "& > *": { borderBottom: "unset" } }}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            color="primary"
                            onClick={(event) => handleClick(event, row.name)}
                            checked={isItemSelected}
                            inputProps={{
                              "aria-labelledby": labelId,
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton
                            aria-label="expand row"
                            size="small"
                            onClick={(event) => handleOpen(event, row.name)}
                          >
                            {isItemOpen ? (
                              <KeyboardArrowUpIcon />
                            ) : (
                              <KeyboardArrowDownIcon />
                            )}
                          </IconButton>
                        </TableCell>
                        <TableCell
                          component="th"
                          id={labelId}
                          scope="row"
                          padding="none"
                        >
                          {row.name}
                        </TableCell>

                        <TableCell align="right">{calc_result(row)}</TableCell>
                        <TableCell align="right">{calc_goal(row)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell
                          style={{ paddingBottom: 0, paddingTop: 0 }}
                          colSpan={6}
                        >
                          <Collapse
                            in={isItemOpen}
                            timeout="auto"
                            unmountOnExit
                          >
                            <Box sx={{ margin: 1 }}>
                              <Typography
                                variant="h6"
                                gutterBottom
                                component="div"
                                style={{ display: "inline-block" }}
                              >
                                Unit of Study
                              </Typography>
                              {/* hideFooter to disable pagination */}
                              <div style={{ height: 300, width: "100%" }}>
                                <DataGrid
                                  rows={uosRow(row.uosList)}
                                  columns={columns}
                                  hideFooter
                                  components={{
                                    Toolbar: CustomToolbar,
                                  }}
                                />
                              </div>
                            </Box>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 53 * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={history.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}

function uosRow(uosList) {
  var i = 1;
  const row = uosList.map((unit) => ({
    id: i++,
    col1: unit.code,
    col2: unit.overall_mark.toFixed(1),
    col3: unit.goal_mark.toFixed(1),
    col4: (unit.goal_mark - unit.overall_mark).toFixed(1),
  }));
  return row;
}

const columns = [
  { field: "id", hide: true, flex: 1 },
  { field: "col1", headerName: "UoS Code", flex: 1 },
  { field: "col2", headerName: "Result %", flex: 1 },
  { field: "col3", headerName: "Goal %", flex: 1 },
  { field: "col4", headerName: "Diff %", flex: 1 },
];

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarExport />
      {/* disable printing ---- printOptions={{ disableToolbarButton: true }} */}
    </GridToolbarContainer>
  );
}
