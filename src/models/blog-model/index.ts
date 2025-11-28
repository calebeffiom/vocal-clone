import mongoose, {Schema, Document} from "mongoose";

const CommentSchema = new Schema(
  {
    author: {type: mongoose.Types.ObjectId, ref: "User", required: true},
    content: {type: String, requied: true, trim: true,}

  },
  {timestamps: true},
)



export interface Blog extends Document{
  author: mongoose.Types.ObjectId,
  title: string,
  subtitle: string,
  content: string,
  coverImage: string,
  slug: string,
  tags: string[],
  published: boolean,
  likes: number,
  comments: mongoose.Types.DocumentArray<typeof CommentSchema>
}
const BlogSchema = new Schema<Blog>(
    {
      author: {type: mongoose.Types.ObjectId, ref: "User", required: true},
      title: {type: String, required: true},
      subtitle: {type: String, trim: true},
      content: {type: String, required: true},
      coverImage: {type: String, required: true},
      slug: {type: String, required: true, unique: true, lowercase: true},
      tags: [String],
      published: {type: Boolean, default: false},
      likes: {type: Number, default: 0},
      comments: [CommentSchema]
    },
    {timestamps: true}
);

export default mongoose.models.Blog || mongoose.model("Blog", BlogSchema);