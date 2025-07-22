import os
import google.generativeai as genai
from flask import Flask, render_template, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Configure Gemini API
# TODO: Replace with your actual Gemini API key
GEMINI_API_KEY = "AIzaSyBbCVSLlEFoAg3BmzLP0VcBRHkEDxnirGQ"
genai.configure(api_key=GEMINI_API_KEY)

# Initialize the model
model = genai.GenerativeModel('gemini-1.5-flash')

# Language-specific prompts for better code generation
LANGUAGE_PROMPTS = {
    'html': """
    Generate clean, semantic HTML code for: {prompt}
    
    Requirements:
    - Use modern HTML5 elements
    - Include proper structure and accessibility
    - Add relevant classes for styling
    - Ensure responsive design considerations
    - Only return the HTML code, no explanations
    """,
    
    'css': """
    Generate modern CSS code for: {prompt}
    
    Requirements:
    - Use modern CSS features (flexbox, grid, custom properties)
    - Include responsive design with media queries
    - Use semantic class names
    - Add smooth transitions and hover effects
    - Only return the CSS code, no explanations
    """,
    
    'javascript': """
    Generate clean, modern JavaScript code for: {prompt}
    
    Requirements:
    - Use ES6+ features (arrow functions, const/let, destructuring)
    - Include proper error handling
    - Add comments for complex logic
    - Follow best practices for performance
    - Only return the JavaScript code, no explanations
    """,
    
    'python': """
    Generate clean, pythonic code for: {prompt}
    
    Requirements:
    - Follow PEP 8 style guidelines
    - Use appropriate data structures
    - Include docstrings for functions
    - Handle edge cases appropriately
    - Only return the Python code, no explanations
    """,
    
    'typescript': """
    Generate TypeScript code for: {prompt}
    
    Requirements:
    - Use proper type annotations
    - Include interfaces where appropriate
    - Use modern TypeScript features
    - Follow best practices for type safety
    - Only return the TypeScript code, no explanations
    """,
    
    'react': """
    Generate a React component for: {prompt}
    
    Requirements:
    - Use functional components with hooks
    - Include proper TypeScript types
    - Use modern React patterns
    - Include proper prop validation
    - Add comments for complex logic
    - Only return the React JSX code, no explanations
    """
}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/generate', methods=['POST'])
def generate_code():
    try:
        data = request.json
        prompt = data.get('prompt', '')
        language = data.get('language', 'javascript').lower()
        
        if not prompt.strip():
            return jsonify({'error': 'Please provide a description'}), 400
        
        # Get language-specific prompt template
        template = LANGUAGE_PROMPTS.get(language, LANGUAGE_PROMPTS['javascript'])
        full_prompt = template.format(prompt=prompt)
        
        # Generate code using Gemini
        response = model.generate_content(full_prompt)
        generated_code = response.text
        
        # Clean up the response (remove markdown code blocks if present)
        if generated_code.startswith('```'):
            lines = generated_code.split('\n')
            # Remove first line with ```language and last line with ```
            generated_code = '\n'.join(lines[1:-1])
        
        return jsonify({
            'code': generated_code,
            'language': language
        })
    
    except Exception as e:
        return jsonify({'error': f'Failed to generate code: {str(e)}'}), 500

@app.route('/health')
def health():
    return jsonify({'status': 'healthy'})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)