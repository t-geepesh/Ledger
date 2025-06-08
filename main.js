const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const multer  = require('multer');
const port = process.env.PORT || 3129;
require('dotenv').config();
//const upload = multer({ dest: 'uploads/' })

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1E9)}-${file.originalname}`)
  }
})

const upload = multer({ storage: storage })
//const Ledger = require('./models/ledger.js'); // Adjust the path as necessary

//
app.use(express.static('uploads'));
const ledgerSchema = new mongoose.Schema({
    party: {
        type: String,
        required: true
    },
    amount: {
        type: Number
    },
    date: {
        type: Date,
        default: Date.now
    },
    contact : {
        type : Number
    },
    note : {
        type : String
    },
    check:{
        type: Boolean,
        default: false
    } 
});
const Ledger = mongoose.model('Ledger', ledgerSchema);
//
const ledgerWithImgSchema = new mongoose.Schema({
    party: {
        type: String,
        required: true
    },
    amount: {
        type: Number
    },
    url:{
        type : String
    },
    date: {
        type: Date,
        default: Date.now
    },
    contact : {
        type : Number
    },
    note : {
        type : String
    },check:{
        type: Boolean,
        default: false
    }   
});
const LedgerWithImg = mongoose.model('LedgerWithImg', ledgerWithImgSchema);
//



let connect = mongoose.connect(`${process.env.URI}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
})
const bodyParser = require('body-parser');
app.set("view engine", "ejs");
app.set('views', __dirname + '/render');
app.use(bodyParser.urlencoded({ extended: true }));
app.get('/ledger', (req, res) => {
    res.render('home')
});
app.get('/', (req, res) => {
    res.render('public')
})
app.post('/chalan', (req, res) => {
    res.render("done",{
        party: req.body.party,
        amount: req.body.amount,
        contact : req.body.contact,
        note : req.body.note
    })
    const ledger = new Ledger({
        party: req.body.party,
        amount: req.body.amount,
        contact: req.body.contact,
        note: req.body.note
    });

    ledger.save()
    .then(() => {
        console.log('Data saved successfully');
    })
})

app.get("/img", (req, res) => {
    res.render("img")
})

app.post("/img", upload.single('img'), (req, res) => {
    res.render("done")
    const ledgerWithImg = new LedgerWithImg({
        party: req.body.party,
        amount: req.body.amount,
        url: req.file.filename,
        contact: req.body.contact,
        note: req.body.note
    });
    ledgerWithImg.save()
    .then(() => {
        console.log('Data with image saved successfully');
    })

})

app.get("/records", (req,res)=>{
    LedgerWithImg.find().sort({ date: -1 })
    .then((data) => {
        res.render("records", {
            data: data
        });
    })
    .catch((err) => {
        console.error('Error fetching records:', err);
})
})

app.get("/records/wtimg", (req,res)=>{
     Ledger.find().sort({ date: -1 })
    .then((data) => {
        res.render("records_withoutimg", {
            data: data
        });
    })
    .catch((err) => {
        console.error('Error fetching records:', err);
})
})

app.post("/check_", (req, res) => {
    const id = req.body.id;
    Ledger.findByIdAndUpdate(id, { check: true })
    .then(() => {
        console.log('Record updated successfully');
        res.redirect("/records/wtimg");
    })
    .catch((err) => {
        console.error('Error updating record:', err);
        res.status(500).send('Internal Server Error');
    });
})

app.post("/check", (req, res) => {
    const id = req.body.id;
    LedgerWithImg.findByIdAndUpdate(id, { check: true })
    .then(() => {
        console.log('Record updated successfully');
        res.redirect("/records");
    })
    .catch((err) => {
        console.error('Error updating record:', err);
        res.status(500).send('Internal Server Error');
    });
})


app.get("/delete/:id", (req, res) => {
    const id = req.params.id;
    Ledger.findByIdAndDelete(id)
    .then(() => {
        console.log('Record deleted successfully');
        res.redirect("/records/wtimg");
    })
    .catch((err) => {
        console.error('Error deleting record:', err);
        res.status(500).send('Internal Server Error');
    });
})
app.get("/delete_/:id", (req, res) => {
    const id = req.params.id;
    LedgerWithImg.findByIdAndDelete(id)
    .then(() => {
        console.log('Record deleted successfully');
        res.redirect("/records");
    })
    .catch((err) => {
        console.error('Error deleting record:', err);
        res.status(500).send('Internal Server Error');
    });
})


app.post("/check/wtimg", (req, res) => {
    const id = req.body.id;
    Ledger.findByIdAndUpdate(id, { check: true })
    .then(() => {
        console.log('Record updated successfully');
        res.redirect("/records/wtimg");
    })
    .catch((err) => {
        console.error('Error updating record:', err);
        res.status(500).send('Internal Server Error');
    });
})
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})
console.log("hilo")