const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");

dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 3000;

const cardSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    name: { type: String, default: "" },
    scientificName: { type: String, default: "" },
    origin: { type: String, default: "" },
    size: { type: String, default: "" },
    temperature: { type: String, default: "" },
    ph: { type: String, default: "" },
    beauty: { type: String, default: "" },
    care: { type: String, default: "" },
    genderType: { type: String, enum: ["has", "none"], default: "none" },
    maleDescription: { type: String, default: "" },
    femaleDescription: { type: String, default: "" },
    breedingDifficulty: { type: Number, min: 1, max: 5, default: 1 },
    priceRating: { type: Number, min: 1, max: 5, default: 1 },
    mainImage: { type: String, default: "" },
    maleImage: { type: String, default: "" },
    femaleImage: { type: String, default: "" },
    availableSizes: { type: [String], default: [] }
}, { timestamps: true, versionKey: false });

const Card = mongoose.model("Card", cardSchema);

function serializeCard(card) {
    const value = card.toObject ? card.toObject() : card;
    const { _id, createdAt, updatedAt, ...fields } = value;
    return { ...fields, id: _id };
}

function getCardFields(body) {
    const fields = [
        "name", "scientificName", "origin", "size", "temperature", "ph",
        "beauty", "care", "genderType", "maleDescription", "femaleDescription",
        "breedingDifficulty", "priceRating", "mainImage", "maleImage",
        "femaleImage", "availableSizes"
    ];

    return Object.fromEntries(
        fields
            .filter((field) => body[field] !== undefined)
            .map((field) => [field, body[field]])
    );
}

app.use(express.json({ limit: "15mb" }));
app.use(express.static(__dirname));

app.get("/api/cards", async (request, response, next) => {
    try {
        const cards = await Card.find().sort({ createdAt: -1 }).lean();
        response.json(cards.map(serializeCard));
    } catch (error) {
        next(error);
    }
});

app.put("/api/cards/:id", async (request, response, next) => {
    try {
        const id = request.params.id;
        if (!id || id.length > 100 || !request.body || typeof request.body !== "object") {
            return response.status(400).json({ error: "Dữ liệu poster không hợp lệ." });
        }

        const card = await Card.findByIdAndUpdate(
            id,
            { $set: getCardFields(request.body) },
            { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
        );

        response.json(serializeCard(card));
    } catch (error) {
        next(error);
    }
});

app.delete("/api/cards/:id", async (request, response, next) => {
    try {
        const result = await Card.findByIdAndDelete(request.params.id);
        if (!result) {
            return response.status(404).json({ error: "Không tìm thấy poster." });
        }

        response.status(204).end();
    } catch (error) {
        next(error);
    }
});

app.use((error, request, response, next) => {
    console.error(error);
    if (response.headersSent) {
        return next(error);
    }

    const status = error.type === "entity.too.large" ? 413 : 500;
    const message = status === 413
        ? "Dữ liệu poster quá lớn. Hãy dùng ảnh nhỏ hơn."
        : "Lỗi máy chủ hoặc MongoDB.";

    response.status(status).json({ error: message });
});

async function start() {
    if (!process.env.MONGODB_URI) {
        throw new Error("Thiếu MONGODB_URI. Hãy tạo file .env từ .env.example.");
    }

    await mongoose.connect(process.env.MONGODB_URI);
    app.listen(port, () => {
        console.log(`Cichlid Poster Maker đang chạy tại http://localhost:${port}`);
    });
}

start().catch((error) => {
    console.error("Không khởi động được máy chủ:", error.message);
    process.exit(1);
});