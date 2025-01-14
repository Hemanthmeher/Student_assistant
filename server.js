// server.js
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const mammoth = require('mammoth');
const pdfParse = require('pdf-parse');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.static('public'));
app.use(express.json());

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        'text/plain',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Please upload a .txt, .pdf, or .doc/.docx file.'));
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 30 * 1024 * 1024 // 30MB limit
    }
});

// Function to read text file
const readTextFile = (filePath) => {
    return fs.readFileSync(filePath, 'utf8');
};

// Function to read Word document
const readWordDocument = async (filePath) => {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
};

// Function to read PDF file
const readPDFFile = async (filePath) => {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    return data.text;
};

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Handle file upload and processing
// Handle file upload and processing
app.post('/api/process', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        let textContent = '';
        const filePath = req.file.path;
        const format = req.body.format || 'bullets';

        // Extract text based on file type
        switch (req.file.mimetype) {
            case 'text/plain':
                textContent = readTextFile(filePath);
                break;
            case 'application/pdf':
                textContent = await readPDFFile(filePath);
                break;
            case 'application/msword':
            case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
                textContent = await readWordDocument(filePath);
                break;
            default:
                throw new Error('Unsupported file type');
        }

        // Generate summary with bullet points
        let summary = `File Analysis for: ${req.file.originalname}\n\n`;
        summary += `Content Preview:\n${textContent.substring(0, 500)}...\n\n`;

        // Add file details with bullet points
        summary += `File Details:\n`;
        summary += `- File Name: ${req.file.originalname}\n`;
        summary += `- File Size: ${(req.file.size / 1024).toFixed(2)} KB\n`;
        summary += `- File Type: ${req.file.mimetype}\n`;
        summary += `- Character Count: ${textContent.length}\n`;
        summary += `- Word Count: ${textContent.split(/\s+/).length}\n`;

        // Clean up uploaded file
        fs.unlinkSync(filePath);

        res.json({
            success: true,
            summary: summary,
            fileName: req.file.originalname,
            fileSize: req.file.size,
            fileType: req.file.mimetype
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: `Error processing file: ${error.message}` });
    }
});


// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: err.message || 'Something broke!' });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});