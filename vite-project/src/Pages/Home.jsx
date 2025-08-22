import React, { useState } from 'react'
import axios from 'axios'

const Home = () => {
    const [idea, setIdea] = useState("");
    const [category, setCategory] = useState("AI SaaS");
    const [result, setResult] = useState("");
    const [loading, setLoading] = useState(false);
    const [viewMode, setViewMode] = useState("preview");

    const handleGenerate = async () => {
        try {
            setLoading(true)
            setResult("")
            const prompt = `
                Create a stunning, professional landing page using HTML and TailwindCSS for a "${category}" business: "${idea}".

                DESIGN REQUIREMENTS:
                - Modern, visually striking design with premium aesthetics
                - Responsive layout that works on all devices
                - Bold, attention-grabbing typography with proper hierarchy
                - Professional color scheme with excellent contrast
                - Smooth hover effects and subtle animations
                - Clean, organized sections with proper spacing

                STRUCTURE REQUIREMENTS:
                1. Hero section with compelling headline, subheadline, and primary CTA
                2. Features section with exactly 3 feature cards, each with different vibrant color schemes
                3. About/Benefits section explaining the value proposition
                4. Social proof section (testimonials or stats)
                5. Final call-to-action section
                6. Footer with essential links

                VISUAL REQUIREMENTS:
                - Use high-quality, relevant images from Unsplash.com (use actual Unsplash URLs like: https://images.unsplash.com/photo-[photo-id]?w=800&h=600&fit=crop)
                - Choose images that directly relate to "${idea}" and "${category}"
                - Ensure all image URLs are working Unsplash links, not placeholders
                - Use vibrant gradient backgrounds and modern color combinations
                - Include icons from Heroicons or similar (use SVG code, not icon fonts)

                TECHNICAL REQUIREMENTS:
                - Complete, valid HTML5 structure
                - Only use TailwindCSS utility classes (no custom CSS)
                - Ensure all images have proper alt text for accessibility
                - Include proper meta tags and page title
                - All links and buttons should have hover states
                - Use semantic HTML elements (header, main, section, footer)

                CONTENT REQUIREMENTS:
                - Write compelling, benefit-focused copy for "${idea}"
                - Create realistic testimonials and social proof elements
                - Include specific features that would appeal to the target market
                - Use action-oriented language in CTAs
                - Make the content conversion-focused

                IMPORTANT: Only return the complete HTML code with inline TailwindCSS classes. Add Tailwind cdn to the code. Do not include any explanations, comments, or additional text outside the HTML.
    `;

            const response = await axios.post("https://openrouter.ai/api/v1/chat/completions",
                {
                    model: "openai/gpt-3.5-turbo-0613",
                    messages: [{
                        role: "user",
                        content: prompt
                    }]
                },
                {
                    headers: {
                        // Changed from process.env to import.meta.env for Vite
                        "Authorization": `Bearer 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`,
                        "Content-Type": "application/json",
                        "HTTP-Referer": "http://localhost:5174",
                        "X-Title": "AI Landing Page Generator"
                    }
                }
            )
            // console.log(response.data.choices[0].message.content);
            let content = response.data.choices[0].message.content;
            // Remove triple backticks and optional "html" language identifier
            content = content.replace(/```html|```/g, "").trim();
            setResult(content);
            setViewMode("preview");
        } catch (err) {
            console.log(err)
            alert("An error occurred")
        } finally {
            setLoading(false);
        }
    }

    const copycode = () => {
        navigator.clipboard.writeText(result);
        alert("code copied to the clipboard")
    }


    return (
        <div className="min-h-screen font-sans px-4 py-10 bg-gray-50">
            {/* ---------- Input Section ---------- */}
            <div className="bg-white max-w-3xl mx-auto rounded-2xl shadow-xl p-8 mb-10">
                <h1 className="text-yellow-800 text-center text-3xl font-bold">
                    AI Landing Page Generator
                </h1>
                <p className="text-gray-600 text-center mx-2 my-1">
                    Create your own landing page for your business within seconds...
                </p>

                <div className="space-y-4 mt-6">
                    <input
                        type="text"
                        value={idea}
                        onChange={(e) => setIdea(e.target.value)}
                        placeholder="Enter your business or express your idea briefly"
                        className="w-full bg-gray-200 rounded-lg p-2 text-[1.2rem] text-yellow-800 focus:bg-gray-100 outline-none"
                    />

                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full bg-gray-200 py-2 px-2 text-yellow-800 rounded-lg outline-none"
                    >
                        <option value="AI SaaS">AI SaaS</option>
                        <option value="Productivity Tool">Productivity Tool</option>
                        <option value="Startup">StartUp</option>
                        <option value="BlogPage">Blog Page</option>
                    </select>

                    <button
                        disabled={loading || idea.trim() === ""}
                        className="w-full p-3 bg-purple-600 font-bold text-[1.1rem] text-gray-100 rounded-lg hover:bg-purple-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={handleGenerate}
                    >
                        {loading ? "Generating..." : "Generate Result"}
                    </button>
                </div>
            </div>

            {/* ---------- Output Section ---------- */}
            {result && (
                <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-5 relative">
                    {/* Top-right toggle button */}
                    <div className="absolute top-4 right-4">
                        {viewMode === "preview" ? (
                            <button
                                onClick={() => setViewMode("code")}
                                className="bg-gray-200 px-3 py-1 rounded-lg hover:bg-gray-300 cursor-pointer"
                            >
                                View Code
                            </button>
                        ) : (
                            <button
                                onClick={() => setViewMode("preview")}
                                className="bg-gray-200 px-3 py-1 rounded-lg hover:bg-gray-300 cursor-pointer"
                            >
                                View Preview
                            </button>
                        )}
                    </div>

                    {/* Conditional Rendering */}
                    {viewMode === "preview" ? (
                        <div>
                            <h2 className="text-xl font-bold mb-3">Preview:</h2>
                            <div
                                className="border rounded-lg p-5 overflow-auto"
                                dangerouslySetInnerHTML={{ __html: result }}
                            />
                        </div>
                    ) : (
                        <div>
                            <div className="flex items-center mb-3">
                                <h2 className="text-xl font-bold">HTML Code:</h2>
                                <button
                                    className="bg-gray-200 ml-2 px-3 py-1 rounded-lg hover:bg-gray-300 cursor-pointer"
                                    onClick={copycode}
                                >
                                    📋 Copy
                                </button>
                            </div>
                            <div className="bg-black text-green-400 font-mono text-sm rounded-lg p-4 max-h-[600px] overflow-y-auto whitespace-pre-wrap">
                                {result}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Home;