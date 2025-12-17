"use client"
import { useRef, useState, ChangeEvent, useCallback, TextareaHTMLAttributes } from "react";
import {Container} from "@shared";
import { Plus, X, Image as ImageIcon, Upload } from "lucide-react";
import axios from "axios";

/**
 * Defines the structure for the story text state.
 */
interface TextState {
    title: string;
    subtitle: string;
    paragraphs: string[];
    coverImage: string | null;
    tags: string[]
}

const CreateStory = ()=> {
    const [text, setText] = useState<TextState>({
        title: "",
        subtitle: "",
        paragraphs: [""],
        coverImage: null,
        tags: [""]
    });
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const paragraphRefs = useRef<(HTMLTextAreaElement | null)[]>([]);
    const [formError, setFormError] = useState<string | "">("")
    // Refs for title and subtitle
    const titleRef = useRef<HTMLTextAreaElement>(null);
    const subtitleRef = useRef<HTMLTextAreaElement>(null);
    
    /**
     * Handles input changes and dynamically adjusts the height of the textarea.
     */
    const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        
        if (name === "title" || name === "subtitle") {
            setText((prev) => ({
                ...prev,
                [name]: value,
            }));
            
            const currentRef = name === "title" ? titleRef.current : subtitleRef.current;
            if (currentRef) {
                currentRef.style.height = "auto";
                currentRef.style.height = `${currentRef.scrollHeight}px`;
            }
        }
    };

    /**
     * Handles paragraph changes
     */
    const handleParagraphChange = (index: number, value: string) => {
        setText((prev) => {
            const newParagraphs = [...prev.paragraphs];
            newParagraphs[index] = value;
            return {
                ...prev,
                paragraphs: newParagraphs,
            };
        });
        
        const currentRef = paragraphRefs.current[index];
        if (currentRef) {
            currentRef.style.height = "auto";
            currentRef.style.height = `${currentRef.scrollHeight}px`;
        }
    };

    /**
     * Adds a new paragraph block
     */
    const addParagraph = () => {
        setText((prev) => ({
            ...prev,
            paragraphs: [...prev.paragraphs, ""],
        }));
    };

    /**
     * Removes a paragraph block
     */
    const removeParagraph = (index: number) => {
        if (text.paragraphs.length > 1) {
            setText((prev) => ({
                ...prev,
                paragraphs: prev.paragraphs.filter((_, i) => i !== index),
            }));
        }
    };

    /**
     * Handles image upload
     */
    const handleImageUpload = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                setImagePreview(result);
                setText((prev) => ({
                    ...prev,
                    coverImage: result,
                }));
            };
            reader.readAsDataURL(file);
        }
    }, []);

    /**
     * Handles image removal
     */
    const handleImageRemove = () => {
        setImagePreview(null);
        setText((prev) => ({
            ...prev,
            coverImage: null,
        }));
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    /**
     * Triggers file input click
     */
    const triggerImageUpload = () => {
        fileInputRef.current?.click();
    };

    const handleTagsChange = (e: ChangeEvent<HTMLTextAreaElement>)=>{
        const {value, name} = e.target
        const tags = value.trim()
        .replace(/\s+/g, " ")
        .split(/[,\s]+/)
        .filter(Boolean);
        setText((prev)=>({
            ...prev,
            [name]: tags
        }))
    }


    const publishBlog= async ()=>{
        
        if (text.title === "") setFormError("Title is required");
        if (text.subtitle === "") setFormError("Subtitle is required");
        if (text.coverImage === null) setFormError("Cover image is required");
        if (text.paragraphs.length <= 1) setFormError("Add at least two paragraph");
        if (text.tags.length < 1) setFormError("Add at least one tag");
        console.log(formError)
        try {
            const req = await axios.post("/api/publish-blog",text)
            console.log(req.data.message)
        } catch (error) {
            console.log(error)
        }
    }
    
    return (
        <section className="min-h-screen">
            <Container>
                <div className="section-inner py-16">
                    <div className="max-w-4xl mx-auto space-y-8">
                        
                        {/* Title Section */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2 transition-all duration-300">
                            <textarea 
                                ref={titleRef}
                                name="title" 
                                placeholder="Story Title" 
                                value={text.title}
                                onChange={handleChange}
                                rows={1}
                                className="w-full resize-none overflow-hidden px-4 py-3 text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight placeholder-gray-400 text-gray-900 bg-transparent outline-none focus:ring-0 transition duration-150"
                            />
                        </div>
                        
                        {/* Subtitle Section */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2 transition-all duration-300">
                            <textarea 
                                ref={subtitleRef}
                                name="subtitle" 
                                placeholder="Story Subtitle" 
                                value={text.subtitle}
                                onChange={handleChange}
                                rows={1}
                                className="w-full resize-none overflow-hidden px-4 py-3 text-xl sm:text-2xl md:text-3xl font-medium leading-snug placeholder-gray-400 text-gray-700 bg-transparent outline-none focus:ring-0 transition duration-150"
                            />
                        </div>

                        {/* Image Upload Section */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition-all duration-300">
                            {imagePreview ? (
                                <div className="relative group">
                                    <img 
                                        src={imagePreview} 
                                        alt="Cover" 
                                        className="w-full h-auto max-h-96 object-cover rounded-lg"
                                    />
                                    <button
                                        onClick={handleImageRemove}
                                        className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600 shadow-lg"
                                        aria-label="Remove image"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            ) : (
                                <div 
                                    onClick={triggerImageUpload}
                                    className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
                                >
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="hidden"
                                    />
                                    <div className="flex flex-col items-center space-y-4">
                                        <div className="p-4 bg-gray-100 rounded-full">
                                            <ImageIcon className="w-8 h-8 text-gray-600" />
                                        </div>
                                        <div>
                                            <p className="text-lg font-semibold text-gray-700 mb-1">
                                                Add a cover image
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                Click to upload or drag and drop
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        
                        {/* Content Section - Paragraph Blocks */}
                        <div className="space-y-4">
                            {text.paragraphs.map((paragraph, index) => (
                                <div key={index} className="relative group">
                                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 transition-all duration-300 hover:shadow-md">
                                        <div className="flex items-start gap-4">
                                            <div className="flex-1">
                                                <textarea
                                                    ref={(el) => {
                                                        paragraphRefs.current[index] = el;
                                                    }}
                                                    value={paragraph}
                                                    onChange={(e) => handleParagraphChange(index, e.target.value)}
                                                    placeholder={index === 0 ? "Start writing your story..." : "Continue writing..."}
                                                    rows={3}
                                                    className="w-full resize-none overflow-hidden px-2 py-2 text-base md:text-lg leading-relaxed placeholder-gray-400 text-gray-800 bg-transparent outline-none focus:ring-0 transition duration-150"
                                                />
                                            </div>
                                            {text.paragraphs.length > 1 && (
                                                <button
                                                    onClick={() => removeParagraph(index)}
                                                    className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
                                                    aria-label="Remove paragraph"
                                                >
                                                    <X className="w-5 h-5" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    {index === text.paragraphs.length - 1 && (
                                        <button
                                            onClick={addParagraph}
                                            className="mt-4 w-full flex items-center justify-center gap-2 py-4 bg-white border-2 border-dashed border-gray-300 rounded-xl text-gray-600 font-medium hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 group"
                                        >
                                            <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                            <span>Add paragraph</span>
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2 transition-all duration-300">
                        <textarea
                            name="tags"
                            value={text.tags}
                            onChange={handleTagsChange}
                            placeholder="Include post tags here"
                            className="w-full max-h-40 resize-none overflow-hidden px-4 py-3 outline-none focus:ring-0 transition duration-150"
                            />
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex justify-end space-x-4 pt-6">
                            <button className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition duration-200 ease-in-out">
                                Save Draft
                            </button>
                            <button className="px-6 py-3 bg-[#2E2E2E] text-white rounded-xl font-semibold shadow-md transition duration-200 ease-in-out" onClick={publishBlog}>
                                Publish
                            </button>
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    );
}
export default CreateStory