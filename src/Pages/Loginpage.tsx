import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import Loader from "../Components/Loading";
// import Imagecarosal from "../Components/Imagecarosal";
// import Login1 from "../assets/Login1.svg";
// import Login2 from "../assets/Login2.svg";
// import Login3 from "../assets/Login3.svg";
import { Card, CardContent, TextField, Button, Typography, Box, CardActions } from "@mui/material";
//import axios from "axios";
import apiClient from '../api/apiClient';


// const images = [
//   { src: Login1, alt: "Login Illustration 1" },
//   { src: Login2, alt: "Login Illustration 2" },
//   { src: Login3, alt: "Login Illustration 3" },

// ];
const Login: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [messageType, setMessageType] = React.useState<"error" | "success">("error");
  const [loading, setLoading] = useState(false);


  const MainPageAPI = async (payload: any) => {
    const response = await apiClient.post("/common", payload);
    return response;
  }


  // Mask password for display
  //const maskedPassword = password.replace(/./g, "*");

  const handleLogin = async () => {
    try {

      setLoading(true);

      const token = await login(username, password);

      setMessageType("success");



      const Defaultvalues = {
        userid: username,
        name: "",
        age: "",
        designation: "",
        location: "",
        role: "",
        ouAccess: ""
      };

      localStorage.setItem("activeUserInfo", JSON.stringify(Defaultvalues));


      const payload = {
        Usercontext: JSON.parse(localStorage.getItem("activeUserInfo") || "{}"),
        servicename: "getUserInfo",
        JsonValue: {
          "userId": username
        }

      };
      console.log("Payload for user info:", payload);
      const response = await MainPageAPI(payload);

      console.log("User Info response:", response);

      const name = response.data.data[0];
      const roles = response.data.data[1];
      const ouAccess = response.data.data[2];
      const roleOuMapping = response.data.data[3];




      const userInfo = {
        roles: roles,
        ouAccess: ouAccess,
        roleOuMapping: roleOuMapping
      };

      const ActiveUserInfo = {
        userid: payload.JsonValue.userId,
        name: name[0].Fullname,
        age: '35',
        designation: 'Manager -IT',
        location: 'Chennai - CORP-IT',
        role: { value: 'BRS_ROLE', label: 'BRS_ROLE' },
        ouAccess: { value: '301', label: 'CORP' }
      };

      localStorage.setItem("userInfo", JSON.stringify(userInfo));
      localStorage.setItem("activeUserInfo", JSON.stringify(ActiveUserInfo));


      /*Print localstorage userinfo*/






      setMessage("Login Successful! Redirecting...");

      setPassword("");

      setTimeout(() => {
        navigate("/Mainpage");
      }, 1000);

    } catch (error: any) {
      setLoading(false);
      setMessageType("error");
      setMessage(error.response?.data?.message || "Login failed For some reason");
      console.log("Login error:", error);
    }
    finally {
      setLoading(false);
    }
  };




  const login = async (username: string, password: string) => {

    const response = await apiClient.post("/auth/login",

      { username, password },
      { withCredentials: true } // 🔥 important for cookies
    );


    const token = response.data.token;

    // Store token
    localStorage.setItem("token", token);
    localStorage.setItem("refreshToken", response.data.refreshToken);
    console.log("Token", response.data)

    return token;
  };



  return (
    <div style={styles.container}>
      {/* <div style={styles.leftpanel}>
              <div style={styles.Imagecarosal}>
                <Imagecarosal images={images} height={"80%"} autoPlay={true} interval={3000} />
              </div>
            </div> */}
      <div style={styles.rightpanel}>
        <Box
          sx={{
            minHeight: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#f5f5f5",
            p: 2,
          }}
        >
          <Card sx={{ width: 350, p: 2, boxShadow: 4, borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h5" align="center" gutterBottom>
                Login
              </Typography>

              <TextField
                label="Username"
                fullWidth
                margin="normal"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />

              <TextField
                label="Password"
                fullWidth
                margin="normal"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Typography
                variant="body2"
                color={messageType === "error" ? "error" : "primary"}
                align="center"
                sx={{ mt: 1 }}
              >
                {message}
              </Typography>
            </CardContent>
            {loading && <Loader loading />}

            <CardActions>
              <Button
                variant="contained"
                fullWidth
                sx={{ mt: 1 }}
                onClick={handleLogin}
              >
                Login
              </Button>
            </CardActions>
          </Card>
        </Box>
      </div>
    </div>
  )


};
const styles = {
  container: {
    display: "flex",
    height: "100vh",
    width: "100vw",
    justifyContent: "center",
    backgroundColor: "#ffffff"
  },
  leftpanel: {
    width: "50%",
    display: "flex",
    flexdirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff"

  },
  rightpanel: {
    width: "50%",
    backgroundColor: "#ffffff"

  },
  heading: {
    fontSize: "30px",
    fontWeight: "bold",
    marginTop: "40px",
    marginLeft: "20px"
  },
  Imagecarosal: {
    width: "80%",          // shrink width to fit panel
    maxHeight: "80%",      // shrink height to fit panel
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  Image: {
    width: "100%",
    height: "auto",       // maintain aspect ratio
  }

}

export default Login;