import { ZodError } from "zod";

const validate = (schema) =>
    (req, res, next) => {
        try {
            req.body = schema.parse(req.body);
            next();
        } catch (err) {
            if (err instanceof ZodError) {
                return res.status(400).json({
                    message: "Invalid input!",
                    error: err.issues.map((issue) => ({
                        field: issue.path.join("."),
                        message: issue.message
                    }))
                })
            }
            return res.status(500).json({message: "Internal server error!"});
        }
    }

export { validate }