import mongoose, { Schema, model, models } from "mongoose";

const MAX_PINNED_STORIES = 3;

export interface IUser extends Document {
  displayName: string;
  username: string;
  email: string; 
  profilePicture: string; 
  coverPicture: string;   
  bio: string;
  blogsWritten: mongoose.Schema.Types.ObjectId[]; 
  pinnedStories: mongoose.Schema.Types.ObjectId[]
  blogsCount: number; 
  dateJoined: Date; 
}


const UserSchema = new Schema<IUser>(
  {
    displayName: {type: String, required: true},
    username: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    profilePicture: {type: String, default: "/images/profile.png"},
    coverPicture: {type: String, default: "black"},
    bio: {type: String, default: "Nothing to see here yet"},
    blogsWritten: [{type: mongoose.Schema.Types.ObjectId, ref: "Blog"}],
    pinnedStories: [{type: mongoose.Schema.Types.ObjectId, ref: "Blog"}]

  },
  {
    timestamps: true, 
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
UserSchema.path('pinnedStories').validate(function (value) {
  // This validation runs before saving the document
  if (value && value.length > MAX_PINNED_STORIES) {
      return false; // Validation fails if more than 3 IDs are in the array
  }
  return true; // Validation succeeds
}, `The maximum number of pinned stories is ${MAX_PINNED_STORIES}.`);


// 4. Define Virtual Property for Blog Count
UserSchema.virtual("blogsCount").get(function(this: IUser) {
return this.blogsWritten ? this.blogsWritten.length : 0;
});

export default models.User || model("User", UserSchema);