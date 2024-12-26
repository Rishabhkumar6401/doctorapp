const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Admin = require('../Model/Admin');  // Ensure this path is correct

// Admin login function
const AdminLogin = async (req, res) => {
    const { username, password } = req.headers;
    

    try {
        // Find the admin by username
        const admin = await Admin.findOne({ username });

        // Log the retrieved admin for debugging
        // console.log('Admin found:', admin);

        // If admin not found
        if (!admin) {
            return res.status(400).json({ message: 'Admin not found' });
        }

        // Check if the password matches
        const isMatch = await bcrypt.compare(password, admin.password);

        // If password is incorrect
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        // Generate JWT token with admin id
      const token = jwt.sign({ admin, role: 'admin' }, "SECRET", { expiresIn: '1h' });
      res.json({ message: 'Logged in successfully', token });

      

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

// const createAdmin = async () => {
//     const username = 'doctor'; // your admin username
//     const password = 'admin123'; // your admin password

//     // Hash the password before saving it to the database
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create and save the admin to the database
//     const admin = new Admin({
//         username,
//         password: hashedPassword,
//     });

//     try {
//         await admin.save();
//         console.log('Admin created successfully');
//     } catch (error) {
//         console.error('Error creating admin:', error);
//     }
// }

// // Call the createAdmin function to add the admin to the database
// createAdmin();

module.exports = { AdminLogin };  // Export the correct function
