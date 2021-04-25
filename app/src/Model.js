import React, { useEffect, useMemo, useState } from "react";
import colabLogoImage from "./help/colab_icon.png";
import openStomp from './network/stompClient';
import {TextField , Fab, Card, CardMedia, Container, CardContent,Typography, IconButton, CardHeader, Avatar, CardActions, Box, Paper, Divider,CardActionArea} from "@material-ui/core"
import {PlayArrow, Stop, MoreVer, Favorite, Share} from '@material-ui/icons';
import Markdown from 'markdown-to-jsx';
import Form from "@rjsf/material-ui";



import useColab from "./network/ipfsClient"
export default function Model({notebook}) {
    console.log("notebook",notebook)
    const {description,form} = notebook;

    const {nodeID: colabNodeID, add:dispatchColab} = useColab();
    const [latestConsole, setLatestConsole] = useState({headers: {text:""}, body:"Loading..."});
    const [latestMedia, setLatestMedia] = useState({headers:{type:"image/jpeg"}});
    const queueMessage = new useMemo(() => {
      return openStomp(setLatestConsole, setLatestMedia)
    },[]);

    const [isRunning, setRunning] = useState(false);
    const [text, setText] = useState("")
    // console.log("latest",latestConsole);


    useEffect(() => setText(latestConsole.headers.text),[latestConsole.headers.text])

    const colabURL = "https://colab.research.google.com/github/voodoohop/colabasaservice/blob/master/colabs/deep-daze.ipynb";
 
  return <Card variant="outlined">
        <CardActionArea>
            <CardContent>
          <Markdown>{description}</Markdown>
          <a href={colabURL} target="_blank"><img src={colabLogoImage} width="70" height="auto" /> </a>
          NodeID: <b>{colabNodeID ? colabNodeID.slice(-4)  : "Not connected..."}</b>
        </CardContent> 
        <CardContent>
        <Form schema={form} onSubmit={({formData}) => dispatchColab(formData)}/>
          </CardContent>      
        <CardMedia component={latestMedia.headers.type.startsWith("image") ? "img" : "video"} src={latestMedia.body} title={text} style={{
        minHeight: "500px"
      }} controls />

        <CardContent>

        <Typography variant="body2" color="textPrimary" component="p" style={{
          fontWeight: "bold"
        }}>
          <pre>{latestConsole.body.replace(/\].*/g, "")}</pre>
        </Typography>
        </CardContent>

        </CardActionArea>
        <CardActions>
        
        
        <IconButton aria-label="add to favorites">
          <Favorite />
        </IconButton>
        <IconButton aria-label="share">
          <Share />
        </IconButton>
        </CardActions>
        </Card>;
};
  