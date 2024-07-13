const express = require("express");
const multer = require("multer");
const path = require("path");
const { Dropbox } = require("dropbox");
const fetch = require("node-fetch");
require("dotenv").config();

const router = express.Router();

let dbx = new Dropbox({ accessToken: process.env.DROPBOX_ACCESS_TOKEN, fetch });

// Funkcija za osvežavanje access tokena
const refreshAccessToken = async () => {
  try {
    const response = await fetch('https://api.dropboxapi.com/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: process.env.DROPBOX_REFRESH_TOKEN,
        client_id: process.env.DROPBOX_CLIENT_ID,
        client_secret: process.env.DROPBOX_CLIENT_SECRET,
      }),
    });

    const data = await response.json();
    if (data.access_token) {
      process.env.DROPBOX_ACCESS_TOKEN = data.access_token;
      dbx = new Dropbox({ accessToken: data.access_token, fetch });
      console.log("Access token refreshed successfully");
    } else {
      throw new Error('Failed to refresh access token');
    }
  } catch (error) {
    console.error('Error refreshing access token:', error);
  }
};

// Multer setup
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpe?g|png|webp/;
    const mimetypes = /image\/jpe?g|image\/png|image\/webp/;

    const extname = path.extname(file.originalname).toLowerCase();
    const mimetype = file.mimetype;

    if (filetypes.test(extname) && mimetypes.test(mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Images only"), false);
    }
  }
});

const uploadSingleImage = upload.single("image");

router.post("/", async (req, res) => {
  uploadSingleImage(req, res, async (err) => {
    if (err) {
      res.status(400).send({ message: err.message });
    } else if (req.file) {
      const filename = `${req.file.fieldname}-${Date.now()}${path.extname(req.file.originalname)}`;
      const fileBuffer = req.file.buffer;

      try {
        const response = await dbx.filesUpload({
          path: `/uploads/${filename}`,
          contents: fileBuffer,
          mode: 'add',
          autorename: true,
          mute: false,
        });

        const sharedLink = await dbx.sharingCreateSharedLinkWithSettings({
          path: response.result.path_lower,
          settings: {
            requested_visibility: 'public',
          },
        });

        // direktan link za sliku
        const rawLink = sharedLink.result.url.replace('dl=0', 'raw=1');
        res.status(200).send({
          message: "Image uploaded successfully",
          image: rawLink,
        });
      } catch (error) {
        if (error.status === 401) { 
          await refreshAccessToken(); 

          
          try {
            const response = await dbx.filesUpload({
              path: `/uploads/${filename}`,
              contents: fileBuffer,
              mode: 'add',
              autorename: true,
              mute: false,
            });

            const sharedLink = await dbx.sharingCreateSharedLinkWithSettings({
              path: response.result.path_lower,
              settings: {
                requested_visibility: 'public',
              },
            });

            // direktan link za sliku
            const rawLink = sharedLink.result.url.replace('dl=0', 'raw=1');
            res.status(200).send({
              message: "Image uploaded successfully",
              image: rawLink,
            });
          } catch (retryError) {
            res.status(500).send({ message: retryError.message });
          }
        } else {
          res.status(500).send({ message: error.message });
        }
      }
    } else {
      res.status(400).send({ message: "No image file provided" });
    }
  });
});

module.exports = router;
