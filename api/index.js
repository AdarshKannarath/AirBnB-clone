const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const imageDownloader = require('image-downloader');
const multer=require('multer')
const fs=require('fs')
const cookieParser = require('cookie-parser');
const User = require('./models/User');
const Place = require('./models/Place');
const Booking = require('./models/Booking');
const bcrypt = require('bcryptjs');
const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = "fgdhfghdggh3re";
const { default: mongoose } = require('mongoose');
const app = express();
require('dotenv').config();
app.use(express.json());
app.use('/uploads', express.static('uploads')); 
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

mongoose.connect(process.env.MONGO_URL);

function getUserDataFromReq(req) {
  return new Promise((resolve, reject) => {
    jwt.verify(req.cookies.token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      resolve(userData);
    });
  });
}


app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    const userDoc = await User.create({
        name,
        email,
        password: bcrypt.hashSync(password, bcryptSalt)
    });
    res.json(userDoc);
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const userDoc = await User.findOne({ email: email });
    if (userDoc) {
        const passwordComparison = bcrypt.compareSync(password, userDoc.password);
        if (passwordComparison) {
            jwt.sign({ email: userDoc.email, id: userDoc._id }, jwtSecret, {}, (err, token) => {
                if (err) throw err;
                res.cookie('token', token).json(userDoc);
            });

        } else {
            res.status(422).json('password not matched');
        }
    } else {
        res.json('not found');
    }
});

app.get('/profile', (req, res) => {
    const { token } = req.cookies;
    if (token) {
        jwt.verify(token, jwtSecret, {}, async (err, userData) => {
            if (err) throw err;
            const { name, email, id } = await User.findById(userData.id);
            res.json({ name, email, id });
        });
    } else {
        res.json(null);
    }

});

app.post('/logout', (req,res) => {
  res.clearCookie('token', '').json(true);
});

app.post('/upload-by-link', async (req, res) => {
    const { link } = req.body;
    const newName = 'photo' + Date.now() + '.jpg';
    try {
        await imageDownloader.image({
            url: link,
            dest: __dirname + '/uploads/' + newName
        });
        res.json(newName);
    } catch (error) {
        console.error("Error downloading the image: ", error);
        res.status(500).json({ error: 'Image download failed' });
    }
});

const photosMiddleware = multer({ dest: 'uploads' });
app.post('/upload', photosMiddleware.array('photos', 100), (req, res) => {
    const uploadedFiles = [];
    for (let i = 0; i < req.files.length; i++) {
        const { path, originalname } = req.files[i];
        const parts = originalname.split('.');
        const ext = parts[parts.length - 1];
        const newPath = path + '.' + ext;
        fs.renameSync(path, newPath);
        uploadedFiles.push(newPath.replace('uploads\\', ''));
    }
    // console.log(req.files); 
    res.json(uploadedFiles); 
});



app.post('/places', (req, res) => {
    const { token } = req.cookies;
    if (!token) {
        return res.status(401).json({ error: 'Token must be provided' });
    }

    const {
        title, address, addedPhotos, description,
        perks, extraInfo, checkIn, checkOut, maxGuests,price,
    } = req.body;

    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid token' });
        }

        try {
            const placeDoc = await Place.create({
                owner: userData.id,price,
                title, address, photos:addedPhotos, description,
                perks, extraInfo, checkIn, checkOut, maxGuests,
            });
            res.json(placeDoc);
        } catch (createErr) {
            console.error('Error creating place:', createErr);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
});

app.get('/user-places',(req,res)=>{
    const {token}=req.cookies
    // console.log("token",token)
    jwt.verify(token,jwtSecret,{},async (err,userData)=>{
        const {id}=userData
        res.json(await Place.find({owner:id}))
    })
})

app.get('/places/:id',async (req,res)=>{
    const {id}=req.params
    res.json(await Place.findById(id))
})

app.put('/places',async (req,res)=>{
    const {token}=req.cookies
    const{
        id,title, address, photos:addedPhotos, description,
        perks, extraInfo, checkIn, checkOut, maxGuests,price,
    }=req.body
    jwt.verify(token,jwtSecret,{},async (err,userData)=>{
        if(err) throw err
        const placeDoc=await Place.findById(id)
        if(userData.id===placeDoc.owner.toString()){
            placeDoc.set({
                title, address, photos:addedPhotos, description,
                perks, extraInfo, checkIn, checkOut, maxGuests,price,
            })
            await placeDoc.save()
            res.json('ok')
        }
    })
})

app.get('/place',async (req,res)=>{
    res.json(await Place.find())
})

app.post('/bookings', async (req, res) => {
    try {
        const userData = await getUserDataFromReq(req);
        const { place, checkIn, checkOut, numberOfGuests, name, phone,price } = req.body;
        const newBooking = new Booking({
            place,
            checkIn,
            checkOut,
            numberOfGuests,
            name,
            phone,
            price,
            user: userData.id
        });

        const savedBooking = await newBooking.save();
        res.json(savedBooking);
    } catch (err) {
        console.error("Error creating booking:", err);
        res.status(500).send('Error creating booking');
    }
});

app.get('/bookings', async (req,res) => {
//   mongoose.connect(process.env.MONGO_URL);
  const userData = await getUserDataFromReq(req);
  res.json( await Booking.find({user:userData.id}).populate('place'))
});


app.listen(4000, () => {
    console.log('Server is running on port 4000');
});
