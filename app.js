// app.js

const express = require('express');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const moment = require('moment');
const { Employee, Departments, sequelize } = require('./models/recordmodel');  
const app = express();
const upload = multer({ dest: 'uploads/' });  

app.use(express.json());
app.use(express.static('uploads'));


// File Upload Endpoint
app.get('/show',async(req,res)=>{
  const data = await Employee.findAll();
  const data1=await Departments.findAll();
  res.json({
    Employee:data,data1
  });

})

app.post('/upload', upload.single('file'), async (req, res) => {
  const invalidRows = [];
  const validRows = [];
  let  duplicates = [];
  let errorMessages = [];
  let promises=[];
 
  const filePath = req.file.path;

  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', async (row) => {
      const { EmployeeID, Name, Email, Department, JoiningDate } = row;
      let isValid = true;
   
      const promise = (async () => {
      const existingEmployee = await Employee.findOne({ where: { EmployeeID } });
      if (existingEmployee) {
        duplicates.push(EmployeeID);
        console.log(duplicates);
        isValid = false;
        errorMessages.push('Duplicate Employee ID');
      }

      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
      if (!emailRegex.test(Email)) {
        isValid = false;
        errorMessages.push('Invalid email format');
      }

      // Validate Joining Date format
      const joiningDate = moment(JoiningDate, 'YYYY-MM-DD', true);
      if (!joiningDate.isValid()) {
        isValid = false;
        errorMessages.push('Invalid Joining Date format');
      }

      const existingDepartment = await Departments.findOne({ where: { name: Department } });
      if (!existingDepartment) {
        await Departments.create({ name: Department });
      }

      if (isValid) {
        await Employee.create({
          EmployeeID: row.EmployeeID,
          Name: row.Name,
          Email: row.Email,
          Department: row.Department,
          JoiningDate: row.JoiningDate,
        });
 } 
})();

  promises.push(promise); 

    })
    .on('end', async () => {
      await Promise.all(promises);
      console.log("hello promises",promises);

      console.log("successfully added");
       console.log(duplicates);
      res.json({
        message: 'File processed successfully!',
        duplicates
      });
});
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
