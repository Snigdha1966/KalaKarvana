# ✨ KalaKarvan: The Artisan's Digital Amplifier

<img width="12" height="12" alt="image" src="https://github.com/user-attachments/assets/81fd8ef3-b294-43fc-b718-068ed2e480a0" />


> A Generative AI-powered digital partner that empowers local Indian artisans to thrive in the modern marketplace by helping them create stunning product visuals and compelling narratives for their craft.

---

### 🎯 **Core Mission**

Indian artisans, rich in cultural heritage and traditional skills, often face a significant digital divide. Lacking digital marketing skills, professional photography equipment, and the ability to craft stories for a global audience, their incredible work can go unnoticed online.

**KalaKarvan** was built to bridge this gap. It serves as an AI-powered mentor, providing artisans with the tools to enhance their digital presence, tell the rich story behind their craft, and ultimately expand their market reach, securing a sustainable future for these timeless art forms.

### 🚀 **Live Demo & Video Pitch**

*   **Live Application:** **[YOUR LIVE DEMO URL HERE]**
*   **3-Minute Video Pitch:** **[YOUR VIDEO PITCH URL HERE]**

### ⭐ **Key Features**

*   **✍️ Caption Crafter:** Artisans upload an image of their craft, and the multimodal AI (**gemini-2.5-flash**) analyzes it to generate a rich, culturally-aware product story, complete with a title, caption, and hashtags.
*   **🎨 Image Alchemist:** An integrated tool (**gemini-2.5-flash-image-preview**) to edit and transform product photos with simple text prompts, such as adding frames or changing backgrounds.
*   **🎥 Story Weaver:** Creates short, engaging videos from a text prompt and an optional image, perfect for sharing an artisan's creative process (**veo-2.0-generate-001**).
*   **🧠 Digital Guru & Art Style Advisor:** A conversational AI (**gemini-2.5-flash**) that provides expert advice on digital marketing strategies and offers constructive feedback on artistic styles.
*   **📂 My Collection:** A personal, secure dashboard where all generated content (captions, images, videos) is saved and can be managed for use on any platform.

### 🧠 **Technology Stack & Architecture**

This project is a modern, client-side web application that interacts directly with the Google AI platform.

*   **Frontend:** React, TypeScript, Tailwind CSS
*   **AI Models (via `@google/genai` SDK):**
    *   `gemini-2.5-flash` for multimodal content generation and chat.
    *   `gemini-2.5-flash-image-preview` for advanced image editing.
    *   `veo-2.0-generate-001` for text- and image-to-video generation.
*   **Local Storage:** Uses the browser's `localStorage` for session management and saving user collections, ensuring data privacy and offline access.
*   **Deployment:** Can be deployed to any static web host (e.g., Firebase Hosting, Vercel, Netlify).

The application follows a client-centric architecture. The React frontend, built with Vite, calls the Google AI APIs directly via the `@google/genai` library. This approach simplifies development and deployment, removing the need for a separate backend server.

### 🛠️ **Getting Started: Local Setup Instructions**

To get a local copy up and running, follow these simple steps.

#### **Prerequisites**

*   Node.js (v18 or later)
*   npm or yarn

#### **Installation & Setup**

1.  **Clone the repository:**
    ```sh
    git clone [YOUR GITHUB REPO URL HERE]
    cd kalakarvan-ai-copilot
    ```

2.  **Install dependencies:**
    ```sh
    npm install
    ```

3.  **Set up environment variables:**
    *   You will need a Google AI API Key. You can get one from [Google AI Studio](https://aistudio.google.com/).
    *   The application expects the API key to be available as an environment variable named `API_KEY`. The execution environment should handle this.

4.  **Run the Project Locally:**
    *   Start the development server:
        ```sh
        npm run dev
        ```
    *   Open your browser to the local URL provided in the terminal (usually `http://localhost:5173`) to see the result.

### 🔮 **Future Work**

*   Full implementation of the **Virtual Gallery** to create a shareable, public portfolio for each artisan.
*   AI-powered pricing suggestions based on craft complexity and market trends.
*   Multi-language support for both the UI and AI-generated content to cater to diverse linguistic regions in India.

---

*This project was created for a Generative AI Hackathon.*
