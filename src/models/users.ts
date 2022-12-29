import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      match:
        /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
    },
    role:{type: String, default:"customer"},
    isAdmin: { type: Boolean, required: false, default: false },
    password: { type: String, required: true },
    phone: { type: String, required: true, default: "-" },
    // address: { type: mongoose.Schema.Types.ObjectId, ref: "address", required: true },
   address: { type: String, required: true},
    firstName: {
      type: String,
      required: true,
      max: 50,
    },
    lastName: {
      type: String,
      required: true,
      max: 50,
    },
    bio: {
      type: String,
      required: false,
      max: 255,
    },

    profileImage: {
      type: String,
      required: false,
      max: 255,
    },
    cart: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "product",
          required: false,
        },
        unit: { type: Number, required: true },
      },
    ],
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
        required: false,
      },
    ],
    orders: [
      { type: mongoose.Schema.Types.ObjectId, ref: "order", required: false },
    ],
  },
  {
    // toJSON: {
    //   transform(doc, ret) {
    //     delete ret.password;
    //     delete ret.salt;
    //     delete ret.__v;
    //   },
    // },
    timestamps: true,
  }
);

export default mongoose.model("User", UserSchema);
