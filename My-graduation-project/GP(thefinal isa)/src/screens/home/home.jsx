import * as React from "react";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import CssBaseline from "@mui/material/CssBaseline";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import Box from "@mui/material/Box";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Button,
  Paper,
  Grid,
  alpha,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { NavLink } from "react-router-dom";
import scrollToFunction from "./scrollToFunction";
import "./style.css";

// Import images
import Logo from "../../../src/assets/icons/Logo.png";
import homeImage from "../../../src/assets/icons/Home/rodeo-project-management-software-ONe-snuCaqQ-unsplash.jpg";
import analysisImage from "../../../src/assets/icons/Home/analysis.jpg";
import realCommunicationImage from "../../../src/assets/icons/Home/realCommunication2.jpg";
import planningToolsImage from "../../../src/assets/icons/Home/planningTools.jpg";
import lastImage from "../../../src/assets/icons/Home/last2.jpg";
import austinDistelImage from "../../../src/assets/icons/Home/austin-distel-rxpThOwuVgE-unsplash.jpg";
import facebookIcon from "../../../src/assets/icons/Home/facebook.png";
import instagramIcon from "../../../src/assets/icons/Home/Instagram.png";
import linkedinIcon from "../../../src/assets/icons/Home/LinkedIn.png";
import twitterXIcon from "../../../src/assets/icons/Home/TwitterX.png";

function ElevationScroll(props) {
  const { children } = props;

  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  });

  const scrolledStyle = {
    backgroundColor: trigger ? alpha("#000", 0.7) : alpha("#fff", 0), // Adjust opacity values
    color: trigger ? "white" : "white", // Change text color based on scroll
  };

  return React.cloneElement(children, {
    elevation: trigger ? 4 : 0,
    style: scrolledStyle,
  });
}

ElevationScroll.propTypes = {
  children: PropTypes.element.isRequired,
};

function Home(props) {
  return (
    <React.Fragment>
      <CssBaseline />
      <ElevationScroll {...props}>
        <AppBar>
          <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
            {/* Left side empty space */}
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1.5 }}
            ></Typography>

            {/* Centered items */}
            <Box sx={{ display: "flex" }}>
              <Typography variant="h6" component="div" mx={"30px"}>
                <a
                  href="#"
                  style={{ color: "inherit" }}
                  onClick={() => scrollToFunction("ourServices")}
                >
                  Our Services
                </a>
              </Typography>
              <Typography variant="h6" component="div" mx={"30px"}>
                <a
                  style={{ color: "inherit" }}
                  onClick={() => scrollToFunction("FAQ")}
                >
                  FAQ
                </a>
              </Typography>
              <Typography variant="h6" component="div" mx={"30px"}>
                <img
                  src={Logo}
                  style={{
                    height: "22px",
                    marginLeft: "40px",
                    marginRight: "40px",
                  }}
                />
              </Typography>
              <Typography
                variant="h6"
                component="div"
                mx={"30px"}
                onClick={() => scrollToFunction("AboutUs")}
              >
                <a style={{ color: "inherit" }}>About Us</a>
              </Typography>
              <Typography
                variant="h6"
                component="div"
                mx={"30px"}
                onClick={() => scrollToFunction("More")}
              >
                <a style={{ color: "inherit" }}>More</a>
              </Typography>
            </Box>

            {/* Right side "Get Started" link */}
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1, display: "flex", justifyContent: "flex-end", paddingRight: "20px" }}
            >
              <Button style={{  paddingLeft: "15px",
                paddingRight: "15px",
                borderRadius: "20px",
                backgroundColor: "white",
                color: "black", }}><a href="./login">Get Started</a></Button>
            </Typography>
          </Toolbar>
        </AppBar>
      </ElevationScroll>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: "100vh",
            backgroundColor: alpha("#000", 0.7),
          }}
        >
          <img
            src={homeImage}
            alt="Background Image"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: 0.3,
            }}
          />
          <Typography
            variant="h2"
            component="div"
            color="#fff"
            sx={{
              position: "absolute",
              top: "80%",
              left: "28%",
              transform: "translate(-50%, -50%)",
              textAlign: "start",
              display: "flex",
              flexDirection: "column",
              fontSize: "40px",
              maxWidth: "720px",
              wordWrap: "break-word",
            }}
          >
            Get Started Today and experience the future of project management.
            <Typography
              variant="h6"
              component="div"
              sx={{display: "flex", justifyContent: "flex-start" }}
            >
              <Button style={{  paddingLeft: "15px",
                paddingRight: "15px",
                marginTop: "25px",
                width: "17%",
                borderRadius: "20px",
                backgroundColor: "white",
                color: "black", }}>Get Started</Button>
            </Typography>
          </Typography>
        </Box>
        <Box paddingLeft={"15px"}>
          <Typography variant="h4" my={"50px"} mx={"3rem"}>
            <Typography variant="h4" marginBottom={"70px"} id="ourServices">
              Our Services
            </Typography>
            <Grid
              container
              spacing={2}
              sx={{ marginBottom: "10px", marginLeft: "5px" }}
            >
              <Typography display={"flex"} alignItems={"center"}>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ boxShadow: "none" }}>
                    <img
                      src={analysisImage}
                      alt="Sticky notes"
                      style={{
                        height: "80%",
                        width: "100%",
                      }}
                    />
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6} pl={10}>
                  <Typography variant="h4" gutterBottom>
                    Highlight specific features
                  </Typography>

                  <Typography variant="body1" maxWidth={"40rem"}>
                    Monitor changes in interest rates, which can affect a
                    company's borrowing costs and investment strategy.
                  </Typography>
                </Grid>
              </Typography>
            </Grid>
            <Grid
              container
              spacing={2}
              sx={{ marginBottom: "10px", marginLeft: "5px" }}
            >
              <Typography display={"flex"} alignItems={"center"}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h4" gutterBottom>
                    Highlight specific features
                  </Typography>

                  <Typography variant="body1" maxWidth={"40rem"}>
                    Empower your team with real-time collaboration and progress
                    tracking.
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ boxShadow: "none" }}>
                    <img
                      src={realCommunicationImage}
                      alt="Sticky notes"
                      style={{
                        height: "80%",
                        width: "100%",
                      }}
                    />
                  </Paper>
                </Grid>
              </Typography>
            </Grid>
            <Grid
              container
              spacing={2}
              sx={{ marginBottom: "10px", marginLeft: "5px" }}
            >
              <Typography display={"flex"} alignItems={"center"}>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ boxShadow: "none" }}>
                    <img
                      src={planningToolsImage}
                      alt="planningTools"
                      style={{
                        height: "80%",
                        width: "100%",
                      }}
                    />
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6} pl={10}>
                  <Typography variant="h4" gutterBottom>
                    Highlight specific features
                  </Typography>

                  <Typography variant="body1" maxWidth={"40rem"}>
                    Meet deadlines and stay on track with powerful project
                    planning tools.
                  </Typography>
                </Grid>
              </Typography>
            </Grid>
            <Grid
              container
              spacing={2}
              sx={{ marginBottom: "30px", marginLeft: "5px" }}
            >
              <Typography display={"flex"} alignItems={"center"}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h4" gutterBottom>
                    Highlight specific features
                  </Typography>

                  <Typography variant="body1" maxWidth={"40rem"}>
                    Real-time collaboration, intuitive task management, and
                    insightful reporting for successful projects.
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ boxShadow: "none" }}>
                    <img
                      src={lastImage}
                      alt="lastImage"
                      style={{
                        height: "80%",
                        width: "100%",
                      }}
                    />
                  </Paper>
                </Grid>
              </Typography>
            </Grid>
          </Typography>
        </Box>
        <Typography
          sx={{
            marginTop: "10px",
            backgroundColor: "#D0D3D7",
            padding: "40px",
          }}
        >
          <Typography
            variant="h4"
            gutterBottom
            sx={{ paddingTop: "50px", paddingLeft: "80px" }}
            id="FAQ"
          >
            Frequently Asked Questions (FAQ)
          </Typography>
          <Accordion
            sx={{
              backgroundColor: "#D0D3D7",
              marginLeft: "80px",
              marginTop: "30px",
              boxShadow: "none",
              border: "none",
              "& .Mui-expanded": {
                paddingLeft: "47px", // Apply paddingLeft when Accordion is expanded
              },
            }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>
                What services do you offer in project management?
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box pl={10}>
                <Typography>
                  We offer comprehensive project planning, execution, and
                  monitoring services to help you achieve your project goals
                  efficiently.
                </Typography>
              </Box>
            </AccordionDetails>
          </Accordion>
          <Accordion
            sx={{
              backgroundColor: "#D0D3D7",
              marginLeft: "80px",
              marginTop: "30px",
              boxShadow: "none",
              border: "none",
              "& .Mui-expanded": {
                paddingLeft: "47px", // Apply paddingLeft when Accordion is expanded
              },
            }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>
                How experienced is your project management team?
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box pl={10}>
                <Typography>
                  Our team consists of highly skilled and experienced
                  professionals who have successfully managed various projects
                  across different industries.
                </Typography>
              </Box>
            </AccordionDetails>
          </Accordion>
          <Accordion
            sx={{
              backgroundColor: "#D0D3D7",
              marginLeft: "80px",
              marginTop: "30px",
              marginBottom: "40px",
              boxShadow: "none",
              border: "none",
              "& .Mui-expanded": {
                paddingLeft: "47px", // Apply paddingLeft when Accordion is expanded
              },
            }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>
                Do you provide project budgeting and cost control?
              </Typography>
            </AccordionSummary>
            <AccordionDetails
              sx={{
                paddingBottom: "20px",
              }}
            >
              <Box pl={10}>
                <Typography>
                  Yes, we provide effective budgeting and cost control
                  strategies to ensure your project stays within the allocated
                  budget.
                </Typography>
              </Box>
            </AccordionDetails>
          </Accordion>
        </Typography>
        <Grid
          container
          spacing={2}
          sx={{ marginTop: "50px", paddingLeft: "8rem", marginBottom: "30px" }}
        >
          <Typography display={"flex"} alignItems={"center"}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ boxShadow: "none" }}>
                <img
                  src={austinDistelImage}
                  alt="austinDistelImage"
                  style={{ width: "80%", borderRadius: "15px" }}
                />
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h4" gutterBottom id="AboutUs">
                About NexaPro
              </Typography>

              <Typography variant="body1" maxWidth={"40rem"}>
                Welcome to NexaPro, a leading project management webSite from
                Egypt. With a proven track record of delivering successful
                projects, we are dedicated to providing top-notch services to
                help our clients achieve their goals.
              </Typography>
              <Typography variant="body1" maxWidth={"40rem"}>
                Our team of experienced professionals is committed to excellence
                and innovation, ensuring that every project is completed on time
                and within budget. Trust NexaPro to take your project to the
                next level.
              </Typography>
            </Grid>
          </Typography>
        </Grid>
      </Box>
      <footer className="footer">
      <div className="topFooter">
        <div className="footerSection">
          <h3 className="footerTitle">
            Nexa<span>Pro</span>
          </h3>
          <p>we're here to answer your questions,</p>
          <p>provide support, and help you leverage the</p>
          <p>power of NexaPro for financial success.</p>
        </div>
        <div className="footerSection">
          <h3 className="footerTitle">Quick Menu</h3>
          <ul className="footerList">
            <li>Company</li>
            <li>Platform</li>
            <li>Product</li>
            <li>Solutions</li>
          </ul>
        </div>
        <div className="footerSection">
          <h3 className="footerTitle">Licence</h3>
          <ul className="footerList">
            <li>Privacy policy</li>
            <li>Copyright</li>
            <li>Term and conditions</li>
          </ul>
        </div>
        <div className="footerSection">
          <h3 className="footerTitle">Company</h3>
          <ul className="footerList">
            <li>Privacy policy</li>
            <li>Copyright</li>
            <li>Term and conditions</li>
          </ul>
        </div>
      </div>
      <div className="bottomFooter">
        <p>Copyright &#169; 2023 NexaPro</p>
        <img src={Logo} width={"100px"} alt="NexaPro Logo" />
        <div className="social">
          <NavLink to={"#"}>
            <img src={facebookIcon} className="socialMedia" alt="Facebook"/>
          </NavLink>
          <NavLink to={"#"}>
            <img src={instagramIcon} alt="Instagram" className="socialMedia"/>
          </NavLink>
          <NavLink to={"#"}>
            <img src={linkedinIcon} alt="LinkedIn" className="socialMedia"/>
          </NavLink>
          <NavLink to={"#"}>
            <img src={twitterXIcon} alt="Twitter" className="socialMedia"/>
          </NavLink>
        </div>
      </div>
    </footer>
    </React.Fragment>
  );
}
export default Home

