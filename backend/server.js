const http = require("http");
const { MongoClient } = require("mongodb");
const url = "mongodb://localhost:27017"; 

const dbName = "textSimilarity";
const port = 5000;

// --------------------- Helper Functions ---------------------
function preprocess(text) {
    return text
        .toLowerCase()
        .replace(/[.,!?;:()"']/g, "")
        .split(/\s+/)
        .filter(Boolean);
}

function calculateSimilarity(text1, text2) {
    const words1 = preprocess(text1);
    const words2 = preprocess(text2);
    const set1 = new Set(words1);
    const set2 = new Set(words2);
    const shared = [...set1].filter((word) => set2.has(word));
    const unique = new Set([...set1, ...set2]);
    const similarityScore = (shared.length / unique.size) * 100;
    return {
        wordCount1: words1.length,
        wordCount2: words2.length,
        sharedWords: shared,
        sharedWordsCount: shared.length,
        similarityScore: parseFloat(similarityScore.toFixed(2)),
    };
}

// --------------------- Server Setup ---------------------
const server = http.createServer(async (req, res) => {
    // Enable CORS
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    // Handle preflight OPTIONS request
    if (req.method === "OPTIONS") {
        res.writeHead(204);
        res.end();
        return;
    }

    if (req.method === "POST" && req.url === "/check") {
        let body = "";

        req.on("data", (chunk) => {
            body += chunk;
        });

        req.on("end", async () => {
            try {
                const { text1, text2 } = JSON.parse(body);
                const result = calculateSimilarity(text1, text2);

                const client = new MongoClient(url);
                await client.connect();
                const db = client.db(dbName);
                const collection = db.collection("checks");

                const doc = {
                    text1,
                    text2,
                    ...result,
                    timestamp: new Date(),
                };

                await collection.insertOne(doc);
                client.close();

                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify(doc));
            } catch (err) {
                console.error("Error:", err);
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "Internal Server Error" }));
            }
        });
    } else {
        res.writeHead(404);
        res.end("Not Found");
    }
});

server.listen(port, () => {
    console.log(`✅ Server running on http://localhost:${port}`);
});
