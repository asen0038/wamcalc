import React, { Component } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import EditAssessmentForm from "../AssessmentForms/editAssessment.component";
import { weightSum } from "./util";

export default class DenseTable extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <TableContainer component={Paper}>
        <Table size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell>Weight (%)</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Mark (%)</TableCell>
              {this.props.editMode ? <TableCell>Action</TableCell> : ""}
            </TableRow>
          </TableHead>
          <TableBody>
            {this.props.assessments.map((row) => (
              <TableRow
                key={row.name}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.weight}
                </TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.mark === -1 ? "-" : row.mark}</TableCell>
                {this.props.editMode ? (
                  <TableCell>
                    <EditAssessmentForm
                      assessment={row}
                      haveFinal={this.props.haveFinal}
                      weightSum={weightSum(this.props.assessments)}
                    />
                  </TableCell>
                ) : (
                  ""
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }
}
