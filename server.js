const express = require('express');  
const bodyParser = require('body-parser');  
const cors = require('cors');  

const app = express();  
const port = 3000;  

app.use(cors());  
app.use(bodyParser.json());  

let ageHistory = []; // Array to store age calculations  

// Endpoint to save age and DOB  
app.post('/api/save', (req, res) => {  
    const { dob, years, months, days } = req.body;  
    const today = new Date();  

    // Validate that the date of birth is not in the future  
    if (new Date(dob) > today) {  
        return res.status(400).json({ message: "Invalid date of birth in the future." });  
    }  

    // Check if the required data is provided  
    if (dob && years !== undefined && months !== undefined && days !== undefined) {  
        ageHistory.push({ dob, years, months, days });  
        return res.status(201).json({ message: "Data saved successfully!" });  
    } else {  
        return res.status(400).json({ message: "Invalid data!" });  
    }  
});  

// Endpoint to get age history  
app.get('/api/history', (req, res) => {  
    res.json(ageHistory);  
});  

// Endpoint to delete an entry from age history  
app.delete('/api/history/:index', (req, res) => {  
    const index = parseInt(req.params.index);  
    if (!isNaN(index) && index >= 0 && index < ageHistory.length) {  
        ageHistory.splice(index, 1); // Remove the item at the specified index  
        return res.status(200).json({ message: "Entry deleted successfully!" });  
    } else {  
        return res.status(400).json({ message: "Invalid index!" });  
    }  
});  

// Serve static files from the public directory  
app.use(express.static('public'));  

app.listen(port, () => {  
    console.log(`Server running at http://localhost:${port}`);  
});  