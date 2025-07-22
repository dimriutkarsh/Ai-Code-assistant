# AI Code Generator

A professional AI-powered code generator that transforms natural language descriptions into functional code using Google's Gemini API and Flask.

## 🚀 Features

- **Multi-Language Support**: HTML, CSS, JavaScript, Python, TypeScript, React JSX
- **Natural Language Input**: Describe what you want in plain English
- **Syntax Highlighting**: Beautiful code display with Prism.js
- **Copy to Clipboard**: One-click code copying
- **Responsive Design**: Works perfectly on all devices
- **Sample Prompts**: Quick start examples for each language
- **Real-time Generation**: Powered by Google Gemini AI

## 🛠️ Installation

1. **Clone or download the project files**

2. **Install Python dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Get your Gemini API key**:
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Copy your API key

4. **Configure your API key**:
   - Open `app.py`
   - Find line 11: `GEMINI_API_KEY = "YOUR_GEMINI_API_KEY_HERE"`
   - Replace `YOUR_GEMINI_API_KEY_HERE` with your actual API key

5. **Run the application**:
   ```bash
   python app.py
   ```

6. **Open your browser** and go to `http://localhost:5000`

## 📋 Usage

1. **Select a programming language** from the dropdown
2. **Describe what you want to build** in the textarea
3. **Click "Generate Code"** or press Ctrl+Enter
4. **Copy the generated code** with one click
5. **Use sample prompts** for quick inspiration

## 🎯 Example Prompts

- **HTML**: "Create a responsive navigation bar with dropdown menu"
- **CSS**: "Design a loading spinner with smooth animation"
- **JavaScript**: "Build a form validation function with email check"
- **Python**: "Create a function to calculate fibonacci with memoization"
- **React**: "Make a todo list component with add/delete functionality"
- **TypeScript**: "Create interfaces for a user management system"

## 🔧 Configuration

### API Key Setup
The most important step is adding your Gemini API key to `app.py`:

```python
# Line 11 in app.py
GEMINI_API_KEY = "your_actual_api_key_here"
```

### Environment Variables (Optional)
You can also use environment variables:

1. Create a `.env` file:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```

2. Update `app.py` to use it:
   ```python
   import os
   from dotenv import load_dotenv
   
   load_dotenv()
   GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
   ```

## 🎨 Customization

### Adding New Languages
1. Add the language to the HTML dropdown in `templates/index.html`
2. Add a language prompt template in `app.py` under `LANGUAGE_PROMPTS`
3. Add sample prompts in `static/js/script.js` under `LANGUAGE_EXAMPLES`

### Styling Changes
- Main styles: `static/css/style.css`
- Dark theme with purple gradient accent
- Fully responsive design
- Modern glassmorphism effects

## 📱 Mobile Support

The application is fully responsive and works great on:
- 📱 Mobile phones (320px+)
- 📱 Tablets (768px+)
- 💻 Desktops (1024px+)

## 🔒 Security Notes

- Never commit your API key to version control
- The API key should be kept private and secure
- Consider using environment variables in production
- Add rate limiting for production use

## 🚀 Deployment

For production deployment:

1. **Use environment variables** for the API key
2. **Add rate limiting** to prevent abuse
3. **Use a production WSGI server** like Gunicorn
4. **Enable HTTPS** for secure communication
5. **Add error logging** for monitoring

Example with Gunicorn:
```bash
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

## 🤝 Contributing

Feel free to:
- Add new programming languages
- Improve the AI prompts
- Enhance the UI/UX
- Add new features
- Fix bugs

## 📄 License

This project is open source and available under the MIT License.

---

**Happy Coding!** 🎉

Transform your ideas into code with the power of AI!