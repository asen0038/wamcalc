import React, { Component } from "react";
import { Grid, Button, TextField } from "@mui/material";
import FileService from "../../services/file.service";
import WAMDataService from "../../services/wam.service";
import AuthService from "../../services/auth.service";
import Results from "./performance.component";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";

export default class Upload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fileUploaded: null,
      currentUser: AuthService.getCurrentUser(),
      selectWAM: "Overall WAM",
      uploadName: "Semester WAM",
      allWAM: [],
    };
  }

  fetchWAM() {
    if (this.state.currentUser) {
      WAMDataService.getAll(this.state.currentUser.username).then(
        (response) => {
          let wams = response.data;
          if (wams) {
            wams.forEach((wam) => {
              this.setState({ test: wam });
              this.setState((previousState) => ({
                allWAM: [...previousState.allWAM, wam],
              }));
            });
          }
        }
      );
    }
  }

  componentDidMount() {
    this.setState(this.fetchWAM);
  }

  // On file select (from the pop up)
  onFileChange = (event) => {
    // Update the state
    this.setState({ selectedFile: event.target.files[0] });
  };

  // On file select (from the pop up)
  onFileDelete = (event) => {
    // Update the state
    this.setState({ selectedFile: null });
    window.location.reload();
  };

  // On file upload (click the upload button)
  onFileUpload = () => {
    // Create an object of formData
    const formData = new FormData();

    // Update the formData object
    formData.append(
      "myFile",
      this.state.selectedFile,
      this.state.selectedFile.name
    );

    FileService.upload(
      this.state.currentUser.username,
      formData,
      this.state.selectWAM,
      this.state.uploadName
    ).then((response) => {
      window.location.reload();
    });
  };

  // File content to be displayed after
  // file upload is complete
  fileData = () => {
    if (this.state.selectedFile) {
      return (
        <Grid item xs={12} sx={{ m: 2 }}>
          <Alert severity="success" sx={{ width: 700 }}>
            <AlertTitle> File Name: {this.state.selectedFile.name}</AlertTitle>
          </Alert>
        </Grid>
      );
    } else {
      return (
        <Grid sx={{ m: 2 }}>
          <Alert severity="warning" sx={{ width: 700 }}>
            <AlertTitle>Choose before Pressing the Upload button</AlertTitle>
          </Alert>
        </Grid>
      );
    }
  };

  handleChange = (event) => {
    this.setState({ selectWAM: event.target.value });
  };

  handleInputChange = (event) => {
    this.setState({ uploadName: event.target.value });
  };

  render() {
    return (
      <Grid
        container
        columnSpacing={6}
        rowSpacing={3}
        justify="space-around"
        style={{ gap: 15 }}
      >
        <Grid item xs={12}>
          <h1>Upload Transcript</h1>
        </Grid>
        <Grid item xs={6}>
          <TextField
            sx={{ m: 2 }}
            label="Name"
            value={this.state.uploadName}
            onChange={this.handleInputChange}
          />

          <FormControl sx={{ m: 2 }}>
            <InputLabel id="demo-simple-select-label">WAMType</InputLabel>
            <Select
              defaultValue="Overall WAM"
              value={this.state.selectWAM}
              label="WAM"
              onChange={this.handleChange}
            >
              <MenuItem value={"Overall WAM"}>WAM</MenuItem>
              <MenuItem value={"EIHWAM"}>EIHWAM</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sx={{ m: 2 }}>
          <input
            type="file"
            id="uploadFile"
            name="file"
            onChange={this.onFileChange}
          />
        </Grid>
        <Grid item xs={12}>
          {this.fileData()}
        </Grid>

        <Grid item xs={12}>
          <Button
            variant="contained"
            sx={{
              m: 2,
              background: "black",
              color: "white",
            }}
            onClick={this.onFileDelete}
          >
            Delete
          </Button>
          <Button
            variant="contained"
            sx={{
              background: "black",
              color: "white",
            }}
            onClick={this.onFileUpload}
          >
            Upload!
          </Button>
        </Grid>
        <Grid item xs={12}>
          <h1>WAM Calculator History</h1>
        </Grid>
        <Results wamData={this.state.allWAM} />
      </Grid>
    );
  }
}
