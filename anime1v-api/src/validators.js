const { z } = require("zod");

const searchSchema = z.object({
  q: z.string().min(2).max(100).trim(),
  page: z.coerce.number().int().min(1).max(100).default(1).optional(),
});

const animeIdSchema = z.object({
  id: z.coerce.number().int().positive(),
});

function validate(schema, source = "query") {
  return (req, res, next) => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: "Parámetros inválidos",
        details: result.error.flatten(),
      });
    }
    req[source] = result.data;
    next();
  };
}

module.exports = { searchSchema, animeIdSchema, validate };
