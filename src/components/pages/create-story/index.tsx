import { useRef, useState, ChangeEvent, useCallback, TextareaHTMLAttributes, useEffect } from "react";
import { Container } from "@shared";
import { Plus, X, Image as ImageIcon, Upload } from "lucide-react";
import axios from "axios";
import { useSearchParams, useRouter } from "next/navigation";
import { useRecoilValue } from "recoil";
import { userAtom } from "@/utils/states/userAtom";
import { topicsList } from "@/utils/constants/topics";
import { useSession } from "next-auth/react";
import { debouncedToast } from "@/utils/toast";

/**
 * Defines the structure for the story text state.
 */
interface TextState {
    title: string;
    subtitle: string;
    paragraphs: string[];
    coverImage: string | null;
    tag: string
}

const CreateStory = () => {
    const { status } = useSession();
    const [text, setText] = useState<TextState>({
        title: "",
        subtitle: "",
        paragraphs: [""],
        coverImage: null,
        tag: ""
    });
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const paragraphRefs = useRef<(HTMLTextAreaElement | null)[]>([]);
    const [formError, setFormError] = useState<string | "">("")

    // Draft handling
    const searchParams = useSearchParams()
    const draftId = searchParams.get('id')
    const user = useRecoilValue(userAtom)
    const router = useRouter()

    useEffect(() => {
        if (status === "unauthenticated") {
            const callbackUrl =
                typeof window !== "undefined"
                    ? window.location.pathname + window.location.search
                    : "/create-story";
            router.replace(`/signup?callbackUrl=${encodeURIComponent(callbackUrl)}`);
        }
    }, [status, router]);

    useEffect(() => {
        if (draftId && user) {
            const draft = user.blogsWritten.find((b: any) => b.id === draftId || b._id === draftId)
            if (draft) {
                setText({
                    title: draft.title,
                    subtitle: draft.subtitle || "",
                    paragraphs: draft.content,
                    coverImage: draft.coverImage,
                    tag: draft.tag  // fallback for old data
                })
                setImagePreview(draft.coverImage)
            }
        }
    }, [draftId, user])

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

    const handleTopicSelect = (topic: string) => {
        setText((prev) => ({
            ...prev,
            tag: topic
        }))
    }


    const publishBlog = async () => {

        if (text.title === "") setFormError("Title is required");
        if (text.subtitle === "") setFormError("Subtitle is required");
        if (text.coverImage === null) setFormError("Cover image is required");
        if (text.paragraphs.length <= 1) setFormError("Add at least two paragraph");
        if (text.paragraphs.length <= 1) setFormError("Add at least two paragraph");
        if (text.tag === "") setFormError("Select a topic");
        console.log(formError)
        try {
            if (draftId) {
                // Update draft and publish
                const req = await axios.put("/api/publish-blog", { ...text, id: draftId })
                console.log(req.data.message)
                if (req.status === 200) {
                    debouncedToast.success("Story published successfully!");
                    router.push('/latest-stories');
                }
            } else {
                // Publish new
                const req = await axios.post("/api/publish-blog", text)
                console.log(req.data.message)
                if (req.status === 201) {
                    debouncedToast.success("Story published successfully!");
                    router.push('/latest-stories');
                }
            }

        } catch (error) {
            console.log(error)
            debouncedToast.error("Failed to publish story. Please try again.");
        }
    }

    const draftBlog = async () => {
        if (text.title === "") setFormError("Title is required");
        if (text.subtitle === "") setFormError("Subtitle is required");
        if (text.coverImage === null) setFormError("Cover image is required");
        if (text.paragraphs.length <= 1) setFormError("Add at least two paragraph");
        if (text.paragraphs.length <= 1) setFormError("Add at least two paragraph");
        if (text.tag === "") setFormError("Select a topic");
        console.log(formError)
        try {
            const req = await axios.post("/api/draft-blog", text)
            console.log(req.data.message)
            debouncedToast.success("Draft saved successfully!");
        } catch (error) {
            console.log(error)
            debouncedToast.error("Failed to save draft.");
        }
    }

    return (
        <section className="min-h-screen">
            <Container>
                <div className="section-inner py-8 md:py-16">
                    <div className="max-w-4xl mx-auto space-y-6 md:space-y-8">

                        {/* Title Section */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-1 md:p-2 transition-all duration-300">
                            <textarea
                                ref={titleRef}
                                name="title"
                                placeholder="Story Title"
                                value={text.title}
                                onChange={handleChange}
                                rows={1}
                                className="w-full resize-none overflow-hidden px-4 py-3 text-3xl sm:text-4xl md:text-6xl font-extrabold leading-tight placeholder-gray-400 text-gray-900 bg-transparent outline-none focus:ring-0 transition duration-150"
                            />
                        </div>

                        {/* Subtitle Section */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-1 md:p-2 transition-all duration-300">
                            <textarea
                                ref={subtitleRef}
                                name="subtitle"
                                placeholder="Story Subtitle"
                                value={text.subtitle}
                                onChange={handleChange}
                                rows={1}
                                className="w-full resize-none overflow-hidden px-4 py-3 text-lg sm:text-xl md:text-3xl font-medium leading-snug placeholder-gray-400 text-gray-700 bg-transparent outline-none focus:ring-0 transition duration-150"
                            />
                        </div>

                        {/* Image Upload Section */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 transition-all duration-300">
                            {imagePreview ? (
                                <div className="relative group">
                                    <img
                                        src={imagePreview}
                                        alt="Cover"
                                        className="w-full h-auto max-h-64 md:max-h-96 object-cover rounded-lg"
                                    />
                                    <button
                                        onClick={handleImageRemove}
                                        className="absolute top-2 right-2 md:top-4 md:right-4 p-2 bg-red-500 text-white rounded-full opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600 shadow-lg"
                                        aria-label="Remove image"
                                    >
                                        <X className="w-4 h-4 md:w-5 md:h-5" />
                                    </button>
                                </div>
                            ) : (
                                <div
                                    onClick={triggerImageUpload}
                                    className="border-2 border-dashed border-gray-300 rounded-xl p-8 md:p-12 text-center cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
                                >
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="hidden"
                                    />
                                    <div className="flex flex-col items-center space-y-4">
                                        <div className="p-3 md:p-4 bg-gray-100 rounded-full">
                                            <ImageIcon className="w-6 h-6 md:w-8 md:h-8 text-gray-600" />
                                        </div>
                                        <div>
                                            <p className="text-base md:text-lg font-semibold text-gray-700 mb-1">
                                                Add a cover image
                                            </p>
                                            <p className="text-xs md:text-sm text-gray-500">
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
                                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 md:p-4 transition-all duration-300 hover:shadow-md">
                                        <div className="flex items-start gap-2 md:gap-4">
                                            <div className="flex-1">
                                                <textarea
                                                    ref={(el) => {
                                                        paragraphRefs.current[index] = el;
                                                    }}
                                                    value={paragraph}
                                                    onChange={(e) => handleParagraphChange(index, e.target.value)}
                                                    placeholder={index === 0 ? "Start writing your story..." : "Continue writing..."}
                                                    rows={3}
                                                    className="w-full resize-none overflow-hidden px-1 md:px-2 py-2 text-base md:text-lg leading-relaxed placeholder-gray-400 text-gray-800 bg-transparent outline-none focus:ring-0 transition duration-150"
                                                />
                                            </div>
                                            {text.paragraphs.length > 1 && (
                                                <button
                                                    onClick={() => removeParagraph(index)}
                                                    className="opacity-100 md:opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
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
                                            className="mt-4 w-full flex items-center justify-center gap-2 py-3 md:py-4 bg-white border-2 border-dashed border-gray-300 rounded-xl text-gray-600 font-medium hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 group"
                                        >
                                            <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                            <span>Add paragraph</span>
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 transition-all duration-300">
                            <h3 className="text-lg md:text-xl font-semibold mb-4 text-gray-800">Select a Topic</h3>
                            <div className="flex flex-wrap gap-2">
                                {topicsList.map((topic) => (
                                    <button
                                        key={topic}
                                        onClick={() => handleTopicSelect(topic)}
                                        className={`px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium transition-all duration-200 border ${text.tag === topic
                                            ? "bg-black text-white border-black"
                                            : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"
                                            }`}
                                    >
                                        {topic}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row justify-end gap-3 sm:space-x-4 pt-4 md:pt-6">
                            <button className="w-full sm:w-auto px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition duration-200 ease-in-out" onClick={draftBlog}>
                                Save Draft
                            </button>
                            <button className="w-full sm:w-auto px-6 py-3 bg-[#2E2E2E] text-white rounded-xl font-semibold shadow-md transition duration-200 ease-in-out" onClick={publishBlog}>
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