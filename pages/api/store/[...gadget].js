import db from "@/lib/db";

export default async function handler(req, res) {
    const { method, query, body } = req;

    if (method === "GET") {
        const { gadget } = query;
        
        if (!gadget) {
            return res.status(400).json({ error: "Parameter 'gadget' is required for GET request" });
        }

        try {
            const query = `SELECT * FROM ${gadget}`;
            const result = await db.query(query);

            res.status(200).json({ message: "Data fetched successfully", data: result.rows });
        } catch (error) {
            res.status(500).json({ error: "Database query error", details: error.message });
        }
    } else if (method === "POST") {
        const { table, fields, values } = body;

        if (typeof table !== "string" || !Array.isArray(fields) || !Array.isArray(values)) {
            return res.status(400).json({ error: "Table must be a string, and fields and values must be arrays" });
        }

        if (fields.length !== values.length) {
            return res.status(400).json({ error: "Fields and values length mismatch" });
        }

        try {
            const query = `INSERT INTO ${table} (${fields.join(", ")}) VALUES (${fields
                .map((_, i) => `$${i + 1}`)
                .join(", ")}) RETURNING *`;
            const result = await db.query(query, values);

            res.status(200).json({ message: "Data inserted successfully", data: result.rows[0] });
        } catch (error) {
            res.status(500).json({ error: "Database insertion error", details: error.message });
        }
    } else {
        res.status(405).json({ message: "Method Not Allowed" });
    }
}