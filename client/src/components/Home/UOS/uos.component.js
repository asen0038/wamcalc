import React, { Component } from "react";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  LinearProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import DenseTable from "./table.component";
import AddAssessmentForm from "../AssessmentForms/addAssessment.component";
import UOSDataService from "../../../services/uos.service";
import {
  progressBarColor,
  finalMarkRequired,
  currentMark,
  haveFinal,
  weightSum,
} from "./util";

export default class UOS extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showDialog: false,
      progressBar: {
        progress: 100,
        color: progressBarColor(
          this.props.uos.assessmentList,
          this.props.uos.goal_mark
        ),
      },
      markReq: finalMarkRequired(
        this.props.uos.assessmentList,
        this.props.uos.goal_mark
      ),
      currMark: currentMark(this.props.uos.assessmentList),
      haveFinal: haveFinal(this.props.uos.assessmentList),
    };

    this.deleteUOS = this.deleteUOS.bind(this);
    this.handleNo = this.handleNo.bind(this);
    this.handleYes = this.handleYes.bind(this);
  }

  deleteUOS() {
    this.setState({
      showDialog: true,
    });
  }

  handleNo() {
    this.setState({
      showDialog: false,
    });
  }

  handleYes() {
    UOSDataService.delete(this.props.uos.id).then(() => {
      window.location.reload();
    });
  }

  render() {
    let supportText = "";
    let headerActions = undefined;
    if (this.props.editMode) {
      supportText = `Current: ${this.state.currMark}`;
      headerActions = (
        <IconButton sx={{ color: "white" }} onClick={this.deleteUOS}>
          <DeleteIcon />
        </IconButton>
      );
    } else {
      supportText = `Achieved: ${this.props.uos.overall_mark}`;
    }
    return (
      <Card>
        <CardHeader
          title={this.props.uos.code}
          sx={{
            background: "black",
            color: "white",
          }}
          action={headerActions}
        />
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} container>
              <Grid item xs={12}>
                <h4>
                  Goal: {this.props.uos.goal_mark} ({supportText})
                </h4>
              </Grid>
              <Grid item xs={12}>
                <LinearProgress
                  variant="determinate"
                  value={this.state.progressBar.progress}
                  sx={{
                    "& .MuiLinearProgress-barColorPrimary": {
                      backgroundColor: this.state.progressBar.color,
                    },
                  }}
                />
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Grid item xs={12}>
                <DenseTable
                  assessments={this.props.uos.assessmentList}
                  haveFinal={this.state.haveFinal}
                  editMode={this.props.editMode}
                />
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
        {this.props.editMode ? (
          <CardActions>
            <AddAssessmentForm
              uos={this.props.uos}
              haveFinal={this.state.haveFinal}
              weightSum={weightSum(this.props.uos.assessmentList)}
            />
          </CardActions>
        ) : (
          ""
        )}
        {this.state.markReq === 0 || !this.props.editMode ? (
          ""
        ) : (
          <h6>Final Mark Requirement: {this.state.markReq}</h6>
        )}
        {!this.props.editMode ? (
          <h6>
            Mark Achieved in Finals:{" "}
            {this.props.uos.final_mark === 0
              ? "n/a"
              : this.props.uos.final_mark}
          </h6>
        ) : (
          ""
        )}
        <Dialog open={this.state.showDialog}>
          <DialogTitle id="alert-dialog-title">Delete UOS</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete this UOS?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleNo}>No</Button>
            <Button onClick={this.handleYes}>Yes</Button>
          </DialogActions>
        </Dialog>
      </Card>
    );
  }
}
