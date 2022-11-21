import React, { Component } from "react";
import {
  Grid,
  Button,
  Dialog,
  TextField,
  IconButton,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import AddBoxIcon from "@mui/icons-material/AddBox";
import AssessmentDataService from "../../../services/assessment.service";

export default class AddAssessmentForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openDialog: false,
      formValues: {
        name: "",
        weight: 0,
        isFinal: false,
      },
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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
    AssessmentDataService.create(this.state.formValues, this.props.uos.id).then(
      () => {
        this.setState(
          {
            openDialog: false,
          },
          window.location.reload()
        );
      }
    );
  }

  render() {
    let marginSx = { margin: "1%" };
    let validateWeight = this.props.weightSum + this.state.formValues.weight > 100;
    return (
      <Grid item xs={12} container>
        <Grid item xs={3} sx={{ padding: "10px" }}>
          <IconButton
            aria-label="settings"
            sx={{ color: "black" }}
            onClick={() => this.setState({ openDialog: true })}
          >
            <AddBoxIcon />
          </IconButton>
        </Grid>
        <Dialog fullScreen open={this.state.openDialog}>
          <form onSubmit={this.handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <h1>Add Assessment for {this.props.uos.code}</h1>
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
                  helperText={validateWeight ? `Weight cannot exceed 100%! Current weight sum = ${this.props.weightSum}%` : ' '}
                  value={this.state.formValues.weight}
                  onChange={this.handleInputChange}
                />
              </Grid>
              {!this.props.haveFinal ? (
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
                <Button variant="contained" type="submit" disabled={validateWeight} >
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
