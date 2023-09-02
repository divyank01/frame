const express = require('express');
const multer = require('multer');
const path = require('path')
const { exec } = require('node:child_process')

const app = express();
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join('/usr/src/images/images'));
    //cb(null, path.join('/home/pi/divyank/slideshow','pictures'));
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});




const upload = multer({ storage: storage });

app.post('/upload', upload.array('uploadedfile',100), (req, res) => {
  exec('cd /usr/src/images && sh compress.sh', (err, output) => {
    if (err) {
        console.error("could not execute command: ", err)
        res.send({"message":err});
        return
    }
    exec('cd /usr/src/images/images && rm *', (err, output) => {
      if (err) {
          console.error("could not execute command: ", err)
          res.send({"message":err});
          return
      }
      console.log("Output: \n", output)
      res.send({"message":"Files uploaded are compressed and stored originals are deleted."});
    });
  });
});

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '/index.html'));
});

const port = 9900;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});