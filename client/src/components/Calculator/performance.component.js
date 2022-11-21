import React, { Component } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import WAMDataService from "../../services/wam.service";

const columns = [
  { field: "name", headerName: "Name", width: 500 },
  { field: "score", headerName: "Score", type: "number", width: 130 },
  {
    field: "type",
    headerName: "Type",
    width: 355,
  },
  {
    field: "action",
    headerName: "Action",
    sortable: false,
    width: 150,
    renderCell: (params) => {
      const onClick = (e) => {
        e.stopPropagation(); // don't select this row after clicking
        WAMDataService.delete(params.id).then(() => {
          window.location.reload();
        });
      };

      return (
        <Button
          variant="contained"
          sx={{
            background: "black",
            color: "white",
          }}
          onClick={onClick}
        >
          Delete
        </Button>
      );
    },
  },
];

export default class Results extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div style={{ height: 400, width: "100%", display: "flex" }}>
        <DataGrid
          sx={{ mx: 7 }}
          rows={this.props.wamData}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          checkboxSelection
        />
      </div>
    );
  }
}
