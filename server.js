const NodeMediaServer = require('node-media-server');
const ffmpeg = require('@ffmpeg-installer/ffmpeg');
const express = require("express")

const app = express()

const config = {
  rtmp: {
    port: 1935,
    chunk_size: 60000,
    gop_cache: true,
    ping: 60,
    ping_timeout: 30
  },
  http: {
    port: 8000,
    mediaroot: './media',
    allow_origin: '*'
  },
  trans: {
    ffmpeg: ffmpeg.path,
    tasks: [
      {
        app: 'live',
        ac: 'aac',
        hls: true,
        hlsFlags: '[hls_time=10:hls_list_size=3:hls_flags=delete_segments]',
        dash: true,
        dashFlags: '[f=dash:window_size=3:extra_window_size=5]'
      }
    ]
  }
};
 
var nms = new NodeMediaServer(config)

nms.run()


// app.get("/start",(req,res)=>{
  
// })

// nms.run();


// nms.on('preConnect', (id, args) => {
//   console.log('[NodeEvent on preConnect]', `id=${id} args=${JSON.stringify(args)}`);
//   // let session = nms.getSession(id);
//   // session.reject();
// });

// nms.on('postConnect', (id, args) => {
//   console.log('[NodeEvent on postConnect]', `id=${id} args=${JSON.stringify(args)}`);
// });

// nms.on('doneConnect', (id, args) => {
//   console.log("stream done connecting");
// });

// nms.on('prePublish', (id, StreamPath, args) => {
//     console.log('Stream prepublish')
//   // let session = nms.getSession(id);
//   // session.reject();
// });

// nms.on('postPublish', (id, StreamPath, args) => {
//   console.log('stream postpublish');
// });

// nms.on('donePublish', (id, StreamPath, args) => {
//   console.log("Stream donepublish");
// });

// nms.on('prePlay', (id, StreamPath, args) => {
//   console.log("stream preplay");
//   let session = nms.getSession(id);
//   console.log(args)
//   // session.reject();
// });

// nms.on('postPlay', (id, StreamPath, args) => {
//   console.log("stream post play");
// });

// nms.on('donePlay', (id, StreamPath, args) => {
//   console.log("stream is done playing");
// });


// app.listen(3000,()=>{
//   console.log("Server is running")
// })