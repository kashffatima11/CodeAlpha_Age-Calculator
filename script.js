
document.getElementById('ageForm').addEventListener('submit', function (e) {  
    e.preventDefault(); // Prevent form submission  

    const dob = new Date(document.getElementById('dob').value);  
    const today = new Date();  

    // Check if birth date is in the future  
    if (dob > today) {  
        document.getElementById('result').innerText = "You are entering an invalid date of birth. Please select a date in the past.";  
        return;  
    }  

    let years = today.getFullYear() - dob.getFullYear();  
    let months = today.getMonth() - dob.getMonth();  
    let days = today.getDate() - dob.getDate();  

    // Adjust months and days if the birth date hasn't occurred this year  
    if (days < 0) {  
        months--;  
        days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();  
    }  

    if (months < 0) {  
        years--;  
        months += 12;  
    }  

    document.getElementById('result').innerHTML = `You are ${years} year${years !== 1 ? 's' : ''}, ${months} month${months !== 1 ? 's' : ''}, and ${days} day${days !== 1 ? 's' : ''} old.`;  

    // Send age data to the server  
    fetch('/api/save', {  
        method: 'POST',  
        headers: {  
            'Content-Type': 'application/json'  
        },  
        body: JSON.stringify({ dob: dob.toISOString(), years, months, days })  
    })  
    .then(response => response.json())  
    .then(data => {  
        loadHistory();  
    })  
    .catch(error => console.error('Error:', error));  
});  

// Function to load age history  
function loadHistory() {  
    fetch('/api/history')  
        .then(response => response.json())  
        .then(data => {  
            const historyDiv = document.getElementById('history');  
            historyDiv.innerHTML = '<h3>Submission History:</h3>';  
            data.forEach((item, index) => {  
                const date = new Date(item.dob);  
                historyDiv.innerHTML += `  
                    <p>  
                        
                        <span>Birthday: ${date.toLocaleDateString()} - Age: ${item.years} years, ${item.months} months, ${item.days} days</span>  
                        <button class="delete-button" onclick="deleteEntry(${index})">Delete</button>  
                    </p>  
                `;  
            });  
        });  
}  

// Function to delete an entry  
function deleteEntry(index) {  
    fetch(`/api/history/${index}`, {  
        method: 'DELETE'  
    })  
    .then(response => {  
        if (response.ok) {  
            loadHistory(); // Reload history after deletion  
        } else {  
            console.error('Error deleting entry');  
        }  
    });  
}  

// Load history on page load  
document.addEventListener('DOMContentLoaded', loadHistory);  