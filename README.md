STUDYEASY
Overview
Studeasy is a web-based tool designed to process and summarize uploaded files in multiple formats such as .txt, .pdf, .doc, and .docx. Users can choose different output formats for the summary, including bullet points, paragraphs, and detailed summaries.

Features
File Upload: Supports file formats .txt, .pdf, .doc, and .docx.
Flexible Output Formats: Generate summaries in bullet points, paragraph format, or detailed analysis.
File Analysis: Provides details like file size, word count, and a preview of the content.
Simple UI: Clean and intuitive interface for easy usage.
Technologies Used
Frontend
HTML, CSS, JavaScript: For building the user interface and interactivity.
Backend
Node.js and Express.js: For handling file processing and generating summaries.
Multer: For file uploads and storage.
Mammoth.js: For reading .doc and .docx files.
pdf-parse: For extracting content from .pdf files.
fs (File System): For file handling and manipulation.

Usage Instructions
Visit the frontend link.
Upload a .txt, .pdf, .doc, or .docx file.
Choose the desired output format (e.g., Bullet Points, Paragraph, or Detailed Summary).
View the summarized result and file analysis details.
Limitations
The maximum file size is 30MB.
For .pdf files, certain complex structures may not be processed accurately due to limitations in the parsing library.
Future Improvements
Add support for more file formats (e.g., .xlsx).
Enhance the summary generation algorithm with AI models.
Allow users to download the summary as a file.
Contributing
Feel free to fork the repository, make changes, and create a pull request. Contributions are always welcome!

