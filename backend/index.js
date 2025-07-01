require('dotenv').config();
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const FormDataModel = require('./models/FormData');

const app = express();
app.use(express.json());
app.use(cors());
const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/practice_mern';
mongoose.connect(mongoURI);

app.post('/register', (req, res) => {
    const {name, email, password} = req.body;
    FormDataModel.findOne({email: email})
    .then(user => {
        if(user){
            res.json("Already registered")
        }
        else{
            FormDataModel.create(req.body)
            .then(log_reg_form => res.json(log_reg_form))
            .catch(err => res.json(err))
        }
    })
})



app.get('/ping', (req, res) => {
  res.status(200).json({ status: 'ok' });
});




app.post('/login', (req, res) => {
    const {email, password} = req.body;
    FormDataModel.findOne({email: email})
    .then(user => {
        if(user){
            if(user.password === password) {
                res.json("Success");
            }
            else{
                res.json("Wrong password");
            }
        }
        else{
            res.json("No records found! ");
        }
    })
})


app.put('/update-user/:id', (req, res) => {
    const userId = req.params.id;
    const updateData = req.body;
    
    FormDataModel.findByIdAndUpdate(userId, updateData, { new: true })
    .then(updatedUser => {
        if(updatedUser) {
            res.json(updatedUser);
        } else {
            res.json("User not found");
        }
    })
    .catch(err => res.json(err));
});

app.put('/update-user-by-email', (req, res) => {
    const { email, ...updateData } = req.body;
    
    FormDataModel.findOneAndUpdate({email: email}, updateData, { new: true })
    .then(updatedUser => {
        if(updatedUser) {
            res.json(updatedUser);
        } else {
            res.json("User not found");
        }
    })
    .catch(err => res.json(err));
});


app.get('/get-user/:email', (req, res) => {
    const email = req.params.email;
    
    FormDataModel.findOne({email: email})
    .then(user => {
        if(user) {
            res.json(user);
        } else {
            res.json("User not found");
        }
    })
    .catch(err => res.json(err));
});



app.get('/get-all-users', (req, res) => {
    FormDataModel.find({}, '-password -__v -llmText') 
    .then(users => {
        const sorted = users.sort((a, b) => (b.totalScore || 0) - (a.totalScore || 0));
        res.json(sorted);
    })
    .catch(err => res.status(500).json({ error: 'Failed to fetch users' }));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});