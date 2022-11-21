import React, { Component } from "react";
import {
  Grid,
  Button,
  Dialog,
  TextField,
  IconButton,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import AssessmentDataService from "../../../services/assessment.service";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default class EditAssessmentForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openDialog: false,
      formValues: {
        name: "",
        weight: 0,
        mark: 0,
        isFinal: false,
      },
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.deleteAssessment = this.deleteAssessment.bind(this);
  }

  componentDidMount() {
    this.setState({
      ...this.state,
      formValues: {
        name: this.props.assessment.name,
        weight: this.props.assessment.weight,
        mark: this.props.assessment.mark,
        isFinal: this.props.assessment.isFinal,
      },
    });
  }

  deleteAssessment() {
    AssessmentDataService.delete(this.props.assessment.id).then(() => {
      window.location.reload();
    });
  }

  handleInputChange(event) {
    if (event.target.name === "isFinal") {
      this.setState({
        ...this.state,
        formValues: {
          ...this.state.formValues,
          [event.target.name]: event.target.checked,
        },
      });
    } else {
      this.setState({
        ...this.state,
        formValues: {
          ...this.state.formValues,
          [event.target.name]: isNaN(parseInt(event.target.value))
            ? event.target.value
            : parseInt(event.target.value),
        },
      });
    }
  }

  handleSubmit(event) {
    event.preventDefault();
    AssessmentDataService.update(
      this.state.formValues,
      this.props.assessment.id
    ).then(() => {
      this.setState(
        {
          openDialog: false,
        },
        window.location.reload()
      );
    });
  }

  render() {
    let marginSx = { margin: "1%" };
    let validateWeight =
      this.props.weightSum -
        this.props.assessment.weight +
        this.state.formValues.weight >
      100;
    return (
      <Grid item xs={12} container>
        <Grid item xs={6} sx={{ padding: "10px" }}>
          <IconButton
            sx={{ color: "black" }}
            onClick={() => this.setState({ openDialog: true })}
          >
            <EditIcon />
          </IconButton>
        </Grid>
        <Grid item xs={6} sx={{ padding: "10px" }}>
          <IconButton sx={{ color: "black" }} onClick={this.deleteAssessment}>
            <DeleteIcon />
          </IconButton>
        </Grid>
        <Dialog fullScreen open={this.state.openDialog}>
          <form onSubmit={this.handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <h1>Edit Assessment</h1>
              </Grid>
              <Grid item xs={9} sx={marginSx}>
                <TextField
                  fullWidth
                  required
                  name="name"
                  label="Name"
                  value={this.state.formValues.name}
                  onChange={this.handleInputChange}
                />
              </Grid>
              <Grid item xs={9} sx={marginSx}>
                <TextField
                  type="number"
                  required
                  name="weight"
                  label="Weight %"
                  error={validateWeight}
                  helperText={
                    validateWeight
                      ? `Weight cannot exceed 100%! Current weight sum = ${
                          this.props.weightSum - this.props.assessment.weight
                        }%`
                      : " "
                  }
                  value={this.state.formValues.weight}
                  onChange={this.handleInputChange}
                />
              </Grid>
              <Grid item xs={9} sx={marginSx}>
                <TextField
                  type="number"
                  required
                  name="mark"
                  label="mark"
                  value={this.state.formValues.mark}
                  onChange={this.handleInputChange}
                />
                {this.state.formValues.mark === -1 ? (
                  <h4>
                    Note: The mark should be -1 if the assessment hasn't been
                    marked.
                  </h4>
                ) : (
                  ""
                )}
              </Grid>
              {!this.props.haveFinal || this.props.assessment.isFinal ? (
                <Grid item xs={9} sx={marginSx}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="isFinal"
                        checked={this.state.formValues.isFinal}
                        onChange={this.handleInputChange}
                      />
                    }
                    label="Final Exam"
                  />
                </Grid>
              ) : (
                ""
              )}
              <Grid item xs={9} sx={marginSx}>
                <Button
                  variant="contained"
                  type="submit"
                  disabled={validateWeight}
                >
                  Submit
                </Button>
              </Grid>
              <Grid item xs={9} sx={marginSx}>
                <Button
                  variant="contained"
                  sx={{
                    background: "black",
                    color: "white",
                  }}
                  onClick={() =>
                    this.setState({
                      openDialog: false,
                    })
                  }
                >
                  Cancel
                </Button>
              </Grid>
            </Grid>
          </form>
        </Dialog>
      </Grid>
    );
  }
}
