import React from "react";
import Navbar from "../components/Navbar";
import { useEffect } from "react";
import axios from "axios";
import {Link, Text, Flex} from "@chakra-ui/react";

const Visualization = () => {

    useEffect(() => {
        axios
          .post("https://us-central1-project5410-20200120.cloudfunctions.net/datavisualization")
          .then((response) => {
            console.log("Success");
          })
          .catch((error) => {
            console.log(error);
          });
      }, []);

    return (
        <div><Navbar />
        <iframe width="100%" title="visualization_frame" height="1000" src="https://datastudio.google.com/embed/reporting/ebb03ff4-e2e0-4dfb-a85f-92b1c2bfcbba/page/8sWyC" frameBorder="0" style={{border:0}} allowFullScreen></iframe>
       </div> 
    );
};

export default Visualization;